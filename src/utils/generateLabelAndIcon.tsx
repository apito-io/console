import React from "react";
import {
  CalendarOutlined,
  EnvironmentFilled,
  FileImageOutlined,
  FontSizeOutlined,
  PartitionOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
  TagOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  CheckSquareOutlined,
  UploadOutlined,
  NumberOutlined,
  GlobalOutlined,
  EditOutlined,
  UnorderedListOutlined,
  SelectOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Space, Tag } from "antd";
import { Icon } from "@iconify/react";

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
    return <MailOutlined />;
  }

  // Phone fields
  if (
    fieldLabel.includes("phone") ||
    fieldLabel.includes("tel") ||
    fieldLabel.includes("mobile")
  ) {
    return <PhoneOutlined />;
  }

  // Name fields
  if (
    fieldLabel.includes("name") ||
    fieldLabel.includes("title") ||
    fieldLabel.includes("label")
  ) {
    return <UserOutlined />;
  }

  // Address/Location fields
  if (
    fieldLabel.includes("address") ||
    fieldLabel.includes("location") ||
    fieldLabel.includes("street")
  ) {
    return <HomeOutlined />;
  }

  // Slogan/Description/Bio fields
  if (
    fieldLabel.includes("slogan") ||
    fieldLabel.includes("bio") ||
    fieldLabel.includes("description") ||
    fieldLabel.includes("about")
  ) {
    return <TagOutlined />;
  }

  // Logo/Image/File fields
  if (
    fieldLabel.includes("logo") ||
    fieldLabel.includes("image") ||
    fieldLabel.includes("picture") ||
    fieldLabel.includes("avatar")
  ) {
    return <FileImageOutlined />;
  }

  // URL/Website fields
  if (
    fieldLabel.includes("url") ||
    fieldLabel.includes("website") ||
    fieldLabel.includes("link")
  ) {
    return <GlobalOutlined />;
  }

  // Now check by field type
  switch (field.field_type) {
    case "text":
      // Check input_type for specific text variations
      switch (field.input_type) {
        case "email":
          return <MailOutlined />;
        case "phone":
          return <PhoneOutlined />;
        case "url":
          return <GlobalOutlined />;
        default:
          return <FontSizeOutlined />;
      }

    case "multiline":
      return <EditOutlined />;

    case "date":
      return <CalendarOutlined />;

    case "number":
      if (field.input_type === "double") {
        return <NumberOutlined />;
      } else {
        return <NumberOutlined />;
      }

    case "object":
      return <DatabaseOutlined />;

    case "repeated":
      return <AppstoreOutlined />;

    case "list": {
      const list = field?.validation?.fixed_list_elements || [];
      const multiChoice = field?.validation?.is_multi_choice;
      if (
        field?.field_sub_type === "dropdown" ||
        (list.length > 0 && !multiChoice)
      ) {
        // dropdown
        return <SelectOutlined />;
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
        return <UnorderedListOutlined />;
      }
      return <UnorderedListOutlined />;
    }

    case "boolean":
      return <CheckSquareOutlined />;

    case "media":
      return <UploadOutlined />;

    case "geo":
      return <EnvironmentFilled />;

    case "relation":
      return <PartitionOutlined />;

    default:
      return <FileTextOutlined />;
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
