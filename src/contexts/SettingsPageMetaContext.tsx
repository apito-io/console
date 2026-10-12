import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface SettingsPageMeta {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** When true, content uses full width (e.g. DB Explorer). */
  fullWidth?: boolean;
  /** Fill remaining settings chrome height (split-pane tools). */
  fillViewport?: boolean;
}

interface SettingsPageMetaContextValue {
  meta: SettingsPageMeta;
  setMeta: (meta: SettingsPageMeta) => void;
}

const SettingsPageMetaContext = createContext<SettingsPageMetaContextValue | null>(
  null,
);

export const SettingsPageMetaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [meta, setMetaState] = useState<SettingsPageMeta>({});

  const setMeta = useCallback((next: SettingsPageMeta) => {
    setMetaState(next);
  }, []);

  const value = useMemo(() => ({ meta, setMeta }), [meta, setMeta]);

  return (
    <SettingsPageMetaContext.Provider value={value}>
      {children}
    </SettingsPageMetaContext.Provider>
  );
};

export function useSettingsPageMetaContext(): SettingsPageMetaContextValue {
  const ctx = useContext(SettingsPageMetaContext);
  if (!ctx) {
    throw new Error(
      "useSettingsPageMetaContext must be used within SettingsPageMetaProvider",
    );
  }
  return ctx;
}

/** Let a settings child page override the shared header or layout. */
export function useSettingsPageMeta(meta: SettingsPageMeta): void {
  const { setMeta } = useSettingsPageMetaContext();

  useEffect(() => {
    setMeta(meta);
    return () => setMeta({});
  }, [
    setMeta,
    meta.title,
    meta.description,
    meta.actions,
    meta.fullWidth,
    meta.fillViewport,
  ]);
}
