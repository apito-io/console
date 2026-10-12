import React from "react";
import { Card, Typography, Empty } from "antd";
import { useNavigate, useParams } from "../../router/navigation";
import { usePluginManager } from "../../plugins/PluginManager";
import PluginSettingsDrawer from "./PluginSettingsDrawer";
import { useGetProjectPluginsQuery } from "../../generated_gql/tanstack-query";

const { Title, Text } = Typography;

const PluginSettingsRenderer: React.FC = () => {
  const { pluginName } = useParams<{ pluginName: string }>();
  const [, pluginAPI] = usePluginManager();
  const navigate = useNavigate();
  const { data: projectPluginsData } = useGetProjectPluginsQuery(
    { limit: 100, page: 1 },
    { enabled: !!pluginName },
  );

  if (!pluginName) {
    return (
      <div style={{ padding: "16px" }}>
        <Empty description="Plugin not specified" />
      </div>
    );
  }

  const plugin = pluginAPI.getPlugin(pluginName);

  if (!plugin || !plugin.loaded || plugin.config.blockedReason) {
    return (
      <div style={{ padding: "16px" }}>
        <Empty
          description={`Plugin "${pluginName}" is not activated for this project`}
        />
      </div>
    );
  }

  const settingsComponentName = plugin.config.settings?.component;
  const SettingsComponent = settingsComponentName
    ? pluginAPI.getPluginComponent(pluginName, "settings", settingsComponentName)
    : undefined;

  if (SettingsComponent) {
    return (
      <div style={{ padding: "16px" }}>
        <Card>
          <div style={{ marginBottom: "24px" }}>
            <Title level={3}>{plugin.config.displayName} Settings</Title>
            <Text type="secondary">{plugin.config.description}</Text>
          </div>
          <SettingsComponent />
        </Card>
      </div>
    );
  }

  const row = (projectPluginsData?.getProjectPlugins ?? []).find(
    (item) => item?.id === pluginName,
  );

  return (
    <div style={{ padding: "16px" }}>
      <Card>
        <Title level={3}>{plugin.config.displayName} Settings</Title>
        <Text type="secondary">
          Configure environment variables for this project. Official signed
          bundles can replace this host settings page.
        </Text>
      </Card>
      <PluginSettingsDrawer
        open
        onClose={() => navigate("/console/settings/plugins")}
        selectedPlugin={{
          id: plugin.config.name,
          title: row?.title || plugin.config.displayName,
          description: row?.description || plugin.config.description,
          version: row?.version || plugin.config.version,
          author: row?.author || plugin.config.author,
          env_vars: row?.env_vars ?? [],
        }}
        variant="project"
      />
    </div>
  );
};

export default PluginSettingsRenderer;
