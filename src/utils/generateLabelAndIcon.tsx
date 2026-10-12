import React from "react";
import { Space, Tag } from "antd";
import { Icon } from "@iconify/react";
import { Calendar, Database, FileText, GitBranch, Globe, Hash, Home, Image, LayoutGrid, List, ListChecks, Mail, MapPin, Pencil, Phone, SquareCheck, Tag as TagIcon, Type, Upload, User } from "lucide-react";

interface FieldInfo {
  serial: number;
  identifier: string;
  label: string;
  input_type: string;
  field_type: string;
  field_sub_type?: string;
  description?: string;
  system_generated: boolean;
  validation?: {
    fixed_list_elements?: string[];
    is_multi_choice?: boolean;
    locals?: string[];
    [key: string]: any;
  };
}

export const generateIcon = (field: FieldInfo): React.ReactNode => {
  // Check for specific field purposes based on label/identifier (case-insensitive)
  const fieldLabel = (field.label || field.identifier || "").toLowerCase();

  // Email fields
  if (fieldLabel.includes("email") || fieldLabel.includes("mail")) {
    return <Mail size={16} strokeWidth={1.75} />;
  }

  // Phone fields
  if (
    fieldLabel.includes("phone") ||
    fieldLabel.includes("tel") ||
    fieldLabel.includes("mobile")
  ) {
    return <Phone size={16} strokeWidth={1.75} />;
  }

  // Name fields
  if (
    fieldLabel.includes("name") ||
    fieldLabel.includes("title") ||
    fieldLabel.includes("label")
  ) {
    return <User size={16} strokeWidth={1.75} />;
  }

  // Address/Location fields
  if (
    fieldLabel.includes("address") ||
    fieldLabel.includes("location") ||
    fieldLabel.includes("street")
  ) {
    return <Home size={16} strokeWidth={1.75} />;
  }

  // Slogan/Description/Bio fields
  if (
    fieldLabel.includes("slogan") ||
    fieldLabel.includes("bio") ||
    fieldLabel.includes("description") ||
    fieldLabel.includes("about")
  ) {
    return <TagIcon size={16} strokeWidth={1.75} />;
  }

  // Logo/Image/File fields
  if (
    fieldLabel.includes("logo") ||
    fieldLabel.includes("image") ||
    fieldLabel.includes("picture") ||
    fieldLabel.includes("avatar")
  ) {
    return <Image size={16} strokeWidth={1.75} />;
  }

  // URL/Website fields
  if (
    fieldLabel.includes("url") ||
    fieldLabel.includes("website") ||
    fieldLabel.includes("link")
  ) {
    return <Globe size={16} strokeWidth={1.75} />;
  }

  // Now check by field type
  switch (field.field_type) {
    case "text":
      // Check input_type for specific text variations
      switch (field.input_type) {
        case "email":
          return <Mail size={16} strokeWidth={1.75} />;
        case "phone":
          return <Phone size={16} strokeWidth={1.75} />;
        case "url":
          return <Globe size={16} strokeWidth={1.75} />;
        default:
          return <Type size={16} strokeWidth={1.75} />;
      }

    case "multiline":
      return <Pencil size={16} strokeWidth={1.75} />;

    case "date":
      return <Calendar size={16} strokeWidth={1.75} />;

    case "number":
      if (field.input_type === "double") {
        return <Hash size={16} strokeWidth={1.75} />;
      } else {
        return <Hash size={16} strokeWidth={1.75} />;
      }

    case "object":
      return <Database size={16} strokeWidth={1.75} />;

    case "repeated":
      return <LayoutGrid size={16} strokeWidth={1.75} />;

    case "list": {
      const list = field?.validation?.fixed_list_elements || [];
      const multiChoice = field?.validation?.is_multi_choice;
      if (
        field?.field_sub_type === "dropdown" ||
        (list.length > 0 && !multiChoice)
      ) {
        // dropdown
        return <ListChecks size={16} strokeWidth={1.75} />;
      }
      if (
        field?.field_sub_type === "multiselect" ||
        (list.length > 0 && multiChoice)
      ) {
        // multiple choice
        return <Icon icon="ci:select-multiple" />;
      }
      if (
        field?.field_sub_type === "dynamic_list" ||
        (list.length === 0 && !multiChoice)
      ) {
        // dynamic list
        return <List size={16} strokeWidth={1.75} />;
      }
      return <List size={16} strokeWidth={1.75} />;
    }

    case "boolean":
      return <SquareCheck size={16} strokeWidth={1.75} />;

    case "media":
      return <Upload size={16} strokeWidth={1.75} />;

    case "geo":
      return <MapPin size={16} strokeWidth={1.75} />;

    case "relation":
      return <GitBranch size={16} strokeWidth={1.75} />;

    default:
      return <FileText size={16} strokeWidth={1.75} />;
  }
};

export const generateLabel = (item: FieldInfo): React.ReactNode => (
  <Space
    style={{
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <Space>
      {generateIcon(item)}
      <div style={{ textTransform: "capitalize" }}>
        {item?.label || item?.identifier}
      </div>
      <Tag color="green">{item?.identifier}</Tag>
    </Space>
    <Space>
      {item?.validation?.locals?.map((locale) => (
        <Tag key={locale} color="blue">
          {locale}
        </Tag>
      ))}
    </Space>
  </Space>
);

// Helper function to get field type color for borders
export const getFieldTypeColor = (fieldType: string): string => {
  switch (fieldType) {
    case "text":
      return "#1890ff"; // blue
    case "multiline":
      return "#52c41a"; // green
    case "number":
      return "#fa8c16"; // orange
    case "boolean":
      return "#722ed1"; // purple
    case "date":
      return "#eb2f96"; // magenta
    case "list":
      return "#13c2c2"; // cyan
    case "object":
      return "#f5222d"; // red
    case "repeated":
      return "#faad14"; // gold
    case "media":
      return "#a0d911"; // lime
    case "geo":
      return "#fa541c"; // volcano
    default:
      return "#d9d9d9"; // gray
  }
};
