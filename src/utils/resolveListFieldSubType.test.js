import { describe, expect, it } from "vitest";
import { Field_Sub_Type_Enum } from "../generated_gql/tanstack-query";
import { resolveListFieldSubType } from "./resolveListFieldSubType";
describe("resolveListFieldSubType", () => {
    it("prefers dropdown when fixed_list_elements exist without multi choice", () => {
        expect(resolveListFieldSubType({
            field_type: "list",
            field_sub_type: "dynamicList",
            validation: {
                fixed_list_elements: ["kgs", "piece"],
                is_multi_choice: false,
            },
        })).toBe(Field_Sub_Type_Enum.Dropdown);
    });
    it("prefers multiSelect when fixed_list_elements and is_multi_choice", () => {
        expect(resolveListFieldSubType({
            field_type: "list",
            field_sub_type: "dynamicList",
            validation: {
                fixed_list_elements: ["a", "b"],
                is_multi_choice: true,
            },
        })).toBe(Field_Sub_Type_Enum.MultiSelect);
    });
    it("falls back to stored subtype when no fixed list", () => {
        expect(resolveListFieldSubType({
            field_type: "list",
            field_sub_type: "dynamicList",
            validation: {},
        })).toBe(Field_Sub_Type_Enum.DynamicList);
    });
});
