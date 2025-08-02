import { Segmented, theme, Button, Dropdown } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  GithubOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePluginManager } from "../../plugins/PluginManager";
import { getHeaderTitle, getHeaderSubtitle } from "../../constants/navigation";
import {
  getSettingsHeaderTitle,
  getSettingsHeaderSubtitle,
} from "../../constants/settingsNavigation";
import type { MenuProps } from "antd";

interface HeaderProps {
  currentPath: string;
}

const Header = ({ currentPath }: HeaderProps) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout, decodeTokenData } = useAuth();
  const [, pluginAPI] = usePluginManager();

  const tokenData = decodeTokenData();
  const isConsolePage = location.pathname.startsWith("/console/");

  const handleSegmentChange = (value: string) => {
    if (value.startsWith("plugin-")) {
      // Handle plugin navigation
      const pluginPath = value.replace("plugin-", "/console/plugin/");
      navigate(pluginPath);
    } else {
      navigate(`/console/${value}`);
    }
  };

  // Generate navigation options including plugins
  const getNavigationOptions = () => {
    const baseOptions = [
      { label: "Content", value: "content" },
      { label: "Model", value: "model" },
      { label: "API", value: "api" },
    ];

    // Get plugin menu items
    const pluginMenuItems = pluginAPI.getPluginMenuItems();

    // Convert plugin items to segmented options
    const pluginOptions = pluginMenuItems.map((item) => ({
      label: item.label,
      value: `plugin-${item.path.replace("/console/plugin/", "")}`,
    }));

    // Insert plugin options after API (as specified in requirements)
    const apiIndex = baseOptions.findIndex((opt) => opt.value === "api");
    const result = [...baseOptions];
    result.splice(apiIndex + 1, 0, ...pluginOptions);

    return result;
  };

  // Get current value for segmented control
  const getCurrentValue = () => {
    if (location.pathname.startsWith("/console/plugin/")) {
      const pluginName = location.pathname
        .split("/console/plugin/")[1]
        ?.split("/")[0];
      return `plugin-${pluginName}`;
    }
    return currentPath;
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div
      style={{
        background: token.colorBgContainer,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "72px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
        position: "fixed",
        top: 0,
        left: 240,
        right: 0,
        zIndex: 99,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: 600,
            color: token.colorText,
            lineHeight: "32px",
          }}
        >
          {location.pathname.includes("/console/settings")
            ? getSettingsHeaderTitle(currentPath)
            : getHeaderTitle(currentPath)}
        </h1>
        {(location.pathname.includes("/console/settings")
          ? getSettingsHeaderSubtitle(currentPath)
          : getHeaderSubtitle(currentPath)) && (
          <div
            style={{
              margin: 0,
              fontSize: "12px",
              color: token.colorTextSecondary,
              lineHeight: "20px",
              marginTop: "2px",
            }}
          >
            {location.pathname.includes("/console/settings")
              ? getSettingsHeaderSubtitle(currentPath)
              : getHeaderSubtitle(currentPath)}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {isConsolePage && !location.pathname.includes("/console/settings") && (
          <>
            <Segmented
              value={getCurrentValue()}
              onChange={handleSegmentChange}
              options={getNavigationOptions()}
              style={{
                background: token.colorFill,
                borderRadius: token.borderRadius,
                border: "none",
                padding: "2px",
                boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.04)",
                minWidth: "300px",
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Button
                type="text"
                icon={<AppstoreOutlined />}
                onClick={() => navigate("/console/plugins")}
                style={{
                  color: token.colorTextSecondary,
                  border: "none",
                  padding: "4px 8px",
                  height: "32px",
                }}
              >
                Plugins
              </Button>

              <Button
                type="text"
                icon={<GithubOutlined />}
                style={{
                  color: token.colorTextSecondary,
                  border: "none",
                  padding: "4px 8px",
                  height: "32px",
                }}
              >
                Source Code
              </Button>
            </div>
          </>
        )}

        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: token.colorTextSecondary,
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = token.colorFillTertiary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <UserOutlined
              style={{
                color: token.colorTextTertiary,
                fontSize: "16px",
              }}
            />
            <span style={{ color: token.colorText }}>
              Welcome, {tokenData?.email?.split("@")[0] || "User"}!
            </span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
