import { describe, expect, it } from "vitest";
import { selectProjectListFingerprint, selectProjectsList, } from "./selectors";
describe("selectProjectsList", () => {
    it("returns empty array when undefined", () => {
        expect(selectProjectsList(undefined)).toEqual([]);
    });
});
describe("selectProjectListFingerprint", () => {
    it("returns stable fingerprint for list", () => {
        const data = {
            code: 200,
            body: [
                {
                    id: "a",
                    name: "P1",
                    description: "",
                    created_at: "",
                    plan: "free",
                    db: "pg",
                    status: "LIVE",
                },
                {
                    id: "b",
                    name: "P2",
                    description: "",
                    created_at: "",
                    plan: "free",
                    db: "pg",
                },
            ],
        };
        expect(selectProjectListFingerprint(data)).toBe("a:LIVE:P1|b::P2");
    });
});
