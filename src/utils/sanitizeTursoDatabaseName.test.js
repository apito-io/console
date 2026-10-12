import { describe, expect, it } from "vitest";
import { sanitizeTursoDatabaseName } from "./sanitizeTursoDatabaseName";
describe("sanitizeTursoDatabaseName", () => {
    it("uses hint when valid", () => {
        expect(sanitizeTursoDatabaseName("My DB", "proj")).toBe("my-db");
    });
    it("falls back to apito-{projectId}", () => {
        expect(sanitizeTursoDatabaseName("", "my_project")).toBe("apito-my-project");
    });
    it("defaults base when project id empty", () => {
        expect(sanitizeTursoDatabaseName("", "")).toBe("apito-apito");
    });
});
