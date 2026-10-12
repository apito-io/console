import React, { useState, useMemo, useEffect } from "react";
import { Drawer, Typography, Divider } from "antd";
import {
  fieldTypeOptions,
  type FieldTypeOption,
} from "../../constants/fieldTypes";
import type { FieldInfo } from "../../types/model";
import { Field_Type_Enum, Input_Type_Enum } from "../../generated_gql/tanstack-query";
import { resolveListFieldSubType } from "../../utils/resolveListFieldSubType";
import SingleFieldOption from "./SingleFieldOption";
import FieldConfigurationDrawer from "./FieldConfigurationDrawer";
import { usePluginManager } from "../../plugins/PluginManager";
import "./RightSidebar.css";

const { Title, Link } = Typography;

interface RightSidebarProps {
  repeatedFieldIdentifier?: string;
  isVisible: boolean;
  onClose: () => void;
  onFieldCreated?: () => void;
  selectedField?: FieldInfo | null; // For editing existing fields
  isEditing?: boolean;
  modelName: string; // Add modelName prop
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  repeatedFieldIdentifier = "",
  isVisible,
  onClose,
  onFieldCreated,
  selectedField,
  isEditing = false,
  modelName,
}) => {
  const [isFieldConfigDrawer, setIsFieldConfigDrawer] = useState(false);
  const [selectedFieldOption, setSelectedFieldOption] =
    useState<FieldTypeOption | null>(null);
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
    return pluginFields.map(
      (field): FieldTypeOption => ({
        example_json: { [field.type]: "Cloudinary asset" },
        root_json_name: field.type,
        field_type: (field.storageType as FieldTypeOption["field_type"]) || Field_Type_Enum.Media,
        input_type: Input_Type_Enum.String,
        label: field.label,
        description: field.description || "",
        plugin_id: field.pluginId,
        plugin_field_type: field.type,
      })
    );
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
      return (
        <>
          Add Fields to{" "}
          <span style={{ color: "#9f1329" }}>
            {repeatedFieldIdentifier.toUpperCase()}
          </span>{" "}
          Schema
        </>
      );
    } else {
      return <span style={{ color: "#E73A55" }}>Add Root(/) Fields</span>;
    }
  };

  const handleFieldSelection = (index: number) => {
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
      const fieldOption =
        (selectedField.plugin_field_type
          ? pluginFieldOptions.find(
              (option) => option.plugin_field_type === selectedField.plugin_field_type,
            )
          : undefined) ??
        fieldTypeOptions.find(
          (option) =>
            option.field_type === selectedField.field_type &&
            (option.field_type !== Field_Type_Enum.List ||
              option.field_sub_type === resolvedSubType)
        ) ??
        fieldTypeOptions.find(
          (option) => option.field_type === selectedField.field_type
        );
      if (fieldOption) {
        setSelectedFieldOption(fieldOption);
        setIsFieldConfigDrawer(true);
      } else {
        // Clear stale state if field not found (e.g. system relation field)
        setSelectedFieldOption(null);
        setIsFieldConfigDrawer(false);
      }
    }
  }, [isEditing, selectedField, pluginFieldOptions]);

  return (
    <>
      <Drawer
        title={
          <div style={{ padding: 0 }}>
            <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
              {getHeaderTitle()}
            </Title>
            {repeatedFieldIdentifier === "" && !isEditing && (
              <Link
                href="https://apito.io/docs/model/database-design"
                target="_blank"
                style={{ fontSize: "12px" }}
              >
                documentation
              </Link>
            )}
          </div>
        }
        width={340}
        placement="right"
        closable
        onClose={onClose}
        open={isVisible}
        destroyOnHidden
        className="right-sidebar-drawer"
      >
        <div className="right-sidebar-content">
          {!isEditing && (
            <>
              {/* Core Field Types */}
              {fieldTypeOptions.map(
                (fieldOption, index) =>
                  !(
                    repeatedFieldIdentifier &&
                    fieldOption.field_type === "relation"
                  ) && (
                    <SingleFieldOption
                      key={index}
                      fieldOption={fieldOption}
                      index={index}
                      onSelectField={handleFieldSelection}
                    />
                  )
              )}

              {/* Plugin Fields Section */}
              {pluginFieldOptions.length > 0 && (
                <>
                  <Divider orientation="left" style={{ margin: "16px 0" }}>
                    Plugin Fields
                  </Divider>
                  {pluginFieldOptions.map((fieldOption, index) => (
                    <SingleFieldOption
                      key={`plugin-${index}`}
                      fieldOption={fieldOption}
                      index={fieldTypeOptions.length + index}
                      onSelectField={handleFieldSelection}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </Drawer>

      <FieldConfigurationDrawer
        isVisible={isFieldConfigDrawer}
        onClose={handleCloseFieldConfig}
        fieldOption={selectedFieldOption}
        repeatedFieldIdentifier={repeatedFieldIdentifier}
        onFieldCreated={handleFieldCreated}
        selectedField={isEditing ? selectedField || undefined : undefined}
        isEditing={isEditing}
        modelName={modelName}
      />
    </>
  );
};

export default RightSidebar;
