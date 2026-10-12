import React from "react";
import { Play, Check } from "lucide-react";
import { useTourSafe } from "../../contexts/TourContext";
import "./ConsoleShell.css";

const ConsoleTourAction: React.FC = () => {
  const tourContext = useTourSafe();

  if (!tourContext) {
    return null;
  }

  const { tourProgress, shouldShowTour, isTourActive, startTour } = tourContext;

  // Fully completed and not asking to show Setup again.
  if (!shouldShowTour && tourProgress.isCompleted) {
    return null;
  }

  const completedCount = tourProgress.completedSteps.length;
  const total = tourProgress.totalSteps || 4;
  const label = tourProgress.isCompleted
    ? "Setup complete"
    : `Setup ${completedCount}/${total}`;

  return (
    <button
      type="button"
      className={`console-topbar-tour${tourProgress.isCompleted ? " completed" : ""}`}
      onClick={() => {
        if (!isTourActive) {
          startTour();
        }
      }}
      disabled={isTourActive}
      title={
        tourProgress.isCompleted
          ? "Setup complete"
          : "Open setup guide"
      }
    >
      {tourProgress.isCompleted ? (
        <Check size={14} strokeWidth={1.75} />
      ) : (
        <Play size={14} strokeWidth={1.75} />
      )}
      {label}
    </button>
  );
};

export default ConsoleTourAction;
