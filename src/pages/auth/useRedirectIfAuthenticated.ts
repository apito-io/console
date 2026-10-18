import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "../../router/navigation";
import { redirectAfterAuth } from "../../utils/authRedirect";
import type { LocationState } from "../../types/auth";

/** Sends already-authenticated users away from the login screen. */
export function useRedirectIfAuthenticated() {
  const [cookies] = useCookies(["userToken"]);
  const location = useLocation();
  const from = (location.state as unknown as LocationState | undefined)?.from;

  useEffect(() => {
    if (cookies.userToken) {
      redirectAfterAuth(from || "/projects");
    }
  }, [cookies.userToken, from]);
}
