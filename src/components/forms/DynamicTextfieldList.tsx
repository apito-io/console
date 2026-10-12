import React from "react";
import { Form, Input, Button } from "antd";
import { CircleMinus, Plus } from "lucide-react";

interface DynamicTextfieldListProps {
  btnLabel?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  namePath?: (string | number)[]; // NEW: allow parent to specify form path
}

  const DynamicTextfieldList: React.FC<DynamicTextfieldListProps> = ({
  btnLabel = "Add Item",
  value = [],
  onChange,
  namePath,
}) => {
  return (
    <Form.List
      initialValue={value?.length > 0 ? value : [""]}
      name={namePath || "dynamic_list"}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map((field, index) => (
            <Form.Item
              required={false}
              key={field.key}
              style={{ marginBottom: 8 }}
            >
              <Form.Item
                {...field}
                validateTrigger={["onChange", "onBlur"]}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input an option or delete this field.",
                  },
                ]}
                noStyle
              >
                <Input
                  placeholder={`${btnLabel} ${index + 1}`}
                  style={{ width: "90%" }}
                  onChange={(e) => {
                    // Update the parent component's value
                    const newValues = [...value];
                    newValues[index] = e.target.value;
                    onChange?.(newValues);
                  }}
                />
              </Form.Item>
              {fields.length > 1 ? (
                <CircleMinus size={16} strokeWidth={1.75}
                  className="dynamic-delete-button"
                  onClick={() => {
                    remove(field.name);
                    // Update the parent component's value
                    const newValues = value.filter((_, i) => i !== index);
                    onChange?.(newValues);
                  }}
                  style={{ marginLeft: 8 }}
                />
              ) : null}
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => {
                add();
                // Add empty string to parent value
                onChange?.([...value, ""]);
              }}
              style={{ width: "100%" }}
              icon={<Plus size={16} strokeWidth={1.75} />}
            >
              Add {btnLabel}
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default DynamicTextfieldList;
