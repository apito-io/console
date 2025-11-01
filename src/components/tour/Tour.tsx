import React from "react";
import { Tour as AntdTour } from "antd";
import { useNavigate } from "react-router-dom";
import { useTour } from "../../contexts/TourContext";
import { TOUR_STEPS } from "../../constants/tourSteps";

const Tour: React.FC = () => {
  const navigate = useNavigate();
  const {
    isTourModalVisible,
    tourProgress,
    endTour,
    closeTourModal,
    skipStep,
  } = useTour();

  const handleClose = () => {
    endTour();
  };

  const handleAction = () => {
    const currentTourStep = TOUR_STEPS[tourProgress.currentStep];

    switch (currentTourStep?.id) {
      case "create-model": {
        // Close the tour first to avoid background overlap
        endTour();

        // Try to trigger the Add Model button click
        const addModelButton = document.querySelector(
          '[data-tour="add-model-button"]'
        );

        if (addModelButton) {
          (addModelButton as HTMLButtonElement).click();
        } else {
          // Fallback: navigate to model page with type=new
          navigate("/console/model?type=new");
        }

        // Mark that we're waiting for model creation
        localStorage.setItem("tour-waiting-for-model", "true");
        // Don't advance tour - let the model creation success trigger advancement
        break;
      }

      case "add-fields": {
        // Close the tour first to avoid background overlap
        endTour();

        // Navigate to model page and trigger field addition
        navigate("/console/model");
        setTimeout(() => {
          const addFieldsButton = document.querySelector(
            '[data-tour="add-fields-button"]'
          );
          if (addFieldsButton) {
            (addFieldsButton as HTMLButtonElement).click();
          }
        }, 500);

        // Mark that we're waiting for field creation
        localStorage.setItem("tour-waiting-for-fields", "true");
        // Don't advance tour - let the field creation success trigger advancement
        break;
      }

      case "add-content": {
        // Close the tour first to avoid background overlap
        endTour();

        // Navigate to content page and trigger content creation
        navigate("/console/content");
        setTimeout(() => {
          const createContentButton = document.querySelector(
            '[data-tour="create-content-button"]'
          );
          if (createContentButton) {
            (createContentButton as HTMLButtonElement).click();
          }
        }, 500);

        // Mark that we're waiting for content creation
        localStorage.setItem("tour-waiting-for-content", "true");
        // Don't advance tour - let the content creation success trigger advancement
        break;
      }

      case "run-query": {
        // Close the tour modal but keep tour active for tracking
        closeTourModal();

        // Navigate to API page - let user write and execute their own query
        navigate("/console/api");

        // Mark that we're waiting for query execution
        localStorage.setItem("tour-waiting-for-query", "true");
        // Don't advance tour - let the query execution trigger completion
        break;
      }

      default:
        // Fallback behavior
        endTour();
    }
  };

  // Convert our tour steps to Ant Design Tour format
  const antdTourSteps = TOUR_STEPS.map((step, index) => ({
    title: step.title,
    description: (
      <>
        {step.description}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          {index > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (tourProgress.currentStep > 0) {
                  // Handle previous step
                }
              }}
              style={{
                padding: "4px 15px",
                borderRadius: "6px",
                border: "1px solid #d9d9d9",
                background: "#fff",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Previous
            </button>
          )}
          {step.skipButtonProps && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                skipStep();
              }}
              style={{
                padding: "4px 15px",
                borderRadius: "6px",
                border: "1px solid #d9d9d9",
                background: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                color: "#666",
              }}
            >
              {step.skipButtonProps.children || "Skip"}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
            }}
            style={{
              padding: "4px 15px",
              borderRadius: "6px",
              border: "none",
              background: "#1677ff",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {step.nextButtonProps?.children || "Next"}
          </button>
        </div>
      </>
    ),
    target: () => {
      const element = document.querySelector(step.target);
      return element as HTMLElement | null;
    },
    placement: step.placement,
    nextButtonProps: {
      style: { display: "none" }, // Hide default next button
    },
    prevButtonProps: {
      style: { display: "none" }, // Hide default prev button
    },
  })) as any; // Type assertion to work around Ant Design type issues

  return (
    <AntdTour
      open={isTourModalVisible}
      onClose={handleClose}
      steps={antdTourSteps}
      current={tourProgress.currentStep}
      type="primary"
      arrow={true}
      placement="bottom"
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
