import React, { useState, useContext, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  InputNumber,
  message,
} from "antd";
import { capitalize } from "lodash";
import pluralize from "pluralize";
import { type FieldTypeOption } from "../../constants/fieldTypes";
import { type FieldInfo } from "../../types/model";
import { ContentContext } from "../../contexts/ContentContext";
import { buildFieldIdentifier } from "../../utils/identifierBuilder";
import { useTourTracking } from "../../hooks/useTourTracking";
import {
  Field_Sub_Type_Enum,
  Field_Type_Enum,
  useUpsertFieldToModelMutation,
  useGetOnlyModelsInfoQuery,
  useUpdateModelRelationMutation,
  Relation_Type_Enum,
} from "../../generated/graphql";
import DynamicTextfieldList from "../forms/DynamicTextfieldList";
import "./FieldConfigurationDrawer.css";
import { GET_MODEL_DETAILS } from "../../graphql/queries/models";
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
  const context = useContext(ContentContext) as ContentContextType | null;
  const state = context?.state || { target: "" };
  const messageApi = message;
  const { trackFieldAdded } = useTourTracking();

  // Fetch available models for relation configuration
  const { data: modelsData } = useGetOnlyModelsInfoQuery({
    errorPolicy: "all",
  });

  const availableModels = modelsData?.projectModelsInfo || [];

  // Relation form state
  const [model, setModel] = useState("");
  const [backwardRelation, setBackwardRelation] = useState("");

  const modelList = availableModels
    ?.filter((model) => model && model.name && model.name !== state.target)
    .map((item) => item!.name);

  const relationArr: Relation_Type_Enum[] = [
    Relation_Type_Enum.HasMany,
    Relation_Type_Enum.HasOne,
  ];

  const [createModelRelation] = useUpdateModelRelationMutation({
    onCompleted: () => {
      messageApi.success("New Relation Created Successfully!");
      onFieldCreated();
      window.location.reload();
    },
    onError: (error) => {
      console.error("Relation creation error:", error);
      const errorMessage =
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.message ||
        error.message ||
        "Unknown error occurred";
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

  const [upsertFieldToModel, { loading }] = useUpsertFieldToModelMutation({
    onCompleted: () => {
      messageApi.success("New Field Created Successfully!");
      form.resetFields();
      setIsLocal(false);
      setFormError("");
      trackFieldAdded(); // Track tour progress
      onFieldCreated();
    },
    onError: (error) => {
      console.error("Field creation error:", error);
      const errorMessage =
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.message ||
        error.message ||
        "Unknown error occurred";
      setFormError(errorMessage);
    },
    refetchQueries: [
      {
        query: GET_MODEL_DETAILS,
        variables: {
          model_name: modelName,
        },
      },
    ],
  });

  const onFinish = async (values: Record<string, unknown>) => {
    if (!fieldOption) return;

    const { field_type, field_sub_type, input_type } = fieldOption;

    // Handle relation field creation
    if (field_type === "relation") {
      const forwardModel = (values?.forward as any)?.model;
      const forwardRelation = (values?.forward as any)?.relation;
      const backwardRelation = (values?.backward as any)?.relation;

      if (!forwardModel || !forwardRelation || !backwardRelation) {
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
      await createModelRelation({
        variables: payload,
      });
      return;
    }

    // Build validation payload safely (remove empty keys and coerce numbers)
    const rawValidation = (values.validation || {}) as any;
    const validationPayload: Record<string, unknown> = { ...rawValidation };

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

    await upsertFieldToModel({
      variables: {
        model_name: modelName,
        field_label: (values.field_label as string) || "",
        field_type: field_type as Field_Type_Enum,
        field_sub_type,
        field_description: values.field_description as string,
        input_type,
        is_update: isEditing,
        parent_field: repeatedFieldIdentifier || undefined,
        validation: validationPayload,
      },
    });
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

    const { field_type, field_sub_type } = fieldData;

    // Handle relation fields separately
    if (field_type === "relation") {
      return (
        <div className="field-config-content">
          <div style={{ marginBottom: "24px" }}>
            <div>
              <Form.Item
                label="Forward Relationship"
                rules={[{ required: true }]}
              >
                <Input value={capitalize(state.target)} />
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
                      ? capitalize(pluralize(state.target))
                      : capitalize(state.target)
                  }
                />
              </Form.Item>
            </div>
            <Form.Item
              name="known_as"
              label="Known As (Optional)"
              help={
                <div>
                  Please do check out the{" "}
                  <a
                    target="_blank"
                    href="https://docs.apito.io/console/models-fields#creating-relations-between-models"
                  >
                    guide
                  </a>{" "}
                  before using this field. If you are confused then dont.
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
          help={
            formError && <div style={{ color: "#ff4d4f" }}>{formError}</div>
          }
        >
          <Input placeholder="Ex: Name, Title, etc" />
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
              <DynamicTextfieldList btnLabel={dynamicFormListBtnLabel} />
            </Form.Item>
          </div>
        )}
      </div>
    );
  };

  // Initialize form when editing
  useEffect(() => {
    if (isEditing && selectedField) {
      form.setFieldsValue({
        field_label: selectedField.label,
        field_description: selectedField.description,
        validation: selectedField.validation || {},
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
