import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState, } from "react";
const NavigationExtensionContext = createContext(undefined);
export const NavigationExtensionProvider = ({ children, }) => {
    const [bySource, setBySource] = useState({});
    const [beforeBySource, setBeforeBySource] = useState({});
    const register = useCallback((source, items) => {
        setBySource((prev) => ({ ...prev, [source]: items }));
    }, []);
    const unregister = useCallback((source) => {
        setBySource((prev) => {
            const next = { ...prev };
            delete next[source];
            return next;
        });
    }, []);
    const registerBeforeAnchor = useCallback((source, anchorKey, items) => {
        setBeforeBySource((prev) => ({
            ...prev,
            [source]: { anchorKey, items },
        }));
    }, []);
    const unregisterBeforeAnchor = useCallback((source) => {
        setBeforeBySource((prev) => {
            const next = { ...prev };
            delete next[source];
            return next;
        });
    }, []);
    const extensionItems = useMemo(() => {
        const sources = Object.keys(bySource).sort();
        const out = [];
        for (const s of sources) {
            out.push(...(bySource[s] ?? []));
        }
        return out;
    }, [bySource]);
    const beforeAnchorItems = useMemo(() => {
        const sources = Object.keys(beforeBySource).sort();
        return sources.map((s) => beforeBySource[s]).filter(Boolean);
    }, [beforeBySource]);
    const value = useMemo(() => ({
        extensionItems,
        beforeAnchorItems,
        register,
        unregister,
        registerBeforeAnchor,
        unregisterBeforeAnchor,
    }), [
        extensionItems,
        beforeAnchorItems,
        register,
        unregister,
        registerBeforeAnchor,
        unregisterBeforeAnchor,
    ]);
    return (_jsx(NavigationExtensionContext.Provider, { value: value, children: children }));
};
export function useNavigationExtension() {
    const ctx = useContext(NavigationExtensionContext);
    if (!ctx) {
        throw new Error("useNavigationExtension must be used within NavigationExtensionProvider");
    }
    return ctx;
}
/** Insert extension items before the first menu entry matching anchorKey. */
export function insertBeforeAnchor(items, anchorKey, inserts) {
    if (inserts.length === 0)
        return items;
    const idx = items.findIndex((item) => item &&
        typeof item === "object" &&
        "key" in item &&
        item.key === anchorKey);
    if (idx < 0)
        return [...items, ...inserts];
    return [...items.slice(0, idx), ...inserts, ...items.slice(idx)];
}
