import React from "react";
import { Button, theme } from "antd";
import { PlayCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useTourSafe } from "../../contexts/TourContext";

const TourProgressHeader: React.FC = () => {
  const { token } = theme.useToken();
  const tourContext = useTourSafe();

  // If context is not available, don't render anything
  if (!tourContext) {
    return null;
  }

  const { tourProgress, shouldShowTour, isTourActive, startTour } = tourContext;

  // Don't show if tour is not needed and already completed
  if (!shouldShowTour && tourProgress.isCompleted) {
    return null;
  }

  const completedCount = tourProgress.completedSteps.length;

  const getButtonText = () => {
    if (tourProgress.isCompleted) {
      return "Setup Complete!";
    }
    return `Setup: ${completedCount}/4`;
  };

  const getButtonIcon = () => {
    if (tourProgress.isCompleted) {
      return <CheckCircleOutlined />;
    }
    return <PlayCircleOutlined />;
  };

  const getButtonType = (): "default" | "primary" => {
    if (tourProgress.isCompleted) {
      return "default";
    }
    return "primary";
  };

  return (
    <Button
      type={getButtonType()}
      size="small"
      icon={getButtonIcon()}
      onClick={tourProgress.isCompleted ? undefined : startTour}
      disabled={isTourActive || tourProgress.isCompleted}
      style={{
        height: "32px",
        fontSize: "12px",
        fontWeight: 500,
        cursor: tourProgress.isCompleted ? "default" : "pointer",
        ...(tourProgress.isCompleted
          ? {
              background: token.colorSuccessBg,
              borderColor: token.colorSuccess,
              color: token.colorSuccess,
            }
          : {}),
      }}
    >
      {getButtonText()}
    </Button>
  );
};

export default TourProgressHeader;
