import { describe, expect, it } from "vitest";
import {
  canInstall,
  catalogVersionLabel,
  filterMarketplace,
  installedVersionLabel,
  pluginActionLabel,
  updateButtonLabel,
  type CatalogPlugin,
} from "../services/pluginCatalog";

const discord: CatalogPlugin = {
  id: "hc-discord-plugin",
  name: "Discord Notifications",
  description: "webhooks",
  category: "communication",
  trust: "official",
  status: "available",
  tags: ["discord"],
  capabilities: ["system.events"],
  installed: false,
  compatible: true,
  platform_supported: true,
};

describe("filterMarketplace", () => {
  it("filters browse by query and category", () => {
    const list = filterMarketplace(
      [discord, { ...discord, id: "hc-stripe-plugin", name: "Stripe", category: "data" }],
      "browse",
      "discord",
      "communication",
      "official",
    );
    expect(list.map((p) => p.id)).toEqual(["hc-discord-plugin"]);
  });

  it("installed tab hides uninstalled", () => {
    const list = filterMarketplace(
      [discord, { ...discord, id: "hc-stripe-plugin", installed: true }],
      "installed",
      "",
      "all",
      "all",
    );
    expect(list.map((p) => p.id)).toEqual(["hc-stripe-plugin"]);
  });
});

describe("role labels", () => {
  it("project admin cannot install", () => {
    expect(canInstall(discord, false)).toBe(false);
    expect(pluginActionLabel(discord, false)).toBe("Requires super-admin installation");
  });

  it("super-admin can install available platform-supported plugins", () => {
    expect(canInstall(discord, true)).toBe(true);
    expect(pluginActionLabel(discord, true)).toBe("Install");
  });
});

describe("version labels", () => {
  it("keeps catalog version distinct from installed version", () => {
    const p: CatalogPlugin = {
      ...discord,
      plugin_version: "0.0.4",
      installed: true,
      installed_version: "0.0.3",
      update_available: true,
    };
    expect(catalogVersionLabel(p)).toBe("latest v0.0.4");
    expect(installedVersionLabel(p)).toBe("installed v0.0.3");
    expect(updateButtonLabel(p)).toBe("Update to v0.0.4");
  });

  it("omits installed label when not installed", () => {
    expect(installedVersionLabel({ ...discord, plugin_version: "0.0.4" })).toBeNull();
    expect(catalogVersionLabel({ ...discord, plugin_version: "0.0.4" })).toBe("latest v0.0.4");
  });
});
