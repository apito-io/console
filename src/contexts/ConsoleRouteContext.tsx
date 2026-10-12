import React, { createContext, useContext } from "react";

interface ConsoleRouteModel {
  id: string;
  name: string;
  fields: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
}

export interface ConsoleRouteContextValue {
  selectedModel: string | null;
  models: ConsoleRouteModel[];
  contentState?: unknown;
}

const ConsoleRouteContext = createContext<ConsoleRouteContextValue | null>(null);

export const ConsoleRouteProvider: React.FC<
  ConsoleRouteContextValue & { children: React.ReactNode }
> = ({ children, ...value }) => (
  <ConsoleRouteContext.Provider value={value}>
    {children}
  </ConsoleRouteContext.Provider>
);

export const useConsoleRouteContext = () => useContext(ConsoleRouteContext);
