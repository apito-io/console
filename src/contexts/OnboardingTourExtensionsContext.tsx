import React, { createContext, useContext } from "react";
import type { TourStep } from "../types/tour";

/** Optional hooks for the onboarding tour (OSS stays empty; host app may supply steps and signals). */
export interface OnboardingTourExtensions {
  /** When set, replaces the default general onboarding step list. */
  steps?: TourStep[] | null;
  /**
   * Numeric completion hints keyed by tour step `id` (e.g. a provisioning step
   * may use a count from outside the core model list).
   */
  stepSignals?: Record<string, number>;
  /** Invoked when the active tour step runs its primary action (e.g. open a host-provided form). */
  onStepAction?: (stepId: string) => void;
}

const OnboardingTourExtensionsContext = createContext<OnboardingTourExtensions>(
  {}
);

export const useOnboardingTourExtensions = () =>
  useContext(OnboardingTourExtensionsContext);

export const OnboardingTourExtensionsProvider: React.FC<{
  value: OnboardingTourExtensions;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <OnboardingTourExtensionsContext.Provider value={value}>
    {children}
  </OnboardingTourExtensionsContext.Provider>
);
