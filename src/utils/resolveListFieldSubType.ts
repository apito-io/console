import { Field_Sub_Type_Enum } from "../generated_gql/tanstack-query";
import type { FieldInfo } from "../types/model";

/** Infer list field subtype from validation when stored metadata is missing or wrong. */
export function resolveListFieldSubType(
  field: Pick<FieldInfo, "field_type" | "field_sub_type" | "validation">
): Field_Sub_Type_Enum | undefined {
  if (field.field_type !== "list") {
    return field.field_sub_type as Field_Sub_Type_Enum | undefined;
  }

  const fixedList = (field.validation?.fixed_list_elements ?? [])
    .map((el) => String(el).trim())
    .filter(Boolean);
  const hasFixedList = fixedList.length > 0;
  const multiChoice = !!field.validation?.is_multi_choice;
  const stored = field.field_sub_type;

  if (hasFixedList) {
    if (multiChoice || stored === Field_Sub_Type_Enum.MultiSelect) {
      return Field_Sub_Type_Enum.MultiSelect;
    }
    return Field_Sub_Type_Enum.Dropdown;
  }
  if (
    stored === Field_Sub_Type_Enum.Dropdown ||
    stored === Field_Sub_Type_Enum.MultiSelect ||
    stored === Field_Sub_Type_Enum.DynamicList
  ) {
    return stored as Field_Sub_Type_Enum;
  }

  return Field_Sub_Type_Enum.DynamicList;
}
