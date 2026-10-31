import type { PluginConfig, LoadedPlugin, PluginRegistryState } from "./types";
import type { PluginContributions } from "./contributions";
import { primaryNavPlacement } from "./contributions";
import { getRestUrl } from "../constants/api";

export const PLUGIN_MANIFEST_PATH = "/system/plugin/manifest";

export interface EnginePluginManifestEntry {
  id: string;
  version?: string;
  title?: string;
  capabilities?: string[];
  activated?: boolean;
  official?: boolean;
  signed?: boolean;
  publisher?: string;
  bundle_url?: string;
  bundle_sha256?: string;
  extension_points?: string[];
  blocked_reason?: string;
  contributions?: PluginContributions;
}

interface EnginePluginManifestResponse {
  success?: boolean;
  plugins?: EnginePluginManifestEntry[];
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

class PluginRegistry {
  private state: PluginRegistryState = {
    plugins: new Map(),
    loading: false,
    error: null,
  };

  private loadingPlugins: Set<string> = new Set();
  private loadedBundles: Set<string> = new Set();
  private listeners: Array<(state: PluginRegistryState) => void> = [];

  subscribe(listener: (state: PluginRegistryState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  getState(): PluginRegistryState {
    return {
      ...this.state,
      plugins: new Map(this.state.plugins),
    };
  }

  reset() {
    this.state.plugins = new Map();
    this.state.error = null;
    this.loadedBundles = new Set();
    this.notify();
  }

  registerPlugin(config: PluginConfig) {
    const existing = this.state.plugins.get(config.name);
    const merged: PluginConfig = existing
      ? {
          ...existing.config,
          ...config,
          routes: config.routes?.length ? config.routes : existing.config.routes,
          components: {
            menu: {
              ...existing.config.components?.menu,
              ...config.components?.menu,
            },
            pages: {
              ...existing.config.components?.pages,
              ...config.components?.pages,
            },
            settings: {
              ...existing.config.components?.settings,
              ...config.components?.settings,
            },
            fields: {
              ...existing.config.components?.fields,
              ...config.components?.fields,
            },
            forms: {
              ...existing.config.components?.forms,
              ...config.components?.forms,
            },
            slots: {
              ...existing.config.components?.slots,
              ...config.components?.slots,
            },
          },
          fields: config.fields?.length ? config.fields : existing.config.fields,
          contributions: config.contributions ?? existing.config.contributions,
          menu: config.menu ?? existing.config.menu,
        }
      : config;
    const plugin: LoadedPlugin = {
      config: merged,
      loaded: !merged.blockedReason,
      error: merged.blockedReason,
      loadedAt: new Date(),
    };
    this.state.plugins.set(merged.name, plugin);
    this.notify();
  }

  async loadPlugin(_pluginPath: string): Promise<void> {
    await this.scanForPlugins();
  }

  unloadPlugin(pluginName: string) {
    this.state.plugins.delete(pluginName);
    this.notify();
  }

  getPlugin(pluginName: string): LoadedPlugin | undefined {
    return this.state.plugins.get(pluginName);
  }

  getAllPlugins(): LoadedPlugin[] {
    return Array.from(this.state.plugins.values());
  }

  getLoadedPlugins(): LoadedPlugin[] {
    return this.getAllPlugins().filter((plugin) => plugin.loaded);
  }

  async scanForPlugins(): Promise<void> {
    this.state.loading = true;
    this.state.error = null;
    this.notify();
    try {
      await this.loadFromEngineManifest();
    } catch (error) {
      this.state.error =
        error instanceof Error ? error.message : "Plugin manifest failed";
    } finally {
      this.state.loading = false;
      this.notify();
    }
  }

  async discoverPlugins(): Promise<LoadedPlugin[]> {
    await this.scanForPlugins();
    return this.getLoadedPlugins();
  }

  private async loadFromEngineManifest(): Promise<void> {
    const response = await fetch(getRestUrl(PLUGIN_MANIFEST_PATH), {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-Use-Cookies": "true",
      },
    });
    if (!response.ok) {
      throw new Error(`Plugin manifest HTTP ${response.status}`);
    }
    const body = (await response.json()) as EnginePluginManifestResponse;
    const entries = body.plugins ?? [];
    this.state.plugins = new Map();
    for (const entry of entries) {
      await this.ingestManifestEntry(entry);
    }
  }

  private async ingestManifestEntry(
    entry: EnginePluginManifestEntry,
  ): Promise<void> {
    if (!entry.id) {
      return;
    }
    const declarative = !entry.official || !entry.signed || !entry.bundle_url;
    const blockedReason =
      entry.blocked_reason ||
      (!entry.activated &&
      (entry.extension_points || []).some(
        (c) =>
          c.startsWith("project.") ||
          c.startsWith("console.") ||
          c === "content.fields",
      )
        ? "plugin is not activated for this project"
        : undefined);

    const contributions = entry.contributions;
    const nav = primaryNavPlacement(contributions);
    const config: PluginConfig = {
      name: entry.id,
      version: entry.version || "0.0.0",
      displayName: entry.title || entry.id,
      description: entry.publisher
        ? `Publisher: ${entry.publisher}`
        : undefined,
      author: entry.publisher,
      routes: (contributions?.ui?.routes || []).map((route) => ({
        path: route.path || "/",
        component: "Page",
        title: route.title,
      })),
      capabilities: entry.capabilities || [],
      official: Boolean(entry.official),
      signed: Boolean(entry.signed),
      declarative,
      blockedReason,
      contributions,
    };

    if (
      entry.activated &&
      !blockedReason &&
      nav &&
      ((entry.capabilities || []).includes("console.routes") ||
        contributions?.ui?.ui_available)
    ) {
      config.menu = {
        label: nav?.label || entry.title || entry.id,
        path: nav?.path || `/console/plugin/${entry.id}`,
        icon: nav?.icon,
        placement: nav,
      };
    }

    if (entry.activated && !blockedReason) {
      config.fields = (contributions?.fields || []).map((field) => ({
        type: field.id,
        label: field.label,
        icon: field.icon,
        formComponent: field.form_component || "",
        displayComponent: field.display_component,
        pluginId: entry.id,
        storageType: field.storage_type,
      }));
    }

    const settings = contributions?.ui?.settings?.[0];
    if (entry.activated && !blockedReason && settings) {
      config.settings = {
        label: settings.label || entry.title || entry.id,
        section: "plugins",
        menu: {
          label: settings.label || entry.title || entry.id,
          path: settings.path || `/console/settings/plugins/${entry.id}`,
        },
      };
    }

    if (
      entry.official &&
      entry.signed &&
      entry.activated &&
      entry.bundle_url &&
      entry.bundle_sha256 &&
      !entry.blocked_reason
    ) {
      try {
        await this.loadSignedBundle(entry.id, entry.bundle_url, entry.bundle_sha256);
        const fromBundle = this.state.plugins.get(entry.id);
        this.registerPlugin({
          ...config,
          declarative: false,
          routes: fromBundle?.config.routes?.length
            ? fromBundle.config.routes
            : config.routes,
          components: fromBundle?.config.components,
          fields: fromBundle?.config.fields?.length
            ? fromBundle.config.fields
            : config.fields,
        });
        return;
      } catch (error) {
        config.blockedReason =
          error instanceof Error ? error.message : "signed bundle failed";
        config.declarative = true;
      }
    }

    this.registerPlugin(config);
  }

  private async loadSignedBundle(
    pluginId: string,
    bundleUrl: string,
    sha256hex: string,
  ): Promise<void> {
    if (this.loadingPlugins.has(pluginId) || this.loadedBundles.has(pluginId)) {
      return;
    }
    this.loadingPlugins.add(pluginId);
    try {
      const url = /^https?:\/\//i.test(bundleUrl)
        ? bundleUrl
        : getRestUrl(bundleUrl);
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) {
        throw new Error(`bundle HTTP ${res.status}`);
      }
      const buf = await res.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", buf);
      const got = toHex(digest);
      if (got !== sha256hex.toLowerCase()) {
        throw new Error("bundle checksum mismatch");
      }
      const blob = new Blob([buf], { type: "text/javascript" });
      const src = URL.createObjectURL(blob);
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to execute signed bundle for ${pluginId}`));
        document.head.appendChild(script);
      });
      this.loadedBundles.add(pluginId);
    } finally {
      this.loadingPlugins.delete(pluginId);
    }
  }
}

const pluginRegistry = new PluginRegistry();

export { PluginRegistry };
export default pluginRegistry;
