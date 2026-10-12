import { createContext, useContext } from "react";
const SortableDragHandleContext = createContext(null);
export const SortableDragHandleProvider = SortableDragHandleContext.Provider;
export function useSortableDragHandle() {
    return useContext(SortableDragHandleContext);
}
