import { GENERAL_TOUR_STEPS } from "./tourStepsBase";
/** @deprecated Prefer GENERAL_TOUR_STEPS; kept as alias for older imports. */
export const TOUR_STEPS = GENERAL_TOUR_STEPS;
export { GENERAL_TOUR_STEPS };
export const getTourStepsForCurrentStep = (steps, currentStep) => {
    return steps.slice(0, currentStep + 1);
};
export const getCurrentTourStep = (steps, currentStep) => {
    return steps[currentStep] || null;
};
