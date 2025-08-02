import React from "react";
import { Card, Typography, Empty, Button, Row, Col, Tag, Space } from "antd";
import {
  AppstoreOutlined,
  DownloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { usePluginManager } from "../../plugins/PluginManager";

const { Title, Text } = Typography;

const ProjectPluginsPage: React.FC = () => {
  const [pluginState, _pluginAPI] = usePluginManager();

  const installedPlugins = Array.from(pluginState.plugins.values());

  return (
    <div style={{ padding: "16px" }}>
      <Card>
        <div style={{ marginBottom: "24px" }}>
          <Title
            level={2}
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <AppstoreOutlined />
            Project Plugins
          </Title>
          <Text type="secondary">
            Manage and configure plugins for your current project. These plugins
            extend your project's functionality.
          </Text>
        </div>

        {installedPlugins.length === 0 ? (
          <Empty
            description="No plugins installed"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary">Browse Plugin Marketplace</Button>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {installedPlugins.map((plugin) => (
              <Col xs={24} sm={12} lg={8} key={plugin.config.name}>
                <Card
                  size="small"
                  actions={[
                    <SettingOutlined key="setting" title="Configure" />,
                    <DownloadOutlined key="download" title="Update" />,
                  ]}
                  style={{ height: "100%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Title level={5} style={{ margin: 0 }}>
                        {plugin.config.displayName || plugin.config.name}
                      </Title>
                      <Tag color={plugin.loaded ? "green" : "red"}>
                        {plugin.loaded ? "Active" : "Error"}
                      </Tag>
                    </div>

                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      v{plugin.config.version} • by {plugin.config.author}
                    </Text>

                    <Text style={{ fontSize: "13px", lineHeight: "1.4" }}>
                      {plugin.config.description}
                    </Text>

                    {plugin.error && (
                      <Text type="danger" style={{ fontSize: "12px" }}>
                        Error: {plugin.error}
                      </Text>
                    )}

                    {plugin.config.menu && (
                      <Space size="small" style={{ marginTop: "4px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Menu: {plugin.config.menu.label}
                        </Text>
                      </Space>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Space>
            <Button type="primary">Browse Plugin Marketplace</Button>
            <Button>Install from File</Button>
            <Button>Developer Tools</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default ProjectPluginsPage;
