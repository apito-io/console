import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useContext, useEffect, useRef, useMemo } from "react";
import { Drawer, Form, Input, Button, Checkbox, Select, InputNumber, message, Typography, } from "antd";
import { capitalize } from "lodash";
import pluralize from "pluralize";
import { ContentContext } from "../../contexts/ContentContext";
import { useConsoleExtensions } from "../../contexts/ConsoleExtensionsContext";
import { buildFieldIdentifier } from "../../utils/identifierBuilder";
import { useTourTracking } from "../../hooks/useTourTracking";
import { useQueryClient } from "@tanstack/react-query";
import { Field_Sub_Type_Enum, Field_Type_Enum, useUpsertFieldToModelMutation, useGetOnlyModelsInfoQuery, useUpdateModelRelationMutation, Relation_Type_Enum, } from "../../generated_gql/tanstack-query";
import DynamicTextfieldList from "../forms/DynamicTextfieldList";
import "./FieldConfigurationDrawer.css";
import { invalidateModelQueries } from "../../lib/schemaCache";
import { resolveListFieldSubType } from "../../utils/resolveListFieldSubType";
const { Option } = Select;
const validateMessages = {
    required: "${label} is required!",
};
const FieldConfigurationDrawer = ({ isVisible, onClose, fieldOption, repeatedFieldIdentifier = "", onFieldCreated, selectedField, isEditing = false, modelName, }) => {
    const [form] = Form.useForm();
    const [isLocal, setIsLocal] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [formError, setFormError] = useState("");
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
    const context = useContext(ContentContext);
    const state = context?.state || { target: "" };
    // Use modelName prop as primary source, fallback to ContentContext
    const forwardModelName = modelName || state.target || "";
    const queryClient = useQueryClient();
    const messageApi = message;
    const { trackFieldAdded } = useTourTracking();
    const { FieldConfigurationRelationNotice, onSchemaMutationCompleted, schemaDraftOverlay } = useConsoleExtensions();
    const shouldRefetchLiveModelDetails = schemaDraftOverlay?.getModelChangeKind(modelName) !== "added";
    // Fetch available models for relation configuration
    const { data: modelsData } = useGetOnlyModelsInfoQuery();
    const availableModels = useMemo(() => {
        const live = modelsData?.projectModelsInfo ?? [];
        if (!schemaDraftOverlay?.hasDraft) {
            return live;
        }
        const names = new Set(live.map((m) => m?.name?.toLowerCase()).filter(Boolean));
        const merged = [...live];
        for (const overlayModel of schemaDraftOverlay.models) {
            if (overlayModel.overlayMeta.kind === "removed" ||
                names.has(overlayModel.name.toLowerCase())) {
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
    const watchedForwardRelatedModel = Form.useWatch(["forward", "model"], form);
    const modelList = availableModels
        ?.filter((model) => model && model.name && model.name !== forwardModelName)
        .map((item) => item.name);
    const relationArr = [
        Relation_Type_Enum.HasMany,
        Relation_Type_Enum.HasOne,
    ];
    const invalidateAfterMutation = async () => {
        await invalidateModelQueries(queryClient, shouldRefetchLiveModelDetails ? modelName : undefined);
    };
    const { mutateAsync: createModelRelation, isPending: relationLoading } = useUpdateModelRelationMutation({
        onSuccess: async () => {
            messageApi.success("New Relation Created Successfully!");
            await invalidateAfterMutation();
            onFieldCreated();
            await onSchemaMutationCompleted?.();
        },
        onError: (error) => {
            submitLockRef.current = false;
            console.error("Relation creation error:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
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
    const { mutateAsync: upsertFieldToModel, isPending: fieldLoading } = useUpsertFieldToModelMutation({
        onSuccess: async () => {
            submitLockRef.current = false;
            messageApi.success(isEditingRef.current
                ? "Field updated successfully."
                : "New Field Created Successfully!");
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
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            setFormError(errorMessage);
        },
    });
    const loading = relationLoading || fieldLoading;
    const onFinish = async (values) => {
        if (!fieldOption || loading || submitLockRef.current)
            return;
        submitLockRef.current = true;
        const field_type = (isEditing && selectedField
            ? selectedField.field_type
            : fieldOption.field_type);
        const field_sub_type = isEditing && selectedField
            ? resolveListFieldSubType(selectedField)
            : fieldOption.field_sub_type;
        const input_type = isEditing && selectedField?.input_type
            ? selectedField.input_type
            : fieldOption.input_type;
        // Handle relation field creation
        if (field_type === "relation") {
            const forwardModel = values?.forward?.model;
            const forwardRelation = values?.forward?.relation;
            const backwardRelation = values?.backward?.relation;
            if (!forwardModel || !forwardRelation || !backwardRelation) {
                submitLockRef.current = false;
                messageApi.error("Please fill in all required relation fields");
                return;
            }
            const payload = {
                forward_connection_type: forwardRelation,
                from: modelName,
                reverse_connection_type: backwardRelation,
                to: forwardModel,
                known_as: values?.known_as,
            };
            try {
                await createModelRelation(payload);
            }
            catch {
                submitLockRef.current = false;
            }
            return;
        }
        // Build validation payload safely (remove empty keys and coerce numbers)
        const rawValidation = (values.validation || {});
        const validationPayload = { ...rawValidation };
        // Handle integer range [min, max] – optional
        if (rawValidation?.int_range_limit) {
            const minRaw = rawValidation.int_range_limit?.[0];
            const maxRaw = rawValidation.int_range_limit?.[1];
            const minNum = minRaw !== undefined && minRaw !== null && minRaw !== ""
                ? Number(minRaw)
                : null;
            const maxNum = maxRaw !== undefined && maxRaw !== null && maxRaw !== ""
                ? Number(maxRaw)
                : null;
            if (minNum === null && maxNum === null) {
                delete validationPayload.int_range_limit;
            }
            else {
                const range = [];
                if (minNum !== null)
                    range.push(minNum);
                if (maxNum !== null)
                    range.push(maxNum);
                validationPayload.int_range_limit = range;
            }
        }
        try {
            await upsertFieldToModel({
                model_name: modelName,
                field_label: values.field_label || "",
                field_type: field_type,
                field_sub_type,
                field_description: values.field_description,
                input_type,
                is_update: isEditing,
                parent_field: repeatedFieldIdentifier || undefined,
                validation: validationPayload,
            });
        }
        catch {
            submitLockRef.current = false;
        }
    };
    const onFormValueChange = (_changedValues, values) => {
        const label = values?.field_label || "";
        if (label) {
            setIdentifier(buildFieldIdentifier(label));
        }
        // Clear form error when user starts typing
        if (formError) {
            setFormError("");
        }
        // Handle relation form value changes
        if (fieldOption?.field_type === "relation") {
            const backwardRltn = values?.backward?.relation ?? ""; // has_one or has_many
            if (backwardRltn)
                setBackwardRelation(backwardRltn);
        }
    };
    const getFormContent = () => {
        // When editing, use selectedField data; otherwise use fieldOption
        const fieldData = isEditing && selectedField ? selectedField : fieldOption;
        if (!fieldData)
            return null;
        const field_type = fieldData.field_type;
        const field_sub_type = field_type === Field_Type_Enum.List
            ? resolveListFieldSubType(fieldData)
            : fieldData.field_sub_type;
        // Handle relation fields separately
        if (field_type === "relation") {
            return (_jsxs("div", { className: "field-config-content", children: [_jsx(Typography.Paragraph, { type: "secondary", style: { marginBottom: 16 }, children: "Foreign key columns are created nullable. You can create records independently and connect them later using Tag/Connect." }), FieldConfigurationRelationNotice ? (_jsx(FieldConfigurationRelationNotice, { drawerVisible: isVisible, isRelationField: true, sourceModelName: forwardModelName, relatedModelName: watchedForwardRelatedModel ?? model })) : null, _jsxs("div", { style: { marginBottom: "24px" }, children: [_jsxs("div", { children: [_jsx(Form.Item, { label: "Current Model (Forward)", rules: [{ required: true }], children: _jsx(Input, { value: capitalize(forwardModelName) }) }), _jsx(Form.Item, { name: ["forward", "relation"], rules: [
                                            { message: "Relation Type is Required", required: true },
                                        ], children: _jsx(Select, { placeholder: "Has One/Has Many", children: relationArr.map((relation) => (_jsx(Select.Option, { value: relation, children: relation.replace("_", " ") }, relation))) }) }), _jsx(Form.Item, { name: ["forward", "model"], rules: [
                                            { message: "Another Model is Required", required: true },
                                        ], children: _jsx(Select, { placeholder: "Select One", onSelect: (value) => setModel(value), children: modelList?.map((modelName) => (_jsx(Select.Option, { value: modelName, children: capitalize(modelName || "") }, modelName))) }) })] }), _jsxs("div", { children: [_jsx(Form.Item, { label: "Backward Relationship", rules: [{ required: true }], children: _jsx(Input, { disabled: true, placeholder: "Select Forward Relationship First", value: capitalize(model) }) }), _jsx(Form.Item, { name: ["backward", "relation"], rules: [
                                            { message: "Relation Type is Required", required: true },
                                        ], children: _jsx(Select, { placeholder: "Has One/Has Many", children: relationArr.map((relation) => (_jsx(Select.Option, { value: relation, children: relation.replace("_", " ") }, relation))) }) }), _jsx(Form.Item, { rules: [{ required: true }], children: _jsx(Input, { disabled: true, value: backwardRelation === "has_many"
                                                ? capitalize(pluralize(forwardModelName))
                                                : capitalize(forwardModelName) }) })] }), _jsx(Form.Item, { name: "known_as", label: "Known As (Optional)", help: _jsxs("div", { children: ["Please check out the", " ", _jsx("a", { target: "_blank", href: "https://apito.io/docs/console/models-fields#creating-relations-between-models", children: "guide" }), " ", "before using this field. If you are confused, don't use it."] }), children: _jsx(Input, { placeholder: "Alternate identifier for this relation" }) })] })] }));
        }
        const listType = ["string"]; // for now only string
        const dynamicFormListBtnLabel = field_sub_type === Field_Sub_Type_Enum.Dropdown
            ? "Dropdown Option"
            : field_sub_type === Field_Sub_Type_Enum.MultiSelect
                ? "Select Option"
                : "";
        const showLocalization = ![
            Field_Type_Enum.Geo,
            Field_Type_Enum.Date,
            Field_Type_Enum.Repeated,
            Field_Type_Enum.Boolean,
            Field_Type_Enum.Number,
            Field_Type_Enum.Media,
        ].includes(field_type) &&
            ![Field_Sub_Type_Enum.Dropdown, Field_Sub_Type_Enum.MultiSelect].includes(field_sub_type);
        const showFixedListElements = field_type === Field_Type_Enum.List &&
            field_sub_type !== Field_Sub_Type_Enum.DynamicList;
        return (_jsxs("div", { className: "field-config-content", children: [_jsx(Form.Item, { name: "field_label", label: "Field Label", rules: [
                        { required: true },
                        { min: 2, message: "Field label must be at least 2 characters" },
                        { max: 50, message: "Field label must be at most 50 characters" },
                    ], extra: isEditing
                        ? "Label and API identifier are fixed here; use rename if you need to change them."
                        : undefined, help: formError && _jsx("div", { style: { color: "#ff4d4f" }, children: formError }), children: _jsx(Input, { placeholder: "Ex: Name, Title, etc", disabled: isEditing }) }), _jsx(Form.Item, { label: "Field Identifier", extra: "Auto Generated & Used by API", children: _jsx(Input, { placeholder: "Auto Generated Field Identifier", value: identifier, disabled: true }) }), _jsx(Form.Item, { name: "field_description", label: "Field Description", children: _jsx(Input, { placeholder: "The purpose of the field" }) }), _jsx(Form.Item, { name: ["validation", "placeholder"], label: "Hints", children: _jsx(Input, { placeholder: "Placeholder text for the field" }) }), _jsxs("div", { className: "validation-section", children: [_jsx(Form.Item, { name: ["validation", "required"], valuePropName: "checked", children: _jsx(Checkbox, { children: "Required Field" }) }), field_type === Field_Type_Enum.Text && (_jsxs(_Fragment, { children: [_jsx(Form.Item, { name: ["validation", "unique"], valuePropName: "checked", children: _jsx(Checkbox, { children: "Unique Values Only" }) }), _jsx(Form.Item, { name: ["validation", "is_email"], valuePropName: "checked", children: _jsx(Checkbox, { children: "Email Validation" }) }), _jsx(Form.Item, { name: ["validation", "char_limit"], label: "Character Limit", children: _jsx(Input, { type: "number", placeholder: "Max characters allowed" }) })] })), field_type === Field_Type_Enum.Number && (_jsx(_Fragment, { children: _jsx(Form.Item, { label: "Number Range", children: _jsxs(Input.Group, { compact: true, children: [_jsx(Form.Item, { name: ["validation", "int_range_limit", 0], noStyle: true, children: _jsx(InputNumber, { placeholder: "Min", style: { width: "50%" } }) }), _jsx(Form.Item, { name: ["validation", "int_range_limit", 1], noStyle: true, children: _jsx(InputNumber, { placeholder: "Max", style: { width: "50%" } }) })] }) }) })), field_type === Field_Type_Enum.Media && (_jsx(Form.Item, { name: ["validation", "is_gallery"], valuePropName: "checked", children: _jsx(Checkbox, { children: "Multiple File Upload (Gallery)" }) }))] }), showLocalization && (_jsxs("div", { className: "localization-section", children: [_jsx(Form.Item, { valuePropName: "checked", children: _jsx(Checkbox, { checked: isLocal, onChange: () => setIsLocal(!isLocal), children: "Enable Localization" }) }), isLocal && (_jsx(Form.Item, { name: ["validation", "locals"], initialValue: ["en"], extra: "Add / Remove Languages from Setting > General > Content Languages", children: _jsxs(Select, { mode: "multiple", placeholder: "Select Language", optionFilterProp: "children", allowClear: true, children: [_jsx(Option, { value: "en", children: "English" }), _jsx(Option, { value: "es", children: "Spanish" }), _jsx(Option, { value: "fr", children: "French" }), _jsx(Option, { value: "de", children: "German" })] }) }))] })), showFixedListElements && (_jsxs("div", { className: "list-elements-section", children: [_jsx(Form.Item, { name: ["validation", "fixed_list_element_type"], label: "Field Type", children: _jsx(Select, { placeholder: "Select Value Type", children: listType.map((item, index) => (_jsx(Option, { value: item, children: capitalize(item) }, index))) }) }), _jsx(Form.Item, { name: ["validation", "fixed_list_elements"], label: "Options", children: _jsx(DynamicTextfieldList, { btnLabel: dynamicFormListBtnLabel, namePath: ["validation", "fixed_list_elements"] }) })] }))] }));
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
        }
        else {
            form.resetFields();
            setIdentifier("");
            setIsLocal(false);
        }
        // Clear form error when drawer opens or form resets
        setFormError("");
    }, [isEditing, selectedField, form]);
    return (_jsx(Drawer, { title: getDrawerTitle(), width: 340, placement: "right", closable: true, onClose: onClose, open: isVisible, destroyOnHidden: true, className: "field-config-drawer", extra: _jsx(Button, { type: "link", onClick: onClose, children: "< Back" }), children: _jsxs(Form, { form: form, name: "field_setting", layout: "vertical", onFinish: onFinish, validateMessages: validateMessages, onValuesChange: onFormValueChange, initialValues: { remember: true }, children: [getFormContent(), _jsx("div", { className: "drawer-footer", children: _jsx(Button, { type: "primary", htmlType: "submit", loading: loading, style: { width: "100%" }, children: isEditing ? "UPDATE FIELD" : "CREATE FIELD" }) })] }) }));
};
export default FieldConfigurationDrawer;
