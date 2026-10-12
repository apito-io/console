import React, { Fragment, useState } from "react";
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
  Tooltip,
  Typography,
} from "antd";
import type { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";

// rc-picker (Ant Design DatePicker) calls dayjs#weekday(); extend once at module load.
dayjs.extend(weekday);
dayjs.extend(localeData);
import {
  getFieldTypeColor,
  generateIcon,
} from "../../utils/generateLabelAndIcon";
import ReactDraft from "./ReactDraft";
import { usePluginManager } from "../../plugins/PluginManager";
import type { LoadedPlugin } from "../../plugins/types";
import { CircleMinus, Lock, Plus, Unlock } from "lucide-react";
import { resolveListFieldSubType } from "../../utils/resolveListFieldSubType";
import { Field_Sub_Type_Enum } from "../../generated_gql/tanstack-query";

const { Text } = Typography;

interface FieldDefinition {
  serial: number;
  identifier: string;
  label: string;
  input_type: string;
  field_type: string;
  field_sub_type?: string;
  description?: string;
  system_generated: boolean;
  plugin_id?: string;
  plugin_field_type?: string;
  sub_field_info?: FieldDefinition[];
  validation?: {
    as_title?: boolean;
    char_limit?: number;
    double_range_limit?: [number, number];
    fixed_list_elements?: string[];
    fixed_list_element_type?: string;
    hide?: boolean;
    is_email?: boolean;
    is_gallery?: boolean;
    is_multi_choice?: boolean;
    is_password?: boolean;
    int_range_limit?: [number, number];
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
  const [editableHiddenFields, setEditableHiddenFields] = useState<Set<string>>(
    new Set()
  );

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

    if (value instanceof Date) {
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

  // Media values are stored as `{ url }` (or gallery arrays); Input needs a string.
  const normalizeMediaUrl = (value: unknown): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      const first = value[0];
      return normalizeMediaUrl(first);
    }
    if (typeof value === "object") {
      const obj = value as Record<string, unknown>;
      if (typeof obj.url === "string") return obj.url;
      if (typeof obj.src === "string") return obj.src;
    }
    return "";
  };

  const mediaValueFromUrlInput = (
    eventOrString: unknown,
    previous: unknown,
  ): unknown => {
    const url =
      typeof eventOrString === "string"
        ? eventOrString
        : eventOrString &&
            typeof eventOrString === "object" &&
            "target" in eventOrString &&
            (eventOrString as { target?: { value?: string } }).target?.value != null
          ? String(
              (eventOrString as { target: { value?: string } }).target.value ??
                "",
            )
          : "";
    // Gallery fields keep array shape; single media stays `{ url }`.
    if (Array.isArray(previous)) {
      if (!url.trim()) return [];
      const first =
        previous[0] && typeof previous[0] === "object"
          ? { ...(previous[0] as object), url }
          : { url };
      return [first];
    }
    if (previous && typeof previous === "object" && !Array.isArray(previous)) {
      return { ...(previous as object), url };
    }
    return { url };
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
      const [min, max] = field.validation.int_range_limit;
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

  const toggleHiddenFieldEdit = (fieldId: string) => {
    setEditableHiddenFields((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  };

  const renderField = (field: FieldDefinition): React.ReactNode => {
    const fieldPath = getFieldPath(field.identifier);
    const fieldType = field.field_type;
    const isHidden = field.validation?.hide;
    const isSystemGenerated = field.system_generated;
    const isHiddenEditable = editableHiddenFields.has(field.identifier);

    // Determine if field should be disabled
    const isFieldDisabled =
      disabled || (isHidden && !isHiddenEditable) || isSystemGenerated;

    // For hidden fields, wrap in a card with edit toggle
    if (isHidden) {
      return (
        <Card
          key={field.identifier}
          size="small"
          style={{
            marginBottom: 16,
            borderLeft: `4px solid #faad14`,
            backgroundColor: "#fffbe6",
          }}
          title={
            <Space>
              {renderFieldLabel(field)}
              <Tag color="orange">Hidden Field</Tag>
              <Tooltip
                title={
                  isHiddenEditable ? "Lock field" : "Unlock field for editing"
                }
              >
                <Button
                  type="text"
                  size="small"
                  icon={
                    isHiddenEditable ? <Lock size={16} strokeWidth={1.75} /> : <Unlock size={16} strokeWidth={1.75} />
                  }
                  onClick={() => toggleHiddenFieldEdit(field.identifier)}
                  disabled={disabled}
                />
              </Tooltip>
            </Space>
          }
        >
          {renderFieldContent(field, fieldPath, fieldType, isFieldDisabled)}
        </Card>
      );
    }

    // For system-generated fields, wrap in a card with disabled indicator
    if (isSystemGenerated) {
      return (
        <Card
          key={field.identifier}
          size="small"
          style={{
            marginBottom: 16,
            borderLeft: `4px solid #52c41a`,
            backgroundColor: "#f6ffed",
          }}
          title={
            <Space>
              {renderFieldLabel(field)}
              <Tag color="green">System Generated</Tag>
            </Space>
          }
        >
          {renderFieldContent(field, fieldPath, fieldType, true)}
        </Card>
      );
    }

    // Regular field rendering
    return renderFieldContent(field, fieldPath, fieldType, isFieldDisabled);
  };

  const renderFieldContent = (
    field: FieldDefinition,
    fieldPath: (string | number)[],
    fieldType: string,
    isFieldDisabled: boolean
  ): React.ReactNode => {
    // Create a field info object for generateIcon
    const fieldInfo = {
      serial: field.serial,
      identifier: field.identifier,
      label: field.label,
      input_type: field.input_type,
      field_type: field.field_type,
      field_sub_type: field.field_sub_type,
      description: field.description,
      system_generated: field.system_generated,
      validation: field.validation,
    };

    // Helper function to render field label with icon
    const renderFieldLabelWithIcon = () => (
      <Space size={8}>
        {generateIcon(fieldInfo)}
        <Text strong>{field.label || field.identifier}</Text>
        <Text type="secondary">({field.identifier})</Text>
        {field.validation?.required && <Text type="danger">*</Text>}
      </Space>
    );

    const pluginFields = pluginAPI.getPluginFields();
    const pluginField =
      pluginFields.find(
        (pf) =>
          (field.plugin_field_type && pf.type === field.plugin_field_type) ||
          pf.type === fieldType,
      ) ??
      pluginFields.find(
        (pf) =>
          Boolean(field.plugin_id) &&
          pf.pluginId === field.plugin_id &&
          pf.storageType === fieldType,
      );

    if (pluginField) {
      const allPlugins = Array.from(pluginState.plugins.values());
      const ownerPlugin = allPlugins.find((plugin: LoadedPlugin) =>
        plugin.config.fields?.some((f) => f.type === pluginField.type),
      );
      if (ownerPlugin && ownerPlugin.loaded && !ownerPlugin.config.blockedReason) {
        const FormComponent = pluginAPI.getPluginComponent(
          ownerPlugin.config.name,
          "forms",
          pluginField.formComponent,
        ) as React.ComponentType<{
          disabled?: boolean;
          field?: unknown;
          pluginField?: unknown;
          placeholder?: string;
        }> | undefined;
        if (FormComponent) {
          return (
            <Form.Item
              name={fieldPath}
              label={renderFieldLabelWithIcon()}
              tooltip={field.description}
              rules={getValidationRules(field)}
            >
              <FormComponent
                disabled={isFieldDisabled}
                field={field}
                pluginField={pluginField}
                placeholder={field.validation?.placeholder}
              />
            </Form.Item>
          );
        }
      }
      return (
        <Form.Item
          name={fieldPath}
          label={renderFieldLabelWithIcon()}
          tooltip={field.description}
          rules={getValidationRules(field)}
        >
          <Input
            disabled={isFieldDisabled}
            placeholder={`${pluginField.label} unavailable — activate ${pluginField.pluginId || "the plugin"}`}
          />
        </Form.Item>
      );
    }

    switch (fieldType) {
      case "text":
        if (field.validation?.is_password) {
          return (
            <Form.Item
              name={fieldPath}
              label={renderFieldLabelWithIcon()}
              tooltip={field.description}
              rules={getValidationRules(field)}
            >
              <Input.Password
                disabled={isFieldDisabled}
                placeholder={field.validation?.placeholder}
              />
            </Form.Item>
          );
        }
        return (
          <Form.Item
            name={fieldPath}
            label={renderFieldLabelWithIcon()}
            tooltip={field.description}
            rules={getValidationRules(field)}
          >
            <Input
              disabled={isFieldDisabled}
              placeholder={field.validation?.placeholder}
            />
          </Form.Item>
        );

      case "multiline":
        return (
          <Form.Item
            name={fieldPath}
            label={renderFieldLabelWithIcon()}
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
              disabled={isFieldDisabled}
              placeholder={field.validation?.placeholder}
            />
          </Form.Item>
        );

      case "number":
        return (
          <Form.Item
            name={fieldPath}
            label={renderFieldLabelWithIcon()}
            tooltip={field.description}
            rules={getValidationRules(field)}
          >
            <InputNumber
              style={{ width: "100%" }}
              disabled={isFieldDisabled}
              placeholder={field.validation?.placeholder}
              min={
                Array.isArray(field.validation?.int_range_limit) &&
                field.validation?.int_range_limit.length > 0
                  ? field.validation?.int_range_limit[0]
                  : undefined
              }
              max={
                Array.isArray(field.validation?.int_range_limit) &&
                field.validation?.int_range_limit.length > 1
                  ? field.validation?.int_range_limit[1]
                  : undefined
              }
            />
          </Form.Item>
        );

      case "boolean":
        return (
          <Form.Item
            name={fieldPath}
            label={renderFieldLabelWithIcon()}
            tooltip={field.description}
            valuePropName="checked"
          >
            <Switch disabled={isFieldDisabled} />
          </Form.Item>
        );

      case "date":
        return (
          <Form.Item
            name={fieldPath}
            label={renderFieldLabelWithIcon()}
            tooltip={field.description}
            rules={getValidationRules(field)}
            getValueFromEvent={(date) => date}
            getValueProps={(value) => ({
              value: normalizeDateValue(value),
            })}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabled={isFieldDisabled}
              placeholder={field.validation?.placeholder}
            />
          </Form.Item>
        );

      case "list": {
        const listElements = field.validation?.fixed_list_elements || [];
        const listSub = resolveListFieldSubType({
          field_type: "list",
          field_sub_type: field.field_sub_type,
          validation: field.validation,
        });
        const isMultiChoice = listSub === Field_Sub_Type_Enum.MultiSelect;

        if (listElements.length > 0) {
          if (isMultiChoice) {
            return (
              <Form.Item
                name={fieldPath}
                label={renderFieldLabelWithIcon()}
                tooltip={field.description}
                rules={getValidationRules(field)}
              >
                <Checkbox.Group disabled={isFieldDisabled}>
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
                name={fieldPath}
                label={renderFieldLabelWithIcon()}
                tooltip={field.description}
                rules={getValidationRules(field)}
              >
                <Select
                  disabled={isFieldDisabled}
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
            label={renderFieldLabelWithIcon()}
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
                        <Input
                          placeholder="Enter value"
                          disabled={isFieldDisabled}
                        />
                      </Form.Item>
                      {!isFieldDisabled && (
                        <CircleMinus size={16} strokeWidth={1.75} onClick={() => remove(name)} />
                      )}
                    </div>
                  ))}
                  {!isFieldDisabled && (
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
                        <Plus size={16} strokeWidth={1.75} /> Add Item
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
            title={renderFieldLabelWithIcon()}
            size="small"
            style={{
              marginBottom: 16,
              borderLeft: "2px solid #1890ff",
            }}
          >
            <DynamicFormGenerator
              fields={field.sub_field_info}
              form={form}
              disabled={isFieldDisabled}
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
                    title={
                      <Space>
                        {generateIcon(fieldInfo)}
                        <Text strong>
                          {field.label || field.identifier} Section #{index + 1}
                        </Text>
                      </Space>
                    }
                    extra={
                      !isFieldDisabled &&
                      fields.length >= 1 && (
                        <CircleMinus size={16} strokeWidth={1.75}
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
                        disabled={isFieldDisabled}
                        parentPath={[fieldItem.name]}
                      />
                    </div>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    disabled={isFieldDisabled}
                    style={{ width: "100%" }}
                  >
                    <Plus size={16} strokeWidth={1.75} /> Add {field.label || field.identifier}
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        );
      }

      case "media":
        // Full uploader is still TODO; URL input must not render `{url}` as [object Object].
        return (
          <Form.Item
            name={fieldPath}
            label={renderFieldLabelWithIcon()}
            tooltip={field.description}
            rules={getValidationRules(field)}
            getValueProps={(value) => ({ value: normalizeMediaUrl(value) })}
            getValueFromEvent={(eventOrString) =>
              mediaValueFromUrlInput(
                eventOrString,
                form.getFieldValue(fieldPath),
              )
            }
          >
            <Input
              disabled={isFieldDisabled}
              placeholder="https://… or media URL"
              addonBefore="📁"
              allowClear
            />
          </Form.Item>
        );

      case "geo":
        // TODO: Implement geo field component
        return (
          <Form.Item
            name={fieldPath}
            label={renderFieldLabelWithIcon()}
            tooltip={field.description}
            rules={getValidationRules(field)}
          >
            <Input
              disabled={isFieldDisabled}
              placeholder="Geo field will be implemented"
              addonBefore="🌍"
            />
          </Form.Item>
        );

      default:
        return (
          <Form.Item
            name={fieldPath}
            label={renderFieldLabelWithIcon()}
            tooltip={field.description}
            rules={getValidationRules(field)}
          >
            <Input
              disabled={isFieldDisabled}
              placeholder={`Field type: ${fieldType}`}
            />
          </Form.Item>
        );
    }
  };

  return (
    <>
      {[...fields]
        .sort((a, b) => a.serial - b.serial)
        .map((field) => (
          <Fragment key={field.identifier}>{renderField(field)}</Fragment>
        ))}
    </>
  );
};

export default DynamicFormGenerator;
