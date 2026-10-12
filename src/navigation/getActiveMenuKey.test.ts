import { describe, it, expect } from "vitest";
import { getActiveMenuKey } from "./getActiveMenuKey";

describe("getActiveMenuKey", () => {
  it("maps /projects", () => {
    expect(getActiveMenuKey("/projects")).toBe("active-projects");
  });
  it("maps /projects/new", () => {
    expect(getActiveMenuKey("/projects/new")).toBe("new-project");
  });
  it("maps administrator plugins catalog", () => {
    expect(getActiveMenuKey("/administrator/plugins")).toBe("administrator-plugins");
  });
  it("maps support", () => {
    expect(getActiveMenuKey("/support")).toBe("support");
  });
  it("maps subscriptions", () => {
    expect(getActiveMenuKey("/subscriptions")).toBe("subscriptions");
  });
  it("maps partners", () => {
    expect(getActiveMenuKey("/partners")).toBe("partners");
    expect(getActiveMenuKey("/channel-monetization")).toBe("partners");
    expect(getActiveMenuKey("/invoice-settings")).toBe("invoice-settings");
  });
  it("maps system-db", () => {
    expect(getActiveMenuKey("/system-db")).toBe("system-db");
    expect(getActiveMenuKey("/administrator/system-db")).toBe("system-db");
  });
  it("maps administrator accounts separately from profile", () => {
    expect(getActiveMenuKey("/accounts")).toBe("accounts");
    expect(getActiveMenuKey("/administrator/accounts")).toBe("platform-accounts");
  });
  it("does not treat /administrator as /admin", () => {
    expect(getActiveMenuKey("/administrator/logs")).toBe("logs");
    expect(getActiveMenuKey("/administrator/admin")).toBe("admin");
    expect(getActiveMenuKey("/administrator/workspace")).toBe("workspace-settings");
  });
  it("maps backups", () => {
    expect(getActiveMenuKey("/backups")).toBe("backups");
  });
  it("maps workspace Teams without matching settings/teams", () => {
    expect(getActiveMenuKey("/teams")).toBe("teams");
    expect(getActiveMenuKey("/teams/")).toBe("teams");
    expect(getActiveMenuKey("/console/settings/teams")).not.toBe("teams");
  });

  it("maps /clients to My Clients", () => {
    expect(getActiveMenuKey("/clients")).toBe("clients");
    expect(getActiveMenuKey("/clients/acme")).toBe("clients");
  });
});
