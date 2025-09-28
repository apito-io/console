import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  TourContextType,
  TourProgress,
  ProjectCompletionStatus,
} from "../types/tour";
import { useGetOnlyModelsInfoQuery } from "../generated/graphql";
import { TOUR_STEPS } from "../constants/tourSteps";

const TourContext = createContext<TourContextType | undefined>(undefined);

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [isTourModalVisible, setIsTourModalVisible] = useState(false);
  const [tourProgress, setTourProgress] = useState<TourProgress>({
    currentStep: 0,
    totalSteps: 4,
    completedSteps: [],
    isCompleted: false,
  });

  const [projectStatus, setProjectStatus] = useState<ProjectCompletionStatus>({
    hasModel: false,
    modelHasFields: false,
    modelHasContent: false,
    hasRunQuery: false,
  });

  // Query for models to check project status
  const { data: modelsData, refetch: refetchModels } =
    useGetOnlyModelsInfoQuery({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    });

  // Check if tour should be shown (new project with no models)
  // const shouldShowTour =
  //   !projectStatus.hasModel && !localStorage.getItem("tour-dismissed");

  // Check project completion status
  const checkProjectStatus = useCallback(async () => {
    try {
      // Refetch models data
      const result = await refetchModels();
      const models = result.data?.projectModelsInfo || [];

      const hasModel = models.length > 0;
      let modelHasFields = false;
      let modelHasContent = false;

      if (hasModel && models[0]) {
        // Check if the first model has fields by checking localStorage
        // This will be set when user adds fields
        modelHasFields = localStorage.getItem("project-has-fields") === "true";

        // TODO: Check if model has content entries
        // This would require a separate query to check content
        // For now, we'll check localStorage for content status
        modelHasContent =
          localStorage.getItem("project-has-content") === "true";
      }

      // Check if user has run a GraphQL query
      const hasRunQuery =
        localStorage.getItem("project-has-run-query") === "true";

      console.log("checkProjectStatus - hasRunQuery:", hasRunQuery);

      const newStatus = {
        hasModel,
        modelHasFields,
        modelHasContent,
        hasRunQuery,
      };

      setProjectStatus(newStatus);

      // Update completed steps based on status
      const completedSteps: string[] = [];
      if (hasModel) completedSteps.push("create-model");
      if (modelHasFields) completedSteps.push("add-fields");
      if (modelHasContent) completedSteps.push("add-content");
      if (hasRunQuery) completedSteps.push("run-query");

      setTourProgress((prev) => ({
        ...prev,
        completedSteps,
        isCompleted: completedSteps.length === prev.totalSteps,
      }));

      // Auto-advance tour based on completion
      console.log(
        "Tour status check - isTourActive:",
        isTourActive,
        "tourProgress.currentStep:",
        tourProgress.currentStep,
        "hasRunQuery:",
        hasRunQuery
      );
      if (isTourActive) {
        const currentStepId = TOUR_STEPS[tourProgress.currentStep]?.id;
        console.log(
          "Auto-advance check - currentStep:",
          tourProgress.currentStep,
          "currentStepId:",
          currentStepId,
          "hasRunQuery:",
          hasRunQuery
        );

        // Check if current step is completed and advance tour
        if (
          currentStepId === "create-model" &&
          hasModel &&
          tourProgress.currentStep === 0
        ) {
          setTourProgress((prev) => ({ ...prev, currentStep: 1 }));
        } else if (
          currentStepId === "add-fields" &&
          modelHasFields &&
          tourProgress.currentStep === 1
        ) {
          setTourProgress((prev) => ({ ...prev, currentStep: 2 }));
        } else if (
          currentStepId === "add-content" &&
          modelHasContent &&
          tourProgress.currentStep === 2
        ) {
          setTourProgress((prev) => ({ ...prev, currentStep: 3 }));
        } else if (
          currentStepId === "run-query" &&
          hasRunQuery &&
          tourProgress.currentStep === 3
        ) {
          console.log("Tour step 4 completed - ending tour");
          // Complete the tour
          setIsTourActive(false);
          localStorage.setItem("tour-completed", "true");
        }
      }

      // Auto-end tour if all steps completed
      if (completedSteps.length === 4) {
        setIsTourActive(false);
        localStorage.setItem("tour-completed", "true");
      }
    } catch (error) {
      console.error("Error checking project status:", error);
    }
  }, [refetchModels, isTourActive, tourProgress.currentStep]);

  // Check project status on mount and when models data changes
  useEffect(() => {
    checkProjectStatus();
  }, [modelsData, checkProjectStatus]);

  const startTour = useCallback(() => {
    // Determine the correct step to start from
    let currentStep = 0;
    if (projectStatus.hasModel && !projectStatus.modelHasFields) {
      currentStep = 1; // Start at "add-fields"
    } else if (projectStatus.modelHasFields && !projectStatus.modelHasContent) {
      currentStep = 2; // Start at "add-content"
    } else if (projectStatus.modelHasContent && !projectStatus.hasRunQuery) {
      currentStep = 3; // Start at "run-query"
    }

    setIsTourActive(true);
    setIsTourModalVisible(true);
    setTourProgress((prev) => ({ ...prev, currentStep }));
  }, [projectStatus]);

  // Auto-start tour when setup is incomplete
  useEffect(() => {
    // Don't auto-start if user is already in model creation process
    if (localStorage.getItem("tour-waiting-for-model") === "true") {
      return;
    }

    // Don't auto-start if user is already in field creation process
    if (localStorage.getItem("tour-waiting-for-fields") === "true") {
      return;
    }

    // Don't auto-start if user is already in content creation process
    if (localStorage.getItem("tour-waiting-for-content") === "true") {
      return;
    }

    // Don't auto-start if user is already in query execution process
    if (localStorage.getItem("tour-waiting-for-query") === "true") {
      return;
    }

    // Don't auto-start if tour is already active
    if (isTourActive) {
      return;
    }

    // Check if tour should be shown based on project completion status
    const isSetupIncomplete = !tourProgress.isCompleted;
    const hasIncompleteSteps =
      tourProgress.completedSteps.length < tourProgress.totalSteps;

    // Auto-start tour if setup is incomplete
    if (isSetupIncomplete && hasIncompleteSteps) {
      const timer = setTimeout(() => {
        startTour();
      }, 1500);

      return () => clearTimeout(timer);
    }

    // Handle restart after user cancellation
    if (
      !projectStatus.hasModel &&
      !isTourActive &&
      sessionStorage.getItem("tour-should-restart") === "true"
    ) {
      sessionStorage.removeItem("tour-should-restart");
      const timer = setTimeout(() => {
        startTour();
      }, 500);

      return () => clearTimeout(timer);
    }

    // Also check if we were waiting for field creation but user canceled
    if (
      localStorage.getItem("tour-waiting-for-fields") === "true" &&
      !projectStatus.modelHasFields &&
      !isTourActive
    ) {
      // User closed drawer without creating field, restart tour
      localStorage.removeItem("tour-waiting-for-fields");
      const timer = setTimeout(() => {
        startTour();
      }, 500);

      return () => clearTimeout(timer);
    }

    // Also check if we were waiting for content creation but user canceled
    if (
      localStorage.getItem("tour-waiting-for-content") === "true" &&
      !projectStatus.modelHasContent &&
      !isTourActive
    ) {
      // User closed drawer without creating content, restart tour
      localStorage.removeItem("tour-waiting-for-content");
      const timer = setTimeout(() => {
        startTour();
      }, 500);

      return () => clearTimeout(timer);
    }

    // Also check if we were waiting for query execution but user canceled
    if (
      localStorage.getItem("tour-waiting-for-query") === "true" &&
      !projectStatus.hasRunQuery &&
      !isTourActive
    ) {
      // User canceled without running query, restart tour
      localStorage.removeItem("tour-waiting-for-query");
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
    projectStatus.hasModel,
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

  const value: TourContextType = {
    isTourActive,
    isTourModalVisible,
    tourProgress,
    projectStatus,
    startTour,
    endTour,
    closeTourModal,
    showTourModal,
    nextStep,
    prevStep,
    skipTour,
    checkProjectStatus,
    shouldShowTour: false, // This is not used but required by the type
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

// Optional hook that returns null instead of throwing an error
export const useTourSafe = (): TourContextType | null => {
  const context = useContext(TourContext);
  return context || null;
};
