import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { redirectAfterAuth } from "../../utils/authRedirect";

/** Sends already-authenticated users away from the login screen. */
export function useRedirectIfAuthenticated() {
  const [cookies] = useCookies(["userToken"]);

  useEffect(() => {
    if (cookies.userToken) {
      redirectAfterAuth("/projects");
    }
  }, [cookies.userToken]);
}
