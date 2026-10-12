import { describe, expect, it } from "vitest";
import { isSuperAdminFromToken } from "./superAdmin";
describe("isSuperAdminFromToken", () => {
    it("accepts string true", () => {
        expect(isSuperAdminFromToken({ is_super_admin: "true" })).toBe(true);
    });
    it("accepts boolean true", () => {
        expect(isSuperAdminFromToken({ is_super_admin: true })).toBe(true);
    });
    it("falls back to is_admin", () => {
        expect(isSuperAdminFromToken({ is_admin: true })).toBe(true);
        expect(isSuperAdminFromToken({ is_admin: "true" })).toBe(true);
    });
    it("rejects missing or false claims", () => {
        expect(isSuperAdminFromToken(null)).toBe(false);
        expect(isSuperAdminFromToken({ is_super_admin: "false" })).toBe(false);
    });
});
