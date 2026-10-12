import React from "react";
import { Outlet, useLocation } from "../../router/navigation";
import ConsolePageBody from "./ConsolePageBody";
import { usesConsolePageBodyPadding } from "./consoleRoutePadding";

/**
 * Wraps console child routes with standard page padding unless the route
 * is full-bleed (content/model/api/settings manage their own layout).
 */
const ConsoleMainOutlet: React.FC = () => {
  const { pathname } = useLocation();

  if (!usesConsolePageBodyPadding(pathname)) {
    return <Outlet />;
  }

  return (
    <ConsolePageBody variant="console">
      <Outlet />
    </ConsolePageBody>
  );
};

export default ConsoleMainOutlet;
