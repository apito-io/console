import { describe, expect, it } from "vitest";
import {
  allowlistedAnalyticsProps,
  analyticsHostBlocked,
} from "./consoleAnalytics";

describe("console analytics allowlist", () => {
  it("drops secrets and unknown keys", () => {
    expect(
      allowlistedAnalyticsProps({
        project_id: "todo_notes",
        key_role: "admin",
        token: "ak_live_secret",
        email: "person@apito.io",
        jwt: "eyJhbGciOiJIUzI1NiJ9.payload",
        project_id_bad: "/tmp/schema.sql",
        template: "https://example.com/starter",
        field_count: 3,
      }),
    ).toEqual({
      project_id: "todo_notes",
      key_role: "admin",
      field_count: 3,
    });
  });

  it("blocks local and preview hosts", () => {
    expect(analyticsHostBlocked("localhost")).toBe(true);
    expect(analyticsHostBlocked("127.0.0.1")).toBe(true);
    expect(analyticsHostBlocked("feature.pages.dev")).toBe(true);
    expect(analyticsHostBlocked("app.apito.io")).toBe(false);
  });
});
