import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Drawer, Typography, Divider } from "antd";
import { fieldTypeOptions, } from "../../constants/fieldTypes";
import { Field_Type_Enum } from "../../generated_gql/tanstack-query";
import { resolveListFieldSubType } from "../../utils/resolveListFieldSubType";
import SingleFieldOption from "./SingleFieldOption";
import FieldConfigurationDrawer from "./FieldConfigurationDrawer";
import { usePluginManager } from "../../plugins/PluginManager";
import "./RightSidebar.css";
const { Title, Link } = Typography;
const RightSidebar = ({ repeatedFieldIdentifier = "", isVisible, onClose, onFieldCreated, selectedField, isEditing = false, modelName, }) => {
    const [isFieldConfigDrawer, setIsFieldConfigDrawer] = useState(false);
    const [selectedFieldOption, setSelectedFieldOption] = useState(null);
    const [, pluginAPI] = usePluginManager();
    // Reset inner drawer state when outer sidebar closes
    useEffect(() => {
        if (!isVisible) {
            setIsFieldConfigDrawer(false);
            setSelectedFieldOption(null);
        }
    }, [isVisible]);
    // Convert plugin fields to FieldTypeOption format
    const pluginFieldOptions = useMemo(() => {
        const pluginFields = pluginAPI.getPluginFields();
        return pluginFields.map((field) => ({
            example_json: { [field.type]: "example value" },
            root_json_name: field.type,
            field_type: "relation", // Using relation as fallback type
            label: field.label,
            description: field.description || "",
        }));
    }, [pluginAPI]);
    // Combine core and plugin field options
    const allFieldOptions = useMemo(() => {
        return [...fieldTypeOptions, ...pluginFieldOptions];
    }, [pluginFieldOptions]);
    const getHeaderTitle = () => {
        if (isEditing && selectedField) {
            return `Edit ${selectedField.label || "Field"}`;
        }
        if (repeatedFieldIdentifier !== "") {
            return (_jsxs(_Fragment, { children: ["Add Fields to", " ", _jsx("span", { style: { color: "#9f1329" }, children: repeatedFieldIdentifier.toUpperCase() }), " ", "Schema"] }));
        }
        else {
            return _jsx("span", { style: { color: "#E73A55" }, children: "Add Root(/) Fields" });
        }
    };
    const handleFieldSelection = (index) => {
        const fieldOption = allFieldOptions[index];
        setSelectedFieldOption(fieldOption);
        setIsFieldConfigDrawer(true);
    };
    const handleCloseFieldConfig = () => {
        setIsFieldConfigDrawer(false);
        setSelectedFieldOption(null);
    };
    const handleFieldCreated = () => {
        setIsFieldConfigDrawer(false);
        setSelectedFieldOption(null);
        onFieldCreated?.();
        onClose(); // Close the right sidebar after field creation
    };
    // If editing an existing field, show the configuration drawer directly
    useEffect(() => {
        if (isEditing && selectedField) {
            const resolvedSubType = resolveListFieldSubType(selectedField);
            const fieldOption = fieldTypeOptions.find((option) => option.field_type === selectedField.field_type &&
                (option.field_type !== Field_Type_Enum.List ||
                    option.field_sub_type === resolvedSubType)) ??
                fieldTypeOptions.find((option) => option.field_type === selectedField.field_type);
            if (fieldOption) {
                setSelectedFieldOption(fieldOption);
                setIsFieldConfigDrawer(true);
            }
            else {
                // Clear stale state if field not found (e.g. system relation field)
                setSelectedFieldOption(null);
                setIsFieldConfigDrawer(false);
            }
        }
    }, [isEditing, selectedField]);
    return (_jsxs(_Fragment, { children: [_jsx(Drawer, { title: _jsxs("div", { style: { padding: 0 }, children: [_jsx(Title, { level: 5, style: { margin: 0, marginBottom: 4 }, children: getHeaderTitle() }), repeatedFieldIdentifier === "" && !isEditing && (_jsx(Link, { href: "https://apito.io/docs/model/database-design", target: "_blank", style: { fontSize: "12px" }, children: "documentation" }))] }), width: 340, placement: "right", closable: true, onClose: onClose, open: isVisible, destroyOnHidden: true, className: "right-sidebar-drawer", children: _jsx("div", { className: "right-sidebar-content", children: !isEditing && (_jsxs(_Fragment, { children: [fieldTypeOptions.map((fieldOption, index) => !(repeatedFieldIdentifier &&
                                fieldOption.field_type === "relation") && (_jsx(SingleFieldOption, { fieldOption: fieldOption, index: index, onSelectField: handleFieldSelection }, index))), pluginFieldOptions.length > 0 && (_jsxs(_Fragment, { children: [_jsx(Divider, { orientation: "left", style: { margin: "16px 0" }, children: "Plugin Fields" }), pluginFieldOptions.map((fieldOption, index) => (_jsx(SingleFieldOption, { fieldOption: fieldOption, index: fieldTypeOptions.length + index, onSelectField: handleFieldSelection }, `plugin-${index}`)))] }))] })) }) }), _jsx(FieldConfigurationDrawer, { isVisible: isFieldConfigDrawer, onClose: handleCloseFieldConfig, fieldOption: selectedFieldOption, repeatedFieldIdentifier: repeatedFieldIdentifier, onFieldCreated: handleFieldCreated, selectedField: isEditing ? selectedField || undefined : undefined, isEditing: isEditing, modelName: modelName })] }));
};
export default RightSidebar;
