import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { EMPTY_SCHEMA_DRAFT_OVERLAY } from "../types/schemaDraftOverlay";
const ConsoleExtensionsContext = createContext({
    schemaDraftOverlay: EMPTY_SCHEMA_DRAFT_OVERLAY,
});
export const useConsoleExtensions = () => useContext(ConsoleExtensionsContext);
export const ConsoleExtensionsProvider = ({ value, children }) => (_jsx(ConsoleExtensionsContext.Provider, { value: value, children: children }));
export default ConsoleExtensionsContext;
