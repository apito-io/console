import React, { useMemo, useState } from "react";
import {
  Button,
  Row,
  Col,
  Spin,
  Empty,
  Alert,
  Drawer,
  List,
  Space,
  Tag,
  message,
} from "antd";
import {
  useGetProjectPluginsQuery,
  useUpsertPluginDetailsMutation,
  Plugin_Activation_Type_Enum,
} from "../../generated_gql/tanstack-query";
import PluginCard from "../../components/plugins/PluginCard";
import { PluginGlyph } from "../../components/plugins/pluginIcons";
import PluginSettingsDrawer from "../../components/plugins/PluginSettingsDrawer";
import type { PluginDetailsRow } from "../../components/plugins/pluginTypes";
import { Package, Plus } from "lucide-react";
import { ConsoleCard, ConsoleCardTitle } from "../../components/console";
import { catalogVersionLabel, fetchPluginCatalog, type CatalogPlugin } from "../../services/pluginCatalog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { refreshPluginRegistry } from "../../plugins/queries";
import "../../components/console/ConsoleShell.css";

const ProjectPluginsPage: React.FC = () => {
  const [selectedPlugin, setSelectedPlugin] = useState<PluginDetailsRow | null>(
    null,
  );
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [installingId, setInstallingId] = useState<string | null>(null);

  const { data, isLoading: loading, error, refetch } = useGetProjectPluginsQuery(
    { limit: 100, page: 1 },
  );

  const { data: catalogData, isLoading: catalogLoading } = useQuery({
    queryKey: ["system-plugin-catalog"],
    queryFn: fetchPluginCatalog,
    enabled: addDrawerOpen,
  });

  const { mutateAsync: upsertPluginDetails } = useUpsertPluginDetailsMutation();
  const queryClient = useQueryClient();
  const { decodeTokenData } = useAuth();
  const projectId = decodeTokenData()?.project_id ?? "";

  const projectPlugins = (data?.getProjectPlugins ?? []).filter(
    Boolean,
  ) as PluginDetailsRow[];

  const installedIds = useMemo(
    () => new Set(projectPlugins.map((p) => p.id).filter(Boolean) as string[]),
    [projectPlugins],
  );

  const catalogPlugins = (catalogData?.plugins ?? []).filter(
    (p) => p.status !== "blocked",
  );

  const installedPlugins = projectPlugins.filter(
    (plugin) =>
      (plugin.load_status || "").toLowerCase() === "installed" ||
      (plugin.load_status || "").toLowerCase() === "loaded",
  );
  const availablePlugins = projectPlugins.filter(
    (plugin) =>
      (plugin.load_status || "").toLowerCase() !== "installed" &&
      (plugin.load_status || "").toLowerCase() !== "loaded",
  );

  const handleSettingsClick = (plugin: PluginDetailsRow) => {
    setSelectedPlugin(plugin);
    setSettingsDrawerVisible(true);
  };

  const handleCloseSettings = () => {
    setSettingsDrawerVisible(false);
    setSelectedPlugin(null);
  };

  const handleActivate = async (plugin: CatalogPlugin) => {
    if (!plugin.id || !plugin.installed) return;
    setInstallingId(plugin.id);
    try {
      await upsertPluginDetails({
        id: plugin.id,
        enable: true,
        activate_status: Plugin_Activation_Type_Enum.Activated,
      });
      await refreshPluginRegistry(queryClient, projectId);
      await refetch();
      message.success("Plugin added to project");
    } catch (err) {
      console.error("Failed to activate plugin:", err);
      message.error("Failed to activate plugin");
    } finally {
      setInstallingId(null);
    }
  };

  if (loading) {
    return (
      <div className="console-loading-state">
        <Spin size="large" />
        <div className="console-loading-state-text">
          Loading project plugins...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="console-page">
        <Alert
          message="Error Loading Plugins"
          description={
            error instanceof Error
              ? error.message
              : "Failed to load plugins. Please try again."
          }
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="console-page">
      <div className="console-stack">
        <ConsoleCard
          title={<ConsoleCardTitle icon={Package} label="Project Plugins" />}
          extra={
            <Button
              type="primary"
              icon={<Plus size={16} strokeWidth={1.75} />}
              onClick={() => setAddDrawerOpen(true)}
            >
              Add plugin
            </Button>
          }
        >
          <p className="console-text-muted-block">
            Plugins attached to this project from the system catalog
          </p>
        </ConsoleCard>

        <ConsoleCard
          title={
            <ConsoleCardTitle
              icon={Package}
              label={`Installed Plugins (${installedPlugins.length})`}
            />
          }
        >
          <p className="console-text-muted-block console-mb-md">
            These plugins are currently active in your project
          </p>

          {installedPlugins.length === 0 ? (
            <Empty description="No installed plugins" />
          ) : (
            <Row gutter={[16, 16]}>
              {installedPlugins.map((plugin, index) => (
                <Col xs={24} sm={12} lg={8} key={plugin.id || index}>
                  <PluginCard
                    plugin={plugin}
                    onSettingsClick={handleSettingsClick}
                  />
                </Col>
              ))}
            </Row>
          )}
        </ConsoleCard>

        {availablePlugins.length > 0 ? (
          <ConsoleCard
            title={
              <ConsoleCardTitle
                icon={Package}
                label={`Available Plugins (${availablePlugins.length})`}
              />
            }
          >
            <p className="console-text-muted-block console-mb-md">
              These plugins are on the project but not yet loaded
            </p>

            <Row gutter={[16, 16]}>
              {availablePlugins.map((plugin, index) => (
                <Col xs={24} sm={12} lg={8} key={plugin.id || index}>
                  <PluginCard
                    plugin={plugin}
                    onSettingsClick={handleSettingsClick}
                  />
                </Col>
              ))}
            </Row>
          </ConsoleCard>
        ) : null}
      </div>

      <PluginSettingsDrawer
        open={settingsDrawerVisible}
        onClose={handleCloseSettings}
        selectedPlugin={selectedPlugin}
        variant="project"
        onAfterMutation={() => {
          void refetch();
        }}
      />

      <Drawer
        title="Add plugin from registry"
        placement="right"
        width={440}
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        destroyOnClose
      >
        {catalogLoading ? (
          <div className="console-drawer-loading">
            <Spin />
          </div>
        ) : (
          <List
            dataSource={catalogPlugins}
            locale={{ emptyText: "No registry plugins found" }}
            renderItem={(item) => {
              const name = item.name || item.id || "Plugin";
              const already = item.id ? installedIds.has(item.id) : false;
              const hostInstalled = !!item.installed;
              return (
                <List.Item
                  actions={[
                    hostInstalled ? (
                      <Button
                        key="activate"
                        type="primary"
                        size="small"
                        disabled={already}
                        loading={installingId === item.id}
                        onClick={() => void handleActivate(item)}
                      >
                        {already ? "Activated" : "Activate"}
                      </Button>
                    ) : (
                      <Tag key="needs-admin">Requires super-admin installation</Tag>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <span className="marketplace-plugin-card__icon marketplace-plugin-card__icon--sm">
                        <PluginGlyph plugin={item} size={18} />
                      </span>
                    }
                    title={name}
                    description={
                      <Space direction="vertical" size={0}>
                        {catalogVersionLabel(item) ? (
                          <span className="console-text-caption">
                            {catalogVersionLabel(item)}
                          </span>
                        ) : null}
                        {item.description ? (
                          <span className="console-text-caption console-desc-clamp">
                            {item.description}
                          </span>
                        ) : null}
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Drawer>
    </div>
  );
};

export default ProjectPluginsPage;
