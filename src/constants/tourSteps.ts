import type { TourStep } from "../types/tour";
import { GENERAL_TOUR_STEPS } from "./tourStepsBase";

/** @deprecated Prefer GENERAL_TOUR_STEPS; kept as alias for older imports. */
export const TOUR_STEPS: TourStep[] = GENERAL_TOUR_STEPS;

export { GENERAL_TOUR_STEPS };

export const getTourStepsForCurrentStep = (
  steps: TourStep[],
  currentStep: number
): TourStep[] => {
  return steps.slice(0, currentStep + 1);
};

export const getCurrentTourStep = (
  steps: TourStep[],
  currentStep: number
): TourStep | null => {
  return steps[currentStep] || null;
};
