import React from "react";
import { LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "../../router/navigation";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import {
  getProjectBreadcrumbs,
  type ProjectBreadcrumbSegment,
} from "../../constants/projectNavigation";
import type { NavigationConfig } from "../../constants/navigation";
import "../console/ConsoleShell.css";

interface ProjectSpaceTopBarProps {
  navigationOverride?: NavigationConfig;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

const ProjectSpaceTopBar: React.FC<ProjectSpaceTopBarProps> = ({
  navigationOverride,
  leading,
  trailing,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();

  const breadcrumbs: ProjectBreadcrumbSegment[] = getProjectBreadcrumbs(
    location.pathname,
    navigationOverride,
  );

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
      icon: <LogOut size={14} />,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="console-topbar">
      <div className="console-topbar-leading">
        {leading}
        <nav className="console-breadcrumb" aria-label="Breadcrumb">
        {breadcrumbs.map((segment, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={`${segment.label}-${index}`}>
              {index > 0 ? (
                <span className="console-breadcrumb-divider">/</span>
              ) : null}
              {isLast || !segment.path ? (
                <span className="console-breadcrumb-segment current">
                  {segment.label}
                </span>
              ) : (
                <button
                  type="button"
                  className="console-breadcrumb-segment"
                  onClick={() => navigate(segment.path!)}
                >
                  {segment.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
        </nav>
      </div>

      <div className="console-topbar-actions">
        {trailing}
        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <button
            type="button"
            className="console-topbar-user"
            aria-label="Account menu"
          >
            <span className="console-topbar-user-avatar">
              <User size={16} strokeWidth={1.75} />
            </span>
          </button>
        </Dropdown>
      </div>
    </header>
  );
};

export default ProjectSpaceTopBar;
