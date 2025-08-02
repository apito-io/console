import React from 'react';
import { Typography, Card, Button } from 'antd';
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const PluginsSettingsPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AppstoreOutlined />
          Plugins
        </Title>
        <Paragraph type="secondary">
          Extend your project's functionality with plugins
        </Paragraph>
      </div>

      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <AppstoreOutlined style={{ fontSize: '48px', color: '#bfbfbf', marginBottom: '16px' }} />
          <Title level={4}>Plugin Marketplace</Title>
          <Paragraph type="secondary">
            This feature is coming soon. You'll be able to install and configure plugins to extend your project's capabilities.
          </Paragraph>
          <Button type="primary" icon={<PlusOutlined />} disabled>
            Browse Plugins
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PluginsSettingsPage; 