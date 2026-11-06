import React, { useState } from "react";
import {
  Button,
  Row,
  Col,
  Spin,
  Empty,
  Alert,
  Tabs,
} from "antd";
import { useGetProjectPluginsQuery } from "../../generated_gql/tanstack-query";
import PluginCard from "../../components/plugins/PluginCard";
import PluginSettingsDrawer from "../../components/plugins/PluginSettingsDrawer";
import type { PluginDetailsRow } from "../../components/plugins/pluginTypes";
import { isProjectPluginActivated } from "../../components/plugins/pluginActivation";
import { Package } from "lucide-react";
import { ConsoleCard, ConsoleCardTitle } from "../../components/console";
import "../../components/console/ConsoleShell.css";

const ProjectPluginsPage: React.FC = () => {
  const [selectedPlugin, setSelectedPlugin] = useState<PluginDetailsRow | null>(
    null,
  );
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

  const { data, isLoading: loading, error, refetch } = useGetProjectPluginsQuery(
    { limit: 100, page: 1 },
  );

  const projectPlugins = (data?.getProjectPlugins ?? []).filter(
    Boolean,
  ) as PluginDetailsRow[];

  const activatedPlugins = projectPlugins.filter(isProjectPluginActivated);
  const installedPlugins = projectPlugins.filter(
    (plugin) => !isProjectPluginActivated(plugin),
  );

  const handleSettingsClick = (plugin: PluginDetailsRow) => {
    setSelectedPlugin(plugin);
    setSettingsDrawerVisible(true);
  };

  const handleCloseSettings = () => {
    setSettingsDrawerVisible(false);
    setSelectedPlugin(null);
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
        >
          <p className="console-text-muted-block">
            System-installed plugins. Activate one for this project. Install
            and remove stay on System Plugins.
          </p>
        </ConsoleCard>

        <ConsoleCard>
          <Tabs
            defaultActiveKey="activated"
            items={[
              {
                key: "activated",
                label: `Activated Plugins (${activatedPlugins.length})`,
                children: (
                  <>
                    <p className="console-text-muted-block console-mb-md">
                      Turned on for this project.
                    </p>
                    {activatedPlugins.length === 0 ? (
                      <Empty description="No plugins activated for this project" />
                    ) : (
                      <Row gutter={[16, 16]}>
                        {activatedPlugins.map((plugin, index) => (
                          <Col xs={24} sm={12} lg={8} key={plugin.id || index}>
                            <PluginCard
                              plugin={plugin}
                              onSettingsClick={handleSettingsClick}
                            />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </>
                ),
              },
              {
                key: "installed",
                label: `Installed Plugins (${installedPlugins.length})`,
                children: (
                  <>
                    <p className="console-text-muted-block console-mb-md">
                      On this Apito instance. Off for this project until you
                      activate one.
                    </p>
                    {installedPlugins.length === 0 ? (
                      <Empty description="No installed plugins waiting to activate" />
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
                  </>
                ),
              },
            ]}
          />
        </ConsoleCard>
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
    </div>
  );
};

export default ProjectPluginsPage;
