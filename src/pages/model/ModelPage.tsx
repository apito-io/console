import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
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
  Alert,
  Select,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
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
  useGetOnlyModelsInfoQuery,
  useModelFieldOperationMutation,
  useRearrangeFieldSerialMutation,
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
import { ApolloError } from "@apollo/client";

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
  const [resolvedModelName, setResolvedModelName] = useState<string>("");
  const isSinglePage = context?.state?.single_page || false;

  // Determine initial model name
  const initialModelName = context?.state?.target || params?.model || "";

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
  const [isChangeTypeModalVisible, setIsChangeTypeModalVisible] =
    useState(false);
  const [operationField, setOperationField] = useState<FieldInfo | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [renameForm] = Form.useForm();
  const [duplicateForm] = Form.useForm();
  const [deleteForm] = Form.useForm();
  const [changeTypeForm] = Form.useForm();

  // Auto-generated identifiers for rename and duplicate
  const [renameIdentifier, setRenameIdentifier] = useState("");
  const [duplicateIdentifier, setDuplicateIdentifier] = useState("");

  // Field operation mutations
  const [modelFieldOperation] = useModelFieldOperationMutation();
  const [rearrangeFieldSerial] = useRearrangeFieldSerialMutation();

  // Local fields state for DnD operations
  const [localFields, setLocalFields] = useState<FieldInfo[]>([]);

  // Drag state management
  const [isDragging, setIsDragging] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    parentId: string | null;
    index: number;
  } | null>(null);
  const isDraggingRef = useRef(false);
  const hasLocalChanges = useRef(false);

  // Fetch all models to resolve model name on page reload
  const { data: allModelsData } = useGetOnlyModelsInfoQuery({
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  // Resolve correct model name when no context (page reload)
  useEffect(() => {
    if (context?.state?.target) {
      // Use context if available (from sidebar click)
      setResolvedModelName(context.state.target);
    } else if (params?.model && allModelsData?.projectModelsInfo) {
      // Resolve from URL parameter (page reload)
      const urlModelName = params.model.toLowerCase();
      const actualModel = allModelsData.projectModelsInfo.find(
        (model) => model?.name?.toLowerCase() === urlModelName
      );

      if (actualModel?.name) {
        setResolvedModelName(actualModel.name);
        console.log("Resolved model name from URL:", {
          urlModelName,
          actualModelName: actualModel.name,
        });
      } else {
        setResolvedModelName(params.model); // Fallback to URL param
      }
    } else if (initialModelName) {
      setResolvedModelName(initialModelName);
    }
  }, [
    context?.state?.target,
    params?.model,
    allModelsData?.projectModelsInfo,
    initialModelName,
  ]);

  // Fetch model generation data using the GraphQL query
  console.log("resolve model name", resolvedModelName);
  const {
    data: currentModelInfo,
    loading,
    error,
  } = useGetModelDetailsQuery({
    variables: {
      model_name: resolvedModelName,
    },
    skip: !resolvedModelName,
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

  // Create a stable dependency for fields
  const fieldsKey = useMemo(() => {
    return fields.map((f) => `${f.identifier}-${f.serial}`).join("|");
  }, [fields]);

  // Initialize local fields when fields change (but not during DnD operations)

  useEffect(() => {
    if (!isDragging && !isDraggingRef.current && !hasLocalChanges.current) {
      setLocalFields(fields);
    }
  }, [fieldsKey, isDragging]);

  // Root-level sortable items only. Nested lists will have their own SortableContext.
  const getRootSortableItems = (fieldList: FieldInfo[]): string[] => {
    return fieldList
      .filter((f) => !!f?.identifier)
      .map((f) => f.identifier as string);
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
        const duplicateLabel = `${
          data.field.label || data.field.identifier || ""
        }_copy`;
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
      case "changeType":
        setOperationField(data.field);
        setIsChangeTypeModalVisible(true);
        // Initialize the form with current field type
        changeTypeForm.setFieldsValue({
          newFieldType: data.field.field_type || "text",
        });
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
      setRenameIdentifier(label);
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
      //const identifier = buildDuplicateIdentifier(label);
      setDuplicateIdentifier(label);
    } else {
      setDuplicateIdentifier("");
    }
  };

  // Handle field rename
  const handleRename = async (values: { fieldLabel: string }) => {
    if (!operationField) return;

    setOperationLoading(true);
    try {
      await modelFieldOperation({
        variables: {
          type: Field_Operation_Type_Enum.Rename,
          model_name: resolvedModelName,
          field_name: operationField.identifier || "",
          new_name: renameIdentifier, // Use auto-generated identifier
          parent_field: operationField.parent_field,
          single_page_model: isSinglePage,
        },
        onError: (error: ApolloError) => {
          console.log(error.message);
          // Set the error as a form field validation error
          renameForm.setFields([
            {
              name: "fieldLabel",
              errors: [error.message],
            },
          ]);
        },
        onCompleted: (_) => {
          message.success(
            `Field "${operationField.label}" renamed to "${values.fieldLabel}" successfully`
          );
          setIsRenameModalVisible(false);
          renameForm.resetFields();
          setRenameIdentifier("");
          // Refresh the page to update the model data
          window.location.reload();
        },
      });
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
      await modelFieldOperation({
        variables: {
          type: Field_Operation_Type_Enum.Duplicate,
          model_name: resolvedModelName,
          field_name: operationField.identifier || "",
          new_name: duplicateIdentifier, // Use auto-generated identifier
          parent_field: operationField.parent_field,
          single_page_model: isSinglePage,
        },
        onError: (error: ApolloError) => {
          console.log(error.message);
          // Set the error as a form field validation error
          duplicateForm.setFields([
            {
              name: "fieldLabel",
              errors: [error.message],
            },
          ]);
        },
        onCompleted: (_) => {
          message.success(
            `Field "${operationField.label}" duplicated as "${values.fieldLabel}" successfully`
          );
          setIsDuplicateModalVisible(false);
          duplicateForm.resetFields();
          setDuplicateIdentifier("");
          // Refresh the page to update the model data
          window.location.reload();
        },
      });
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
      await modelFieldOperation({
        variables: {
          type: Field_Operation_Type_Enum.Delete,
          model_name: resolvedModelName,
          field_name: operationField.identifier || "",
          parent_field: operationField.parent_field,
          single_page_model: isSinglePage,
          is_relation: false, // This is a field, not a relation
        },
        onError: (error: ApolloError) => {
          console.log(error.message);
          message.error(error.message);
        },
        onCompleted: (_) => {
          message.success(
            `Field "${operationField.label}" deleted successfully`
          );
          setIsDeleteModalVisible(false);
          deleteForm.resetFields();
          // Refresh the page to update the model data
          window.location.reload();
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete field";
      message.error(errorMessage);
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle field change type
  const handleChangeType = async (values: { newFieldType: string }) => {
    if (!operationField) return;

    setOperationLoading(true);
    try {
      await modelFieldOperation({
        variables: {
          type: Field_Operation_Type_Enum.ChangeType,
          model_name: resolvedModelName,
          field_name: operationField.identifier || "",
          parent_field: operationField.parent_field,
          single_page_model: isSinglePage,
          is_relation: false, // This is a field, not a relation
          changed_type: values.newFieldType, // Use the new changed_type parameter
        },
        onError: (error: ApolloError) => {
          console.log(error.message);
          // Set the error as a form field validation error
          changeTypeForm.setFields([
            {
              name: "newFieldType",
              errors: [error.message],
            },
          ]);
        },
        onCompleted: (_) => {
          message.success(
            `Field "${operationField.label}" type changed to "${values.newFieldType}" successfully`
          );
          setIsChangeTypeModalVisible(false);
          changeTypeForm.resetFields();
          // Refresh the page to update the model data
          window.location.reload();
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change field type";
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
    if (field.field_type === "repeated" || field.field_type === "object") {
      const currentRepeatedFieldId = field.identifier || "";

      nestedContent = (
        <div>
          <SortableContext
            items={(field.sub_field_info || [])
              .filter((sf) => !!sf?.identifier)
              .map((sf) => sf!.identifier as string)}
            strategy={verticalListSortingStrategy}
          >
            {field.sub_field_info?.length &&
              field.sub_field_info
                .slice()
                .sort(
                  (a: SubFieldInfo, b: SubFieldInfo) =>
                    (a.serial || 0) - (b.serial || 0)
                )
                .flatMap((subField: SubFieldInfo, sIdx: number, arr) => {
                  if (!subField?.identifier) return null;

                  const subFieldWithParent = {
                    ...subField,
                    parent_field: field.identifier,
                  };

                  const beforeIndicator =
                    dropIndicator &&
                    dropIndicator.parentId === field.identifier &&
                    dropIndicator.index === sIdx ? (
                      <div
                        key={`child-indicator-${field.identifier}-${sIdx}`}
                        style={{
                          height: 6,
                          background: token.colorPrimary,
                          borderRadius: 3,
                          margin: "6px 4px",
                          opacity: 0.35,
                        }}
                      />
                    ) : null;

                  return [
                    beforeIndicator,
                    <SortableField
                      key={subField.identifier}
                      field={subFieldWithParent}
                      value={renderSingleStructure(
                        subFieldWithParent,
                        currentRepeatedFieldId
                      )}
                    />,
                    sIdx === arr.length - 1 &&
                    dropIndicator &&
                    dropIndicator.parentId === field.identifier &&
                    dropIndicator.index === arr.length ? (
                      <div
                        key={`child-indicator-end-${field.identifier}`}
                        style={{
                          height: 6,
                          background: token.colorPrimary,
                          borderRadius: 3,
                          margin: "6px 4px",
                          opacity: 0.35,
                        }}
                      />
                    ) : null,
                  ];
                })}
          </SortableContext>
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

  // Helper function to find field by identifier
  const findFieldByIdentifier = (
    identifier: string,
    fieldList: FieldInfo[]
  ): FieldInfo | null => {
    for (const field of fieldList) {
      if (field.identifier === identifier) return field;
      if (field.sub_field_info) {
        for (const subField of field.sub_field_info) {
          if (subField?.identifier === identifier) return subField;
        }
      }
    }
    return null;
  };

  // Helper function to find parent field
  const findParentField = (
    identifier: string,
    fieldList: FieldInfo[]
  ): FieldInfo | null => {
    for (const field of fieldList) {
      if (field.sub_field_info) {
        for (const subField of field.sub_field_info) {
          if (subField?.identifier === identifier) return field;
        }
      }
    }
    return null;
  };

  const onSortStart = (event?: any) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    if (event && event.active && event.active.id) {
      setActiveDragId(event.active.id as string);
    }
  };

  const onSortEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active.id || !over?.id || active.id === over.id) {
      setIsDragging(false);
      return;
    }

    const activeId = active.id as string;
    setActiveDragId(null);
    const overId = over.id as string;

    console.log("DnD Event:", { activeId, overId });

    // Find the fields
    const activeField = findFieldByIdentifier(activeId, fields);
    const overField = findFieldByIdentifier(overId, fields);
    const activeParent = findParentField(activeId, fields);
    const overParent = findParentField(overId, fields);

    console.log("Found fields:", {
      activeField,
      overField,
      activeParent,
      overParent,
    });

    if (!activeField || !overField) {
      console.log("Missing fields, returning");
      return;
    }

    // Determine move type
    // Consider drops directly on a parent container (object/repeated) as parent_to_child
    const overIsContainer =
      (overField?.field_type === "object" ||
        overField?.field_type === "repeated") &&
      true;

    let moveType: "child_to_parent" | "parent_to_child" | "reorder" | null =
      null;
    // Target parent identifier (used for parent_to_child, including cross-parent moves)
    let targetParentIdentifier: string | null = null;

    if (activeParent && !overParent && !overIsContainer) {
      // Moving from child to parent (root level)
      moveType = "child_to_parent";
    } else if (!activeParent && (overParent || overIsContainer)) {
      // Moving a root field into a parent's children. Allow dropping on either a child of the parent
      // or directly on the parent container itself
      moveType = "parent_to_child";
      targetParentIdentifier = overIsContainer
        ? overField?.identifier || null
        : overParent?.identifier || null;
    } else if (
      activeParent &&
      overParent &&
      activeParent.identifier === overParent.identifier
    ) {
      // Reordering within same child level
      moveType = "reorder";
    } else if (activeParent && (overParent || overIsContainer)) {
      // Moving a child under a different parent (cross-parent move)
      moveType = "parent_to_child";
      targetParentIdentifier = overIsContainer
        ? overField?.identifier || null
        : overParent?.identifier || null;
    } else if (!activeParent && !overParent) {
      // Reordering within root level
      moveType = "reorder";
    }

    console.log("Move type:", moveType);

    // Allow one-level moves and reordering
    if (!moveType) {
      message.warning(
        "Only one-level moves are allowed (parent ↔ child) or reordering within same level"
      );
      return;
    }

    try {
      // Create a deep copy of local fields to modify
      const updatedFields = JSON.parse(
        JSON.stringify(localFields)
      ) as FieldInfo[];

      // Calculate indices and insertion position BEFORE removing the field
      let newPosition: number;
      let insertionIndex: number = -1;

      if (moveType === "parent_to_child") {
        // Moving to child - position is the end of the child's sub_fields
        if (overIsContainer) {
          newPosition = overField.sub_field_info?.length || 0;
        } else if (overParent) {
          const parentField = (
            localFields.length > 0 ? localFields : fields
          ).find((f) => f.identifier === overParent.identifier);
          if (parentField?.sub_field_info) {
            const overIndex = parentField.sub_field_info.findIndex(
              (sf) => sf?.identifier === overId
            );
            insertionIndex = overIndex;
            newPosition = overIndex;
          } else {
            newPosition = 0;
          }
        } else {
          newPosition = 0;
        }
      } else if (moveType === "child_to_parent") {
        // Moving to parent - position is the end of root fields
        newPosition = updatedFields.length;
      } else {
        // Reordering - find the position of the over field
        if (!activeParent && !overParent) {
          // Root level reordering
          const overIndex = updatedFields.findIndex(
            (f) => f.identifier === overId
          );
          const activeIndex = updatedFields.findIndex(
            (f) => f.identifier === activeId
          );

          insertionIndex = overIndex;
          newPosition = overIndex;

          console.log("Position calculation (root):", {
            activeIndex,
            overIndex,
            insertionIndex,
            activeId,
            overId,
            newPosition,
            dragDirection:
              activeIndex < overIndex ? "top-to-bottom" : "bottom-to-top",
          });
        } else {
          // Child level reordering
          const parentField = updatedFields.find(
            (f) => f.identifier === activeParent?.identifier
          );
          if (parentField?.sub_field_info) {
            const overIndex = parentField.sub_field_info.findIndex(
              (sf) => sf?.identifier === overId
            );
            const activeIndex = parentField.sub_field_info.findIndex(
              (sf) => sf?.identifier === activeId
            );

            insertionIndex = overIndex;
            newPosition = overIndex;

            console.log("Position calculation (child):", {
              activeIndex,
              overIndex,
              insertionIndex,
              activeId,
              overId,
              newPosition,
              dragDirection:
                activeIndex < overIndex ? "top-to-bottom" : "bottom-to-top",
            });
          } else {
            newPosition = 0;
          }
        }
      }

      // Find and remove the active field from its current location
      let removedField: FieldInfo | null = null;

      // Remove from root level
      const rootIndex = updatedFields.findIndex(
        (f) => f.identifier === activeId
      );
      if (rootIndex !== -1) {
        removedField = updatedFields.splice(rootIndex, 1)[0];
      }

      // Remove from sub-fields if not found in root
      if (!removedField) {
        for (const field of updatedFields) {
          if (field.sub_field_info) {
            const subIndex = field.sub_field_info.findIndex(
              (sf) => sf?.identifier === activeId
            );
            if (subIndex !== -1) {
              removedField = field.sub_field_info.splice(subIndex, 1)[0];
              break;
            }
          }
        }
      }

      if (!removedField) {
        console.error("Could not find field to move");
        return;
      }

      // Add the field to its new location
      if (moveType === "parent_to_child") {
        // Moving to child - add to the target parent's sub_field_info
        const targetId =
          (targetParentIdentifier ?? null) ||
          (overField.identifier ?? null) ||
          (overParent?.identifier ?? null);

        if (targetId) {
          const targetParentField = updatedFields.find(
            (f) => f.identifier === targetId
          );
          if (targetParentField) {
            if (!targetParentField.sub_field_info) {
              targetParentField.sub_field_info = [];
            }
            removedField.parent_field = targetParentField.identifier;
            if (
              typeof insertionIndex === "number" &&
              insertionIndex >= 0 &&
              insertionIndex <= targetParentField.sub_field_info.length
            ) {
              targetParentField.sub_field_info.splice(
                insertionIndex,
                0,
                removedField
              );
            } else {
              targetParentField.sub_field_info.push(removedField);
            }
          }
        }
      } else if (moveType === "child_to_parent") {
        // Moving to parent - add to root level
        removedField.parent_field = undefined;
        updatedFields.push(removedField);
      } else if (moveType === "reorder") {
        // Reordering within same level
        if (!activeParent && !overParent) {
          // Reordering within root level
          if (insertionIndex !== -1) {
            updatedFields.splice(insertionIndex, 0, removedField);
          } else {
            updatedFields.push(removedField);
          }
        } else if (activeParent && overParent) {
          // Reordering within child level
          const parentField = updatedFields.find(
            (f) => f.identifier === activeParent.identifier
          );
          if (parentField && parentField.sub_field_info) {
            if (insertionIndex !== -1) {
              parentField.sub_field_info.splice(
                insertionIndex,
                0,
                removedField
              );
            } else {
              parentField.sub_field_info.push(removedField);
            }
          }
        }
      }

      // Update serial numbers in the reordered fields (including nested fields)
      const updateSerials = (fieldList: FieldInfo[]) => {
        fieldList.forEach((field, index) => {
          if (field) {
            field.serial = index;
            // Update nested fields if they exist
            if (field.sub_field_info && field.sub_field_info.length > 0) {
              field.sub_field_info.forEach((subField, subIndex) => {
                if (subField) {
                  subField.serial = subIndex;
                }
              });
            }
          }
        });
      };

      updateSerials(updatedFields);

      // Update local fields for UI immediately
      setLocalFields(updatedFields);
      hasLocalChanges.current = true;

      // Determine move parameters
      const draggedFieldName = activeField.identifier!;

      // Calculate parent_id based on move type
      let parentId: string | null = null;
      if (moveType === "parent_to_child") {
        // Moving to child - parent_id should be the target field's identifier
        parentId =
          (targetParentIdentifier ?? null) ||
          (overField.identifier ?? null) ||
          (overParent?.identifier ?? null);
      } else if (moveType === "child_to_parent") {
        // Moving to parent - parent_id should be null (root level)
        parentId = null;
      } else if (moveType === "reorder") {
        // Reordering within same level - parent_id should be the current parent
        parentId = overParent?.identifier || null;
      }

      // Map move type to API format
      let apiMoveType: string;
      switch (moveType) {
        case "child_to_parent":
          apiMoveType = "child_to_parent";
          break;
        case "parent_to_child":
          apiMoveType = "parent_to_child";
          break;
        case "reorder":
          apiMoveType = "reorder";
          break;
        default:
          apiMoveType = "reorder";
      }

      const result = await rearrangeFieldSerial({
        variables: {
          model_name: resolvedModelName,
          field_name: draggedFieldName,
          move_type: apiMoveType,
          new_position: newPosition,
          parent_id: parentId,
        },
      });

      // Update the GraphQL cache with the new field order
      if (result.data?.rearrangeSerialOfField) {
        // Keep the local changes and don't sync with GraphQL for now
        // The cache will be updated on next page load or manual refresh
      }

      message.success("Field moved successfully");
    } catch (error) {
      console.error("Error moving field:", error);
      message.error("Failed to move field");
    } finally {
      setIsDragging(false);
      isDraggingRef.current = false;
      setDropIndicator(null);
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
              {resolvedModelName}
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
              <DndContext
                collisionDetection={closestCorners}
                sensors={sensors}
                modifiers={[restrictToVerticalAxis]}
                onDragStart={onSortStart}
                onDragOver={(event) => {
                  const { active, over } = event as any;
                  if (!active?.id || !over?.id) {
                    setDropIndicator(null);
                    return;
                  }

                  const activeId = active.id as string;
                  const overId = over.id as string;
                  const sourceList =
                    localFields.length > 0 ? localFields : fields;

                  const activeParent = findParentField(activeId, sourceList);
                  const overField = findFieldByIdentifier(overId, sourceList);
                  const overParent = findParentField(overId, sourceList);
                  const overIsContainer =
                    (overField?.field_type === "object" ||
                      overField?.field_type === "repeated") &&
                    true;

                  let parentId: string | null = null;
                  let index = 0;

                  if (activeParent && !overParent && !overIsContainer) {
                    const overIndex = sourceList.findIndex(
                      (f) => f.identifier === overId
                    );
                    parentId = null;
                    index = overIndex >= 0 ? overIndex : sourceList.length;
                  } else if (!activeParent && (overParent || overIsContainer)) {
                    parentId = overIsContainer
                      ? overField?.identifier || null
                      : overParent?.identifier || null;
                    if (overIsContainer) {
                      const target = sourceList.find(
                        (f) => f.identifier === parentId!
                      );
                      index = target?.sub_field_info?.length || 0;
                    } else {
                      const target = sourceList.find(
                        (f) => f.identifier === parentId!
                      );
                      const overIdx =
                        target?.sub_field_info?.findIndex(
                          (sf) => sf?.identifier === overId
                        ) ?? -1;
                      index =
                        overIdx >= 0
                          ? overIdx
                          : target?.sub_field_info?.length || 0;
                    }
                  } else if (activeParent && (overParent || overIsContainer)) {
                    parentId = overIsContainer
                      ? overField?.identifier || null
                      : overParent?.identifier || null;
                    const target = sourceList.find(
                      (f) => f.identifier === parentId!
                    );
                    if (overIsContainer) {
                      index = target?.sub_field_info?.length || 0;
                    } else {
                      const overIdx =
                        target?.sub_field_info?.findIndex(
                          (sf) => sf?.identifier === overId
                        ) ?? -1;
                      index =
                        overIdx >= 0
                          ? overIdx
                          : target?.sub_field_info?.length || 0;
                    }
                  } else {
                    const overIndex = sourceList.findIndex(
                      (f) => f.identifier === overId
                    );
                    parentId = null;
                    index = overIndex >= 0 ? overIndex : sourceList.length;
                  }

                  setDropIndicator({ parentId, index });
                }}
                onDragEnd={onSortEnd}
              >
                <SortableContext
                  items={getRootSortableItems(
                    localFields.length > 0 ? localFields : fields
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  {(localFields.length > 0 ? localFields : fields)
                    .slice()
                    .sort((a, b) => (a?.serial || 0) - (b?.serial || 0))
                    .flatMap((field, idx, arr) => {
                      if (!field?.identifier) return null;
                      const beforeIndicator =
                        dropIndicator &&
                        dropIndicator.parentId === null &&
                        dropIndicator.index === idx ? (
                          <div
                            key={`root-indicator-${idx}`}
                            style={{
                              height: 6,
                              background: token.colorPrimary,
                              borderRadius: 3,
                              margin: "6px 4px",
                              opacity: 0.35,
                            }}
                          />
                        ) : null;

                      return [
                        beforeIndicator,
                        <SortableField
                          key={field.identifier}
                          field={field as FieldInfo}
                          value={renderSingleStructure(
                            field as FieldInfo,
                            repeatedFieldIdentifier
                          )}
                        />,
                        idx === arr.length - 1 &&
                        dropIndicator &&
                        dropIndicator.parentId === null &&
                        dropIndicator.index === arr.length ? (
                          <div
                            key={`root-indicator-end`}
                            style={{
                              height: 6,
                              background: token.colorPrimary,
                              borderRadius: 3,
                              margin: "6px 4px",
                              opacity: 0.35,
                            }}
                          />
                        ) : null,
                      ];
                    })}
                </SortableContext>
                {/* Drag preview overlay for cross-container feedback */}
                <DragOverlay>
                  {(() => {
                    const sourceList =
                      localFields.length > 0 ? localFields : fields;
                    const dragged = findFieldByIdentifier(
                      activeDragId || "",
                      sourceList
                    );
                    if (!dragged) return null;
                    return (
                      <div
                        style={{
                          padding: "8px 12px",
                          background: "#fff",
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderRadius: 8,
                          boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                          fontSize: 14,
                        }}
                      >
                        {dragged.label || dragged.identifier}
                      </div>
                    );
                  })()}
                </DragOverlay>
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
                  modelName={resolvedModelName}
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
        modelName={resolvedModelName}
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
          <Alert
            message="Warning"
            description="Renaming a field will update all references to this field. This action will affect existing field content and cannot be undone."
            type="warning"
            showIcon
            style={{ marginBottom: "16px" }}
          />

          <Form.Item
            name="fieldLabel"
            label="Field Label"
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
            label="Field Label"
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
          {/*           <Form.Item label="Field Identifier">
            <Input
              value={duplicateIdentifier}
              disabled
              placeholder="Auto Generated & Used by API"
              style={{ color: "rgba(0, 0, 0, 0.45)" }}
            />
          </Form.Item> */}
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

      {/* Change Type Field Modal */}
      <Modal
        title={`Change Field Type: ${operationField?.label || ""}`}
        open={isChangeTypeModalVisible}
        onCancel={() => {
          setIsChangeTypeModalVisible(false);
          changeTypeForm.resetFields();
        }}
        onOk={() => changeTypeForm.submit()}
        confirmLoading={operationLoading}
        okText="Change Type"
        destroyOnClose
      >
        <Form
          form={changeTypeForm}
          layout="vertical"
          onFinish={handleChangeType}
          preserve={false}
        >
          <Alert
            message="Warning"
            description="Changing the field type will remove all previous data for this field and will reset the Field Validation Settings and index. This action cannot be undone."
            type="warning"
            showIcon
            style={{ marginBottom: "16px" }}
          />

          <Form.Item
            name="newFieldType"
            label="New Field Type"
            rules={[{ required: true, message: "Please select a field type" }]}
          >
            <Select placeholder="Select field type" autoFocus>
              <Select.Option value="text">Text Field</Select.Option>
              <Select.Option value="multiline">Rich Text Field</Select.Option>
              <Select.Option value="number">Number Field</Select.Option>
              <Select.Option value="boolean">Boolean Field</Select.Option>
              <Select.Option value="date">Date Field</Select.Option>
              <Select.Option value="media">Media Field</Select.Option>
              <Select.Option value="list">List Field</Select.Option>
              <Select.Option value="object">Object Field</Select.Option>
              <Select.Option value="repeated">Repeated Field</Select.Option>
            </Select>
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
