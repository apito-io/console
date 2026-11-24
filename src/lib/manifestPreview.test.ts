import { describe, expect, it } from "vitest";
import {
  engineSafeFieldLabel,
  stageManifestIntoDraft,
  type BackendManifestPreview,
} from "./manifestPreview";

const item = { name: "item", label: "Item" };

describe("engineSafeFieldLabel", () => {
  it("keeps ordinary labels", () => {
    expect(engineSafeFieldLabel(item, { identifier: "name", label: "Name" })).toBe("Name");
  });

  it("renames the reserved status field instead of failing", () => {
    expect(engineSafeFieldLabel(item, { identifier: "status", label: "Status" })).toBe(
      "Item Status",
    );
  });

  it("renames sys_ and digit-leading labels", () => {
    expect(engineSafeFieldLabel(item, { identifier: "sys_flag", label: "sys flag" })).toBe(
      "Item sys flag",
    );
    expect(engineSafeFieldLabel(item, { identifier: "2fa", label: "2FA" })).toBe("Item 2FA");
  });

  it("skips system id fields", () => {
    expect(engineSafeFieldLabel(item, { identifier: "id", label: "ID" })).toBeNull();
    expect(engineSafeFieldLabel(item, { identifier: "_id", label: "_id" })).toBeNull();
  });
});

describe("stageManifestIntoDraft", () => {
  it("stages the AI Builder default proposal without a reserved status label", async () => {
    const manifest: BackendManifestPreview = {
      id: "t",
      slug: "t",
      title: "t",
      description: "",
      version: "0.1.0",
      checksum: "",
      models: [
        {
          name: "item",
          label: "Item",
          fields: [
            { identifier: "id", label: "ID", field_type: "text" },
            { identifier: "name", label: "Name", field_type: "text", required: true },
            {
              identifier: "status",
              label: "Status",
              field_type: "dropdown",
              options: ["draft", "active"],
            },
          ],
        },
      ],
    };
    const calls: Record<string, unknown>[] = [];
    const counts = await stageManifestIntoDraft(
      { mutate: async ({ variables }) => void calls.push(variables) },
      manifest,
      { createModel: "createModel", upsertField: "upsertField" },
    );

    const labels = calls.map((v) => v.field_label).filter(Boolean);
    expect(labels).toEqual(["Name", "Item Status"]);
    expect(counts).toEqual({ models: 1, fields: 2, relations: 0 });
  });
});
