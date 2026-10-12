import React from "react";
import { LogOut, Puzzle, Code2, User } from "lucide-react";
import { useNavigate, useLocation } from "../../router/navigation";
import { Dropdown } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { getConsoleBreadcrumbs } from "../../constants/consoleNavigation";
import type { MenuProps } from "antd";
import ConsoleTourAction from "./ConsoleTourAction";
import "./ConsoleShell.css";

interface ConsoleTopBarProps {
  selectedModel?: string | null;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

const ConsoleTopBar: React.FC<ConsoleTopBarProps> = ({
  selectedModel,
  leading,
  trailing,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();

  const isSettingsPage = location.pathname.includes("/console/settings");
  const breadcrumbs = getConsoleBreadcrumbs(location.pathname, selectedModel);

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
        {!isSettingsPage ? (
          <>
            <button
              type="button"
              className="console-topbar-action"
              onClick={() => navigate("/console/plugins")}
            >
              <Puzzle size={16} strokeWidth={1.75} />
              Plugins
            </button>
            <button
              type="button"
              className="console-topbar-action"
              onClick={() =>
                window.open("https://github.com/apito-io", "_blank")
              }
            >
              <Code2 size={16} strokeWidth={1.75} />
              Source
            </button>
            <span className="console-topbar-divider" />
            <ConsoleTourAction />
          </>
        ) : null}

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

export default ConsoleTopBar;
