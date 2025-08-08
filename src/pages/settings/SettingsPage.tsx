import React, { useMemo } from "react";
import { Typography, theme } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  SettingOutlined,
  TeamOutlined,
  KeyOutlined,
  UserSwitchOutlined,
  AppstoreOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { usePluginManager } from "../../plugins/PluginManager";
import { getSettingsHeaderSubtitle } from "../../constants/settingsNavigation";

const { Text } = Typography;

const SettingsPage: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [, pluginAPI] = usePluginManager();

  // Get plugin settings items
  const pluginSettingsItems = useMemo(() => {
    return pluginAPI.getPluginSettingsItems();
  }, [pluginAPI]);

  const coreSettingsMenuItems = useMemo(
    () => [
      {
        key: "general",
        icon: <SettingOutlined />,
        label: "General",
        onClick: () => navigate("/console/settings/general"),
      },
      {
        key: "teams",
        icon: <TeamOutlined />,
        label: "Teams",
        onClick: () => navigate("/console/settings/teams"),
      },
      {
        key: "api-secrets",
        icon: <KeyOutlined />,
        label: "API Secrets",
        onClick: () => navigate("/console/settings/api-secrets"),
      },
      {
        key: "webhooks",
        icon: <ApiOutlined />,
        label: "Webhooks",
        onClick: () => navigate("/console/settings/webhooks"),
      },
      {
        key: "roles",
        icon: <UserSwitchOutlined />,
        label: "Roles & Permissions",
        onClick: () => navigate("/console/settings/roles"),
      },
      {
        key: "plugins",
        icon: <AppstoreOutlined />,
        label: "Plugins",
        onClick: () => navigate("/console/settings/plugins"),
      },
    ],
    [navigate]
  );

  // Combine core and plugin settings menu items
  const settingsMenuItems = useMemo(() => {
    const pluginItems = pluginSettingsItems.map((plugin) => ({
      key: `plugin-${plugin.pluginName}`,
      icon: <AppstoreOutlined />,
      label: plugin.label,
      onClick: () => navigate(plugin.path),
    }));

    return [...coreSettingsMenuItems, ...pluginItems];
  }, [coreSettingsMenuItems, pluginSettingsItems, navigate]);

  // Check if we're on the main settings page
  const isMainSettingsPage = location.pathname === "/console/settings";

  // Get the current path for header (remove /console/settings/ prefix)
  const currentPath = location.pathname
    .replace("/console/settings/", "")
    .replace("/console/settings", "settings");

  return (
    <div style={{ padding: "24px 24px 24px 24px", margin: "0 auto" }}>
      {isMainSettingsPage ? (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Text type="secondary">
            {getSettingsHeaderSubtitle(currentPath) ||
              "Welcome to your project settings. Select a category from the sidebar to get started."}
          </Text>

          <div
            style={{
              marginTop: "32px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {settingsMenuItems.map((item) => (
              <div
                key={item.key}
                style={{
                  padding: "20px",
                  background: token.colorBgContainer,
                  borderRadius: token.borderRadius,
                  border: `1px solid ${token.colorBorder}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={item.onClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = token.colorPrimary;
                  e.currentTarget.style.boxShadow = `0 2px 8px ${token.colorPrimary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = token.colorBorder;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {item.icon}
                  <div>
                    <div style={{ fontWeight: 500, color: token.colorText }}>
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: token.colorTextSecondary,
                        marginTop: "4px",
                      }}
                    >
                      {item.key === "general" && "Basic project configuration"}
                      {item.key === "teams" && "Manage team members and access"}
                      {item.key === "api-secrets" &&
                        "API keys and authentication"}
                      {item.key === "webhooks" &&
                        "Event notifications and integrations"}
                      {item.key === "roles" && "User roles and permissions"}
                      {item.key === "plugins" &&
                        "Extend functionality with plugins"}
                      {item.key === "database" &&
                        "Database connection settings"}
                      {item.key === "api-usage" &&
                        "Monitor API usage and limits"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default SettingsPage;
