import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const OnboardingTourExtensionsContext = createContext({});
export const useOnboardingTourExtensions = () => useContext(OnboardingTourExtensionsContext);
export const OnboardingTourExtensionsProvider = ({ value, children }) => (_jsx(OnboardingTourExtensionsContext.Provider, { value: value, children: children }));
