import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback, useMemo, } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetOnlyModelsInfoQuery } from "../generated_gql/tanstack-query";
import { GENERAL_TOUR_STEPS } from "../constants/tourStepsBase";
import { useOnboardingTourExtensions } from "./OnboardingTourExtensionsContext";
import { projectKeys } from "../lib/queryKeys";
import { fetchProjectList } from "../pages/projects/api";
import { selectProjectCompletionCacheGeneration } from "../pages/projects/selectors";
const TourContext = createContext(undefined);
function stepMilestoneMet(stepId, ctx) {
    if (!stepId)
        return false;
    switch (stepId) {
        case "create-tenant":
            return (ctx.hasTenant ||
                localStorage.getItem("tour-skip-tenant-step") === "true");
        case "create-model":
            return ctx.useUserModelForCreateModel ? ctx.hasUserModel : ctx.hasModel;
        case "add-fields":
            return ctx.modelHasFields;
        case "add-content":
            return ctx.modelHasContent;
        case "run-query":
            return ctx.hasRunQuery;
        default:
            return false;
    }
}
function firstIncompleteStepIndex(steps, ctx) {
    for (let i = 0; i < steps.length; i++) {
        if (!stepMilestoneMet(steps[i]?.id, ctx)) {
            return i;
        }
    }
    return Math.max(0, steps.length - 1);
}
export const TourProvider = ({ children }) => {
    const onboardingExt = useOnboardingTourExtensions();
    const tourSteps = useMemo(() => onboardingExt.steps && onboardingExt.steps.length > 0
        ? onboardingExt.steps
        : GENERAL_TOUR_STEPS, [onboardingExt.steps]);
    const useUserModelForCreateModel = useMemo(() => tourSteps.some((s) => s.id === "create-tenant"), [tourSteps]);
    const [isTourActive, setIsTourActive] = useState(false);
    const [isTourModalVisible, setIsTourModalVisible] = useState(false);
    const [tourProgress, setTourProgress] = useState({
        currentStep: 0,
        totalSteps: GENERAL_TOUR_STEPS.length,
        completedSteps: [],
        isCompleted: false,
    });
    const [projectStatus, setProjectStatus] = useState({
        hasModel: false,
        modelHasFields: false,
        modelHasContent: false,
        hasRunQuery: false,
    });
    useEffect(() => {
        setTourProgress((prev) => ({
            ...prev,
            totalSteps: tourSteps.length,
        }));
    }, [tourSteps.length]);
    const { data: modelsData, refetch: refetchModels } = useGetOnlyModelsInfoQuery();
    /** Same cache entry as `useProjectsQuery` — `select` avoids re-renders on unrelated list fields. */
    const projectsCacheGeneration = useQuery({
        queryKey: projectKeys.list(),
        queryFn: fetchProjectList,
        select: selectProjectCompletionCacheGeneration,
    });
    const checkProjectStatus = useCallback(async () => {
        try {
            const result = await refetchModels();
            const models = result.data?.projectModelsInfo || [];
            const hasModel = models.length > 0;
            const hasUserModel = models.some((m) => m && !m.system_generated);
            const catalogCount = onboardingExt.stepSignals?.["create-tenant"] ?? 0;
            const hasTenant = catalogCount > 0;
            let modelHasFields = false;
            let modelHasContent = false;
            if (hasModel && models[0]) {
                modelHasFields = localStorage.getItem("project-has-fields") === "true";
                modelHasContent =
                    localStorage.getItem("project-has-content") === "true";
            }
            const hasRunQuery = localStorage.getItem("project-has-run-query") === "true";
            const newStatus = {
                hasModel,
                modelHasFields,
                modelHasContent,
                hasRunQuery,
            };
            setProjectStatus(newStatus);
            const milestoneCtx = {
                hasTenant,
                hasModel,
                hasUserModel,
                useUserModelForCreateModel,
                modelHasFields,
                modelHasContent,
                hasRunQuery,
            };
            const completedSteps = [];
            for (const step of tourSteps) {
                if (stepMilestoneMet(step.id, milestoneCtx)) {
                    completedSteps.push(step.id);
                }
            }
            const totalSteps = tourSteps.length;
            setTourProgress((prev) => ({
                ...prev,
                totalSteps,
                completedSteps,
                isCompleted: completedSteps.length >= totalSteps,
            }));
            if (isTourActive) {
                const currentStepId = tourSteps[tourProgress.currentStep]?.id;
                const curIdx = tourProgress.currentStep;
                if (stepMilestoneMet(currentStepId, milestoneCtx) &&
                    curIdx < totalSteps - 1) {
                    setTourProgress((prev) => ({
                        ...prev,
                        currentStep: prev.currentStep + 1,
                    }));
                }
                else if (currentStepId === "run-query" &&
                    hasRunQuery &&
                    curIdx === totalSteps - 1) {
                    setIsTourActive(false);
                    localStorage.setItem("tour-completed", "true");
                }
            }
            if (completedSteps.length >= totalSteps && totalSteps > 0) {
                setIsTourActive(false);
                localStorage.setItem("tour-completed", "true");
            }
        }
        catch (error) {
            console.error("Error checking project status:", error);
        }
    }, [
        refetchModels,
        isTourActive,
        tourProgress.currentStep,
        tourSteps,
        useUserModelForCreateModel,
        onboardingExt.stepSignals,
    ]);
    useEffect(() => {
        void checkProjectStatus();
    }, [modelsData, projectsCacheGeneration.data, checkProjectStatus]); // `data` here is the select output (fingerprint string)
    const startTour = useCallback(() => {
        const models = modelsData?.projectModelsInfo || [];
        const hasModel = models.length > 0;
        const hasUserModel = models.some((m) => m && !m.system_generated);
        const catalogCount = onboardingExt.stepSignals?.["create-tenant"] ?? 0;
        const hasTenant = catalogCount > 0;
        const modelHasFields = localStorage.getItem("project-has-fields") === "true";
        const modelHasContent = localStorage.getItem("project-has-content") === "true";
        const hasRunQuery = localStorage.getItem("project-has-run-query") === "true";
        const milestoneCtx = {
            hasTenant,
            hasModel,
            hasUserModel,
            useUserModelForCreateModel,
            modelHasFields,
            modelHasContent,
            hasRunQuery,
        };
        const currentStep = firstIncompleteStepIndex(tourSteps, milestoneCtx);
        setIsTourActive(true);
        setIsTourModalVisible(true);
        setTourProgress((prev) => ({
            ...prev,
            currentStep,
            totalSteps: tourSteps.length,
        }));
    }, [modelsData, tourSteps, useUserModelForCreateModel, onboardingExt.stepSignals]);
    useEffect(() => {
        if (localStorage.getItem("tour-waiting-for-model") === "true") {
            return;
        }
        if (localStorage.getItem("tour-waiting-for-tenant") === "true") {
            return;
        }
        if (localStorage.getItem("tour-waiting-for-fields") === "true") {
            return;
        }
        if (localStorage.getItem("tour-waiting-for-content") === "true") {
            return;
        }
        if (localStorage.getItem("tour-waiting-for-query") === "true") {
            return;
        }
        if (isTourActive) {
            return;
        }
        const isSetupIncomplete = !tourProgress.isCompleted;
        const hasIncompleteSteps = tourProgress.completedSteps.length < tourProgress.totalSteps;
        if (isSetupIncomplete && hasIncompleteSteps) {
            const timer = setTimeout(() => {
                startTour();
            }, 1500);
            return () => clearTimeout(timer);
        }
        if (!isTourActive && sessionStorage.getItem("tour-should-restart") === "true") {
            sessionStorage.removeItem("tour-should-restart");
            const timer = setTimeout(() => {
                startTour();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [
        isTourActive,
        tourProgress.isCompleted,
        tourProgress.completedSteps.length,
        tourProgress.totalSteps,
        startTour,
    ]);
    const endTour = () => {
        setIsTourActive(false);
        setIsTourModalVisible(false);
        localStorage.setItem("tour-dismissed", "true");
    };
    const closeTourModal = () => {
        setIsTourModalVisible(false);
    };
    const showTourModal = () => {
        setIsTourModalVisible(true);
    };
    const nextStep = () => {
        setTourProgress((prev) => ({
            ...prev,
            currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
        }));
    };
    const prevStep = () => {
        setTourProgress((prev) => ({
            ...prev,
            currentStep: Math.max(prev.currentStep - 1, 0),
        }));
    };
    const skipTour = () => {
        setIsTourActive(false);
        setIsTourModalVisible(false);
        localStorage.setItem("tour-dismissed", "true");
    };
    const skipStep = useCallback(() => {
        const currentStepId = tourSteps[tourProgress.currentStep]?.id;
        switch (currentStepId) {
            case "create-tenant":
                localStorage.setItem("tour-skip-tenant-step", "true");
                break;
            case "create-model":
                localStorage.setItem("project-has-model-skipped", "true");
                break;
            case "add-fields":
                localStorage.setItem("project-has-fields", "true");
                break;
            case "add-content":
                localStorage.setItem("project-has-content", "true");
                break;
            case "run-query":
                localStorage.setItem("project-has-run-query", "true");
                break;
        }
        localStorage.removeItem("tour-waiting-for-model");
        localStorage.removeItem("tour-waiting-for-tenant");
        localStorage.removeItem("tour-waiting-for-fields");
        localStorage.removeItem("tour-waiting-for-content");
        localStorage.removeItem("tour-waiting-for-query");
        const stepId = currentStepId ?? "";
        const last = tourProgress.currentStep >= tourProgress.totalSteps - 1;
        setTourProgress((prev) => {
            const nextCompleted = [...prev.completedSteps];
            if (stepId && !nextCompleted.includes(stepId)) {
                nextCompleted.push(stepId);
            }
            if (last) {
                return { ...prev, completedSteps: nextCompleted };
            }
            return {
                ...prev,
                completedSteps: nextCompleted,
                currentStep: prev.currentStep + 1,
            };
        });
        if (last) {
            setIsTourActive(false);
            setIsTourModalVisible(false);
            localStorage.setItem("tour-completed", "true");
        }
        else {
            void checkProjectStatus();
        }
    }, [tourSteps, tourProgress, checkProjectStatus]);
    const value = {
        isTourActive,
        isTourModalVisible,
        tourProgress,
        projectStatus,
        tourSteps,
        startTour,
        endTour,
        closeTourModal,
        showTourModal,
        nextStep,
        prevStep,
        skipTour,
        skipStep,
        checkProjectStatus,
        shouldShowTour: false,
    };
    return _jsx(TourContext.Provider, { value: value, children: children });
};
export const useTour = () => {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error("useTour must be used within a TourProvider");
    }
    return context;
};
export const useTourSafe = () => {
    const context = useContext(TourContext);
    return context || null;
};
