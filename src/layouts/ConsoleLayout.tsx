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
import { TourProvider } from "../contexts/TourContext";
import Tour from "../components/tour/Tour";
import "../components/common/Sidebar.css";

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

  // Get the correct path for header navigation
  let headerPath: string;

  if (isSettingsPage) {
    // For settings pages, use the settings sub-path
    if (location.pathname.startsWith("/console/settings/")) {
      // For settings sub-pages (e.g. settings/plugins), pass only the sub key (plugins)
      headerPath = location.pathname.replace("/console/settings/", "");
    } else {
      // For the main settings page (/console/settings), use 'general' as default
      headerPath = "general";
    }
  } else {
    // For console pages, use just the section name (content, model, api, etc.)
    headerPath = currentPath;
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

  // Set selected model based on URL params and auto-navigate to first model
  useEffect(() => {
    if (params.model) {
      setSelectedModel(params.model);
    } else if (models.length > 0 && !params.model) {
      // Auto-select first model and navigate to it
      const firstModel = models[0].name;
      setSelectedModel(firstModel);

      // Find the model data and update context
      const modelData = data?.projectModelsInfo?.find(
        (model) => model?.name?.toLowerCase() === firstModel.toLowerCase()
      );

      if (modelData) {
        contentDispatch({
          type: "SET_TARGET",
          payload: {
            target: modelData.name || firstModel,
            single_page: modelData.single_page || false,
            single_page_uuid: modelData.single_page_uuid || "",
            has_connections: modelData.has_connections || false,
            is_tenant_model: modelData.is_tenant_model || false,
            is_common_model: modelData.is_common_model || false,
            enable_revision: modelData.enable_revision || false,
          },
        });
      }

      // Auto-navigate to the first model if we're on the base model route
      if (currentPath === "model" && location.pathname === "/console/model") {
        navigate(`/console/model/${firstModel}`, { replace: true });
      }
    }
  }, [
    params.model,
    models,
    currentPath,
    location.pathname,
    navigate,
    data,
    contentDispatch,
  ]);

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
          is_common_model: modelData.is_common_model || false,
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
            style={{ marginBottom: 16 }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/console/model?type=new")}
              data-tour="add-model-button"
            >
              Add Model
            </Button>
          </Empty>
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
          fontSize: "14px",
        }}
        className="apito-sidebar-menu"
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {modelData?.is_common_model && (
                    <span
                      style={{
                        color: token.colorPrimary,
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                      title="Common Model - Shared across all tenants"
                    >
                      🌐
                    </span>
                  )}
                  <span>{model.name}</span>
                </div>
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

  console.log("tokenData", tokenData);

  return (
    <TourProvider>
      <ContentContext.Provider
        value={{
          state: contentState,
          dispatch: contentDispatch,
        }}
      >
        <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
          {/* Left Sidebar Column - Fixed */}
          <Sider
            width={280}
            style={{
              background: token.colorBgSpotlight, // Using #FAFAFA from theme
              borderRight: `1px solid ${token.colorBorderSecondary}`,
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              overflow: "hidden", // Prevent scrollbars on the sidebar itself
            }}
          >
            {/* Header Section with Logo, Project Name and Tenant Selector - Fixed */}
            <div
              style={{
                padding: "16px 20px 12px 20px",
                background: token.colorBgSpotlight,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "4px",
                }}
              >
                {/* Left side - Logo and User */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/")}
                >
                  <img
                    src="/logo.svg"
                    alt="Apito"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: token.colorText,
                        lineHeight: 1.2,
                      }}
                    >
                      {tokenData?.project_name || "Apito"}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        //color: token.colorTextTertiary,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        lineHeight: 1.2,
                        marginTop: "2px",
                      }}
                    >
                      {/* Right side - Project ID Tag (center aligned) */}
                      {tokenData?.project_id && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 400,
                              fontSize: "10px",
                              margin: 0,
                              //borderBottom: `1px solid black`,
                            }}
                          >
                            {tokenData.project_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tenant Selector - Only show for SaaS projects (project_type === 1) */}
              {tokenData?.project_type === 1 && (
                <div style={{ marginTop: "16px" }}>
                  <TenantSelector />
                </div>
              )}
            </div>

            {/* Add Model Button - Only show on model page - Fixed */}
            {!isSettingsPage && currentPath === "model" && (
              <div
                style={{
                  padding: "8px 20px 16px 20px",
                  flexShrink: 0,
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateModelModalVisible(true)}
                  data-tour="add-model-button"
                  style={{
                    width: "100%",
                  }}
                >
                  Add Model
                </Button>
              </div>
            )}

            {/* Console Models Section - Scrollable with constrained height */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden", // Prevent horizontal scrollbar
                minHeight: 0,
                maxHeight: "calc(100vh - 200px)", // Constrain height to enable scrolling
                padding: "8px 0",
                paddingBottom: "120px", // Add bottom padding to account for fixed footer
              }}
            >
              {/* Show settings navigation when on settings page */}
              {isSettingsPage ? (
                <div>
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
                        onClick: () =>
                          navigate("/console/settings/api-secrets"),
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
                    const pluginMenuItems = pluginSettingsItems.map(
                      (plugin) => {
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
                      }
                    );

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
                          fontSize: "14px",
                        }}
                        className="apito-sidebar-menu"
                      />
                    );
                  })()}
                </div>
              ) : (
                renderModelMenu()
              )}
            </div>

            {/* Footer Section with Settings and Help Center - Absolutely positioned at bottom */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "12px 20px",
                borderTop: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgSpotlight,
                zIndex: 10,
              }}
            >
              {/* Footer Items */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: token.colorTextSecondary,
                    transition: "all 0.2s ease",
                    height: "36px",
                  }}
                  onClick={() => navigate("/console/settings")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)";
                    e.currentTarget.style.color = token.colorText;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = token.colorTextSecondary;
                  }}
                >
                  <SettingOutlined style={{ fontSize: "16px" }} />
                  <span>Project Settings</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: token.colorTextSecondary,
                    transition: "all 0.2s ease",
                    height: "36px",
                  }}
                  onClick={() => navigate("/support")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)";
                    e.currentTarget.style.color = token.colorText;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = token.colorTextSecondary;
                  }}
                >
                  <QuestionCircleOutlined style={{ fontSize: "16px" }} />
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
                height: "calc(100vh - 72px)",
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

          {/* Tour Components */}
          <Tour />
        </Layout>
      </ContentContext.Provider>
    </TourProvider>
  );
};

export default ConsoleLayout;
