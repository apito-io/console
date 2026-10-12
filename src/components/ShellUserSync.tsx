import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useShellStore } from "../stores/shellStore";

/**
 * When the authenticated user changes, reset persisted shell UI prefs
 * so sidebar state does not leak across accounts.
 */
export const ShellUserSync = () => {
  const { decodeTokenData } = useAuth();
  const tokenData = decodeTokenData();
  const sub =
    (tokenData as { sub?: string } | null)?.sub ??
    (tokenData as { email?: string } | null)?.email ??
    null;

  const shellUserId = useShellStore((s) => s.shellUserId);
  const setShellUserId = useShellStore((s) => s.setShellUserId);
  const setSidebarOpenKeys = useShellStore((s) => s.setSidebarOpenKeys);

  useEffect(() => {
    const nextId = sub ?? "__anonymous__";
    if (nextId === (shellUserId ?? "__anonymous__")) return;
    setShellUserId(sub);
    setSidebarOpenKeys(["projects"]);
  }, [sub, shellUserId, setShellUserId, setSidebarOpenKeys]);

  return null;
};
