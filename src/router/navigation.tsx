import React, { useCallback, useLayoutEffect, useRef } from "react";
import {
  Link,
  Outlet,
  useLocation as useTanStackLocation,
  useNavigate as useTanStackNavigate,
  useParams as useTanStackParams,
} from "@tanstack/react-router";

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

type NavigateProps = NavigateOptions & {
  to: string;
};

export { Link, Outlet };

export const useLocation = () => {
  const location = useTanStackLocation();
  return {
    pathname: location.pathname,
    search: location.searchStr,
    state: location.state,
  };
};

export const useNavigate = () => {
  const navigate = useTanStackNavigate();
  return useCallback(
    (to: string, options?: NavigateOptions) => {
      void navigate({
        to,
        replace: options?.replace,
        state: options?.state as never,
      });
    },
    [navigate],
  );
};

export const useParams = <TParams extends Record<string, string> = Record<string, string>>() =>
  useTanStackParams({ strict: false }) as TParams;

export const Navigate: React.FC<NavigateProps> = ({ to, replace, state }) => {
  const navigate = useTanStackNavigate();
  const didNavigate = useRef(false);

  useLayoutEffect(() => {
    if (didNavigate.current) {
      return;
    }
    didNavigate.current = true;
    void navigate({
      to,
      replace,
      state: state as never,
    });
  }, [navigate, replace, state, to]);

  return null;
};
