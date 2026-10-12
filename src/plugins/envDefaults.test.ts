import { describe, expect, it } from "vitest";
import { mergePluginEnvVars } from "./envDefaults";

describe("mergePluginEnvVars", () => {
  it("keeps saved project values from the plugin yaml", () => {
    expect(
      mergePluginEnvVars("hc-any-plugin", [
        { key: "CLOUDINARY_CLOUD_NAME", value: "demo" },
      ]),
    ).toEqual([{ key: "CLOUDINARY_CLOUD_NAME", value: "demo" }]);
  });

  it("does not invent vendor keys", () => {
    expect(mergePluginEnvVars("hc-cloudinary-plugin", [])).toEqual([]);
  });

  it("fills empty project env from yaml template keys", () => {
    expect(
      mergePluginEnvVars(
        "hc-cloudinary-plugin",
        [],
        [
          { key: "CLOUDINARY_CLOUD_NAME", value: "" },
          { key: "CLOUDINARY_API_KEY", value: "" },
        ],
      ),
    ).toEqual([
      { key: "CLOUDINARY_CLOUD_NAME", value: "" },
      { key: "CLOUDINARY_API_KEY", value: "" },
    ]);
  });

  it("overlays project values on yaml templates", () => {
    expect(
      mergePluginEnvVars(
        "hc-cloudinary-plugin",
        [{ key: "CLOUDINARY_CLOUD_NAME", value: "demo" }],
        [
          { key: "CLOUDINARY_CLOUD_NAME", value: "" },
          { key: "CLOUDINARY_API_SECRET", value: "" },
        ],
      ),
    ).toEqual([
      { key: "CLOUDINARY_CLOUD_NAME", value: "demo" },
      { key: "CLOUDINARY_API_SECRET", value: "" },
    ]);
  });
});
