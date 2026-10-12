import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  TourContextType,
  TourProgress,
  ProjectCompletionStatus,
  TourStep,
} from "../types/tour";
import { useGetOnlyModelsInfoQuery } from "../generated_gql/tanstack-query";
import { GENERAL_TOUR_STEPS } from "../constants/tourStepsBase";
import { useOnboardingTourExtensions } from "./OnboardingTourExtensionsContext";
import { projectKeys } from "../lib/queryKeys";
import { fetchProjectList } from "../pages/projects/api";
import { selectProjectCompletionCacheGeneration } from "../pages/projects/selectors";

const TourContext = createContext<TourContextType | undefined>(undefined);

interface TourProviderProps {
  children: ReactNode;
}

function stepMilestoneMet(
  stepId: string | undefined,
  ctx: {
    hasTenant: boolean;
    hasModel: boolean;
    hasUserModel: boolean;
    useUserModelForCreateModel: boolean;
    modelHasFields: boolean;
    modelHasContent: boolean;
    hasRunQuery: boolean;
  }
): boolean {
  if (!stepId) return false;
  switch (stepId) {
    case "create-tenant":
      return (
        ctx.hasTenant ||
        localStorage.getItem("tour-skip-tenant-step") === "true"
      );
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

function firstIncompleteStepIndex(
  steps: TourStep[],
  ctx: Parameters<typeof stepMilestoneMet>[1]
): number {
  for (let i = 0; i < steps.length; i++) {
    if (!stepMilestoneMet(steps[i]?.id, ctx)) {
      return i;
    }
  }
  return Math.max(0, steps.length - 1);
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const onboardingExt = useOnboardingTourExtensions();

  const tourSteps = useMemo<TourStep[]>(
    () =>
      onboardingExt.steps && onboardingExt.steps.length > 0
        ? onboardingExt.steps
        : GENERAL_TOUR_STEPS,
    [onboardingExt.steps]
  );

  const useUserModelForCreateModel = useMemo(
    () => tourSteps.some((s) => s.id === "create-tenant"),
    [tourSteps]
  );

  const [isTourActive, setIsTourActive] = useState(false);
  const [isTourModalVisible, setIsTourModalVisible] = useState(false);
  const [isTourDismissed, setIsTourDismissed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("tour-dismissed") === "true"
  );
  const [tourProgress, setTourProgress] = useState<TourProgress>({
    currentStep: 0,
    totalSteps: GENERAL_TOUR_STEPS.length,
    completedSteps: [],
    isCompleted: false,
  });

  const [projectStatus, setProjectStatus] = useState<ProjectCompletionStatus>({
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

  const { data: modelsData, refetch: refetchModels } =
    useGetOnlyModelsInfoQuery();

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
      const catalogCount =
        onboardingExt.stepSignals?.["create-tenant"] ?? 0;
      const hasTenant = catalogCount > 0;

      let modelHasFields = false;
      let modelHasContent = false;

      if (hasModel && models[0]) {
        modelHasFields = localStorage.getItem("project-has-fields") === "true";
        modelHasContent =
          localStorage.getItem("project-has-content") === "true";
      }

      const hasRunQuery =
        localStorage.getItem("project-has-run-query") === "true";

      const newStatus: ProjectCompletionStatus = {
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

      const completedSteps: string[] = [];
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

        if (
          stepMilestoneMet(currentStepId, milestoneCtx) &&
          curIdx < totalSteps - 1
        ) {
          setTourProgress((prev) => ({
            ...prev,
            currentStep: prev.currentStep + 1,
          }));
        } else if (
          currentStepId === "run-query" &&
          hasRunQuery &&
          curIdx === totalSteps - 1
        ) {
          setIsTourActive(false);
          localStorage.setItem("tour-completed", "true");
        }
      }

      if (completedSteps.length >= totalSteps && totalSteps > 0) {
        setIsTourActive(false);
        localStorage.setItem("tour-completed", "true");
      }
    } catch (error) {
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
    // Manual Setup from the header always wins over a prior Skip/dismiss.
    localStorage.removeItem("tour-dismissed");
    setIsTourDismissed(false);
    localStorage.removeItem("tour-waiting-for-model");
    localStorage.removeItem("tour-waiting-for-tenant");
    localStorage.removeItem("tour-waiting-for-fields");
    localStorage.removeItem("tour-waiting-for-content");
    localStorage.removeItem("tour-waiting-for-query");

    const models = modelsData?.projectModelsInfo || [];
    const hasModel = models.length > 0;
    const hasUserModel = models.some((m) => m && !m.system_generated);
    const catalogCount = onboardingExt.stepSignals?.["create-tenant"] ?? 0;
    const hasTenant = catalogCount > 0;
    const modelHasFields =
      localStorage.getItem("project-has-fields") === "true";
    const modelHasContent =
      localStorage.getItem("project-has-content") === "true";
    const hasRunQuery =
      localStorage.getItem("project-has-run-query") === "true";

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
      isCompleted: false,
    }));
  }, [modelsData, tourSteps, useUserModelForCreateModel, onboardingExt.stepSignals]);

  useEffect(() => {
    // Skip / X dismiss must stick until the user clicks Setup in the header.
    if (isTourDismissed || localStorage.getItem("tour-dismissed") === "true") {
      return;
    }
    if (localStorage.getItem("tour-completed") === "true") {
      return;
    }
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
    const hasIncompleteSteps =
      tourProgress.completedSteps.length < tourProgress.totalSteps;

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
    isTourDismissed,
    tourProgress.isCompleted,
    tourProgress.completedSteps.length,
    tourProgress.totalSteps,
    startTour,
  ]);

  const endTour = () => {
    setIsTourActive(false);
    setIsTourModalVisible(false);
    localStorage.setItem("tour-dismissed", "true");
    setIsTourDismissed(true);
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

  /** Skip / dismiss entire tour — do not auto-show again until Setup is clicked. */
  const skipTour = () => {
    setIsTourActive(false);
    setIsTourModalVisible(false);
    localStorage.setItem("tour-dismissed", "true");
    setIsTourDismissed(true);
    localStorage.removeItem("tour-waiting-for-model");
    localStorage.removeItem("tour-waiting-for-tenant");
    localStorage.removeItem("tour-waiting-for-fields");
    localStorage.removeItem("tour-waiting-for-content");
    localStorage.removeItem("tour-waiting-for-query");
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
    } else {
      void checkProjectStatus();
    }
  }, [tourSteps, tourProgress, checkProjectStatus]);

  const value: TourContextType = {
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
    // Header Setup stays available after Skip; hide only when fully completed.
    shouldShowTour: !tourProgress.isCompleted || isTourDismissed,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export const useTour = (): TourContextType => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};

export const useTourSafe = (): TourContextType | null => {
  const context = useContext(TourContext);
  return context || null;
};
