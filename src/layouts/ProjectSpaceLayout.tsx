import React, { useEffect } from "react";
import ProjectSpaceSidebar from "../components/project/ProjectSpaceSidebar";
import ProjectSpaceTopBar from "../components/project/ProjectSpaceTopBar";
import ConsolePageHeader from "../components/console/ConsolePageHeader";
import ConsolePageBody from "../components/console/ConsolePageBody";
import MobileMenuButton from "../components/mobile/MobileMenuButton";
import MobileNavDrawer from "../components/mobile/MobileNavDrawer";
import { useMobileShellNav } from "../components/mobile/useMobileShellNav";
import type { NavigationConfig } from "../constants/navigation";
import type {
  ProjectExtensionNavItem,
  ProjectNavItem,
} from "../constants/projectNavigation";
import {
  ProjectSpaceMetaProvider,
  useProjectSpaceMetaContext,
} from "../contexts/ProjectSpaceMetaContext";
import { useProjectExtensionNavItems } from "../lib/projectExtensionNav";
import { useAuth } from "../contexts/AuthContext";
import "../components/console/ConsoleShell.css";

export interface ProjectSpaceLayoutProps {
  navigationOverride?: NavigationConfig;
  extraNavItems?: ProjectNavItem[];
  adminNavItems?: ProjectNavItem[];
  extensionNavItems?: ProjectExtensionNavItem[];
  topBarTrailing?: React.ReactNode;
  children: React.ReactNode;
}

const ProjectSpaceChrome: React.FC<ProjectSpaceLayoutProps> = ({
  navigationOverride,
  extraNavItems,
  adminNavItems,
  extensionNavItems,
  topBarTrailing,
  children,
}) => {
  const { meta } = useProjectSpaceMetaContext();
  const { decodeTokenData } = useAuth();
  const token = decodeTokenData();
  const projectId = token?.project_id;
  const contextExtensionItems = useProjectExtensionNavItems();
  const mergedExtensions = extensionNavItems ?? contextExtensionItems;

  useEffect(() => {
    if (typeof window === "undefined" || !window.posthog) return;
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return;
    try {
      if (projectId) {
        window.posthog.group("project", projectId);
      }
    } catch {
      /* ignore analytics failures */
    }
  }, [projectId]);

  const showPageHeader = Boolean(
    meta.title || meta.description || meta.actions,
  );
  const { compact, navOpen, setNavOpen } = useMobileShellNav();

  const sidebar = (
    <ProjectSpaceSidebar
      extraNavItems={extraNavItems}
      adminNavItems={adminNavItems}
      extensionNavItems={mergedExtensions}
    />
  );

  return (
    <div
      className={
        compact ? "console-shell console-shell--compact" : "console-shell"
      }
    >
      {compact ? (
        <MobileNavDrawer open={navOpen} onClose={() => setNavOpen(false)}>
          {sidebar}
        </MobileNavDrawer>
      ) : (
        sidebar
      )}

      <div className="console-main">
        <ProjectSpaceTopBar
          navigationOverride={navigationOverride}
          leading={
            compact ? (
              <MobileMenuButton onClick={() => setNavOpen(true)} />
            ) : undefined
          }
          trailing={topBarTrailing}
        />

        {showPageHeader ? (
          <ConsolePageHeader
            title={meta.title}
            description={meta.description}
            actions={meta.actions}
          />
        ) : null}

        <ConsolePageBody
          variant="project-space"
          fullWidth={meta.fullWidth}
        >
          {children}
        </ConsolePageBody>
      </div>
    </div>
  );
};

const ProjectSpaceLayout: React.FC<ProjectSpaceLayoutProps> = ({
  children,
  ...chromeProps
}) => {
  return (
    <ProjectSpaceMetaProvider>
      <ProjectSpaceChrome {...chromeProps}>{children}</ProjectSpaceChrome>
    </ProjectSpaceMetaProvider>
  );
};

export default ProjectSpaceLayout;
