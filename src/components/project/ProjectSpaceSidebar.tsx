import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "../../router/navigation";
import { Button } from "antd";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  ArrowRight,
  FolderKanban,
} from "lucide-react";
import {
  PROJECT_FOOTER_NAV,
  PROJECT_PRIMARY_NAV,
  isProjectNavActive,
  type ProjectExtensionNavItem,
  type ProjectNavItem,
} from "../../constants/projectNavigation";
import { getActiveMenuKey } from "../../navigation/getActiveMenuKey";
import { useAuth } from "../../contexts/AuthContext";
import { useConsoleExtensions } from "../../contexts/ConsoleExtensionsContext";
import { useProjectsQuery } from "../../pages/projects/queries";
import {
  getRecentProjectIdFromCookie,
  selectProjectsList,
} from "../../pages/projects/selectors";
import { assetUrl } from "../../utils/url";
import { getLogoPath, getProductName } from "../../utils/env";
import "../console/ConsoleShell.css";

export interface ProjectSpaceSidebarProps {
  extensionNavItems?: ProjectExtensionNavItem[];
  extraNavItems?: ProjectNavItem[];
  adminNavItems?: ProjectNavItem[];
}

const ProjectSpaceSidebar: React.FC<ProjectSpaceSidebarProps> = ({
  extensionNavItems = [],
  extraNavItems = [],
  adminNavItems = [],
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { decodeTokenData } = useAuth();
  const tokenData = decodeTokenData();
  const { resolveConsoleEntryPath } = useConsoleExtensions();

  const [projectsExpanded, setProjectsExpanded] = useState(
    location.pathname.startsWith("/projects"),
  );

  useEffect(() => {
    if (location.pathname.startsWith("/projects")) {
      setProjectsExpanded(true);
    }
  }, [location.pathname]);

  const { data: projectsData } = useProjectsQuery();
  const projects = useMemo(
    () => selectProjectsList(projectsData),
    [projectsData],
  );
  const recentId = getRecentProjectIdFromCookie();
  const recentExists =
    Boolean(recentId) && projects.some((p) => p.id === recentId);

  const workspaceExtras = useMemo(
    () => extraNavItems.filter((item) => item.group !== "saas-monetization"),
    [extraNavItems],
  );
  const saasMonetizationNav = useMemo(
    () => extraNavItems.filter((item) => item.group === "saas-monetization"),
    [extraNavItems],
  );
  const extraKeys = useMemo(
    () => new Set(extraNavItems.map((item) => item.key)),
    [extraNavItems],
  );
  const footerNav = useMemo(
    () => PROJECT_FOOTER_NAV.filter((item) => !extraKeys.has(item.key)),
    [extraKeys],
  );

  const primaryNav = useMemo(
    () => [...PROJECT_PRIMARY_NAV, ...workspaceExtras],
    [workspaceExtras],
  );

  const projectsActive = location.pathname.startsWith("/projects");
  const activeMenuKey = getActiveMenuKey(location.pathname);

  const handleProjectsNavClick = () => {
    setProjectsExpanded((prev) => !prev);
    navigate("/projects");
  };

  const renderNavButton = (item: ProjectNavItem) => {
    const Icon = item.icon;
    const active = isProjectNavActive(item, location.pathname);

    return (
      <button
        key={item.key}
        type="button"
        className={`console-nav-item${active ? " active" : ""}`}
        onClick={() => navigate(item.path)}
      >
        <span className="console-nav-item-main">
          <Icon size={16} strokeWidth={1.75} />
          <span>{item.label}</span>
        </span>
      </button>
    );
  };

  const renderExtensionItem = (item: ProjectExtensionNavItem) => {
    const active =
      item.path !== "#" && location.pathname.startsWith(item.path);
    return (
      <button
        key={item.key}
        type="button"
        className={`console-nav-item${active ? " active" : ""}`}
        onClick={() => {
          if (item.onClick) {
            item.onClick();
          } else if (item.path !== "#") {
            navigate(item.path);
          }
        }}
      >
        <span className="console-nav-item-main">
          {item.icon ?? null}
          <span>{item.label}</span>
        </span>
      </button>
    );
  };

  return (
    <aside className="console-sidebar">
      <div className="console-sidebar-header">
        <div
          className="console-sidebar-brand"
          onClick={() => navigate("/projects")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate("/projects");
          }}
        >
          <img
            src={assetUrl(getLogoPath())}
            alt={getProductName()}
            style={{ width: 20, height: 20, flexShrink: 0 }}
          />
          <div>
            <div className="console-sidebar-brand-title">{getProductName()}</div>
            <div className="console-sidebar-brand-subtitle">
              {tokenData?.email?.split("@")[0] ?? "Workspace"}
            </div>
          </div>
        </div>

        {recentExists ? (
          <div className="console-sidebar-tenant-slot">
            <Button
              type="primary"
              size="small"
              icon={<ArrowRight size={14} />}
              onClick={() => {
                const recentProject = projects.find((p) => p.id === recentId);
                const entryPath =
                  resolveConsoleEntryPath?.(recentProject) ??
                  "/console/content";
                navigate(entryPath);
              }}
              block
              className="console-btn-primary"
            >
              Go to Project
            </Button>
          </div>
        ) : null}
      </div>

      <div className="console-sidebar-nav">
        <section className="console-sidebar-section" aria-label="Workspace">
          <div className="console-sidebar-section-label">Workspace</div>

          <div>
            <button
              type="button"
              className={`console-nav-item${projectsActive ? " active" : ""}`}
              onClick={handleProjectsNavClick}
            >
              <span className="console-nav-item-main">
                <FolderKanban size={16} strokeWidth={1.75} />
                <span>Projects</span>
              </span>
              {projectsExpanded ? (
                <ChevronDown size={16} className="console-nav-chevron" />
              ) : (
                <ChevronRight size={16} className="console-nav-chevron" />
              )}
            </button>

            {projectsExpanded ? (
              <div className="console-nav-nested">
                <button
                  type="button"
                  className={`console-nav-model-item${
                    activeMenuKey === "active-projects" ? " active" : ""
                  }`}
                  onClick={() => navigate("/projects")}
                >
                  <span className="console-nav-model-name">Active Projects</span>
                </button>
                <button
                  type="button"
                  className={`console-nav-model-item${
                    activeMenuKey === "new-project" ? " active" : ""
                  }`}
                  onClick={() => navigate("/projects/new")}
                >
                  <span className="console-nav-model-name">
                    <Plus
                      size={12}
                      style={{ marginRight: 4, verticalAlign: -2 }}
                    />
                    New Project
                  </span>
                </button>
              </div>
            ) : null}
          </div>

          {primaryNav
            .filter((item) => item.key !== "projects")
            .map(renderNavButton)}

          {extensionNavItems.map(renderExtensionItem)}
        </section>

        {saasMonetizationNav.length > 0 ? (
          <section
            className="console-sidebar-section"
            aria-label="SaaS Monetization"
          >
            <div className="console-sidebar-section-label">
              SaaS Monetization
            </div>
            {saasMonetizationNav.map(renderNavButton)}
          </section>
        ) : null}

        {adminNavItems.length > 0 ? (
          <section className="console-sidebar-section" aria-label="Administrator">
            <div className="console-sidebar-section-label">Administrator</div>
            {adminNavItems.map(renderNavButton)}
          </section>
        ) : null}
      </div>

      <div className="console-sidebar-footer">
        {footerNav.map(renderNavButton)}
        <button
          type="button"
          className="console-nav-item console-discord-btn"
          onClick={() =>
            window.open("https://discord.gg/Xb7p2ddC6E", "_blank")
          }
        >
          <span className="console-nav-item-main">
            <span>Join Discord</span>
          </span>
        </button>
      </div>
    </aside>
  );
};

export default ProjectSpaceSidebar;
