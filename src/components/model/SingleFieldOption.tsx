import React from "react";
import { Divider, Tooltip, Typography } from "antd";
import { Field_Type_Enum } from "../../generated/graphql";
import type { FieldTypeOption } from "../../constants/fieldTypes";
import { generateIcon } from "../../utils/generateLabelAndIcon";
import "./SingleFieldOption.css";

const { Text } = Typography;

interface SingleFieldOptionProps {
  index: number;
  fieldOption: FieldTypeOption;
  onSelectField: (index: number) => void;
}

const SingleFieldOption: React.FC<SingleFieldOptionProps> = ({
  fieldOption,
  onSelectField,
  index,
}) => {
  // Create a temporary field info object for generateIcon
  const fieldInfo = {
    field_type:
      fieldOption.field_type === "relation" ? "text" : fieldOption.field_type,
    field_sub_type: fieldOption.field_sub_type,
    input_type: fieldOption.input_type,
  };

  return (
    <div>
      {fieldOption.field_type === "relation" ? (
        <Divider orientation="right">Special Fields</Divider>
      ) : null}
      {fieldOption.field_type === Field_Type_Enum.Text ? (
        <Divider orientation="right">Regular Fields</Divider>
      ) : null}
      <div
        className="single-field-option-container"
        onClick={() => onSelectField(index)}
      >
        <Tooltip
          title={
            <div>
              <strong>{fieldOption.label}</strong>
              <br />
              {fieldOption.description}
              <br />
              <pre style={{ fontSize: "11px", marginTop: "8px" }}>
                {JSON.stringify(fieldOption.example_json, null, 2)}
              </pre>
            </div>
          }
          color="rgba(0, 0, 0, 0.85)"
          placement="left"
        >
          <div className="field-option-content">
            <div className="field-option-icon">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {generateIcon(fieldInfo as any)}
            </div>
            <div className="field-option-text">
              <Text className="field-option-title">{fieldOption.label}</Text>
              <Text className="field-option-description">
                {fieldOption.description}
              </Text>
            </div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default SingleFieldOption;
