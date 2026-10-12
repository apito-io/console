import { Outlet } from "../router/navigation";
import ProjectSpaceLayout from "./ProjectSpaceLayout";

/**
 * Layout route for project-space pages (/projects, /accounts, …).
 * Keeps a single stable <Outlet /> tree so client navigation to /console/* works.
 */
const ProjectSpaceRouteLayout = () => (
  <ProjectSpaceLayout>
    <Outlet />
  </ProjectSpaceLayout>
);

export default ProjectSpaceRouteLayout;
