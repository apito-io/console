import React, { useState, useEffect, useReducer } from "react";
import { Layout, Menu, theme, Spin, Empty, Button } from "antd";
import { useLocation, Outlet, useNavigate, useParams } from "react-router-dom";
import {
  TableOutlined,
  FileTextOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  TeamOutlined,
  KeyOutlined,
  ApiOutlined,
  UserSwitchOutlined,
  AppstoreOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  useGetOnlyModelsInfoQuery,
  type ModelType,
} from "../generated/graphql";
import Header from "../components/common/Header";
import { ContentContext, ContentReducer } from "../contexts/ContentContext";
import { useAuth } from "../contexts/AuthContext";
import TenantSelector from "../components/common/TenantSelector";
import CreateModelModal from "../components/model/CreateModelModal";
import ModelOperationsDropdown from "../components/model/ModelOperationsDropdown";
import { usePluginManager } from "../plugins/PluginManager";

const { Sider, Content } = Layout;

interface Model {
  id: string;
  name: string;
  fields: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
}

const ConsoleLayout: React.FC = () => {
  const { token } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { decodeTokenData } = useAuth();
  const tokenData = decodeTokenData();
  const [, pluginAPI] = usePluginManager();

  // Check if we're on a settings page
  const isSettingsPage = location.pathname.includes("/console/settings");

  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isCreateModelModalVisible, setIsCreateModelModalVisible] =
    useState(false);
  const [contentState, contentDispatch] = useReducer(ContentReducer, {
    target: "",
  });

  // Extract just the section path (content, model, logic, etc.) without model parameters
  const currentPath =
    location.pathname.replace("/console/", "").split("/")[0] || "content";

  // Get the full path for header (including console prefix)
  let headerPath = location.pathname.startsWith("/console/")
    ? location.pathname.replace("/console/", "")
    : location.pathname.replace("/", "");

  // Special handling for settings pages - use the settings navigation
  if (headerPath.startsWith("settings/")) {
    headerPath = headerPath.replace("settings/", "");
  }

  // For settings pages, use "settings" as the header path
  if (isSettingsPage) {
    headerPath = "settings";
  }

  // Fetch models using GraphQL query
  const { data, loading, error, refetch } = useGetOnlyModelsInfoQuery({
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  // Debug logging
  //console.log("GraphQL Query State:", { loading, error, data });

  // Transform GraphQL data to our Model type
  const models: Model[] = React.useMemo(() => {
    if (!data?.projectModelsInfo) {
      console.log("No projectModelsInfo data");
      return [];
    }

    //console.log("Raw model data:", data.projectModelsInfo);

    const filtered = data.projectModelsInfo.filter(
      (model: ModelType | null) =>
        model && !model.system_generated && model.name
    ); // Filter out system generated models and null values

    //console.log("Filtered models:", filtered);

    const transformed = filtered.map(
      (model: ModelType | null, index: number) => ({
        id: (index + 1).toString(),
        name: model?.name || `Model ${index + 1}`, // Safe access with fallback
        fields: [], // Fields will be loaded separately when needed
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );

    //console.log("Transformed models:", transformed);
    return transformed;
  }, [data]);

  // Set selected model based on URL params
  useEffect(() => {
    if (params.model) {
      setSelectedModel(params.model);
    } else if (models.length > 0) {
      setSelectedModel(models[0].name);
    }
  }, [params.model, models]);

  const handleModelClick = (modelName: string) => {
    setSelectedModel(modelName);

    // Find the full model data for context
    const modelData = data?.projectModelsInfo?.find(
      (model) => model?.name?.toLowerCase() === modelName.toLowerCase()
    );

    // Update ContentContext with full model data
    if (modelData) {
      contentDispatch({
        type: "SET_TARGET",
        payload: {
          target: modelData.name || modelName,
          single_page: modelData.single_page || false,
          single_page_uuid: modelData.single_page_uuid || "",
          has_connections: modelData.has_connections || false,
          is_tenant_model: modelData.is_tenant_model || false,
          enable_revision: modelData.enable_revision || false,
        },
      });
    }

    // Navigate to content with the selected model
    if (currentPath === "content") {
      navigate(`/console/content/${modelName}`);
    } else {
      navigate(`/console/${currentPath}/${modelName}`);
    }
  };

  const renderModelMenu = () => {
    if (loading) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Spin size="small" />
        </div>
      );
    }

    if (error && !data) {
      console.error("GraphQL Error:", error);
      return (
        <div style={{ padding: "20px" }}>
          <Empty
            description="Failed to load models"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ marginBottom: 0 }}
          />
        </div>
      );
    }

    if (models.length === 0) {
      return (
        <div style={{ padding: "20px" }}>
          <Empty
            description="No models found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ marginBottom: 0 }}
          />
        </div>
      );
    }

    return (
      <Menu
        mode="inline"
        selectedKeys={selectedModel ? [selectedModel] : []}
        style={{
          border: "none",
          background: "transparent",
        }}
        items={models.map((model) => {
          // Find the corresponding model data to check for single_page_uuid
          const modelData = data?.projectModelsInfo?.find(
            (m) => m?.name?.toLowerCase() === model.name.toLowerCase()
          );
          const hasPageUuid = modelData?.single_page_uuid;

          return {
            key: model.name,
            icon: hasPageUuid ? <FileTextOutlined /> : <TableOutlined />,
            label: (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <span>{model.name}</span>
                {currentPath === "model" && (
                  <ModelOperationsDropdown
                    modelName={model.name}
                    onModelUpdated={() => refetch()}
                  />
                )}
              </div>
            ),
            onClick: () => handleModelClick(model.name),
          };
        })}
      />
    );
  };

  // Get username from email
  const username = tokenData?.email ? tokenData.email.split("@")[0] : "user";

  return (
    <ContentContext.Provider
      value={{
        state: contentState,
        dispatch: contentDispatch,
      }}
    >
      <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
        {/* Left Sidebar Column - Fixed */}
        <Sider
          width={240}
          style={{
            background: token.colorBgContainer,
            borderRight: `1px solid ${token.colorBorder}`,
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            overflow: "auto",
          }}
        >
          {/* Header Section with Logo, Project Name and Tenant Selector */}
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
                marginBottom: "12px",
              }}
            >
              <img
                src="/logo.svg"
                alt="Apito"
                style={{ width: "32px", height: "32px", cursor: "pointer" }}
                onClick={() => navigate("/")}
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
                  {tokenData?.project_name
                    ? `Console - ${tokenData.project_name}`
                    : `Hi, ${username}..`}
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

          {/* Console Models Section */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {/* Show settings navigation when on settings page */}
            {isSettingsPage ? (
              <div style={{ padding: "16px 0" }}>
                {(() => {
                  // Get plugin settings items
                  const pluginSettingsItems =
                    pluginAPI.getPluginSettingsItems();

                  // Core settings menu items
                  const coreSettingsMenuItems = [
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
                  ];

                  // Plugin settings menu items
                  const pluginMenuItems = pluginSettingsItems.map((plugin) => {
                    // Map icon names to components
                    const getIcon = (iconName?: string) => {
                      switch (iconName) {
                        case "PictureOutlined":
                          return <PictureOutlined />;
                        default:
                          return <AppstoreOutlined />;
                      }
                    };

                    return {
                      key: `plugin-${plugin.pluginName}`,
                      icon: getIcon(plugin.icon),
                      label: plugin.label,
                      onClick: () => navigate(plugin.path),
                    };
                  });

                  // Combine core and plugin items
                  const allMenuItems = [
                    ...coreSettingsMenuItems,
                    ...pluginMenuItems,
                  ];

                  return (
                    <Menu
                      mode="inline"
                      selectedKeys={[
                        location.pathname
                          .replace("/console/settings/", "")
                          .replace("/console/settings", "general"),
                      ]}
                      items={allMenuItems}
                      style={{
                        border: "none",
                        background: "transparent",
                      }}
                    />
                  );
                })()}
              </div>
            ) : (
              <>
                {/* Add Model Button - Only show on model page */}
                {currentPath === "model" && (
                  <div style={{ padding: "0 16px", marginBottom: "12px" }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setIsCreateModelModalVisible(true)}
                      style={{
                        width: "100%",
                        borderRadius: token.borderRadius,
                      }}
                    >
                      Add Model
                    </Button>
                  </div>
                )}

                {renderModelMenu()}
              </>
            )}
          </div>

          {/* Footer Section with Settings and Help Center */}
          <div
            style={{
              padding: "16px",
              borderTop: `1px solid ${token.colorBorder}`,
              background: token.colorBgContainer,
            }}
          >
            {/* Footer Items */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: token.borderRadius,
                  cursor: "pointer",
                  fontSize: "14px",
                  color: token.colorTextSecondary,
                  transition: "all 0.2s ease",
                }}
                onClick={() => navigate("/console/settings")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = token.colorFillQuaternary;
                  e.currentTarget.style.color = token.colorPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = token.colorTextSecondary;
                }}
              >
                <SettingOutlined />
                <span>Project Settings</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: token.borderRadius,
                  cursor: "pointer",
                  fontSize: "14px",
                  color: token.colorTextSecondary,
                  transition: "all 0.2s ease",
                }}
                onClick={() => navigate("/support")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = token.colorFillQuaternary;
                  e.currentTarget.style.color = token.colorPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = token.colorTextSecondary;
                }}
              >
                <QuestionCircleOutlined />
                <span>Help & Support</span>
              </div>
            </div>
          </div>
        </Sider>

        {/* Right Content Column */}
        <Layout>
          {/* Header Component */}
          <Header currentPath={headerPath} />

          {/* Main Content - Scrollable */}
          <Content
            style={{
              background: token.colorBgLayout,
              padding: 0,
              overflowX: "hidden",
              overflowY: "auto",
              height: "calc(100vh - 100px)",
            }}
          >
            <Outlet context={{ selectedModel, models, contentState }} />
          </Content>
        </Layout>

        {/* Create Model Modal */}
        <CreateModelModal
          visible={isCreateModelModalVisible}
          onCancel={() => setIsCreateModelModalVisible(false)}
          onSuccess={() => {
            setIsCreateModelModalVisible(false);
            refetch();
          }}
        />
      </Layout>
    </ContentContext.Provider>
  );
};

export default ConsoleLayout;
