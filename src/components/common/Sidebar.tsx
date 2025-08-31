import { Menu, theme, Button, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ProjectOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  CloudSyncOutlined,
  ApiOutlined,
  PlusOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";

const { Text } = Typography;
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { decodeTokenData } = useAuth();
  const tokenData = decodeTokenData();

  // Check if we have a recent project in cookies
  const getRecentProjectId = () => {
    try {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith("project_id="))
        ?.split("=")[1];
    } catch {
      return null;
    }
  };

  const recentProjectId = getRecentProjectId();

  // State for additional menu items (for Pro version)
  const [additionalMenuItems, setAdditionalMenuItems] = useState<any[]>([]);

  // Listen for changes to additional menu items
  useEffect(() => {
    const checkForAdditionalItems = () => {
      const items = (window as any).__APITO_ADDITIONAL_MENU_ITEMS__ || [];
      setAdditionalMenuItems(items);
    };

    // Initial check
    checkForAdditionalItems();

    // Set up an interval to check for updates (for when ProSidebar registers items)
    const interval = setInterval(checkForAdditionalItems, 100);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Base menu items for open-core (no pro features) - keeping original structure with new styling
  const getBaseMenuItems = () => [
    {
      key: "projects",
      icon: <ProjectOutlined />,
      label: "Projects",
      children: [
        {
          key: "active-projects",
          icon: <ProjectOutlined />,
          label: "Active Projects",
          onClick: () => navigate("/projects"),
        },
        {
          key: "new-project",
          icon: <PlusOutlined />,
          label: "New Project",
          onClick: () => navigate("/projects/new"),
        },
      ],
    },
    {
      key: "accounts",
      icon: <UserOutlined />,
      label: "Account Settings",
      onClick: () => navigate("/accounts"),
    },
    {
      key: "support",
      icon: <QuestionCircleOutlined />,
      label: "Help & Support",
      onClick: () => navigate("/support"),
    },
    {
      key: "sync",
      icon: <CloudSyncOutlined />,
      label: "Cloud Sync",
      onClick: () => navigate("/sync"),
    },
    {
      key: "system-api",
      icon: <ApiOutlined />,
      label: "System API",
      onClick: () => navigate("/system-api"),
    },
    {
      key: "plugins",
      icon: <AppstoreOutlined />,
      label: "System Plugins",
      onClick: () => navigate("/plugins"),
    },
  ];

  // Combine base menu items with additional ones
  const menuItems = [...getBaseMenuItems(), ...additionalMenuItems];

  // Get the current active menu key based on the current path
  const getActiveKey = () => {
    const path = location.pathname;
    if (path === "/projects") return "active-projects";
    if (path === "/projects/new") return "new-project";
    if (path.includes("/projects/")) return "active-projects";
    if (path.includes("/accounts")) return "accounts";
    if (path.includes("/support")) return "support";
    if (path.includes("/sync")) return "sync";
    if (path.includes("/system-api")) return "system-api";
    if (path.includes("/plugins")) return "plugins";
    if (path.includes("/subscriptions")) return "subscriptions";
    if (path.includes("/admin")) return "admin";
    if (path.includes("/audit-log")) return "audit-log";
    return "active-projects";
  };

  // Get default open keys based on current path
  const getDefaultOpenKeys = () => {
    return ["projects"]; // Always open projects by default
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: token.colorBgContainer,
      }}
    >
      {/* Header Section */}
      <div
        style={{
          padding: "16px 20px 12px 20px",
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            marginBottom: "4px",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.svg"
            alt="Apito"
            style={{ width: "20px", height: "20px" }}
          />
          <Text
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: token.colorText,
              lineHeight: 1.4,
            }}
          >
            {tokenData?.project_name || "Apito"}
          </Text>
        </div>

        {/* Go to Project Button - Show if we have a recent project */}
        {recentProjectId && (
          <div style={{ marginTop: "16px" }}>
            <Button
              type="primary"
              size="small"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate("/console/content")}
              style={{
                width: "100%",
                borderRadius: "6px",
                height: "32px",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              Go to Project
            </Button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        style={{
          background: token.colorBgContainer,
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Navigation Menu */}
        <div style={{ padding: "8px 0" }}>
          <Menu
            mode="inline"
            selectedKeys={[getActiveKey()]}
            defaultOpenKeys={getDefaultOpenKeys()}
            items={menuItems}
            theme="light"
            style={{
              background: token.colorBgContainer,
              border: "none",
              fontSize: "14px",
            }}
            className="apito-sidebar-menu"
          />
        </div>
      </div>

      {/* Footer Section */}
      <div
        style={{
          padding: "16px",
          borderTop: `1px solid ${token.colorBorder}`,
          background: token.colorBgContainer,
        }}
      >
        {/* Join Discord Button */}
        <Button
          type="primary"
          size="middle"
          style={{
            width: "100%",
            background: "#5865F2",
            borderColor: "#5865F2",
            fontWeight: 500,
          }}
          onClick={() => window.open("https://discord.gg/apito", "_blank")}
        >
          Join Discord Community
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
