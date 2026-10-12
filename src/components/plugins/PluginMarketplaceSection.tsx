import React from "react";
import { Card, Typography, Button, Space } from "antd";
import { useNavigate } from "../../router/navigation";
import { Info, LayoutGrid, Plus } from "lucide-react";

const { Title, Paragraph } = Typography;

export interface PluginMarketplaceSectionProps {
  /** When set, "Browse Plugins" navigates to this path (e.g. `/plugins`). */
  browseDestination?: string;
  onBrowsePlugins?: () => void;
  onPluginDocumentation?: () => void;
}

const PluginMarketplaceSection: React.FC<PluginMarketplaceSectionProps> = ({
  browseDestination,
  onBrowsePlugins,
  onPluginDocumentation,
}) => {
  const navigate = useNavigate();

  const handleBrowse = () => {
    if (onBrowsePlugins) {
      onBrowsePlugins();
      return;
    }
    if (browseDestination) {
      navigate(browseDestination);
    }
  };

  return (
    <Card>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <LayoutGrid size={16} strokeWidth={1.75}
          style={{ fontSize: "48px", color: "#bfbfbf", marginBottom: "16px" }}
        />
        <Title level={4}>Plugin Marketplace</Title>
        <Paragraph type="secondary">
          Discover and install new plugins to extend your project&apos;s
          capabilities
        </Paragraph>
        <Space>
          <Button
            type="primary"
            icon={<Plus size={16} strokeWidth={1.75} />}
            onClick={handleBrowse}
            disabled={!browseDestination && !onBrowsePlugins}
          >
            Browse Plugins
          </Button>
          <Button
            icon={<Info size={16} strokeWidth={1.75} />}
            onClick={onPluginDocumentation}
          >
            Plugin Documentation
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default PluginMarketplaceSection;
