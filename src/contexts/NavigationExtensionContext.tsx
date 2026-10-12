import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ItemType } from "antd/es/menu/interface";

/** Ant Design menu item shape used by Sidebar (subset of ItemType). */
export type NavExtensionItem = ItemType;

type BeforeAnchorRegistration = {
  anchorKey: string;
  items: NavExtensionItem[];
};

export interface NavigationExtensionContextValue {
  /** Merged extension items from all sources (pro, plugins, …). */
  extensionItems: NavExtensionItem[];
  /** Items inserted immediately before a base menu anchor key (e.g. before "support"). */
  beforeAnchorItems: BeforeAnchorRegistration[];
  register: (source: string, items: NavExtensionItem[]) => void;
  unregister: (source: string) => void;
  registerBeforeAnchor: (
    source: string,
    anchorKey: string,
    items: NavExtensionItem[]
  ) => void;
  unregisterBeforeAnchor: (source: string) => void;
}

const NavigationExtensionContext = createContext<
  NavigationExtensionContextValue | undefined
>(undefined);

export const NavigationExtensionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bySource, setBySource] = useState<Record<string, NavExtensionItem[]>>(
    {}
  );
  const [beforeBySource, setBeforeBySource] = useState<
    Record<string, BeforeAnchorRegistration>
  >({});

  const register = useCallback((source: string, items: NavExtensionItem[]) => {
    setBySource((prev) => ({ ...prev, [source]: items }));
  }, []);

  const unregister = useCallback((source: string) => {
    setBySource((prev) => {
      const next = { ...prev };
      delete next[source];
      return next;
    });
  }, []);

  const registerBeforeAnchor = useCallback(
    (source: string, anchorKey: string, items: NavExtensionItem[]) => {
      setBeforeBySource((prev) => ({
        ...prev,
        [source]: { anchorKey, items },
      }));
    },
    []
  );

  const unregisterBeforeAnchor = useCallback((source: string) => {
    setBeforeBySource((prev) => {
      const next = { ...prev };
      delete next[source];
      return next;
    });
  }, []);

  const extensionItems = useMemo(() => {
    const sources = Object.keys(bySource).sort();
    const out: NavExtensionItem[] = [];
    for (const s of sources) {
      out.push(...(bySource[s] ?? []));
    }
    return out;
  }, [bySource]);

  const beforeAnchorItems = useMemo(() => {
    const sources = Object.keys(beforeBySource).sort();
    return sources.map((s) => beforeBySource[s]).filter(Boolean);
  }, [beforeBySource]);

  const value = useMemo(
    () => ({
      extensionItems,
      beforeAnchorItems,
      register,
      unregister,
      registerBeforeAnchor,
      unregisterBeforeAnchor,
    }),
    [
      extensionItems,
      beforeAnchorItems,
      register,
      unregister,
      registerBeforeAnchor,
      unregisterBeforeAnchor,
    ]
  );

  return (
    <NavigationExtensionContext.Provider value={value}>
      {children}
    </NavigationExtensionContext.Provider>
  );
};

export function useNavigationExtension(): NavigationExtensionContextValue {
  const ctx = useContext(NavigationExtensionContext);
  if (!ctx) {
    throw new Error(
      "useNavigationExtension must be used within NavigationExtensionProvider"
    );
  }
  return ctx;
}

/** Insert extension items before the first menu entry matching anchorKey. */
export function insertBeforeAnchor(
  items: NavExtensionItem[],
  anchorKey: string,
  inserts: NavExtensionItem[]
): NavExtensionItem[] {
  if (inserts.length === 0) return items;
  const idx = items.findIndex(
    (item) =>
      item &&
      typeof item === "object" &&
      "key" in item &&
      item.key === anchorKey
  );
  if (idx < 0) return [...items, ...inserts];
  return [...items.slice(0, idx), ...inserts, ...items.slice(idx)];
}
