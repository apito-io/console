import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  InputNumber,
  message,
  Typography,
} from "antd";
import { capitalize } from "lodash";
import pluralize from "pluralize";
import { type FieldTypeOption } from "../../constants/fieldTypes";
import { type FieldInfo } from "../../types/model";
import { ContentContext } from "../../contexts/ContentContext";
import { useConsoleExtensions } from "../../contexts/ConsoleExtensionsContext";
import { buildFieldIdentifier } from "../../utils/identifierBuilder";
import { useTourTracking } from "../../hooks/useTourTracking";
import { useQueryClient } from "@tanstack/react-query";
import {
  Field_Sub_Type_Enum,
  Field_Type_Enum,
  Input_Type_Enum,
  useUpsertFieldToModelMutation,
  useGetOnlyModelsInfoQuery,
  useUpdateModelRelationMutation,
  Relation_Type_Enum,
} from "../../generated_gql/tanstack-query";
import DynamicTextfieldList from "../forms/DynamicTextfieldList";
import "./FieldConfigurationDrawer.css";
import { invalidateModelQueries } from "../../lib/schemaCache";
import { resolveListFieldSubType } from "../../utils/resolveListFieldSubType";
const { Option } = Select;

interface FieldConfigurationDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  fieldOption: FieldTypeOption | null;
  repeatedFieldIdentifier?: string;
  onFieldCreated: () => void;
  selectedField?: FieldInfo;
  isEditing?: boolean;
  modelName: string; // Add modelName prop
}

interface ContentContextType {
  state: {
    target: string;
    single_page?: boolean;
    single_page_uuid?: string;
    has_connections?: boolean;
  };
}

const validateMessages = {
  required: "${label} is required!",
};

const FieldConfigurationDrawer: React.FC<FieldConfigurationDrawerProps> = ({
  isVisible,
  onClose,
  fieldOption,
  repeatedFieldIdentifier = "",
  onFieldCreated,
  selectedField,
  isEditing = false,
  modelName,
}) => {
  const [form] = Form.useForm();
  const [isLocal, setIsLocal] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [formError, setFormError] = useState<string>("");
  const isEditingRef = useRef(isEditing);
  const submitLockRef = useRef(false);
  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);
  useEffect(() => {
    if (!isVisible) {
      submitLockRef.current = false;
    }
  }, [isVisible]);
  const context = useContext(ContentContext) as ContentContextType | null;
  const state = context?.state || { target: "" };
  // Use modelName prop as primary source, fallback to ContentContext
  const forwardModelName = modelName || state.target || "";
  const queryClient = useQueryClient();
  const messageApi = message;
  const { trackFieldAdded } = useTourTracking();
  const { FieldConfigurationRelationNotice, onSchemaMutationCompleted, schemaDraftOverlay } =
    useConsoleExtensions();
  const shouldRefetchLiveModelDetails =
    schemaDraftOverlay?.getModelChangeKind(modelName) !== "added";

  // Fetch available models for relation configuration
  const { data: modelsData } = useGetOnlyModelsInfoQuery();

  const availableModels = useMemo(() => {
    const live = modelsData?.projectModelsInfo ?? [];
    if (!schemaDraftOverlay?.hasDraft) {
      return live;
    }
    const names = new Set(
      live.map((m) => m?.name?.toLowerCase()).filter(Boolean) as string[]
    );
    const merged = [...live];
    for (const overlayModel of schemaDraftOverlay.models) {
      if (
        overlayModel.overlayMeta.kind === "removed" ||
        names.has(overlayModel.name.toLowerCase())
      ) {
        continue;
      }
      merged.push({
        name: overlayModel.name,
        single_page: overlayModel.single_page,
        single_page_uuid: overlayModel.single_page_uuid,
        system_generated: overlayModel.system_generated,
        has_connections: overlayModel.has_connections,
        enable_revision: overlayModel.enable_revision,
      });
      names.add(overlayModel.name.toLowerCase());
    }
    return merged;
  }, [modelsData?.projectModelsInfo, schemaDraftOverlay]);

  // Relation form state
  const [model, setModel] = useState("");
  const [backwardRelation, setBackwardRelation] = useState("");

  const watchedForwardRelatedModel = Form.useWatch(["forward", "model"], form) as
    | string
    | undefined;

  const modelList = availableModels
    ?.filter(
      (model) =>
        model &&
        model.name &&
        model.name !== forwardModelName &&
        (!model.system_generated || model.name === "users")
    )
    .map((item) => item!.name);

  const relationArr: Relation_Type_Enum[] = [
    Relation_Type_Enum.HasMany,
    Relation_Type_Enum.HasOne,
  ];

  const invalidateAfterMutation = async () => {
    await invalidateModelQueries(
      queryClient,
      shouldRefetchLiveModelDetails ? modelName : undefined
    );
  };

  const { mutateAsync: createModelRelation, isPending: relationLoading } =
    useUpdateModelRelationMutation({
      onSuccess: async () => {
        messageApi.success("New Relation Created Successfully!");
        await invalidateAfterMutation();
        onFieldCreated();
        await onSchemaMutationCompleted?.();
      },
      onError: (error) => {
        submitLockRef.current = false;
        console.error("Relation creation error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setFormError(errorMessage);
        messageApi.error(errorMessage);
      },
    });

  const getDrawerTitle = () => {
    if (isEditing && selectedField) {
      return `Edit ${selectedField.label || "Field"}`;
    }
    switch (fieldOption?.field_sub_type) {
      case "dropdown":
        return "Add Dropdown List";
      case "dynamicList":
        return "Add Dynamic List";
      case "multiSelect":
        return "Add Multi Select";
      default:
        return `Add ${capitalize(fieldOption?.field_type ?? "")}`;
    }
  };

  const { mutateAsync: upsertFieldToModel, isPending: fieldLoading } =
    useUpsertFieldToModelMutation({
      onSuccess: async () => {
        submitLockRef.current = false;
        messageApi.success(
          isEditingRef.current
            ? "Field updated successfully."
            : "New Field Created Successfully!"
        );
        form.resetFields();
        setIsLocal(false);
        setFormError("");
        trackFieldAdded();
        await invalidateAfterMutation();
        onFieldCreated();
        await onSchemaMutationCompleted?.();
      },
      onError: (error) => {
        submitLockRef.current = false;
        console.error("Field creation error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setFormError(errorMessage);
      },
    });

  const loading = relationLoading || fieldLoading;

  const onFinish = async (values: Record<string, unknown>) => {
    if (!fieldOption || loading || submitLockRef.current) return;
    submitLockRef.current = true;

    const field_type = (
      isEditing && selectedField
        ? selectedField.field_type
        : fieldOption.field_type
    ) as Field_Type_Enum;
    const field_sub_type =
      isEditing && selectedField
        ? resolveListFieldSubType(selectedField)
        : fieldOption.field_sub_type;
    const input_type =
      isEditing && selectedField?.input_type
        ? (selectedField.input_type as Input_Type_Enum)
        : fieldOption.input_type;

    // Handle relation field creation
    if (field_type === "relation") {
      const forwardModel = (values?.forward as any)?.model;
      const forwardRelation = (values?.forward as any)?.relation;
      const backwardRelation = (values?.backward as any)?.relation;

      if (!forwardModel || !forwardRelation || !backwardRelation) {
        submitLockRef.current = false;
        messageApi.error("Please fill in all required relation fields");
        return;
      }

      const payload = {
        forward_connection_type: forwardRelation as Relation_Type_Enum,
        from: modelName,
        reverse_connection_type: backwardRelation as Relation_Type_Enum,
        to: forwardModel as string,
        known_as: values?.known_as as string | undefined,
      };
      try {
        await createModelRelation(payload);
      } catch {
        submitLockRef.current = false;
      }
      return;
    }

    // Build validation payload safely (remove empty keys and coerce numbers)
    const rawValidation = (values.validation || {}) as any;
    const validationPayload: Record<string, unknown> = { ...rawValidation };
    if (field_sub_type === Field_Sub_Type_Enum.MultiSelect) {
      validationPayload.is_multi_choice = true;
    } else if (field_sub_type === Field_Sub_Type_Enum.Dropdown) {
      validationPayload.is_multi_choice = false;
    }

    // Handle integer range [min, max] – optional
    if (rawValidation?.int_range_limit) {
      const minRaw = rawValidation.int_range_limit?.[0];
      const maxRaw = rawValidation.int_range_limit?.[1];
      const minNum =
        minRaw !== undefined && minRaw !== null && minRaw !== ""
          ? Number(minRaw)
          : null;
      const maxNum =
        maxRaw !== undefined && maxRaw !== null && maxRaw !== ""
          ? Number(maxRaw)
          : null;

      if (minNum === null && maxNum === null) {
        delete validationPayload.int_range_limit;
      } else {
        const range: number[] = [];
        if (minNum !== null) range.push(minNum);
        if (maxNum !== null) range.push(maxNum);
        validationPayload.int_range_limit = range;
      }
    }

    try {
      await upsertFieldToModel({
        model_name: modelName,
        field_label: (values.field_label as string) || "",
        field_type: field_type as Field_Type_Enum,
        field_sub_type,
        field_description: values.field_description as string,
        input_type,
        is_update: isEditing,
        parent_field: repeatedFieldIdentifier || undefined,
        validation: validationPayload,
        plugin_id: fieldOption.plugin_id,
        plugin_field_type: fieldOption.plugin_field_type,
      });
    } catch {
      submitLockRef.current = false;
    }
  };

  const onFormValueChange = (
    _changedValues: Record<string, unknown>,
    values: Record<string, unknown>
  ) => {
    const label = (values?.field_label as string) || "";
    if (label) {
      setIdentifier(buildFieldIdentifier(label));
    }

    // Clear form error when user starts typing
    if (formError) {
      setFormError("");
    }

    // Handle relation form value changes
    if (fieldOption?.field_type === "relation") {
      const backwardRltn = (values?.backward as any)?.relation ?? ""; // has_one or has_many
      if (backwardRltn) setBackwardRelation(backwardRltn);
    }
  };

  const getFormContent = () => {
    // When editing, use selectedField data; otherwise use fieldOption
    const fieldData = isEditing && selectedField ? selectedField : fieldOption;
    if (!fieldData) return null;

    const field_type = fieldData.field_type;
    const field_sub_type =
      field_type === Field_Type_Enum.List
        ? resolveListFieldSubType(fieldData as FieldInfo)
        : fieldData.field_sub_type;

    // Handle relation fields separately
    if (field_type === "relation") {
      return (
        <div className="field-config-content">
          <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
            Foreign key columns are created nullable. You can create records
            independently and connect them later using Tag/Connect.
          </Typography.Paragraph>
          {FieldConfigurationRelationNotice ? (
            <FieldConfigurationRelationNotice
              drawerVisible={isVisible}
              isRelationField
              sourceModelName={forwardModelName}
              relatedModelName={watchedForwardRelatedModel ?? model}
            />
          ) : null}
          <div style={{ marginBottom: "24px" }}>
            <div>
                <Form.Item
                  label="Current Model (Forward)"
                  rules={[{ required: true }]}
                >
                  <Input value={capitalize(forwardModelName)} />
                </Form.Item>
              <Form.Item
                name={["forward", "relation"]}
                rules={[
                  { message: "Relation Type is Required", required: true },
                ]}
              >
                <Select placeholder="Has One/Has Many">
                  {relationArr.map((relation) => (
                    <Select.Option key={relation} value={relation}>
                      {relation.replace("_", " ")}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={["forward", "model"]}
                rules={[
                  { message: "Another Model is Required", required: true },
                ]}
              >
                <Select
                  placeholder="Select One"
                  onSelect={(value) => setModel(value)}
                >
                  {modelList?.map((modelName) => (
                    <Select.Option key={modelName} value={modelName}>
                      {capitalize(modelName || "")}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Backward Relationship"
                rules={[{ required: true }]}
              >
                <Input
                  disabled
                  placeholder="Select Forward Relationship First"
                  value={capitalize(model)}
                />
              </Form.Item>
              <Form.Item
                name={["backward", "relation"]}
                rules={[
                  { message: "Relation Type is Required", required: true },
                ]}
              >
                <Select placeholder="Has One/Has Many">
                  {relationArr.map((relation) => (
                    <Select.Option key={relation} value={relation}>
                      {relation.replace("_", " ")}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
                <Form.Item rules={[{ required: true }]}>
                  <Input
                    disabled
                    value={
                      backwardRelation === "has_many"
                        ? capitalize(pluralize(forwardModelName))
                        : capitalize(forwardModelName)
                    }
                  />
                </Form.Item>
            </div>
              <Form.Item
                name="known_as"
                label="Known As (Optional)"
                help={
                  <div>
                    Please check out the{" "}
                    <a
                      target="_blank"
                      href="https://apito.io/docs/console/models-fields#creating-relations-between-models"
                    >
                      guide
                    </a>{" "}
                    before using this field. If you are confused, don't use it.
                  </div>
                }
              >
              <Input placeholder="Alternate identifier for this relation" />
            </Form.Item>
          </div>
        </div>
      );
    }

    const listType = ["string"]; // for now only string
    const dynamicFormListBtnLabel =
      field_sub_type === Field_Sub_Type_Enum.Dropdown
        ? "Dropdown Option"
        : field_sub_type === Field_Sub_Type_Enum.MultiSelect
          ? "Select Option"
          : "";

    const showLocalization =
      ![
        Field_Type_Enum.Geo,
        Field_Type_Enum.Date,
        Field_Type_Enum.Repeated,
        Field_Type_Enum.Boolean,
        Field_Type_Enum.Number,
        Field_Type_Enum.Media,
      ].includes(field_type as Field_Type_Enum) &&
      ![Field_Sub_Type_Enum.Dropdown, Field_Sub_Type_Enum.MultiSelect].includes(
        field_sub_type as Field_Sub_Type_Enum
      );

    const showFixedListElements =
      field_type === Field_Type_Enum.List &&
      field_sub_type !== Field_Sub_Type_Enum.DynamicList;

    return (
      <div className="field-config-content">
        <Form.Item
          name="field_label"
          label="Field Label"
          rules={[
            { required: true },
            { min: 2, message: "Field label must be at least 2 characters" },
            { max: 50, message: "Field label must be at most 50 characters" },
          ]}
          extra={
            isEditing
              ? "Label and API identifier are fixed here; use rename if you need to change them."
              : undefined
          }
          help={
            formError && <div style={{ color: "#ff4d4f" }}>{formError}</div>
          }
        >
          <Input
            placeholder="Ex: Name, Title, etc"
            disabled={isEditing}
          />
        </Form.Item>

        <Form.Item
          label="Field Identifier"
          extra="Auto Generated & Used by API"
        >
          <Input
            placeholder="Auto Generated Field Identifier"
            value={identifier}
            disabled
          />
        </Form.Item>

        <Form.Item name="field_description" label="Field Description">
          <Input placeholder="The purpose of the field" />
        </Form.Item>

        <Form.Item name={["validation", "placeholder"]} label="Hints">
          <Input placeholder="Placeholder text for the field" />
        </Form.Item>

        {/* Field-specific validations */}
        <div className="validation-section">
          <Form.Item name={["validation", "required"]} valuePropName="checked">
            <Checkbox>Required Field</Checkbox>
          </Form.Item>

          {field_type === Field_Type_Enum.Text && (
            <>
              <Form.Item
                name={["validation", "unique"]}
                valuePropName="checked"
              >
                <Checkbox>Unique Values Only</Checkbox>
              </Form.Item>
              <Form.Item
                name={["validation", "is_email"]}
                valuePropName="checked"
              >
                <Checkbox>Email Validation</Checkbox>
              </Form.Item>
              <Form.Item
                name={["validation", "char_limit"]}
                label="Character Limit"
              >
                <Input type="number" placeholder="Max characters allowed" />
              </Form.Item>
            </>
          )}

          {field_type === Field_Type_Enum.Number && (
            <>
              <Form.Item label="Number Range">
                <Input.Group compact>
                  <Form.Item
                    name={["validation", "int_range_limit", 0]}
                    noStyle
                  >
                    <InputNumber placeholder="Min" style={{ width: "50%" }} />
                  </Form.Item>
                  <Form.Item
                    name={["validation", "int_range_limit", 1]}
                    noStyle
                  >
                    <InputNumber placeholder="Max" style={{ width: "50%" }} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </>
          )}

          {field_type === Field_Type_Enum.Media && (
            <Form.Item
              name={["validation", "is_gallery"]}
              valuePropName="checked"
            >
              <Checkbox>Multiple File Upload (Gallery)</Checkbox>
            </Form.Item>
          )}
        </div>

        {/* Localization */}
        {showLocalization && (
          <div className="localization-section">
            <Form.Item valuePropName="checked">
              <Checkbox checked={isLocal} onChange={() => setIsLocal(!isLocal)}>
                Enable Localization
              </Checkbox>
            </Form.Item>
            {isLocal && (
              <Form.Item
                name={["validation", "locals"]}
                initialValue={["en"]}
                extra="Add / Remove Languages from Setting > General > Content Languages"
              >
                <Select
                  mode="multiple"
                  placeholder="Select Language"
                  optionFilterProp="children"
                  allowClear
                >
                  <Option value="en">English</Option>
                  <Option value="es">Spanish</Option>
                  <Option value="fr">French</Option>
                  <Option value="de">German</Option>
                </Select>
              </Form.Item>
            )}
          </div>
        )}

        {/* Fixed List Elements for Dropdown/MultiSelect */}
        {showFixedListElements && (
          <div className="list-elements-section">
            <Form.Item
              name={["validation", "fixed_list_element_type"]}
              label="Field Type"
            >
              <Select placeholder="Select Value Type">
                {listType.map((item, index) => (
                  <Option value={item} key={index}>
                    {capitalize(item)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={["validation", "fixed_list_elements"]}
              label="Options"
            >
              <DynamicTextfieldList 
                btnLabel={dynamicFormListBtnLabel} 
                namePath={["validation", "fixed_list_elements"]}
              />
            </Form.Item>
          </div>
        )}
      </div>
    );
  };

  // Initialize form when editing
  useEffect(() => {
    if (isEditing && selectedField) {
      // Normalize fixed_list_elements to string[]
      const normalizedElements = (selectedField.validation?.fixed_list_elements || [])
        .map(el => String(el))
        .filter(el => el.trim() !== "");
      
      // Normalize fixed_list_element_type to lowercase
      const normalizedType = selectedField.validation?.fixed_list_element_type?.toLowerCase() || "string";
      
      form.setFieldsValue({
        field_label: selectedField.label,
        field_description: selectedField.description,
        validation: {
          ...selectedField.validation || {},
          fixed_list_elements: normalizedElements,
          fixed_list_element_type: normalizedType,
        },
      });
      setIdentifier(selectedField.identifier || "");
      setIsLocal(!!selectedField.validation?.locals?.length);
    } else {
      form.resetFields();
      setIdentifier("");
      setIsLocal(false);
    }
    // Clear form error when drawer opens or form resets
    setFormError("");
  }, [isEditing, selectedField, form]);

  return (
    <Drawer
      title={getDrawerTitle()}
      width={340}
      placement="right"
      closable
      onClose={onClose}
      open={isVisible}
      destroyOnHidden
      className="field-config-drawer"
      extra={
        <Button type="link" onClick={onClose}>
          {"< Back"}
        </Button>
      }
    >
      <Form
        form={form}
        name="field_setting"
        layout="vertical"
        onFinish={onFinish}
        validateMessages={validateMessages}
        onValuesChange={onFormValueChange}
        initialValues={{ remember: true }}
      >
        {getFormContent()}

        <div className="drawer-footer">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%" }}
          >
            {isEditing ? "UPDATE FIELD" : "CREATE FIELD"}
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default FieldConfigurationDrawer;
