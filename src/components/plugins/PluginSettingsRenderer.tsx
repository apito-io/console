import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Empty } from 'antd';
import { usePluginManager } from '../../plugins/PluginManager';

const { Title, Text } = Typography;

const PluginSettingsRenderer: React.FC = () => {
  const { pluginName } = useParams<{ pluginName: string }>();
  const [, pluginAPI] = usePluginManager();

  if (!pluginName) {
    return (
      <div style={{ padding: '16px' }}>
        <Empty description="Plugin not specified" />
      </div>
    );
  }

  const plugin = pluginAPI.getPlugin(pluginName);
  
  if (!plugin || !plugin.loaded) {
    return (
      <div style={{ padding: '16px' }}>
        <Empty description={`Plugin "${pluginName}" not found or not loaded`} />
      </div>
    );
  }

  // Get the settings component from the plugin
  const settingsComponentName = plugin.config.settings?.component;
  
  if (!settingsComponentName) {
    return (
      <div style={{ padding: '16px' }}>
        <Card>
          <Title level={3}>{plugin.config.displayName} Settings</Title>
          <Text type="secondary">
            This plugin does not provide any configurable settings.
          </Text>
        </Card>
      </div>
    );
  }

  // Get the actual component
  const SettingsComponent = pluginAPI.getPluginComponent(
    pluginName,
    'settings',
    settingsComponentName
  );

  if (!SettingsComponent) {
    return (
      <div style={{ padding: '16px' }}>
        <Card>
          <Title level={3}>{plugin.config.displayName} Settings</Title>
          <Text type="danger">
            Settings component "{settingsComponentName}" not found in plugin.
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={3}>{plugin.config.displayName} Settings</Title>
          <Text type="secondary">{plugin.config.description}</Text>
        </div>
        
        <SettingsComponent />
      </Card>
    </div>
  );
};

export default PluginSettingsRenderer; 