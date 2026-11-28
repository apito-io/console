import { describe, expect, it } from "vitest";
import { isProjectNavChildActive } from "./projectNavigation";

describe("isProjectNavChildActive", () => {
  const overview = { key: "o", label: "Overview", path: "/administrator/backups", exact: true };
  const targets = { key: "t", label: "Targets", path: "/administrator/backups/targets" };

  it("matches the landing page only exactly", () => {
    expect(isProjectNavChildActive(overview, "/administrator/backups")).toBe(true);
    expect(isProjectNavChildActive(overview, "/administrator/backups/")).toBe(true);
    expect(isProjectNavChildActive(overview, "/administrator/backups/targets")).toBe(false);
  });

  it("matches nested pages by prefix, not by string start", () => {
    expect(isProjectNavChildActive(targets, "/administrator/backups/targets")).toBe(true);
    expect(isProjectNavChildActive(targets, "/administrator/backups/targets/abc")).toBe(true);
    expect(isProjectNavChildActive(targets, "/administrator/backups/targetsx")).toBe(false);
  });
});
