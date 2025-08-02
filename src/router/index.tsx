import { createBrowserRouter } from "react-router-dom";
import { authRoutes, getMainRoutes } from "./baseRoutes";
import CommonLayout from "../layouts/CommonLayout";

// Open-core router using base routes (no pro features)
export const router = createBrowserRouter([
  ...authRoutes,
  ...getMainRoutes(CommonLayout, []), // No additional routes for open-core
]);

export default router;
