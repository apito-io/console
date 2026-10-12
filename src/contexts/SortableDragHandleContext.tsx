import React, { createContext, useContext } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";

export interface SortableDragHandleProps {
  setActivatorNodeRef: (element: HTMLElement | null) => void;
  listeners: Record<string, unknown> | undefined;
  attributes: DraggableAttributes;
}

const SortableDragHandleContext =
  createContext<SortableDragHandleProps | null>(null);

export const SortableDragHandleProvider = SortableDragHandleContext.Provider;

export function useSortableDragHandle(): SortableDragHandleProps | null {
  return useContext(SortableDragHandleContext);
}
