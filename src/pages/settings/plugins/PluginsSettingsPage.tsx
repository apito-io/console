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
  Switch,
  message,
} from "antd";
import {
  AppstoreOutlined,
  PlusOutlined,
  SettingOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  useGetPluginsQuery,
  useUpsertPluginDetailsMutation,
  Plugin_Activation_Type_Enum,
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
    activate_status?: string | null;
    type?: string | null;
    icon?: string | null;
  } | null;
  onSettingsClick: (plugin: any) => void;
}

const PluginCard: React.FC<PluginCardProps> = ({ plugin, onSettingsClick }) => {
  const [upsertPluginDetails] = useUpsertPluginDetailsMutation();

  if (!plugin) {
    return null;
  }

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "default";
    switch (status.toLowerCase()) {
      case "loaded":
      case "active":
        return "success";
      case "error":
      case "failed":
        return "error";
      case "loading":
        return "processing";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string | null | undefined) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const isActivated =
    (plugin.activate_status || "").toLowerCase() === "activated";

  const handleToggleActivate = async (activated: boolean) => {
    if (!plugin.id) return;

    try {
      await upsertPluginDetails({
        variables: {
          id: plugin.id,
          activate_status: activated
            ? Plugin_Activation_Type_Enum.Activated
            : Plugin_Activation_Type_Enum.Deactivated,
        },
        refetchQueries: ["GetPlugins"],
      });

      message.success(
        `Plugin ${activated ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Failed to update plugin:", error);
      message.error("Failed to update plugin status");
    }
  };

  return (
    <Card
      hoverable
      style={{ height: "100%" }}
      actions={[
        <SettingOutlined
          key="settings"
          title="Configure"
          onClick={() => onSettingsClick(plugin)}
        />,
        <DownloadOutlined key="update" title="Update" />,
      ]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            {plugin.title || plugin.id || "Unnamed Plugin"}
          </Title>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch
              checked={isActivated}
              onChange={handleToggleActivate}
              size="small"
            />
            <Tag color={isActivated ? "green" : "red"}>
              {isActivated ? "Activated" : "Deactivated"}
            </Tag>
          </div>
        </div>

        {plugin.version && (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            v{plugin.version}
            {plugin.author && ` • by ${plugin.author}`}
          </Text>
        )}

        <Text style={{ fontSize: "13px", lineHeight: "1.4" }}>
          {plugin.description || "No description available"}
        </Text>

        <Space size="small" style={{ marginTop: "4px" }}>
          {plugin.load_status && (
            <Tag color={getStatusColor(plugin.load_status)}>
              Load: {getStatusText(plugin.load_status)}
            </Tag>
          )}
          {plugin.type && <Tag color="blue">{plugin.type}</Tag>}
        </Space>
      </div>
    </Card>
  );
};

const PluginsSettingsPage: React.FC = () => {
  const { tenantId } = useTenant();
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

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
      plugin && (plugin.activate_status || "").toLowerCase() === "activated"
  );
  const availablePlugins = plugins.filter(
    (plugin) =>
      plugin && (plugin.activate_status || "").toLowerCase() !== "activated"
  );

  const handleSettingsClick = (plugin: any) => {
    setSelectedPlugin(plugin);
    setSettingsDrawerVisible(true);
  };

  const handleCloseSettings = () => {
    setSettingsDrawerVisible(false);
    setSelectedPlugin(null);
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
    <div>
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
        width={400}
        closable
        onClose={handleCloseSettings}
        open={settingsDrawerVisible}
      >
        {selectedPlugin ? (
          <div>
            <Alert
              message="Plugin Configuration"
              description="Adjust settings and configure environment variables for this plugin."
              type="info"
              showIcon
              style={{ marginBottom: "16px" }}
            />

            <div style={{ marginBottom: "16px" }}>
              <Text strong>Plugin ID:</Text>
              <br />
              <Text code>{selectedPlugin.id}</Text>
            </div>

            {selectedPlugin.description && (
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Description:</Text>
                <br />
                <Text>{selectedPlugin.description}</Text>
              </div>
            )}

            {selectedPlugin.version && (
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Version:</Text>
                <br />
                <Text>{selectedPlugin.version}</Text>
              </div>
            )}

            {selectedPlugin.author && (
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Author:</Text>
                <br />
                <Text>{selectedPlugin.author}</Text>
              </div>
            )}

            <div style={{ marginTop: "24px" }}>
              <Button type="primary" block>
                Save Settings
              </Button>
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
