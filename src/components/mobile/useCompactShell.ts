import { useEffect, useState } from "react";

/** Matches `@media (max-width: 767px)` — desktop ≥768 keeps the fixed 260px sidebar. */
export const COMPACT_SHELL_QUERY = "(max-width: 767px)";

export function useCompactShell(): boolean {
  const [compact, setCompact] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(COMPACT_SHELL_QUERY).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(COMPACT_SHELL_QUERY);
    const onChange = () => setCompact(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return compact;
}
