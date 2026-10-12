import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  Space,
  Empty,
  Drawer,
  Modal,
  Form,
  Input,
  message,
  Alert,
  Select,
  Card,
} from "antd";
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
import { useParams, useLocation, useNavigate } from "../../router/navigation";
import {
  useGetModelDetailsQuery,
  useGetOnlyModelsInfoQuery,
  useModelFieldOperationMutation,
  useRearrangeFieldSerialMutation,
  useUpdateModelMutation,
  Field_Operation_Type_Enum,
  UpdateModelTypeEnum,
} from "../../generated_gql/tanstack-query";
import {
  ContentContext,
  type ContentContextType,
} from "../../contexts/ContentContext";
import {
  buildFieldIdentifier,
  buildDuplicateIdentifier,
} from "../../utils/identifierBuilder";
import {
  dedupeFieldsByIdentifier,
  fieldRowId,
  fieldIdentifierFromSortableId,
  nestedSortableId,
  parentIdentifierFromSortableId,
  rootSortableId,
} from "../../utils/modelFields";
import type { FieldInfo, SubFieldInfo, DrawerParam } from "../../types/model";
import FieldContainer from "../../components/model/FieldContainer";
import RelationContainer from "../../components/model/RelationContainer";
import RelationshipConfigurationDrawer from "../../components/model/RelationshipConfigurationDrawer";
import SchemaOverlayBadge, {
  schemaOverlayTextStyle,
} from "../../components/model/SchemaOverlayBadge";
import RightSidebar from "../../components/model/RightSidebar";
import { useConsoleExtensions } from "../../contexts/ConsoleExtensionsContext";
import { SortableDragHandleProvider } from "../../contexts/SortableDragHandleContext";
import { useQueryClient } from "@tanstack/react-query";
import { invalidateModelQueries } from "../../lib/schemaCache";
import ConsolePageHeader from "../../components/console/ConsolePageHeader";
import "../../components/console/ConsoleShell.css";
import { CirclePlus, Settings } from "lucide-react";

const { Text, Title } = Typography;

interface SortableFieldProps {
  field: FieldInfo;
  value: React.ReactNode;
  sortableId: string;
}

const SortableField: React.FC<SortableFieldProps> = ({
  field,
  value,
  sortableId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <SortableDragHandleProvider
      value={{ setActivatorNodeRef, listeners, attributes }}
    >
      <div ref={setNodeRef} style={style}>
        {value}
      </div>
    </SortableDragHandleProvider>
  );
};

const ModelPage: React.FC = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(ContentContext) as ContentContextType | null;
  const { schemaDraftOverlay, onSchemaMutationCompleted } =
    useConsoleExtensions();

  const refreshSchemaView = async () => {
    hasLocalChanges.current = false;
    await onSchemaMutationCompleted?.();
  };

  // Get model name from ContentContext (set by left sidebar selection)
  const [resolvedModelName, setResolvedModelName] = useState<string>("");
  const isSinglePage = context?.state?.single_page || false;

  // Determine initial model name
  const initialModelName = context?.state?.target || params?.model || "";

  const [repeatedFieldIdentifier, setRepeatedFieldIdentifier] = useState("");
  const [isConnectionSettingDrawer, setIsConnectionSettingDrawer] =
    useState(false);
  const [selectedConnectionIndex, setSelectedConnectionIndex] = useState<
    number | null
  >(null);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [selectedFieldForEdit, setSelectedFieldForEdit] =
    useState<FieldInfo | null>(null);
  const [isEditingField, setIsEditingField] = useState(false);

  // Model settings drawer
  const [isModelSettingsDrawerVisible, setIsModelSettingsDrawerVisible] =
    useState(false);
  const [modelSettingsForm] = Form.useForm();
  const [modelUpdateLoading, setModelUpdateLoading] = useState(false);

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
  const { mutateAsync: modelFieldOperation } = useModelFieldOperationMutation();
  const { mutateAsync: rearrangeFieldSerial } = useRearrangeFieldSerialMutation();
  const { mutateAsync: updateModelMutation } = useUpdateModelMutation();

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
  const { data: allModelsData } = useGetOnlyModelsInfoQuery();

  // Resolve correct model name when no context (page reload)
  useEffect(() => {
    if (context?.state?.target) {
      // Use context if available (from sidebar click)
      setResolvedModelName(context.state.target);
    } else if (params?.model && schemaDraftOverlay?.hasDraft) {
      const urlModelName = params.model.toLowerCase();
      const overlayMatch = schemaDraftOverlay.models.find(
        (model) => model.name.toLowerCase() === urlModelName
      );
      if (overlayMatch?.name) {
        setResolvedModelName(overlayMatch.name);
      } else if (allModelsData?.projectModelsInfo) {
        const actualModel = allModelsData.projectModelsInfo.find(
          (model) => model?.name?.toLowerCase() === urlModelName
        );
        if (actualModel?.name) {
          setResolvedModelName(actualModel.name);
        } else {
          setResolvedModelName(params.model);
        }
      } else {
        setResolvedModelName(params.model);
      }
    } else if (params?.model && allModelsData?.projectModelsInfo) {
      // Resolve from URL parameter (page reload)
      const urlModelName = params.model.toLowerCase();
      const actualModel = allModelsData.projectModelsInfo.find(
        (model) => model?.name?.toLowerCase() === urlModelName
      );

      if (actualModel?.name) {
        setResolvedModelName(actualModel.name);
      } else {
        setResolvedModelName(params.model);
      }
    } else if (initialModelName) {
      setResolvedModelName(initialModelName);
    }
  }, [
    context?.state?.target,
    params?.model,
    allModelsData?.projectModelsInfo,
    initialModelName,
    schemaDraftOverlay,
  ]);

  // Check for type=new query parameter and open create modal
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get("type");

    if (typeParam === "new") {
      // Programmatically trigger the "Add Model" button in the sidebar
      // This uses the existing modal in ConsoleLayout to avoid conflicts
      const addModelButton = document.querySelector(
        "button:has(.anticon-plus)"
      );

      if (addModelButton) {
        (addModelButton as HTMLButtonElement).click();

        // Clean up the URL parameter after triggering the modal
        searchParams.delete("type");
        const newSearch = searchParams.toString();
        const newPath = newSearch
          ? `${location.pathname}?${newSearch}`
          : location.pathname;
        navigate(newPath, { replace: true });
      }
    }
  }, [location.search, location.pathname, navigate]);

  const overlayModel = schemaDraftOverlay?.getModelOverlay(resolvedModelName);
  const modelChangeKind =
    schemaDraftOverlay?.getModelChangeKind(resolvedModelName) ?? "live";
  const useOverlayDetails = Boolean(
    schemaDraftOverlay?.hasDraft &&
      overlayModel &&
      overlayModel.overlayMeta.kind !== "removed"
  );
  const isPublishedModel = Boolean(
    allModelsData?.projectModelsInfo?.some(
      (model) =>
        model?.name?.toLowerCase() === resolvedModelName.toLowerCase()
    )
  );
  const skipLiveModelDetails =
    !resolvedModelName ||
    useOverlayDetails ||
    modelChangeKind === "added" ||
    !isPublishedModel ||
    Boolean(
      schemaDraftOverlay?.enabled &&
        schemaDraftOverlay?.hasDraft &&
        schemaDraftOverlay.loading
    );

  const {
    data: currentModelInfo,
    isLoading: loading,
    error,
    refetch: refetchModelDetails,
  } = useGetModelDetailsQuery(
    { model_name: resolvedModelName },
    { enabled: !skipLiveModelDetails }
  );

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

  const modelInfo = useOverlayDetails
    ? overlayModel
    : currentModelInfo?.projectModelsInfo?.[0];
  const modelOverlayKind =
    overlayModel?.overlayMeta.kind ??
    schemaDraftOverlay?.getModelChangeKind(resolvedModelName) ??
    "live";
  const fields = useMemo(() => {
    const raw = (modelInfo?.fields || [])
      .filter((field): field is NonNullable<typeof field> => field !== null)
      .map((field) => ({
        ...field,
        serial: field.serial ?? 0,
      })) as FieldInfo[];
    return dedupeFieldsByIdentifier(raw);
  }, [modelInfo?.fields]);
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
      .map((f, idx) => rootSortableId(f, idx));
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
        type: Field_Operation_Type_Enum.Rename,
        model_name: resolvedModelName,
        field_name: operationField.identifier || "",
        new_name: renameIdentifier,
        parent_field: operationField.parent_field,
        single_page_model: isSinglePage,
      });
      message.success(
        `Field "${operationField.label}" renamed to "${values.fieldLabel}" successfully`
      );
      setIsRenameModalVisible(false);
      renameForm.resetFields();
      setRenameIdentifier("");
      await refreshSchemaView();
      if (!skipLiveModelDetails) {
        await refetchModelDetails();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to rename field";
      renameForm.setFields([
        {
          name: "fieldLabel",
          errors: [errorMessage],
        },
      ]);
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
        type: Field_Operation_Type_Enum.Duplicate,
        model_name: resolvedModelName,
        field_name: operationField.identifier || "",
        new_name: duplicateIdentifier,
        parent_field: operationField.parent_field,
        single_page_model: isSinglePage,
      });
      message.success(
        `Field "${operationField.label}" duplicated as "${values.fieldLabel}" successfully`
      );
      setIsDuplicateModalVisible(false);
      duplicateForm.resetFields();
      setDuplicateIdentifier("");
      await refreshSchemaView();
      if (!skipLiveModelDetails) {
        await refetchModelDetails();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to duplicate field";
      duplicateForm.setFields([
        {
          name: "fieldLabel",
          errors: [errorMessage],
        },
      ]);
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
        type: Field_Operation_Type_Enum.Delete,
        model_name: resolvedModelName,
        field_name: operationField.identifier || "",
        parent_field: operationField.parent_field,
        single_page_model: isSinglePage,
      });
      message.success(`Field "${operationField.label}" deleted successfully`);
      setIsDeleteModalVisible(false);
      deleteForm.resetFields();
      await refreshSchemaView();
      if (!skipLiveModelDetails) {
        await refetchModelDetails();
      }
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
        type: Field_Operation_Type_Enum.ChangeType,
        model_name: resolvedModelName,
        field_name: operationField.identifier || "",
        parent_field: operationField.parent_field,
        single_page_model: isSinglePage,
        changed_type: values.newFieldType,
      });
      message.success(
        `Field "${operationField.label}" type changed to "${values.newFieldType}" successfully`
      );
      setIsChangeTypeModalVisible(false);
      changeTypeForm.resetFields();
      await refreshSchemaView();
      if (!skipLiveModelDetails) {
        await refetchModelDetails();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change field type";
      changeTypeForm.setFields([
        {
          name: "newFieldType",
          errors: [errorMessage],
        },
      ]);
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle connection/relationship operations
  const openConnectionDrawer = (index: number) => {
    setSelectedConnectionIndex(index);
    setIsConnectionSettingDrawer(true);
  };

  // Recursive function to render field structure with sub-fields
  const renderSingleStructure = (
    field: FieldInfo,
    parentPath: string[] = [],
    repeatIdentifier?: string
  ): React.ReactNode => {
    const repeatedFieldId = repeatIdentifier || "_root";
    const fieldPath = [...parentPath, field.identifier || ""].filter(Boolean);

    // Prepare nested content for collapsible fields
    let nestedContent = null;
    if (field.field_type === "repeated" || field.field_type === "object") {
      const currentRepeatedFieldId = field.identifier || "";

      nestedContent = (
        <div>
          <SortableContext
            items={(field.sub_field_info || [])
              .filter((sf) => !!sf?.identifier)
              .map((sf, idx) =>
                nestedSortableId(field.identifier || "", sf!, idx)
              )}
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
                        className="model-drop-indicator"
                      />
                    ) : null;

                  return [
                    beforeIndicator,
                    <SortableField
                      key={fieldRowId(subFieldWithParent, sIdx)}
                      sortableId={nestedSortableId(
                        field.identifier || "",
                        subFieldWithParent,
                        sIdx
                      )}
                      field={subFieldWithParent}
                      value={renderSingleStructure(
                        subFieldWithParent,
                        fieldPath,
                        currentRepeatedFieldId
                      )}
                    />,
                    sIdx === arr.length - 1 &&
                    dropIndicator &&
                    dropIndicator.parentId === field.identifier &&
                    dropIndicator.index === arr.length ? (
                      <div
                        key={`child-indicator-end-${field.identifier}`}
                        className="model-drop-indicator"
                      />
                    ) : null,
                  ];
                })}
          </SortableContext>
          <Button
            type="primary"
            icon={<CirclePlus size={16} strokeWidth={1.75} />}
            className="model-nested-add-btn"
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
        overlayKind={
          schemaDraftOverlay?.getFieldOverlay(
            resolvedModelName,
            field.identifier || "",
            fieldPath.join(".")
          ).kind ?? "live"
        }
        draftVersionLabel={schemaDraftOverlay?.draftVersionLabel}
        disableActions={modelOverlayKind === "removed"}
        overlayPreviousLabel={
          schemaDraftOverlay?.getFieldOverlay(
            resolvedModelName,
            field.identifier || "",
            fieldPath.join(".")
          ).previousIdentifier
        }
      >
        {nestedContent}
      </FieldContainer>
    );
  };

  // Helper function to find field by identifier or sortable id
  const findFieldByIdentifier = (
    identifierOrSortableId: string,
    fieldList: FieldInfo[]
  ): FieldInfo | null => {
    const identifier = fieldIdentifierFromSortableId(identifierOrSortableId);
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
    identifierOrSortableId: string,
    fieldList: FieldInfo[]
  ): FieldInfo | null => {
    const parentFromSortable = parentIdentifierFromSortableId(
      identifierOrSortableId
    );
    if (parentFromSortable) {
      return (
        fieldList.find((field) => field.identifier === parentFromSortable) ??
        null
      );
    }

    const identifier = fieldIdentifierFromSortableId(identifierOrSortableId);
    for (const field of fieldList) {
      if (field.sub_field_info) {
        for (const subField of field.sub_field_info) {
          if (subField?.identifier === identifier) return field;
        }
      }
    }
    return null;
  };

  const resetDragState = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
    setActiveDragId(null);
    setDropIndicator(null);
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
      resetDragState();
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    const sourceList = localFields.length > 0 ? localFields : fields;

    // Find the fields
    const activeField = findFieldByIdentifier(activeId, sourceList);
    const overField = findFieldByIdentifier(overId, sourceList);
    const activeParent = findParentField(activeId, sourceList);
    const overParent = findParentField(overId, sourceList);

    if (!activeField || !overField) {
      resetDragState();
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

    if (!moveType) {
      message.warning(
        "Only one-level moves are allowed (parent ↔ child) or reordering within same level"
      );
      resetDragState();
      return;
    }

    const activeFieldIdentifier = fieldIdentifierFromSortableId(activeId);
    const overFieldIdentifier = fieldIdentifierFromSortableId(overId);

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
              (sf) => sf?.identifier === overFieldIdentifier
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
            (f) => f.identifier === overFieldIdentifier
          );
          const activeIndex = updatedFields.findIndex(
            (f) => f.identifier === activeFieldIdentifier
          );

          insertionIndex = overIndex;
          newPosition = overIndex;
        } else {
          // Child level reordering
          const parentField = updatedFields.find(
            (f) => f.identifier === activeParent?.identifier
          );
          if (parentField?.sub_field_info) {
            const overIndex = parentField.sub_field_info.findIndex(
              (sf) => sf?.identifier === overFieldIdentifier
            );
            const activeIndex = parentField.sub_field_info.findIndex(
              (sf) => sf?.identifier === activeFieldIdentifier
            );

            insertionIndex = overIndex;
            newPosition = overIndex;
          } else {
            newPosition = 0;
          }
        }
      }

      // Find and remove the active field from its current location
      let removedField: FieldInfo | null = null;

      // Remove from root level
      const rootIndex = updatedFields.findIndex(
        (f) => f.identifier === activeFieldIdentifier
      );
      if (rootIndex !== -1) {
        removedField = updatedFields.splice(rootIndex, 1)[0];
      }

      // Remove from sub-fields if not found in root
      if (!removedField) {
        for (const field of updatedFields) {
          if (field.sub_field_info) {
            const subIndex = field.sub_field_info.findIndex(
              (sf) => sf?.identifier === activeFieldIdentifier
            );
            if (subIndex !== -1) {
              removedField = field.sub_field_info.splice(subIndex, 1)[0];
              break;
            }
          }
        }
      }

      if (!removedField) {
        message.error("Could not find field to move");
        resetDragState();
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
        model_name: resolvedModelName,
        field_name: draggedFieldName,
        move_type: apiMoveType,
        new_position: newPosition,
        parent_id: parentId,
      });

      if (result.rearrangeSerialOfField) {
        hasLocalChanges.current = false;
        await invalidateModelQueries(queryClient, resolvedModelName);
      }

      message.success("Field moved successfully");
    } catch (error) {
      console.error("Error moving field:", error);
      message.error("Failed to move field");
      setLocalFields(fields);
      hasLocalChanges.current = false;
    } finally {
      resetDragState();
    }
  };

  // Check if there are no models at all
  const hasOverlayModels =
    schemaDraftOverlay?.hasDraft && schemaDraftOverlay.models.length > 0;
  if (
    !hasOverlayModels &&
    allModelsData?.projectModelsInfo &&
    allModelsData.projectModelsInfo.length === 0
  ) {
    return (
      <div className="console-page-body">
        <div className="console-mb-xl">
          <Title level={4} className="console-title-flush console-mb-xs">
            Model
          </Title>
          <Text type="secondary">Design and configure your project schema</Text>
        </div>

        <Card className="console-empty-state-card">
          <Empty
            description={
              <div>
                <div className="console-empty-title">
                  No models found
                </div>
                <div className="console-empty-desc">
                  Create your first model by clicking "+ Add Model" button on
                  the left sidebar
                </div>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            {/*  <Button
              type="primary"
              icon={<CirclePlus size={16} strokeWidth={1.75} />}
              size="large"
              onClick={() => {
                // Navigate to project creation or model creation
                window.location.href = "/projects/new";
              }}
            >
              Create Your First Model
            </Button> */}
          </Empty>
        </Card>
      </div>
    );
  }

  const pageLoading = useOverlayDetails
    ? schemaDraftOverlay?.loading && !overlayModel
    : loading;

  if (pageLoading) {
    return (
      <div className="console-center-pad--lg">
        <div>Loading model details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="console-center-pad--lg">
        <div>Error loading model: {error instanceof Error ? error.message : "Unknown error"}</div>
      </div>
    );
  }

  return (
    <div className="console-scroll-fill">
      <ConsolePageHeader
        title={
          <>
            {overlayModel?.overlayMeta.previousName ? (
              <>
                <Text delete type="secondary">
                  {overlayModel.overlayMeta.previousName.charAt(0).toUpperCase() +
                    overlayModel.overlayMeta.previousName.slice(1)}
                </Text>
                {" → "}
              </>
            ) : null}
            {resolvedModelName
              ? resolvedModelName.charAt(0).toUpperCase() +
                resolvedModelName.slice(1)
              : ""}
            <SchemaOverlayBadge
              kind={modelOverlayKind}
              draftVersionLabel={schemaDraftOverlay?.draftVersionLabel}
            />
          </>
        }
        titleStyle={schemaOverlayTextStyle(modelOverlayKind)}
        badge={isSinglePage ? "Single Record" : "Multi Record"}
        description="Design and configure the schema for this model."
        actions={
          <Button
            type="text"
            icon={<Settings size={16} strokeWidth={1.75} />}
            onClick={() => setIsModelSettingsDrawerVisible(true)}
            title="Model Settings"
          />
        }
      />

      {/* Main Content */}
      <div className="console-page-body">
        <Row gutter={[24, 24]}>
          {/* Left Column - Schema Fields */}
          <Col span={connections.length > 0 ? 12 : 24}>
            <div className="console-mb-lg">
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
                  const overFieldIdentifier =
                    fieldIdentifierFromSortableId(overId);
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
                      (f) => f.identifier === overFieldIdentifier
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
                          (sf) => sf?.identifier === overFieldIdentifier
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
                          (sf) => sf?.identifier === overFieldIdentifier
                        ) ?? -1;
                      index =
                        overIdx >= 0
                          ? overIdx
                          : target?.sub_field_info?.length || 0;
                    }
                  } else {
                    const overIndex = sourceList.findIndex(
                      (f) => f.identifier === overFieldIdentifier
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
                            className="model-drop-indicator"
                          />
                        ) : null;

                      return [
                        beforeIndicator,
                        <SortableField
                          key={fieldRowId(field as FieldInfo, idx)}
                          sortableId={rootSortableId(field as FieldInfo, idx)}
                          field={field as FieldInfo}
                          value={renderSingleStructure(
                            field as FieldInfo,
                            [],
                            repeatedFieldIdentifier
                          )}
                        />,
                        idx === arr.length - 1 &&
                        dropIndicator &&
                        dropIndicator.parentId === null &&
                        dropIndicator.index === arr.length ? (
                          <div
                            key={`root-indicator-end`}
                            className="model-drop-indicator"
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
                      <div className="model-drag-overlay">
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
                className="console-mt-xl"
              />
            )}

            <Button
              type="primary"
              icon={<CirclePlus size={16} strokeWidth={1.75} />}
              className="console-mt-lg"
              data-tour="add-fields-button"
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
              <div className="console-mb-lg">
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
                  overlayKind={
                    schemaDraftOverlay?.getConnectionOverlay(
                      resolvedModelName,
                      connection
                    ).kind ?? "live"
                  }
                  draftVersionLabel={schemaDraftOverlay?.draftVersionLabel}
                  onMutationCompleted={refreshSchemaView}
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
        onFieldCreated={async () => {
          hasLocalChanges.current = false;
          await refreshSchemaView();
          if (!skipLiveModelDetails) {
            await refetchModelDetails();
          }
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
            className="console-mb-md"
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
              className="console-text-disabled"
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
              className="console-text-disabled"
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
          <p className="console-text-danger">
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
            className="console-mb-md"
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

      <RelationshipConfigurationDrawer
        open={isConnectionSettingDrawer}
        modelName={resolvedModelName}
        connection={
          selectedConnectionIndex == null
            ? null
            : connections[selectedConnectionIndex] ?? null
        }
        onClose={() => {
          setIsConnectionSettingDrawer(false);
          setSelectedConnectionIndex(null);
        }}
        onStaged={refreshSchemaView}
      />

      {/* Model Settings Drawer */}
      <Drawer
        title="Model Settings"
        width={400}
        placement="right"
        open={isModelSettingsDrawerVisible}
        onClose={() => {
          setIsModelSettingsDrawerVisible(false);
          modelSettingsForm.resetFields();
        }}
        destroyOnClose
      >
        <Form
          form={modelSettingsForm}
          layout="vertical"
          onFinish={async () => {
            setModelUpdateLoading(true);
            try {
              await updateModelMutation({
                type: UpdateModelTypeEnum.Update,
                model_name: resolvedModelName,
              });
              message.success("Model settings updated successfully");
              setIsModelSettingsDrawerVisible(false);
              modelSettingsForm.resetFields();
              await refreshSchemaView();
              if (!skipLiveModelDetails) {
                await refetchModelDetails();
              }
            } catch (error: unknown) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "Failed to update model";
              message.error(`Failed to update model: ${errorMessage}`);
            } finally {
              setModelUpdateLoading(false);
            }
          }}
        >
          <Form.Item label="Model Name">
            <Input
              value={modelInfo?.name || ""}
              disabled
              placeholder="Model name"
              className="console-text-disabled"
            />
            <div className="console-help-text">
              Use the rename model option to change the model name
            </div>
          </Form.Item>

          <Form.Item label="Single Page">
            <div className="console-inline-row">
              <Text>{modelInfo?.single_page ? "Yes" : "No"}</Text>
              <Text type="secondary" className="console-text-xs">
                (Fixed, non-toggleable)
              </Text>
            </div>
          </Form.Item>

          <Form.Item label="Single Page UUID">
            <Input
              value={modelInfo?.single_page_uuid || "N/A"}
              disabled
              placeholder="Auto-generated UUID"
              className="console-text-disabled"
            />
          </Form.Item>

          <Form.Item label="System Generated">
            <div className="console-inline-row">
              <Text>{modelInfo?.system_generated ? "Yes" : "No"}</Text>
              <Text type="secondary" className="console-text-xs">
                (Non-editable)
              </Text>
            </div>
          </Form.Item>

          <div className="console-form-footer">
            <Space>
              <Button
                onClick={() => {
                  setIsModelSettingsDrawerVisible(false);
                  modelSettingsForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={modelUpdateLoading}
              >
                Update Model
              </Button>
            </Space>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default ModelPage;
