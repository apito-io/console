import { describe, it, expect } from "vitest";
import { getActiveMenuKey } from "./getActiveMenuKey";
describe("getActiveMenuKey", () => {
    it("maps /projects", () => {
        expect(getActiveMenuKey("/projects")).toBe("active-projects");
    });
    it("maps /projects/new", () => {
        expect(getActiveMenuKey("/projects/new")).toBe("new-project");
    });
    it("maps subscriptions", () => {
        expect(getActiveMenuKey("/subscriptions")).toBe("subscriptions");
    });
    it("maps system-db", () => {
        expect(getActiveMenuKey("/system-db")).toBe("system-db");
        expect(getActiveMenuKey("/admin/system-db")).toBe("system-db");
    });
    it("maps backups", () => {
        expect(getActiveMenuKey("/backups")).toBe("backups");
    });
});
