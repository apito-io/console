import { Menu, theme, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ProjectOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  CloudSyncOutlined,
  ApiOutlined,
  PlusOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import TenantSelector from "./TenantSelector";

const Sidebar = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { decodeTokenData } = useAuth();
  const tokenData = decodeTokenData();

  // Base menu items for open-core (no pro features)
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

  // Allow extending menu items (for Pro version)
  const additionalMenuItems =
    (window as any).__APITO_ADDITIONAL_MENU_ITEMS__ || [];
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
    return "active-projects";
  };

  // Get username from email
  const username = tokenData?.email ? tokenData.email.split("@")[0] : "user";

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
          padding: "20px 16px",
          background: token.colorBgContainer,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.svg"
            alt="Apito"
            style={{ width: "32px", height: "32px" }}
          />
          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: token.colorText,
                lineHeight: "1.2",
              }}
            >
              {tokenData?.project_name || "Apito"}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 400,
                color: token.colorTextSecondary,
                lineHeight: "1.2",
                marginTop: "2px",
              }}
            >
              Hi, {username}..
            </div>
          </div>
        </div>

        {/* Tenant Selector - Only show for SaaS projects (project_type === 1) */}
        {tokenData?.project_type === 1 && (
          <div style={{ marginTop: "25px" }}>
            <TenantSelector />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        style={{
          background: token.colorBgContainer,
          flex: 1,
          overflowY: "auto",
        }}
      >
        {/* Navigation Menu */}
        <div>
          <Menu
            mode="inline"
            selectedKeys={[getActiveKey()]}
            defaultOpenKeys={["projects"]}
            items={menuItems}
            theme="light"
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
