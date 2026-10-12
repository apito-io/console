import { Field_Sub_Type_Enum } from "../generated_gql/tanstack-query";
/** Infer list field subtype from validation when stored metadata is missing or wrong. */
export function resolveListFieldSubType(field) {
    if (field.field_type !== "list") {
        return field.field_sub_type;
    }
    const fixedList = (field.validation?.fixed_list_elements ?? [])
        .map((el) => String(el).trim())
        .filter(Boolean);
    const hasFixedList = fixedList.length > 0;
    const multiChoice = !!field.validation?.is_multi_choice;
    if (hasFixedList) {
        return multiChoice
            ? Field_Sub_Type_Enum.MultiSelect
            : Field_Sub_Type_Enum.Dropdown;
    }
    const stored = field.field_sub_type;
    if (stored === Field_Sub_Type_Enum.Dropdown ||
        stored === Field_Sub_Type_Enum.MultiSelect ||
        stored === Field_Sub_Type_Enum.DynamicList) {
        return stored;
    }
    return Field_Sub_Type_Enum.DynamicList;
}
