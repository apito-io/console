import React, { useState } from "react";
import { Card, Button, Typography, theme, Badge, Dropdown } from "antd";
import type { FieldInfo, DrawerParam } from "../../types/model";
import type { SchemaOverlayChangeKind } from "../../types/schemaDraftOverlay";
import { useSortableDragHandle } from "../../contexts/SortableDragHandleContext";
import SchemaOverlayBadge, {
  schemaOverlaySurfaceStyle,
  schemaOverlayTextStyle,
} from "./SchemaOverlayBadge";
import {
  ArrowLeftRight,
  Calendar,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  FileText,
  GripVertical,
  Menu,
  Pencil,
  Settings,
  ToggleLeft,
  Trash2,
  Upload,
} from "lucide-react";

const { Text } = Typography;

interface FieldContainerProps {
  field: FieldInfo;
  openDrawer: (data: DrawerParam) => void;
  objectIdentifier: string;
  children?: React.ReactNode;
  overlayKind?: SchemaOverlayChangeKind;
  draftVersionLabel?: string;
  disableActions?: boolean;
  overlayPreviousLabel?: string;
}

const FieldContainer: React.FC<FieldContainerProps> = ({
  field,
  openDrawer,
  objectIdentifier,
  children,
  overlayKind = "live",
  draftVersionLabel,
  disableActions = false,
  overlayPreviousLabel,
}) => {
  const { token } = theme.useToken();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dragHandle = useSortableDragHandle();

  const getFieldIcon = (fieldType?: string) => {
    switch (fieldType) {
      case "text":
        return <FileText size={16} strokeWidth={1.75} style={{ color: token.colorPrimary }} />;
      case "richtext":
        return <Pencil size={16} strokeWidth={1.75} style={{ color: token.colorPrimary }} />;
      case "datetime":
        return <Calendar size={16} strokeWidth={1.75} style={{ color: token.colorPrimary }} />;
      case "file":
        return <Upload size={16} strokeWidth={1.75} style={{ color: token.colorPrimary }} />;
      case "boolean":
        return <ToggleLeft size={16} strokeWidth={1.75} style={{ color: token.colorPrimary }} />;
      case "repeated":
      case "array":
        return <Menu size={16} strokeWidth={1.75} style={{ color: token.colorPrimary }} />;
      case "object":
        return <Database size={16} strokeWidth={1.75} style={{ color: token.colorPrimary }} />;
      default:
        return <FileText size={16} strokeWidth={1.75} style={{ color: token.colorPrimary }} />;
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

  const isSystemRelation = field.system_generated && field.field_type === "relation";
  
  const isRemoved = overlayKind === "removed";
  const surfaceStyle = schemaOverlaySurfaceStyle(overlayKind, token);
  const textStyle = schemaOverlayTextStyle(overlayKind);

  const menuItems = [
    {
      key: "configure",
      label: isSystemRelation ? "Configure (System Relation)" : "Configure",
      icon: <Settings size={16} strokeWidth={1.75} />,
      disabled: isSystemRelation || isRemoved || disableActions,
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
      icon: <Pencil size={16} strokeWidth={1.75} />,
      disabled: isRemoved || disableActions,
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
      icon: <Copy size={16} strokeWidth={1.75} />,
      disabled: isRemoved || disableActions,
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
      icon: <ArrowLeftRight size={16} strokeWidth={1.75} />,
      disabled: isRemoved || disableActions,
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
      icon: <Trash2 size={16} strokeWidth={1.75} />,
      danger: true,
      disabled: isRemoved || disableActions,
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
        ...surfaceStyle,
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
          <div
            ref={dragHandle?.setActivatorNodeRef}
            {...(dragHandle?.listeners ?? {})}
            {...(dragHandle?.attributes ?? {})}
            style={{
              color: token.colorTextTertiary,
              cursor: dragHandle ? "grab" : "default",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
              touchAction: dragHandle ? "none" : undefined,
            }}
          >
            <GripVertical size={16} strokeWidth={1.75} />
          </div>
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
              <Text strong style={{ fontSize: "14px", lineHeight: "20px", ...textStyle }}>
                {field.label || field.identifier}
              </Text>
              <SchemaOverlayBadge
                kind={overlayKind}
                draftVersionLabel={draftVersionLabel}
              />
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
            {overlayPreviousLabel ? (
              <Text
                delete
                type="secondary"
                style={{ fontSize: "11px", lineHeight: "14px" }}
              >
                was {overlayPreviousLabel}
              </Text>
            ) : null}
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
              icon={isCollapsed ? <ChevronRight size={16} strokeWidth={1.75} /> : <ChevronDown size={16} strokeWidth={1.75} />}
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
              icon={<Settings size={16} strokeWidth={1.75} />}
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
