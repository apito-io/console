import { describe, it, expect } from "vitest";
import { dedupeFieldsByIdentifier, fieldRowId, fieldIdentifierFromSortableId, rootSortableId, nestedSortableId, } from "./modelFields";
describe("dedupeFieldsByIdentifier", () => {
    it("keeps the first root field per identifier", () => {
        const fields = [
            { identifier: "test_fahim", label: "a", serial: 7 },
            { identifier: "test_fahim", label: "b", serial: 7 },
            { identifier: "other", label: "c", serial: 1 },
        ];
        const result = dedupeFieldsByIdentifier(fields);
        expect(result).toHaveLength(2);
        expect(result[0].label).toBe("a");
        expect(result[1].identifier).toBe("other");
    });
});
describe("fieldRowId", () => {
    it("disambiguates list keys by index", () => {
        expect(fieldRowId({ identifier: "test_fahim" }, 3)).toBe("test_fahim__3");
    });
});
describe("sortable ids", () => {
    it("round-trips root and nested sortable ids", () => {
        const rootId = rootSortableId({ identifier: "title" }, 0);
        expect(fieldIdentifierFromSortableId(rootId)).toBe("title");
        const nestedId = nestedSortableId("parent", { identifier: "child" }, 1);
        expect(fieldIdentifierFromSortableId(nestedId)).toBe("child");
    });
});
