import { describe, expect, it } from "vitest";
import { insertByPlacement } from "./navPlacement";
import { contributionBadges } from "./contributions";

describe("insertByPlacement", () => {
  const core = [
    { key: "content" },
    { key: "storage" },
    { key: "graphql" },
  ];

  it("places Cloudinary immediately after Files/storage", () => {
    const merged = insertByPlacement(core, [
      { key: "plugin-hc-cloudinary-plugin", placement: { after: "storage" } },
    ]);
    expect(merged.map((item) => item.key)).toEqual([
      "content",
      "storage",
      "plugin-hc-cloudinary-plugin",
      "graphql",
    ]);
  });

  it("hides settings-only and hidden items", () => {
    const merged = insertByPlacement(core, [
      { key: "hidden", placement: { hidden: true } },
      { key: "settings", placement: { settings: true } },
    ]);
    expect(merged.map((item) => item.key)).toEqual(["content", "storage", "graphql"]);
  });

  it("appends items without a matching anchor", () => {
    const merged = insertByPlacement(core, [{ key: "plugin-other" }]);
    expect(merged[merged.length - 1]?.key).toBe("plugin-other");
  });
});

describe("contributionBadges", () => {
  it("omits missing surfaces", () => {
    expect(
      contributionBadges({
        api: { queries: [{ name: "cloudinaryAssets" }] },
      }),
    ).toEqual(["API"]);
  });

  it("lists present surfaces only", () => {
    expect(
      contributionBadges({
        api: { rest: [{ method: "GET", path: "/assets" }], events: ["order"] },
        ui: { ui_available: true, settings: [{ label: "Cloudinary" }] },
        fields: [{ id: "cloudinary_asset", label: "Asset", storage_type: "media" }],
      }),
    ).toEqual(["API", "UI", "Fields", "Settings", "Events"]);
  });
});
