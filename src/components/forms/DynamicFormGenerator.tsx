import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Switch,
  DatePicker,
  Select,
  Checkbox,
  Card,
  Button,
  Tag,
  Space,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import { getFieldTypeColor } from "../../utils/generateLabelAndIcon";
import ReactDraft from "./ReactDraft";
import { usePluginManager } from "../../plugins/PluginManager";
import type { LoadedPlugin } from "../../plugins/types";

// Removed unused destructuring

interface FieldDefinition {
  serial: number;
  identifier: string;
  label: string;
  input_type: string;
  field_type: string;
  field_sub_type?: string;
  description?: string;
  system_generated: boolean;
  sub_field_info?: FieldDefinition[];
  validation?: {
    as_title?: boolean;
    char_limit?: number;
    double_range_limit?: { min?: number; max?: number };
    fixed_list_elements?: string[];
    fixed_list_element_type?: string;
    hide?: boolean;
    is_email?: boolean;
    is_gallery?: boolean;
    is_multi_choice?: boolean;
    is_password?: boolean;
    int_range_limit?: { min?: number; max?: number };
    locals?: string[];
    placeholder?: string;
    required?: boolean;
    unique?: boolean;
  };
}

interface DynamicFormGeneratorProps {
  fields: FieldDefinition[];
  form: FormInstance;
  initialValues?: Record<string, unknown>;
  disabled?: boolean;
  parentPath?: (string | number)[];
}

const DynamicFormGenerator: React.FC<DynamicFormGeneratorProps> = ({
  fields,
  form,
  // initialValues, // Removed unused parameter
  disabled = false,
  parentPath = [],
}) => {
  const [pluginState, pluginAPI] = usePluginManager();

  // Helper function to normalize date values for DatePicker
  const normalizeDateValue = (value: any) => {
    if (!value) return null;

    // If it's already a dayjs object, return it
    if (dayjs.isDayjs(value)) {
      return value.isValid() ? value : null;
    }

    // If it's a string or number, try to parse it
    if (typeof value === "string" || typeof value === "number") {
      const parsed = dayjs(value);
      return parsed.isValid() ? parsed : null;
    }

    return null;
  };

  // Helper function to normalize rich text content for ReactDraft
  const normalizeRichTextValue = (value: any) => {
    if (!value) return "";

    // If it's a string, return it (assume it's markdown)
    if (typeof value === "string") {
      return value;
    }

    // If it's an object with markdown property, return the markdown
    if (typeof value === "object" && value.markdown) {
      return value.markdown;
    }

    // If it's an object with html property, return the html
    if (typeof value === "object" && value.html) {
      return value.html;
    }

    // If it's an object with text property, return the text
    if (typeof value === "object" && value.text) {
      return value.text;
    }

    // Fallback to empty string
    return "";
  };

  const renderFieldLabel = (field: FieldDefinition) => {
    const label = field.label || field.identifier;
    const locales = field.validation?.locals;

    if (!locales || locales.length === 0) {
      return label;
    }

    return (
      <Space size={8}>
        <span>{label}</span>
        {locales.map((locale: string) => (
          <Tag key={locale} color="blue">
            {locale.toUpperCase()}
          </Tag>
        ))}
      </Space>
    );
  };

  const getValidationRules = (field: FieldDefinition) => {
    const rules: any[] = [];

    if (field.validation?.required && !field.validation?.is_password) {
      rules.push({
        required: true,
        message: `${field.label || field.identifier} is required`,
      });
    }

    if (field.validation?.is_email) {
      rules.push({
        type: "email",
        message: "Please enter a valid email address",
      });
    }

    if (
      Array.isArray(field.validation?.char_limit) &&
      field.validation.char_limit.length > 0
    ) {
      const maxChar = field.validation.char_limit[0];
      if (typeof maxChar === "number" && maxChar > 0) {
        rules.push({
          max: maxChar,
          message: `Maximum ${maxChar} characters allowed`,
        });
      }
    }

    if (
      Array.isArray(field.validation?.int_range_limit) &&
      field.validation.int_range_limit.length > 0
    ) {
      const { min, max } = field.validation.int_range_limit;
      if (min !== undefined) {
        rules.push({
          type: "number",
          min,
          message: `Minimum value is ${min}`,
        });
      }
      if (max !== undefined) {
        rules.push({
          type: "number",
          max,
          message: `Maximum value is ${max}`,
        });
      }
    }

    return rules;
  };

  const getFieldPath = (identifier: string) => {
    // Check if we're inside a Form.List (repeated field)
    // If parentPath is just a number (like [0] or [1]), we're inside Form.List
    if (parentPath.length === 1 && typeof parentPath[0] === "number") {
      // Inside Form.List - use relative path: [index, fieldName]
      return [parentPath[0], identifier];
    }

    // Top level fields
    if (parentPath.length === 0) {
      return ["form", identifier];
    }

    // Nested object fields or other cases
    return [...parentPath, identifier];
  };

  const renderField = (field: FieldDefinition): React.ReactNode => {
    if (field.validation?.hide || field.system_generated) {
      return null;
    }

    const fieldPath = getFieldPath(field.identifier);
    const fieldType = field.field_type;

    switch (fieldType) {
      case "text":
        if (field.validation?.is_password) {
          return (
            <Form.Item
              key={field.identifier}
              name={fieldPath}
              label={renderFieldLabel(field)}
              tooltip={field.description}
              rules={getValidationRules(field)}
            >
              <Input.Password
                disabled={disabled}
                placeholder={field.validation?.placeholder}
              />
            </Form.Item>
          );
        }
        return (
          <Form.Item
            key={field.identifier}
            name={fieldPath}
            label={renderFieldLabel(field)}
            tooltip={field.description}
            rules={getValidationRules(field)}
          >
            <Input
              disabled={disabled}
              placeholder={field.validation?.placeholder}
            />
          </Form.Item>
        );

      case "multiline":
        return (
          <Form.Item
            key={field.identifier}
            name={fieldPath}
            label={renderFieldLabel(field)}
            tooltip={field.description}
            rules={getValidationRules(field)}
            style={{
              borderLeft: `4px solid ${getFieldTypeColor(field.field_type)}`,
              paddingLeft: "12px",
              marginLeft: "4px",
            }}
            getValueFromEvent={(markdownContent) => {
              // Return markdown structure for the server
              return { markdown: markdownContent };
            }}
            getValueProps={(value) => ({
              value: normalizeRichTextValue(value),
            })}
          >
            <ReactDraft
              disabled={disabled}
              placeholder={field.validation?.placeholder}
            />
          </Form.Item>
        );

      case "number":
        return (
          <Form.Item
            key={field.identifier}
            name={fieldPath}
            label={renderFieldLabel(field)}
            tooltip={field.description}
            rules={getValidationRules(field)}
          >
            <InputNumber
              style={{ width: "100%" }}
              disabled={disabled}
              placeholder={field.validation?.placeholder}
              min={field.validation?.int_range_limit?.min}
              max={field.validation?.int_range_limit?.max}
            />
          </Form.Item>
        );

      case "boolean":
        return (
          <Form.Item
            key={field.identifier}
            name={fieldPath}
            label={renderFieldLabel(field)}
            tooltip={field.description}
            valuePropName="checked"
          >
            <Switch disabled={disabled} />
          </Form.Item>
        );

      case "date":
        return (
          <Form.Item
            key={field.identifier}
            name={fieldPath}
            label={renderFieldLabel(field)}
            tooltip={field.description}
            rules={getValidationRules(field)}
            getValueFromEvent={(date) => date}
            getValueProps={(value) => ({
              value: normalizeDateValue(value),
            })}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabled={disabled}
              placeholder={field.validation?.placeholder}
            />
          </Form.Item>
        );

      case "list": {
        const listElements = field.validation?.fixed_list_elements || [];
        const isMultiChoice = field.validation?.is_multi_choice;

        if (listElements.length > 0) {
          if (isMultiChoice) {
            return (
              <Form.Item
                key={field.identifier}
                name={fieldPath}
                label={renderFieldLabel(field)}
                tooltip={field.description}
                rules={getValidationRules(field)}
              >
                <Checkbox.Group disabled={disabled}>
                  {listElements.map((option) => (
                    <Checkbox key={option} value={option}>
                      {option}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            );
          } else {
            return (
              <Form.Item
                key={field.identifier}
                name={fieldPath}
                label={renderFieldLabel(field)}
                tooltip={field.description}
                rules={getValidationRules(field)}
              >
                <Select
                  disabled={disabled}
                  placeholder={
                    field.validation?.placeholder || "Select an option"
                  }
                >
                  {listElements.map((option) => (
                    <Select.Option key={option} value={option}>
                      {option}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            );
          }
        }

        // Dynamic list (no fixed elements)
        return (
          <Form.Item
            key={field.identifier}
            label={renderFieldLabel(field)}
            tooltip={field.description}
          >
            <Form.List name={fieldPath}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        alignItems: "center",
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name]}
                        style={{ flex: 1, marginBottom: 0, marginRight: 8 }}
                        rules={getValidationRules(field)}
                      >
                        <Input placeholder="Enter value" disabled={disabled} />
                      </Form.Item>
                      {!disabled && (
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      )}
                    </div>
                  ))}
                  {!disabled && (
                    <Form.Item>
                      <div
                        onClick={() => add()}
                        style={{
                          width: "100%",
                          border: "1px dashed #d9d9d9",
                          borderRadius: "2px",
                          padding: "8px",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        <PlusOutlined /> Add Item
                      </div>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>
          </Form.Item>
        );
      }

      case "object": {
        if (!field.sub_field_info || field.sub_field_info.length === 0) {
          return null;
        }

        // Use same path logic as old project for object fields
        let objectPath: string[] = ["form", String(field.identifier)];
        if (parentPath.length > 0) {
          objectPath = [...parentPath.map(String), String(field.identifier)];
        }

        return (
          <Card
            key={field.identifier}
            title={renderFieldLabel(field)}
            size="small"
            style={{
              marginBottom: 16,
              borderLeft: "2px solid #1890ff",
            }}
          >
            <DynamicFormGenerator
              fields={field.sub_field_info}
              form={form}
              disabled={disabled}
              parentPath={objectPath}
            />
          </Card>
        );
      }

      case "repeated": {
        if (!field.sub_field_info || field.sub_field_info.length === 0) {
          return null;
        }

        // Exact same logic as old project
        let _path: string[] = ["form", String(field.identifier)];
        if (parentPath.length > 0) {
          _path = [...parentPath.map(String), String(field.identifier)];
        }

        return (
          <Form.List name={_path}>
            {(fields, { add, remove }) => (
              <div style={{ marginTop: 10 }}>
                {fields.map((fieldItem, index) => (
                  <Card
                    key={fieldItem.key}
                    title={`${field.label || field.identifier} Section #${index + 1}`}
                    extra={
                      !disabled &&
                      fields.length >= 1 && (
                        <MinusCircleOutlined
                          onClick={() => remove(fieldItem.name)}
                          style={{ color: "#ff4d4f" }}
                        />
                      )
                    }
                    style={{
                      marginBottom: 15,
                      borderLeft: "2px solid #e73a55",
                    }}
                  >
                    <div key={fieldItem.key}>
                      <DynamicFormGenerator
                        fields={field.sub_field_info!}
                        form={form}
                        disabled={disabled}
                        parentPath={[fieldItem.name]}
                      />
                    </div>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "100%" }}
                  >
                    <PlusOutlined /> Add {field.label || field.identifier}
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        );
      }

      case "media":
        // TODO: Implement media uploader component
        return (
          <Form.Item
            key={field.identifier}
            name={fieldPath}
            label={renderFieldLabel(field)}
            tooltip={field.description}
            rules={getValidationRules(field)}
          >
            <Input
              disabled={disabled}
              placeholder="Media upload will be implemented"
              addonBefore="📁"
            />
          </Form.Item>
        );

      case "geo":
        // TODO: Implement geo field component
        return (
          <Form.Item
            key={field.identifier}
            name={fieldPath}
            label={renderFieldLabel(field)}
            tooltip={field.description}
            rules={getValidationRules(field)}
          >
            <Input
              disabled={disabled}
              placeholder="Geo field will be implemented"
              addonBefore="🌍"
            />
          </Form.Item>
        );

      default: {
        // Check if this is a plugin field type
        const pluginFields = pluginAPI.getPluginFields();
        const pluginField = pluginFields.find((pf) => pf.type === fieldType);

        if (pluginField) {
          // Find which plugin owns this field
          const allPlugins = Array.from(pluginState.plugins.values());
          const ownerPlugin = allPlugins.find((plugin: LoadedPlugin) =>
            plugin.config.fields?.some((f: any) => f.type === fieldType)
          );

          if (ownerPlugin && ownerPlugin.loaded) {
            // Get the form component for this field
            const FormComponent = pluginAPI.getPluginComponent(
              ownerPlugin.config.name,
              "forms",
              pluginField.formComponent
            ) as React.ComponentType<any>;

            if (FormComponent) {
              return (
                <Form.Item
                  key={field.identifier}
                  name={fieldPath}
                  label={renderFieldLabel(field)}
                  tooltip={field.description}
                  rules={getValidationRules(field)}
                >
                  <FormComponent
                    disabled={disabled}
                    field={field}
                    pluginField={pluginField}
                    placeholder={field.validation?.placeholder}
                  />
                </Form.Item>
              );
            }
          }
        }

        // Fallback to default input for unknown field types
        return (
          <Form.Item
            key={field.identifier}
            name={fieldPath}
            label={renderFieldLabel(field)}
            tooltip={field.description}
            rules={getValidationRules(field)}
          >
            <Input
              disabled={disabled}
              placeholder={`Field type: ${fieldType}`}
            />
          </Form.Item>
        );
      }
    }
  };

  return (
    <>
      {fields
        .filter((field) => !field.validation?.hide && !field.system_generated)
        .sort((a, b) => a.serial - b.serial)
        .map((field) => renderField(field))}
    </>
  );
};

export default DynamicFormGenerator;
