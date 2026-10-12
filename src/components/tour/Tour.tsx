import React, { useEffect } from "react";
import { Tour as AntdTour } from "antd";
import { useLocation, useNavigate } from "../../router/navigation";
import { useTour } from "../../contexts/TourContext";
import { useOnboardingTourExtensions } from "../../contexts/OnboardingTourExtensionsContext";

function resolveTourTarget(selector: string): HTMLElement | null {
  for (const part of selector.split(",").map((s) => s.trim()).filter(Boolean)) {
    const el = document.querySelector(part);
    if (el instanceof HTMLElement) {
      return el;
    }
  }
  return null;
}

function routeForStep(stepId: string | undefined): string | null {
  switch (stepId) {
    case "create-tenant":
      return "/console/tenants";
    case "create-model":
      return "/console/model";
    case "add-fields":
      return "/console/model";
    case "add-content":
      return "/console/content";
    case "run-query":
      return "/console/graphql";
    default:
      return null;
  }
}

const Tour: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onboardingExt = useOnboardingTourExtensions();
  const {
    isTourModalVisible,
    tourProgress,
    tourSteps,
    endTour,
    closeTourModal,
    skipTour,
  } = useTour();

  const currentStep = tourSteps[tourProgress.currentStep];

  // Bring the user onto the page that owns the current step target (new shell layout).
  useEffect(() => {
    if (!isTourModalVisible || !currentStep) {
      return;
    }
    const dest = routeForStep(currentStep.id);
    if (!dest) {
      return;
    }
    if (!location.pathname.startsWith(dest)) {
      navigate(dest);
    }
  }, [
    isTourModalVisible,
    currentStep?.id,
    location.pathname,
    navigate,
  ]);

  const handleClose = () => {
    endTour();
  };

  const handleAction = () => {
    const currentTourStep = tourSteps[tourProgress.currentStep];

    switch (currentTourStep?.id) {
      case "create-tenant": {
        endTour();
        if (onboardingExt.onStepAction) {
          onboardingExt.onStepAction("create-tenant");
        } else {
          navigate("/console/tenants");
          window.setTimeout(() => {
            const opener = resolveTourTarget(
              '[data-tour="create-tenant-entry"]'
            );
            opener?.click();
          }, 300);
        }
        localStorage.setItem("tour-waiting-for-tenant", "true");
        break;
      }

      case "create-model": {
        endTour();
        const addModelButton = resolveTourTarget(
          '[data-tour="add-model-button"]'
        );
        if (addModelButton) {
          addModelButton.click();
        } else {
          navigate("/console/model?type=new");
        }
        localStorage.setItem("tour-waiting-for-model", "true");
        break;
      }

      case "add-fields": {
        endTour();
        navigate("/console/model");
        window.setTimeout(() => {
          const addFieldsButton = resolveTourTarget(
            '[data-tour="add-fields-button"]'
          );
          addFieldsButton?.click();
        }, 400);
        localStorage.setItem("tour-waiting-for-fields", "true");
        break;
      }

      case "add-content": {
        endTour();
        navigate("/console/content");
        window.setTimeout(() => {
          const createContentButton = resolveTourTarget(
            '[data-tour="create-content-button"]'
          );
          createContentButton?.click();
        }, 400);
        localStorage.setItem("tour-waiting-for-content", "true");
        break;
      }

      case "run-query": {
        closeTourModal();
        navigate("/console/graphql");
        localStorage.setItem("tour-waiting-for-query", "true");
        break;
      }

      default:
        endTour();
    }
  };

  const antdTourSteps = tourSteps.map((step) => ({
    title: step.title,
    description: (
      <>
        {step.description}
        <div className="console-tour-actions">
          {step.skipButtonProps && (
            <button
              type="button"
              className="console-tour-btn console-tour-btn--ghost"
              onClick={(e) => {
                e.stopPropagation();
                // Skip dismisses the whole guide until Setup is clicked in the header.
                skipTour();
              }}
            >
              {step.skipButtonProps.children || "Skip"}
            </button>
          )}
          <button
            type="button"
            className="console-tour-btn console-tour-btn--primary"
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
            }}
          >
            {step.nextButtonProps?.children || "Next"}
          </button>
        </div>
      </>
    ),
    target: () => resolveTourTarget(step.target),
    placement: step.placement ?? "right",
    nextButtonProps: {
      style: { display: "none" },
    },
    prevButtonProps: {
      style: { display: "none" },
    },
  }));

  return (
    <AntdTour
      open={isTourModalVisible}
      onClose={handleClose}
      steps={antdTourSteps}
      current={tourProgress.currentStep}
      type="primary"
      arrow
      placement="right"
      gap={{ offset: 4, radius: 8 }}
      mask={{
        style: {
          boxShadow: "inset 0 0 15px #333",
        },
      }}
      onFinish={() => {
        endTour();
      }}
    />
  );
};

export default Tour;
