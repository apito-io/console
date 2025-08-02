import React, { useState, useContext } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  Space,
  Empty,
  Drawer,
  theme,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useParams } from "react-router-dom";
import {
  useGetModelDetailsQuery,
  useModelFieldOperationMutation,
  Field_Operation_Type_Enum,
} from "../../generated/graphql";
import {
  ContentContext,
  type ContentContextType,
} from "../../contexts/ContentContext";
import {
  buildFieldIdentifier,
  buildDuplicateIdentifier,
} from "../../utils/identifierBuilder";
import type { FieldInfo, SubFieldInfo, DrawerParam } from "../../types/model";
import FieldContainer from "../../components/model/FieldContainer";
import RelationContainer from "../../components/model/RelationContainer";
import RightSidebar from "../../components/model/RightSidebar";

const { Text, Title } = Typography;

interface SortableFieldProps {
  field: FieldInfo;
  value: React.ReactNode;
}

const SortableField: React.FC<SortableFieldProps> = ({ field, value }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.identifier || "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {value}
    </div>
  );
};

const ModelPage: React.FC = () => {
  const { token } = theme.useToken();
  const params = useParams();
  const context = useContext(ContentContext) as ContentContextType | null;

  // Get model name from ContentContext (set by left sidebar selection)
  const modelName = context?.state?.target || params?.model || "";
  const isSinglePage = context?.state?.single_page || false;

  const [repeatedFieldIdentifier, setRepeatedFieldIdentifier] = useState("");
  const [isConnectionSettingDrawer, setIsConnectionSettingDrawer] =
    useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [selectedFieldForEdit, setSelectedFieldForEdit] =
    useState<FieldInfo | null>(null);
  const [isEditingField, setIsEditingField] = useState(false);

  // Field operation modals
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [operationField, setOperationField] = useState<FieldInfo | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [renameForm] = Form.useForm();
  const [duplicateForm] = Form.useForm();
  const [deleteForm] = Form.useForm();

  // Auto-generated identifiers for rename and duplicate
  const [renameIdentifier, setRenameIdentifier] = useState("");
  const [duplicateIdentifier, setDuplicateIdentifier] = useState("");

  // Field operation mutations
  const [modelFieldOperation] = useModelFieldOperationMutation();

  // Fetch model generation data using the GraphQL query
  const {
    data: currentModelInfo,
    loading,
    error,
  } = useGetModelDetailsQuery({
    variables: {
      model_name: modelName,
    },
    skip: !modelName,
    errorPolicy: "all",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const modelInfo = currentModelInfo?.projectModelsInfo?.[0];
  const fields = (modelInfo?.fields || [])
    .filter((field): field is NonNullable<typeof field> => field !== null)
    .map((field) => ({
      ...field,
      serial: field.serial ?? 0,
    })) as FieldInfo[];
  const connections = (modelInfo?.connections || [])
    .filter((conn): conn is NonNullable<typeof conn> => conn !== null)
    .map((conn) => ({
      ...conn,
      model: conn.model ?? "",
      relation: conn.relation ?? "",
      type: conn.type ?? "",
      known_as: conn.known_as ?? "",
    }));

  // Helper function to flatten all fields for sortable context
  const getAllSortableItems = (fieldList: FieldInfo[]): string[] => {
    const items: string[] = [];

    const addFieldsRecursively = (fields: FieldInfo[]) => {
      fields.forEach((field) => {
        if (!field?.identifier) return;

        // Add the field identifier
        items.push(field.identifier);

        // Add sub-fields if they exist
        if (field.sub_field_info && field.sub_field_info.length > 0) {
          field.sub_field_info.forEach((subField) => {
            if (subField?.identifier) {
              items.push(subField.identifier);
            }
          });
        }
      });
    };

    addFieldsRecursively(fieldList);
    return items;
  };

  // Handle field operations (configure, rename, duplicate, delete)
  const openDrawerCallback = (data: DrawerParam) => {
    setRepeatedFieldIdentifier(data.objectIdentifier);

    switch (data.type) {
      case "configure":
        setSelectedFieldForEdit(data.field);
        setIsEditingField(true);
        setIsRightSidebarVisible(true);
        break;
      case "rename": {
        setOperationField(data.field);
        setIsRenameModalVisible(true);
        const renameLabel = data.field.label || data.field.identifier || "";
        renameForm.setFieldsValue({
          fieldLabel: renameLabel,
        });
        // Initialize the identifier
        const renameId = buildFieldIdentifier(renameLabel);
        setRenameIdentifier(renameId);
        break;
      }
      case "duplicate": {
        setOperationField(data.field);
        setIsDuplicateModalVisible(true);
        const duplicateLabel = `${data.field.label || data.field.identifier || ""}_copy`;
        duplicateForm.setFieldsValue({
          fieldLabel: duplicateLabel,
        });
        // Initialize the identifier
        const duplicateId = buildDuplicateIdentifier(duplicateLabel);
        setDuplicateIdentifier(duplicateId);
        break;
      }
      case "delete":
        setOperationField(data.field);
        setIsDeleteModalVisible(true);
        break;
    }
  };

  // Handle form value changes for auto-generating identifiers
  const handleRenameFormChange = (
    _changedValues: Record<string, unknown>,
    values: Record<string, unknown>
  ) => {
    const label = (values?.fieldLabel as string) || "";
    if (label) {
      const identifier = buildFieldIdentifier(label);
      setRenameIdentifier(identifier);
    } else {
      setRenameIdentifier("");
    }
  };

  const handleDuplicateFormChange = (
    _changedValues: Record<string, unknown>,
    values: Record<string, unknown>
  ) => {
    const label = (values?.fieldLabel as string) || "";
    if (label) {
      const identifier = buildDuplicateIdentifier(label);
      setDuplicateIdentifier(identifier);
    } else {
      setDuplicateIdentifier("");
    }
  };

  // Handle field rename
  const handleRename = async (values: { fieldLabel: string }) => {
    if (!operationField) return;

    setOperationLoading(true);
    try {
      const result = await modelFieldOperation({
        variables: {
          type: Field_Operation_Type_Enum.Rename,
          model_name: modelName,
          field_name: operationField.identifier || "",
          new_name: renameIdentifier, // Use auto-generated identifier
          parent_field: operationField.parent_field,
          single_page_model: isSinglePage,
        },
      });

      if (result.data?.modelFieldOperation) {
        message.success(
          `Field "${operationField.label}" renamed to "${values.fieldLabel}" successfully`
        );
        setIsRenameModalVisible(false);
        renameForm.resetFields();
        setRenameIdentifier("");
        // Refresh the page to update the model data
        window.location.reload();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to rename field";
      message.error(errorMessage);
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle field duplicate
  const handleDuplicate = async (values: { fieldLabel: string }) => {
    if (!operationField) return;

    setOperationLoading(true);
    try {
      const result = await modelFieldOperation({
        variables: {
          type: Field_Operation_Type_Enum.Duplicate,
          model_name: modelName,
          field_name: operationField.identifier || "",
          new_name: duplicateIdentifier, // Use auto-generated identifier
          parent_field: operationField.parent_field,
          single_page_model: isSinglePage,
        },
      });

      if (result.data?.modelFieldOperation) {
        message.success(
          `Field "${operationField.label}" duplicated as "${values.fieldLabel}" successfully`
        );
        setIsDuplicateModalVisible(false);
        duplicateForm.resetFields();
        setDuplicateIdentifier("");
        // Refresh the page to update the model data
        window.location.reload();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to duplicate field";
      message.error(errorMessage);
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle field delete
  const handleDelete = async (values: { confirmText: string }) => {
    if (!operationField || values.confirmText !== "DELETE") return;

    setOperationLoading(true);
    try {
      const result = await modelFieldOperation({
        variables: {
          type: Field_Operation_Type_Enum.Delete,
          model_name: modelName,
          field_name: operationField.identifier || "",
          new_name: "", // Not used for delete but required by API
          parent_field: operationField.parent_field,
          single_page_model: isSinglePage,
          is_relation: false, // This is a field, not a relation
        },
      });

      if (result.data?.modelFieldOperation) {
        message.success(`Field "${operationField.label}" deleted successfully`);
        setIsDeleteModalVisible(false);
        deleteForm.resetFields();
        // Refresh the page to update the model data
        window.location.reload();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete field";
      message.error(errorMessage);
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle connection/relationship operations
  const openConnectionDrawer = () => {
    setIsConnectionSettingDrawer(true);
  };

  // Recursive function to render field structure with sub-fields
  const renderSingleStructure = (
    field: FieldInfo,
    repeatIdentifier?: string
  ): React.ReactNode => {
    const repeatedFieldId = repeatIdentifier || "_root";

    // Prepare nested content for collapsible fields
    let nestedContent = null;
    if (
      (field.field_type === "repeated" || field.field_type === "object") &&
      field.sub_field_info?.length
    ) {
      const currentRepeatedFieldId = field.identifier || "";

      nestedContent = (
        <div>
          {field.sub_field_info
            .slice()
            .sort(
              (a: SubFieldInfo, b: SubFieldInfo) =>
                (a.serial || 0) - (b.serial || 0)
            )
            .map((subField: SubFieldInfo) => {
              if (!subField?.identifier) return null;

              const subFieldWithParent = {
                ...subField,
                parent_field: field.identifier,
              };

              return (
                <SortableField
                  key={subField.identifier}
                  field={subFieldWithParent}
                  value={renderSingleStructure(
                    subFieldWithParent,
                    currentRepeatedFieldId
                  )}
                />
              );
            })}
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            style={{
              backgroundColor: "#9f1329",
              borderColor: "#9f1329",
              marginTop: "12px",
              width: "100%",
            }}
            onClick={() => {
              setRepeatedFieldIdentifier(currentRepeatedFieldId);
              setIsEditingField(false);
              setSelectedFieldForEdit(null);
              setIsRightSidebarVisible(true);
            }}
          >
            ADD FIELDS TO {currentRepeatedFieldId.toUpperCase()}
          </Button>
        </div>
      );
    }

    return (
      <FieldContainer
        field={field}
        openDrawer={openDrawerCallback}
        objectIdentifier={repeatedFieldId}
      >
        {nestedContent}
      </FieldContainer>
    );
  };

  const onSortEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Handle field reordering logic here
      console.log("Field reordered:", { active: active.id, over: over?.id });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div>Loading model details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div>Error loading model: {error.message}</div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {modelName}
            </Title>
            <Text type="secondary">
              {isSinglePage ? "Single Record Model" : "Multi Record Model"}
            </Text>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "16px" }}>
        <Row gutter={[24, 24]}>
          {/* Left Column - Schema Fields */}
          <Col span={connections.length > 0 ? 12 : 24}>
            <div style={{ marginBottom: "24px" }}>
              <Space direction="vertical">
                <Text strong>Schema</Text>
                <Text type="secondary">
                  Long press on fields to drag and rearrange
                </Text>
              </Space>
            </div>

            {fields.length > 0 ? (
              <DndContext sensors={sensors} onDragEnd={onSortEnd}>
                <SortableContext
                  items={getAllSortableItems(fields)}
                  strategy={verticalListSortingStrategy}
                >
                  {fields
                    .slice()
                    .sort((a, b) => (a?.serial || 0) - (b?.serial || 0))
                    .map((field) => {
                      if (!field?.identifier) return null;

                      return (
                        <SortableField
                          key={field.identifier}
                          field={field as FieldInfo}
                          value={renderSingleStructure(
                            field as FieldInfo,
                            repeatedFieldIdentifier
                          )}
                        />
                      );
                    })}
                </SortableContext>
              </DndContext>
            ) : (
              <Empty
                description="Your model looks empty! Please define your model with some fields."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ marginTop: "40px" }}
              />
            )}

            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              style={{ marginTop: 24 }}
              onClick={() => {
                setRepeatedFieldIdentifier("");
                setIsEditingField(false);
                setSelectedFieldForEdit(null);
                setIsRightSidebarVisible(true);
              }}
            >
              ADD ROOT(/) FIELDS
            </Button>
          </Col>

          {/* Right Column - Relationships */}
          {connections.length > 0 && (
            <Col span={12}>
              <div style={{ marginBottom: "24px" }}>
                <Space direction="vertical">
                  <Text strong>Relationship</Text>
                  <Text type="secondary">Relations between models</Text>
                </Space>
              </div>

              {connections.map((connection, i) => (
                <RelationContainer
                  key={i}
                  connection={connection}
                  index={i}
                  onOpneDrawer={openConnectionDrawer}
                  modelName={modelName}
                />
              ))}
            </Col>
          )}
        </Row>
      </div>

      {/* Right Sidebar for Field Selection and Configuration */}
      <RightSidebar
        isVisible={isRightSidebarVisible}
        onClose={() => {
          setIsRightSidebarVisible(false);
          setIsEditingField(false);
          setSelectedFieldForEdit(null);
          setRepeatedFieldIdentifier("");
        }}
        repeatedFieldIdentifier={repeatedFieldIdentifier}
        selectedField={selectedFieldForEdit}
        isEditing={isEditingField}
        modelName={modelName}
      />

      {/* Field Operation Modals */}

      {/* Rename Field Modal */}
      <Modal
        title={`Rename Field: ${operationField?.label || ""}`}
        open={isRenameModalVisible}
        onCancel={() => {
          setIsRenameModalVisible(false);
          renameForm.resetFields();
          setRenameIdentifier("");
        }}
        onOk={() => renameForm.submit()}
        confirmLoading={operationLoading}
        destroyOnClose
      >
        <Form
          form={renameForm}
          layout="vertical"
          onFinish={handleRename}
          onValuesChange={handleRenameFormChange}
          preserve={false}
        >
          <Form.Item
            name="fieldLabel"
            label="* Field Label"
            rules={[
              { required: true, message: "Please enter a field label" },
              { min: 2, message: "Field label must be at least 2 characters" },
              { max: 50, message: "Field label must be at most 50 characters" },
            ]}
          >
            <Input placeholder="Enter field label" autoFocus />
          </Form.Item>
          <Form.Item label="Field Identifier">
            <Input
              value={renameIdentifier}
              disabled
              placeholder="Auto Generated & Used by API"
              style={{ color: "rgba(0, 0, 0, 0.45)" }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Duplicate Field Modal */}
      <Modal
        title={`Duplicate Field: ${operationField?.label || ""}`}
        open={isDuplicateModalVisible}
        onCancel={() => {
          setIsDuplicateModalVisible(false);
          duplicateForm.resetFields();
          setDuplicateIdentifier("");
        }}
        onOk={() => duplicateForm.submit()}
        confirmLoading={operationLoading}
        destroyOnClose
      >
        <Form
          form={duplicateForm}
          layout="vertical"
          onFinish={handleDuplicate}
          onValuesChange={handleDuplicateFormChange}
          preserve={false}
        >
          <Form.Item
            name="fieldLabel"
            label="* Field Label"
            rules={[
              {
                required: true,
                message: "Please enter a field label",
              },
              { min: 2, message: "Field label must be at least 2 characters" },
              { max: 50, message: "Field label must be at most 50 characters" },
            ]}
          >
            <Input placeholder="Enter field label" autoFocus />
          </Form.Item>
          <Form.Item label="Field Identifier">
            <Input
              value={duplicateIdentifier}
              disabled
              placeholder="Auto Generated & Used by API"
              style={{ color: "rgba(0, 0, 0, 0.45)" }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Field Modal */}
      <Modal
        title="Delete Field"
        open={isDeleteModalVisible}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          deleteForm.resetFields();
        }}
        onOk={() => deleteForm.submit()}
        confirmLoading={operationLoading}
        okType="danger"
        okText="Delete"
        destroyOnClose
      >
        <Form
          form={deleteForm}
          layout="vertical"
          onFinish={handleDelete}
          preserve={false}
        >
          <p>
            Are you sure you want to delete the field{" "}
            <strong>"{operationField?.label}"</strong>?
          </p>
          <p
            style={{ color: "#ff4d4f", fontSize: "14px", marginBottom: "16px" }}
          >
            This action cannot be undone and will permanently delete this field.
          </p>

          <Form.Item
            name="confirmText"
            label={`Type "DELETE" to confirm deletion`}
            rules={[
              { required: true, message: "Please type DELETE to confirm" },
              {
                validator: (_, value) =>
                  value === "DELETE"
                    ? Promise.resolve()
                    : Promise.reject(new Error("You must type DELETE exactly")),
              },
            ]}
          >
            <Input placeholder="Type DELETE to confirm" autoFocus />
          </Form.Item>
        </Form>
      </Modal>

      {/* Connection Setting Drawer */}
      <Drawer
        title={`Configure Relationship`}
        width={340}
        open={isConnectionSettingDrawer}
        onClose={() => {
          setIsConnectionSettingDrawer(false);
        }}
        destroyOnClose
      >
        <div>
          <Text>Relationship configuration drawer content will go here</Text>
        </div>
      </Drawer>
    </div>
  );
};

export default ModelPage;
