import React from "react";
import { Button, Popconfirm, Tag } from "antd";
import { ConsoleCard } from "../console";
import {
  canInstall,
  catalogVersionLabel,
  installedVersionLabel,
  pluginActionLabel,
  updateButtonLabel,
  type CatalogPlugin,
} from "../../services/pluginCatalog";
import { PluginGlyph } from "./pluginIcons";
import ContributionBadges from "./ContributionBadges";
import "../console/ConsoleShell.css";

export type MarketplacePluginCardProps = {
  plugin: CatalogPlugin;
  isSuperAdmin: boolean;
  busy: boolean;
  onOpen: (plugin: CatalogPlugin) => void;
  onInstall: (plugin: CatalogPlugin) => void;
  onUpdate: (plugin: CatalogPlugin) => void;
  onRestart: (plugin: CatalogPlugin) => void;
  onUninstall: (plugin: CatalogPlugin) => void;
};

function displayTags(plugin: CatalogPlugin): string[] {
  const tags = [...(plugin.tags ?? [])];
  if (plugin.category && !tags.includes(plugin.category)) {
    tags.unshift(plugin.category);
  }
  return tags.slice(0, 4);
}

const MarketplacePluginCard: React.FC<MarketplacePluginCardProps> = ({
  plugin,
  isSuperAdmin,
  busy,
  onOpen,
  onInstall,
  onUpdate,
  onRestart,
  onUninstall,
}) => {
  const name = plugin.name || plugin.id || "Plugin";
  const installable = canInstall(plugin, isSuperAdmin);
  const stub = plugin.status === "catalog-stub" || plugin.status === "blocked";
  const className = [
    "marketplace-plugin-card",
    plugin.installed ? "marketplace-plugin-card--installed" : "",
    stub ? "marketplace-plugin-card--stub" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ConsoleCard className={className} hoverable>
      <div
        className="marketplace-plugin-card__layout"
        onClick={() => onOpen(plugin)}
      >
        <div className="marketplace-plugin-card__top">
          <div className="marketplace-plugin-card__icon" aria-hidden>
            <PluginGlyph plugin={plugin} size={22} />
          </div>
          <div className="marketplace-plugin-card__copy">
            <button
              type="button"
              className="marketplace-plugin-card__name"
              onClick={(event) => {
                event.stopPropagation();
                onOpen(plugin);
              }}
            >
              {name}
            </button>
            <div className="marketplace-plugin-card__meta">
              {catalogVersionLabel(plugin) ? (
                <span>{catalogVersionLabel(plugin)}</span>
              ) : null}
              {plugin.trust ? (
                <Tag className="marketplace-plugin-card__chip">{plugin.trust}</Tag>
              ) : null}
              {installedVersionLabel(plugin) ? (
                <Tag color="success" className="marketplace-plugin-card__chip">
                  {installedVersionLabel(plugin)}
                </Tag>
              ) : null}
              {plugin.health && plugin.installed ? (
                <Tag className="marketplace-plugin-card__chip">{plugin.health}</Tag>
              ) : null}
              {plugin.update_available ? (
                <Tag color="warning" className="marketplace-plugin-card__chip">
                  {updateButtonLabel(plugin)}
                </Tag>
              ) : null}
            </div>
          </div>
        </div>

        {plugin.description ? (
          <p className="marketplace-plugin-card__desc">{plugin.description}</p>
        ) : null}

        {plugin.installed ? (
          <p className="marketplace-plugin-card__hint">
            Engine-wide install. Activate in a project: Settings → Plugins.
            Env vars and sidebar live there, not on this admin page.
          </p>
        ) : null}

        <ContributionBadges contributions={plugin.contributions} />

        {plugin.blocked_reason ? (
          <p className="marketplace-plugin-card__warn">{plugin.blocked_reason}</p>
        ) : null}

        <div className="marketplace-plugin-card__tags">
          {displayTags(plugin).map((tag) => (
            <Tag key={tag} className="marketplace-plugin-card__chip">
              {tag}
            </Tag>
          ))}
        </div>

        <div
          className="marketplace-plugin-card__actions"
          onClick={(event) => event.stopPropagation()}
        >
          {installable ? (
            <Button
              type="primary"
              className="marketplace-plugin-card__install"
              loading={busy}
              onClick={() => onInstall(plugin)}
            >
              Install
            </Button>
          ) : !plugin.installed ? (
            <span className="marketplace-plugin-card__hint">
              {pluginActionLabel(plugin, isSuperAdmin)}
            </span>
          ) : null}

          {isSuperAdmin && plugin.installed && plugin.update_available ? (
            <Button type="primary" loading={busy} onClick={() => onUpdate(plugin)}>
              {updateButtonLabel(plugin)}
            </Button>
          ) : null}

          {isSuperAdmin && plugin.installed ? (
            <>
              <Button loading={busy} onClick={() => onRestart(plugin)}>
                Restart
              </Button>
              <Popconfirm
                title={`Uninstall ${name}?`}
                description="Removes the binary from this Engine. Projects using it will lose the plugin."
                okText="Uninstall"
                okButtonProps={{ danger: true }}
                onConfirm={() => onUninstall(plugin)}
              >
                <Button danger loading={busy}>
                  Uninstall
                </Button>
              </Popconfirm>
            </>
          ) : null}
        </div>
      </div>
    </ConsoleCard>
  );
};

export default MarketplacePluginCard;
