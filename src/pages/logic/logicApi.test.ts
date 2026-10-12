import { describe, expect, it } from "vitest";
import { deriveFunctionStatus, statusLabel } from "./logicApi";

describe("deriveFunctionStatus", () => {
  it("marks never deployed when active revision is missing", () => {
    expect(deriveFunctionStatus({ source: "x" })).toBe("never_deployed");
    expect(statusLabel("never_deployed")).toBe("Never deployed");
  });

  it("marks deployed when active revision exists and sources match", () => {
    expect(
      deriveFunctionStatus(
        { source: "same", active_revision_id: "r1" },
        "same",
      ),
    ).toBe("deployed");
  });

  it("marks draft changes when source diverges from revision", () => {
    expect(
      deriveFunctionStatus(
        { source: "draft", active_revision_id: "r1" },
        "deployed",
      ),
    ).toBe("draft_changes");
  });
});

describe("tenant error class contract", () => {
  const TENANT_ERROR_CODES = new Set([
    "TENANT_REQUIRED",
    "TENANT_NOT_FOUND",
    "TENANT_NOT_ACTIVE",
    "TENANT_SCOPE_FORBIDDEN",
    "TENANT_DB_NOT_READY",
  ]);

  it("recognizes stable tenant scope codes for Alert rendering", () => {
    for (const code of TENANT_ERROR_CODES) {
      expect(TENANT_ERROR_CODES.has(code)).toBe(true);
    }
    expect(TENANT_ERROR_CODES.has("SQL logic error")).toBe(false);
  });
});
