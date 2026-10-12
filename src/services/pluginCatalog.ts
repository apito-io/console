import { httpService } from "./httpService";

export const PLUGIN_CATALOG_PATH = "/system/plugin/catalog";
export const PLUGIN_INSTALL_PATH = "/system/plugin/install";

export type CatalogHandshake = {
  protocol_version: number;
  magic_cookie_key: string;
  magic_cookie_value: string;
};

export type CatalogRelease = {
  os: string;
  arch: string;
  url: string;
  size: number;
  sha256: string;
};

export type CatalogPlugin = {
  id: string;
  name: string;
  publisher?: string;
  repository?: string;
  license?: string;
  description?: string;
  long_description?: string;
  icon?: string;
  tags?: string[];
  category?: string;
  language?: string;
  capabilities?: string[];
  engine_semver?: string;
  plugin_version?: string;
  trust?: string;
  status?: string;
  documentation_url?: string;
  contributions?: import("../plugins/contributions").PluginContributions;
  runtime?: {
    id: string;
    version: string;
    binary_path: string;
    capabilities?: string[];
    handshake?: CatalogHandshake;
  };
  releases?: CatalogRelease[];
  installed?: boolean;
  installed_version?: string;
  health?: string;
  update_available?: boolean;
  compatible?: boolean;
  platform_supported?: boolean;
  blocked_reason?: string;
};

export type PluginCatalogResponse = {
  success: boolean;
  message?: string;
  registry_enabled?: boolean;
  catalog_digest?: string;
  registry_error?: string;
  os?: string;
  arch?: string;
  engine_version?: string;
  plugins?: CatalogPlugin[];
};

export type PluginOpResponse = {
  success: boolean;
  message?: string;
  code?: string;
  error?: string;
};

export async function fetchPluginCatalog(): Promise<PluginCatalogResponse> {
  const { data } = await httpService.get<PluginCatalogResponse>(PLUGIN_CATALOG_PATH);
  return data;
}

export async function installCatalogPlugin(id: string, version?: string): Promise<PluginOpResponse> {
  const { data } = await httpService.post<PluginOpResponse>(PLUGIN_INSTALL_PATH, {
    id,
    version: version || undefined,
  });
  return data;
}

export async function updateCatalogPlugin(id: string): Promise<PluginOpResponse> {
  const { data } = await httpService.post<PluginOpResponse>(`/system/plugin/${id}/update`, {});
  return data;
}

export async function uninstallCatalogPlugin(id: string, force?: boolean): Promise<PluginOpResponse> {
  const { data } = await httpService.delete<PluginOpResponse>(`/system/plugin/${id}`, {
    params: force ? { force: true } : undefined,
  });
  return data;
}

export async function restartCatalogPlugin(id: string): Promise<PluginOpResponse> {
  const { data } = await httpService.post<PluginOpResponse>(`/system/plugin/${id}/restart`, {});
  return data;
}

export type MarketplaceTab = "browse" | "installed" | "updates";

export function filterMarketplace(
  plugins: CatalogPlugin[],
  tab: MarketplaceTab,
  query: string,
  category: string,
  trust: string,
): CatalogPlugin[] {
  const q = query.trim().toLowerCase();
  return plugins.filter((p) => {
    if (tab === "installed" && !p.installed) return false;
    if (tab === "updates" && !p.update_available) return false;
    if (tab === "browse" && (p.status === "catalog-stub" || p.status === "blocked")) {
      // still show stubs in browse so admins see the roadmap
    }
    if (category && category !== "all" && p.category !== category) return false;
    if (trust && trust !== "all" && p.trust !== trust) return false;
    if (!q) return true;
    const hay = [p.id, p.name, p.description, p.publisher, ...(p.tags ?? []), ...(p.capabilities ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function pluginActionLabel(p: CatalogPlugin, isSuperAdmin: boolean): string {
  if (p.installed && p.update_available) return isSuperAdmin ? "Update" : "Update available";
  if (p.installed) return "Installed";
  if (!isSuperAdmin) return "Requires super-admin installation";
  if (p.status === "catalog-stub" || p.status === "blocked") return "Not installable";
  if (!p.platform_supported) return "Unsupported platform";
  if (!p.compatible) return "Incompatible Engine";
  return "Install";
}

function withV(version?: string): string {
  if (!version) return "";
  return version.startsWith("v") ? version : `v${version}`;
}

/** Catalog / registry version. Never show this as the installed version. */
export function catalogVersionLabel(p: CatalogPlugin): string | null {
  if (!p.plugin_version) return null;
  return `latest ${withV(p.plugin_version)}`;
}

/** Local Engine install. Empty when not installed. */
export function installedVersionLabel(p: CatalogPlugin): string | null {
  if (!p.installed) return null;
  if (!p.installed_version) return "installed";
  return `installed ${withV(p.installed_version)}`;
}

export function updateButtonLabel(p: CatalogPlugin): string {
  if (p.plugin_version) return `Update to ${withV(p.plugin_version)}`;
  return "Update";
}

export function canInstall(p: CatalogPlugin, isSuperAdmin: boolean): boolean {
  return (
    isSuperAdmin &&
    !p.installed &&
    p.status === "available" &&
    p.compatible !== false &&
    p.platform_supported === true
  );
}
