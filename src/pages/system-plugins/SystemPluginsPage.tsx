import React from "react";
import { Card, Typography, Empty, Button, Space, Alert } from "antd";
import {
  // AppstoreOutlined, // Removed unused
  // DownloadOutlined, // Removed unused
  // SettingOutlined, // Removed unused
  SecurityScanOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const SystemPluginsPage: React.FC = () => {
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
            <SecurityScanOutlined />
            System Plugins
          </Title>
          <Text type="secondary">
            Manage system-wide plugins that affect all projects. These plugins
            require administrator privileges.
          </Text>
        </div>

        <Alert
          message="Administrator Access Required"
          description="System plugins affect the entire Apito instance and require administrator privileges to install or modify."
          type="warning"
          showIcon
          style={{ marginBottom: "24px" }}
        />

        <Empty
          description="No system plugins installed"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Space>
            <Button type="primary">Browse System Plugin Marketplace</Button>
            <Button>Install from Package</Button>
          </Space>
        </Empty>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Space>
            <Button>System Plugin Documentation</Button>
            <Button>Plugin Development Guide</Button>
            <Button>Security Guidelines</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default SystemPluginsPage;
