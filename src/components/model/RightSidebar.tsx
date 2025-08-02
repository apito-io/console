import React, { useState, useMemo } from "react";
import { Drawer, Typography, Divider } from "antd";
import {
  fieldTypeOptions,
  type FieldTypeOption,
} from "../../constants/fieldTypes";
import type { FieldInfo } from "../../types/model";
import SingleFieldOption from "./SingleFieldOption";
import FieldConfigurationDrawer from "./FieldConfigurationDrawer";
import { usePluginManager } from "../../plugins/PluginManager";
import "./RightSidebar.css";

const { Title, Link } = Typography;

interface RightSidebarProps {
  repeatedFieldIdentifier?: string;
  isVisible: boolean;
  onClose: () => void;
  selectedField?: FieldInfo | null; // For editing existing fields
  isEditing?: boolean;
  modelName: string; // Add modelName prop
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  repeatedFieldIdentifier = "",
  isVisible,
  onClose,
  selectedField,
  isEditing = false,
  modelName,
}) => {
  const [isFieldConfigDrawer, setIsFieldConfigDrawer] = useState(false);
  const [selectedFieldOption, setSelectedFieldOption] =
    useState<FieldTypeOption | null>(null);
  const [, pluginAPI] = usePluginManager();

  // Convert plugin fields to FieldTypeOption format
  const pluginFieldOptions = useMemo(() => {
    const pluginFields = pluginAPI.getPluginFields();
    return pluginFields.map(
      (field): FieldTypeOption => ({
        example_json: { [field.type]: "example value" },
        root_json_name: field.type,
        field_type: "relation" as const, // Using relation as fallback type
        label: field.label,
        description: field.description || "",
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
    onClose(); // Close the right sidebar after field creation
  };

  // If editing an existing field, show the configuration drawer directly
  React.useEffect(() => {
    if (isEditing && selectedField) {
      // Convert selected field back to field option format for editing
      const fieldOption = fieldTypeOptions.find(
        (option) => option.field_type === selectedField.field_type
      );
      if (fieldOption) {
        setSelectedFieldOption(fieldOption);
        setIsFieldConfigDrawer(true);
      }
    }
  }, [isEditing, selectedField]);

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
