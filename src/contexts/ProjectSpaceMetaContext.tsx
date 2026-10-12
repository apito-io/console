import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface ProjectSpaceMeta {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  fullWidth?: boolean;
}

interface ProjectSpaceMetaContextValue {
  meta: ProjectSpaceMeta;
  setMeta: (meta: ProjectSpaceMeta) => void;
}

const ProjectSpaceMetaContext = createContext<ProjectSpaceMetaContextValue | null>(
  null,
);

export const ProjectSpaceMetaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [meta, setMetaState] = useState<ProjectSpaceMeta>({});

  const setMeta = useCallback((next: ProjectSpaceMeta) => {
    setMetaState(next);
  }, []);

  const value = useMemo(() => ({ meta, setMeta }), [meta, setMeta]);

  return (
    <ProjectSpaceMetaContext.Provider value={value}>
      {children}
    </ProjectSpaceMetaContext.Provider>
  );
};

export function useProjectSpaceMetaContext(): ProjectSpaceMetaContextValue {
  const ctx = useContext(ProjectSpaceMetaContext);
  if (!ctx) {
    throw new Error(
      "useProjectSpaceMetaContext must be used within ProjectSpaceMetaProvider",
    );
  }
  return ctx;
}

export function useProjectSpaceMeta(meta: ProjectSpaceMeta): void {
  const { setMeta } = useProjectSpaceMetaContext();

  useEffect(() => {
    setMeta(meta);
    return () => setMeta({});
  }, [setMeta, meta.title, meta.description, meta.actions, meta.fullWidth]);
}
