import React, { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Drawer,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Typography,
  message,
} from "antd";
import { Puzzle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { isSuperAdminFromToken } from "../../utils/superAdmin";
import { ConsoleCard, ConsoleCardTitle } from "../../components/console";
import MarketplacePluginCard from "../../components/plugins/MarketplacePluginCard";
import PluginDetailsDrawerBody from "../../components/plugins/PluginDetailsDrawerBody";
import { PluginGlyph } from "../../components/plugins/pluginIcons";
import {
  fetchPluginCatalog,
  filterMarketplace,
  installCatalogPlugin,
  restartCatalogPlugin,
  uninstallCatalogPlugin,
  updateCatalogPlugin,
  type CatalogPlugin,
  type MarketplaceTab,
} from "../../services/pluginCatalog";
import "../../components/console/ConsoleShell.css";

const { Text } = Typography;

const SystemPluginsPage: React.FC = () => {
  const { decodeTokenData } = useAuth();
  const isSuperAdmin = isSuperAdminFromToken(decodeTokenData());
  const queryClient = useQueryClient();
  const catalogQuery = useQuery({
    queryKey: ["system-plugin-catalog"],
    queryFn: fetchPluginCatalog,
  });
  const [tab, setTab] = useState<MarketplaceTab>("browse");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [trust, setTrust] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CatalogPlugin | null>(null);

  const plugins = catalogQuery.data?.plugins ?? [];
  const categories = useMemo(() => {
    const set = new Set(plugins.map((p) => p.category).filter(Boolean) as string[]);
    return ["all", ...Array.from(set).sort()];
  }, [plugins]);
  const visible = filterMarketplace(plugins, tab, query, category, trust);
  const installedCount = plugins.filter((p) => p.installed).length;
  const updateCount = plugins.filter((p) => p.update_available).length;

  const run = async (id: string, fn: () => Promise<{ success?: boolean; message?: string; error?: string }>) => {
    setBusyId(id);
    try {
      const res = await fn();
      if (res.success === false) {
        message.error(res.message || res.error || "Plugin operation failed");
      } else {
        message.success(res.message || "Done");
        await queryClient.invalidateQueries({ queryKey: ["system-plugin-catalog"] });
      }
    } catch (err) {
      const ax = err as { response?: { data?: { message?: string; error?: string } } };
      message.error(
        ax.response?.data?.message ||
          ax.response?.data?.error ||
          (err instanceof Error ? err.message : "Plugin operation failed"),
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="console-page">
      <ConsoleCard title={<ConsoleCardTitle icon={Puzzle} label="Plugin marketplace" />}>
        <Text type="secondary" className="console-text-block">
          Signed registry catalog. Super-admin installs on this Engine. Project
          admins activate from Project Settings → Plugins.
        </Text>
        {catalogQuery.data?.registry_enabled === false ? (
          <Alert
            type="info"
            showIcon
            message="Remote registry flag is off"
            description="PLUGIN_REMOTE_REGISTRY_ENABLED=false. Showing locally installed plugins only."
          />
        ) : null}

        {catalogQuery.data?.message &&
        catalogQuery.data.message !== "ok" &&
        catalogQuery.data.registry_enabled !== false ? (
          <Alert
            type="warning"
            showIcon
            message="Signed catalog not loaded"
            description={
              catalogQuery.data.registry_error
                ? `${catalogQuery.data.message} (${catalogQuery.data.registry_error})`
                : catalogQuery.data.message
            }
          />
        ) : null}

        {catalogQuery.error ? (
          <Alert
            message="Failed to load catalog"
            description={
              catalogQuery.error instanceof Error
                ? catalogQuery.error.message
                : "Unknown error"
            }
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => void catalogQuery.refetch()}>
                Retry
              </Button>
            }
          />
        ) : null}

        <Space wrap align="center" className="marketplace-toolbar" size={8}>
          <Input.Search
            allowClear
            placeholder="Search plugins"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="marketplace-toolbar__search"
            aria-label="Search plugins"
          />
          <Select
            value={category}
            onChange={setCategory}
            options={categories.map((c) => ({
              value: c,
              label: c === "all" ? "All categories" : c,
            }))}
            className="marketplace-toolbar__select"
            aria-label="Filter by category"
          />
          <Select
            value={trust}
            onChange={setTrust}
            options={[
              { value: "all", label: "All publishers" },
              { value: "official", label: "Official" },
              { value: "community", label: "Community" },
            ]}
            className="marketplace-toolbar__select marketplace-toolbar__select--narrow"
            aria-label="Filter by publisher"
          />
        </Space>

        <Tabs
          activeKey={tab}
          onChange={(k) => setTab(k as MarketplaceTab)}
          items={[
            { key: "browse", label: "Browse" },
            { key: "installed", label: `Installed (${installedCount})` },
            { key: "updates", label: `Updates (${updateCount})` },
          ]}
        />

        {catalogQuery.isLoading ? (
          <div className="console-drawer-loading">
            <Spin />
          </div>
        ) : visible.length === 0 ? (
          <Empty
            description={query ? "No plugins match that search" : "No plugins match"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Row gutter={[16, 16]}>
            {visible.map((plugin) => (
              <Col xs={24} md={12} xl={8} key={plugin.id}>
                <MarketplacePluginCard
                  plugin={plugin}
                  isSuperAdmin={isSuperAdmin}
                  busy={busyId === plugin.id}
                  onOpen={setDetail}
                  onInstall={(p) =>
                    void run(p.id, () => installCatalogPlugin(p.id, p.plugin_version))
                  }
                  onUpdate={(p) => void run(p.id, () => updateCatalogPlugin(p.id))}
                  onRestart={(p) => void run(p.id, () => restartCatalogPlugin(p.id))}
                  onUninstall={(p) => void run(p.id, () => uninstallCatalogPlugin(p.id, true))}
                />
              </Col>
            ))}
          </Row>
        )}
      </ConsoleCard>

      <Drawer
        title={
          detail ? (
            <Space align="center">
              <span className="marketplace-plugin-card__icon marketplace-plugin-card__icon--sm" aria-hidden>
                <PluginGlyph plugin={detail} size={18} />
              </span>
              <span>{detail.name || detail.id}</span>
            </Space>
          ) : null
        }
        open={!!detail}
        onClose={() => setDetail(null)}
        width={760}
        className="marketplace-details-drawer"
      >
        {detail ? <PluginDetailsDrawerBody plugin={detail} /> : null}
      </Drawer>
    </div>
  );
};

export default SystemPluginsPage;
