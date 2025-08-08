import React, { useState } from "react";
import { Card, Button, Typography, theme, Badge, Dropdown } from "antd";
import {
  SettingOutlined,
  FileTextOutlined,
  EditOutlined,
  CalendarOutlined,
  UploadOutlined,
  SwitcherOutlined,
  BarsOutlined,
  // MenuOutlined, // Removed unused import
  DatabaseOutlined,
  DragOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  RightOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import type { FieldInfo, DrawerParam } from "../../types/model";

const { Text } = Typography;

interface FieldContainerProps {
  field: FieldInfo;
  openDrawer: (data: DrawerParam) => void;
  objectIdentifier: string;
  children?: React.ReactNode;
}

const FieldContainer: React.FC<FieldContainerProps> = ({
  field,
  openDrawer,
  objectIdentifier,
  children,
}) => {
  const { token } = theme.useToken();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getFieldIcon = (fieldType?: string) => {
    switch (fieldType) {
      case "text":
        return <FileTextOutlined style={{ color: token.colorPrimary }} />;
      case "richtext":
        return <EditOutlined style={{ color: token.colorPrimary }} />;
      case "datetime":
        return <CalendarOutlined style={{ color: token.colorPrimary }} />;
      case "file":
        return <UploadOutlined style={{ color: token.colorPrimary }} />;
      case "boolean":
        return <SwitcherOutlined style={{ color: token.colorPrimary }} />;
      case "repeated":
      case "array":
        return <BarsOutlined style={{ color: token.colorPrimary }} />;
      case "object":
        return <DatabaseOutlined style={{ color: token.colorPrimary }} />;
      default:
        return <FileTextOutlined style={{ color: token.colorPrimary }} />;
    }
  };

  const getFieldTypeColor = (fieldType?: string) => {
    switch (fieldType) {
      case "text":
        return "#1890ff";
      case "richtext":
        return "#722ed1";
      case "datetime":
        return "#52c41a";
      case "file":
        return "#fa8c16";
      case "boolean":
        return "#eb2f96";
      case "repeated":
      case "array":
        return "#13c2c2";
      case "object":
        return "#2f54eb";
      default:
        return "#8c8c8c";
    }
  };

  const menuItems = [
    {
      key: "configure",
      label: "Configure",
      icon: <SettingOutlined />,
      onClick: () =>
        openDrawer({
          field,
          type: "configure",
          objectIdentifier,
        }),
    },
    {
      key: "rename",
      label: "Rename",
      icon: <EditOutlined />,
      onClick: () =>
        openDrawer({
          field,
          type: "rename",
          objectIdentifier,
        }),
    },
    {
      key: "duplicate",
      label: "Duplicate",
      icon: <CopyOutlined />,
      onClick: () =>
        openDrawer({
          field,
          type: "duplicate",
          objectIdentifier,
        }),
    },
    {
      key: "changeType",
      label: "Change Type",
      icon: <SwapOutlined />,
      onClick: () =>
        openDrawer({
          field,
          type: "changeType",
          objectIdentifier,
        }),
    },
    {
      type: "divider" as const,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () =>
        openDrawer({
          field,
          type: "delete",
          objectIdentifier,
        }),
    },
  ];

  const isCollapsibleField =
    field.field_type === "object" ||
    field.field_type === "repeated" ||
    field.field_type === "array";

  return (
    <Card
      size="small"
      style={{
        marginBottom: "12px",
        borderRadius: "8px",
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
      }}
      bodyStyle={{ padding: "12px 16px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "32px", // Ensure consistent height
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: 1,
            minHeight: "32px", // Match parent height
          }}
        >
          <DragOutlined
            style={{
              color: token.colorTextTertiary,
              cursor: "grab",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              fontSize: "16px",
            }}
          >
            {getFieldIcon(field.field_type)}
          </div>
          <div
            style={{
              flex: 1,
              minHeight: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "2px",
              }}
            >
              <Text strong style={{ fontSize: "14px", lineHeight: "20px" }}>
                {field.label || field.identifier}
              </Text>
              {field.identifier && (
                <Badge
                  count={field.identifier}
                  style={{
                    background: getFieldTypeColor(field.field_type),
                    fontSize: "10px",
                    padding: "0 6px",
                    height: "18px",
                    lineHeight: "18px",
                    borderRadius: "9px",
                  }}
                />
              )}
              {field.validation?.required && (
                <Badge status="error" text="Required" />
              )}
              {field.system_generated && (
                <Badge status="default" text="System" />
              )}
            </div>
            <Text
              style={{
                fontSize: "12px",
                color: token.colorTextSecondary,
                lineHeight: "16px",
              }}
            >
              {field.description || `${field.field_type || "Unknown"} field`}
            </Text>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            height: "32px", // Match parent height
          }}
        >
          {isCollapsibleField && children && (
            <Button
              type="text"
              icon={isCollapsed ? <RightOutlined /> : <DownOutlined />}
              size="small"
              style={{
                color: token.colorTextSecondary,
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          )}
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<SettingOutlined />}
              size="small"
              style={{
                color: token.colorTextSecondary,
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
            />
          </Dropdown>
        </div>
      </div>

      {/* Collapsible content for nested fields */}
      {isCollapsibleField && children && !isCollapsed && (
        <div
          style={{
            marginTop: "12px",
            paddingLeft: "36px", // Indent nested content
            borderLeft: `2px solid ${token.colorBorderSecondary}`,
            paddingTop: "8px",
          }}
        >
          {children}
        </div>
      )}
    </Card>
  );
};

export default FieldContainer;
