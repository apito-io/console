import { useEffect, useState } from "react";
import { useLocation } from "../../router/navigation";
import { useCompactShell } from "./useCompactShell";

export function useMobileShellNav() {
  const compact = useCompactShell();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!compact) {
      setNavOpen(false);
    }
  }, [compact]);

  return { compact, navOpen, setNavOpen };
}
