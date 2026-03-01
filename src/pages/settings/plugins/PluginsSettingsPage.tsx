import React, { useState } from "react";
import {
  Typography,
  Card,
  Button,
  Row,
  Col,
  Tag,
  Space,
  Spin,
  Empty,
  Drawer,
  Alert,
  message,
  Input,
  Divider,
} from "antd";
import {
  AppstoreOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import {
  useGetPluginsQuery,
  useUpsertPluginDetailsMutation,
  type PluginConfigEnvVarsPayload,
} from "../../../generated/graphql";
import { useTenant } from "../../../hooks/useTenant";

const { Title, Paragraph, Text } = Typography;

interface PluginCardProps {
  plugin: {
    id?: string | null;
    title?: string | null;
    description?: string | null;
    version?: string | null;
    author?: string | null;
    enable?: boolean | null;
    load_status?: string | null;
    type?: string | null;
    icon?: string | null;
    ui_config?: any;
    [key: string]: any;
  } | null;
  onSettingsClick: (plugin: any) => void;
}

const PluginCard: React.FC<PluginCardProps> = ({ plugin, onSettingsClick }) => {
  if (!plugin) {
    return null;
  }

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "default";
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "loaded":
      case "installed":
        return "success";
      case "error":
      case "failed":
        return "error";
      case "loading":
      case "installing":
        return "processing";
      case "not_installed":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string | null | undefined) => {
    if (!status) return "Unknown";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Get first letter for avatar fallback
  const getInitials = (text: string | null | undefined) => {
    if (!text) return "?";
    return text.charAt(0).toUpperCase();
  };

  const pluginName = plugin.title || plugin.id || "Unnamed Plugin";
  const pluginIcon = plugin.icon;

  return (
    <Card
      hoverable
      style={{
        height: "100%",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onClick={() => onSettingsClick(plugin)}
      bodyStyle={{ padding: "20px" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Header with Icon and Title */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          {/* Avatar/Icon */}
          {pluginIcon ? (
            <Avatar
              src={pluginIcon}
              size={48}
              style={{
                flexShrink: 0,
                backgroundColor: "#f0f0f0",
              }}
            >
              {getInitials(pluginName)}
            </Avatar>
          ) : (
            <Avatar
              size={48}
              style={{
                flexShrink: 0,
                backgroundColor: "#1890ff",
                color: "#fff",
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              {getInitials(pluginName)}
            </Avatar>
          )}

          {/* Title and Version */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <Title
                level={5}
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "1.4",
                }}
              >
                {pluginName}
              </Title>
              {plugin.load_status && (
                <Tag
                  color={getStatusColor(plugin.load_status)}
                  style={{ margin: 0 }}
                >
                  {getStatusText(plugin.load_status)}
                </Tag>
              )}
            </div>
            {plugin.version && (
              <Text
                type="secondary"
                style={{
                  fontSize: "13px",
                  display: "block",
                  lineHeight: "1.4",
                }}
              >
                v{plugin.version}
                {plugin.author && ` • by ${plugin.author}`}
              </Text>
            )}
          </div>
        </div>

        {/* Description */}
        {plugin.description && (
          <Text
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: "#595959",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {plugin.description}
          </Text>
        )}

        {/* Tags Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: "4px",
          }}
        >
          {plugin.type && (
            <Tag color="blue" style={{ margin: 0 }}>
              {plugin.type}
            </Tag>
          )}
          {plugin.ui_config && typeof plugin.ui_config === "object" && (
            <Tag color="purple" style={{ margin: 0 }}>
              UI Config
            </Tag>
          )}
          {plugin.enable !== null && plugin.enable !== undefined && (
            <Tag
              color={plugin.enable ? "green" : "default"}
              style={{ margin: 0 }}
            >
              {plugin.enable ? "Enabled" : "Disabled"}
            </Tag>
          )}
          {plugin.role && (
            <Tag color="orange" style={{ margin: 0 }}>
              {plugin.role}
            </Tag>
          )}
        </div>
      </div>
    </Card>
  );
};

const PluginsSettingsPage: React.FC = () => {
  const { tenantId } = useTenant();
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [envVarsVisible, setEnvVarsVisible] = useState<Record<string, boolean>>(
    {}
  );
  const [envVarsValues, setEnvVarsValues] = useState<
    Record<string, { key: string; value: string }>
  >({});
  const [upsertPluginDetails, { loading: saving }] =
    useUpsertPluginDetailsMutation();

  const { data, loading, error, refetch } = useGetPluginsQuery({
    variables: {
      project_id: tenantId || undefined,
      limit: 100,
      page: 1,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  const plugins = data?.getPlugins || [];
  const installedPlugins = plugins.filter(
    (plugin) =>
      plugin &&
      ((plugin.load_status || "").toLowerCase() === "installed" ||
        (plugin.load_status || "").toLowerCase() === "loaded")
  );
  const availablePlugins = plugins.filter(
    (plugin) =>
      plugin &&
      (plugin.load_status || "").toLowerCase() !== "installed" &&
      (plugin.load_status || "").toLowerCase() !== "loaded"
  );

  const handleSettingsClick = (plugin: any) => {
    setSelectedPlugin(plugin);
    setSettingsDrawerVisible(true);
    // Initialize env vars visibility and values
    if (plugin?.env_vars) {
      const initialVisibility: Record<string, boolean> = {};
      const initialValues: Record<string, { key: string; value: string }> = {};
      plugin.env_vars.forEach(
        (envVar: { key?: string | null; value?: string | null }) => {
          if (envVar.key) {
            initialVisibility[envVar.key] = false;
            initialValues[envVar.key] = {
              key: envVar.key,
              value: envVar.value || "",
            };
          }
        }
      );
      setEnvVarsVisible(initialVisibility);
      setEnvVarsValues(initialValues);
    }
  };

  const handleCloseSettings = () => {
    setSettingsDrawerVisible(false);
    setSelectedPlugin(null);
    setEnvVarsVisible({});
    setEnvVarsValues({});
  };

  const toggleEnvVarVisibility = (key: string) => {
    setEnvVarsVisible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateEnvVarValue = (key: string, value: string) => {
    setEnvVarsValues((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    if (!selectedPlugin?.id) return;

    try {
      const envVarsPayload: PluginConfigEnvVarsPayload[] = Object.values(
        envVarsValues
      ).map((envVar) => ({
        key: envVar.key,
        value: envVar.value,
      }));

      await upsertPluginDetails({
        variables: {
          id: selectedPlugin.id,
          env_vars: envVarsPayload,
        },
        refetchQueries: ["GetPlugins"],
      });

      message.success("Plugin settings updated successfully");
      handleCloseSettings();
    } catch (error) {
      console.error("Failed to update plugin settings:", error);
      message.error("Failed to update plugin settings");
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
        <div style={{ marginTop: "16px" }}>Loading plugins...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Error Loading Plugins"
          description={
            error.message || "Failed to load plugins. Please try again."
          }
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (plugins.length === 0) {
    return (
      <div style={{ padding: "24px" }}>
        <Empty description="No plugins found">
          <Button type="primary" onClick={handleRefresh}>
            Refresh
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0 }}>
          System Plugins
        </Title>
        <Text type="secondary">
          Manage and configure plugins for your project
        </Text>
      </div>

      {/* Installed Plugins Section */}
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <Title level={4} style={{ margin: 0 }}>
            Installed Plugins ({installedPlugins.length})
          </Title>
          <Text type="secondary">
            These plugins are currently active in your project
          </Text>
        </div>

        {installedPlugins.length === 0 ? (
          <Empty description="No installed plugins" />
        ) : (
          <Row gutter={[16, 16]}>
            {installedPlugins.map((plugin, index) => (
              <Col xs={24} sm={12} lg={8} key={plugin?.id || index}>
                <PluginCard
                  plugin={plugin}
                  onSettingsClick={handleSettingsClick}
                />
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* Available Plugins Section */}
      {availablePlugins.length > 0 && (
        <Card style={{ marginBottom: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <Title level={4} style={{ margin: 0 }}>
              Available Plugins ({availablePlugins.length})
            </Title>
            <Text type="secondary">
              These plugins are available but not yet enabled
            </Text>
          </div>

          <Row gutter={[16, 16]}>
            {availablePlugins.map((plugin, index) => (
              <Col xs={24} sm={12} lg={8} key={plugin?.id || index}>
                <PluginCard
                  plugin={plugin}
                  onSettingsClick={handleSettingsClick}
                />
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Plugin Marketplace Section */}
      <Card>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <AppstoreOutlined
            style={{ fontSize: "48px", color: "#bfbfbf", marginBottom: "16px" }}
          />
          <Title level={4}>Plugin Marketplace</Title>
          <Paragraph type="secondary">
            Discover and install new plugins to extend your project's
            capabilities
          </Paragraph>
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>
              Browse Plugins
            </Button>
            <Button icon={<InfoCircleOutlined />}>Plugin Documentation</Button>
          </Space>
        </div>
      </Card>

      {/* Plugin Settings Drawer */}
      <Drawer
        title={
          selectedPlugin
            ? `${selectedPlugin.title || selectedPlugin.id} Settings`
            : "Plugin Settings"
        }
        placement="right"
        width={500}
        closable
        onClose={handleCloseSettings}
        open={settingsDrawerVisible}
        footer={
          selectedPlugin ? (
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={handleCloseSettings}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleSaveSettings}
                loading={saving}
              >
                Save Settings
              </Button>
            </div>
          ) : null
        }
      >
        {selectedPlugin ? (
          <div>
            {/* Plugin Details Section */}
            <div style={{ marginBottom: "24px" }}>
              <Title level={5} style={{ marginBottom: "16px" }}>
                Plugin Details
              </Title>

              <Divider />

              <div style={{ marginBottom: "12px" }}>
                <Text strong>Plugin ID:</Text>
                <br />
                <Text code style={{ fontSize: "13px" }}>
                  {selectedPlugin.id}
                </Text>
              </div>

              {selectedPlugin.description && (
                <div style={{ marginBottom: "12px" }}>
                  <Text strong>Description:</Text>
                  <br />
                  <Text style={{ fontSize: "13px" }}>
                    {selectedPlugin.description}
                  </Text>
                </div>
              )}

              {selectedPlugin.version && (
                <div style={{ marginBottom: "12px" }}>
                  <Text strong>Version:</Text>
                  <br />
                  <Text style={{ fontSize: "13px" }}>
                    {selectedPlugin.version}
                  </Text>
                </div>
              )}

              {selectedPlugin.author && (
                <div style={{ marginBottom: "12px" }}>
                  <Text strong>Author:</Text>
                  <br />
                  <Text style={{ fontSize: "13px" }}>
                    {selectedPlugin.author}
                  </Text>
                </div>
              )}
            </div>

            <Divider />

            {/* Environment Variables Section */}
            <div>
              <Title level={5} style={{ marginBottom: "16px" }}>
                Environment Variables
              </Title>

              {selectedPlugin.env_vars && selectedPlugin.env_vars.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {selectedPlugin.env_vars.map(
                    (envVar: {
                      key?: string | null;
                      value?: string | null;
                    }) => {
                      if (!envVar.key) return null;
                      const isVisible = envVarsVisible[envVar.key] || false;
                      const currentValue =
                        envVarsValues[envVar.key]?.value ?? envVar.value ?? "";

                      return (
                        <div
                          key={envVar.key}
                          style={{
                            padding: "12px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <Text strong style={{ fontSize: "13px" }}>
                              {envVar.key}
                            </Text>
                            <Button
                              type="text"
                              size="small"
                              icon={
                                isVisible ? (
                                  <EyeInvisibleOutlined />
                                ) : (
                                  <EyeOutlined />
                                )
                              }
                              onClick={() =>
                                toggleEnvVarVisibility(envVar.key!)
                              }
                            >
                              {isVisible ? "Hide" : "Show"}
                            </Button>
                          </div>
                          <Input
                            type={isVisible ? "text" : "password"}
                            value={currentValue}
                            onChange={(e) =>
                              updateEnvVarValue(envVar.key!, e.target.value)
                            }
                            placeholder="Enter value"
                            style={{ fontSize: "13px" }}
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <Text type="secondary" style={{ fontSize: "13px" }}>
                  No environment variables configured
                </Text>
              )}
            </div>
          </div>
        ) : (
          <Empty description="No plugin selected" />
        )}
      </Drawer>
    </div>
  );
};

export default PluginsSettingsPage;
