import React from "react";
import { Alert, Descriptions, Empty, Space, Tabs, Tag, Typography } from "antd";
import type { CatalogPlugin } from "../../services/pluginCatalog";
import ContributionBadges from "./ContributionBadges";

const { Text, Paragraph } = Typography;

const PluginDetailsDrawerBody: React.FC<{ plugin: CatalogPlugin }> = ({
  plugin,
}) => {
  const api = plugin.contributions?.api;
  const ui = plugin.contributions?.ui;
  const fields = plugin.contributions?.fields ?? [];
  const queries = api?.queries ?? [];
  const mutations = api?.mutations ?? [];
  const rest = api?.rest ?? [];
  const events = api?.events ?? [];
  const routes = ui?.routes ?? [];
  const nav = ui?.navigation ?? [];
  const settings = ui?.settings ?? [];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <ContributionBadges contributions={plugin.contributions} />
      <Tabs
        items={[
          {
            key: "details",
            label: "Details",
            children: (
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Alert
                  type="info"
                  showIcon
                  message={
                    plugin.installed
                      ? "Next: activate on a project"
                      : "Install on Engine first"
                  }
                  description="Administrator Install only loads the binary on this Engine. Open a project → Settings → Plugins → Activate. Then set env vars on that card. Cloudinary nav sits after Files at /console/plugin/hc-cloudinary-plugin."
                />
                <Paragraph className="marketplace-drawer__desc">
                  {plugin.long_description || plugin.description}
                </Paragraph>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="ID">{plugin.id}</Descriptions.Item>
                  <Descriptions.Item label="Catalog version">
                    {plugin.plugin_version ? `v${plugin.plugin_version}` : "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Installed version">
                    {plugin.installed
                      ? plugin.installed_version
                        ? `v${plugin.installed_version}`
                        : "installed (version unknown)"
                      : "not installed"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Publisher">
                    {plugin.publisher || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trust">{plugin.trust || "—"}</Descriptions.Item>
                  <Descriptions.Item label="Signature">
                    {plugin.trust === "official" ? "Official catalog" : "Community"}
                    {plugin.installed ? " · installed" : ""}
                  </Descriptions.Item>
                  <Descriptions.Item label="Compatibility">
                    {plugin.compatible === false
                      ? "Incompatible"
                      : plugin.engine_semver || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Health">
                    {plugin.health || (plugin.installed ? "installed" : "not installed")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Repository">
                    {plugin.repository || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="License">
                    {plugin.license || "—"}
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            ),
          },
          {
            key: "functionality",
            label: "Functionality",
            children:
              queries.length + mutations.length + rest.length + events.length === 0 ? (
                <Empty description="No API" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  {api?.scope ? <Text type="secondary">Scope: {api.scope}</Text> : null}
                  {queries.length > 0 ? (
                    <div>
                      <Text strong>GraphQL queries</Text>
                      {queries.map((op) => (
                        <Paragraph key={op.name} style={{ marginBottom: 8 }}>
                          <Text code>{op.name}</Text>
                          {op.description ? ` — ${op.description}` : ""}
                          {op.args ? <div>Args: {op.args}</div> : null}
                          {op.returns ? <div>Returns: {op.returns}</div> : null}
                        </Paragraph>
                      ))}
                    </div>
                  ) : null}
                  {mutations.length > 0 ? (
                    <div>
                      <Text strong>GraphQL mutations</Text>
                      {mutations.map((op) => (
                        <Paragraph key={op.name} style={{ marginBottom: 8 }}>
                          <Text code>{op.name}</Text>
                          {op.description ? ` — ${op.description}` : ""}
                        </Paragraph>
                      ))}
                    </div>
                  ) : null}
                  {rest.length > 0 ? (
                    <div>
                      <Text strong>REST</Text>
                      {rest.map((op) => (
                        <Paragraph key={`${op.method}-${op.path}`} style={{ marginBottom: 8 }}>
                          <Tag>{op.method}</Tag>
                          <Text code>{op.path}</Text>
                          {op.description ? ` — ${op.description}` : ""}
                        </Paragraph>
                      ))}
                    </div>
                  ) : null}
                  {events.length > 0 ? (
                    <div>
                      <Text strong>Events</Text>
                      <div>
                        {events.map((event) => (
                          <Tag key={event}>{event}</Tag>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </Space>
              ),
          },
          {
            key: "ui-fields",
            label: "UI & Fields",
            children:
              !ui?.ui_available &&
              routes.length === 0 &&
              nav.length === 0 &&
              settings.length === 0 &&
              fields.length === 0 ? (
                <Empty description="No UI" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  {routes.length > 0 ? (
                    <div>
                      <Text strong>Routes</Text>
                      {routes.map((route) => (
                        <div key={route.path}>
                          <Text code>{route.path}</Text> {route.title || ""}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {nav.length > 0 ? (
                    <div>
                      <Text strong>Navigation</Text>
                      {nav.map((item, index) => (
                        <div key={`${item.label}-${index}`}>
                          {item.label || plugin.name}
                          {item.after ? ` after ${item.after}` : ""}
                          {item.before ? ` before ${item.before}` : ""}
                          {item.hidden ? " (hidden)" : ""}
                          {item.settings ? " (settings)" : ""}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {settings.length > 0 ? (
                    <div>
                      <Text strong>Settings</Text>
                      {settings.map((item) => (
                        <div key={item.path || item.label}>
                          {item.label} {item.path ? <Text code>{item.path}</Text> : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {fields.length > 0 ? (
                    <div>
                      <Text strong>Fields</Text>
                      {fields.map((field) => (
                        <Paragraph key={field.id} style={{ marginBottom: 8 }}>
                          <Text code>{field.id}</Text> — {field.label} (storage{" "}
                          {field.storage_type}
                          {field.content_form ? ", content form" : ""})
                        </Paragraph>
                      ))}
                    </div>
                  ) : null}
                </Space>
              ),
          },
        ]}
      />
    </Space>
  );
};

export default PluginDetailsDrawerBody;
