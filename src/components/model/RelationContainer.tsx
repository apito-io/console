import React, { useState } from "react";
import { Card, Button, Typography, theme, Tag, Dropdown, message } from "antd";
import { capitalize } from "lodash";
import pluralize from "pluralize";
import type { ConnectionInfo } from "../../types/model";
import type { SchemaOverlayChangeKind } from "../../types/schemaDraftOverlay";
import SchemaOverlayBadge, {
  schemaOverlaySurfaceStyle,
  schemaOverlayTextStyle,
} from "./SchemaOverlayBadge";
import { useDeleteConnectionFromModelMutation } from "../../generated_gql/tanstack-query";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import { Database, Settings, Trash2 } from "lucide-react";

const { Text } = Typography;

interface RelationContainerProps {
  connection: ConnectionInfo;
  index: number;
  onOpneDrawer: (index: number) => void;
  modelName: string;
  overlayKind?: SchemaOverlayChangeKind;
  draftVersionLabel?: string;
  onMutationCompleted?: () => void | Promise<void>;
}

const RelationContainer: React.FC<RelationContainerProps> = ({
  connection,
  index,
  onOpneDrawer,
  modelName,
  overlayKind = "live",
  draftVersionLabel,
  onMutationCompleted,
}) => {
  const { token } = theme.useToken();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleteLoader, setIsDeleteLoader] = useState(false);

  const { model, relation, known_as } = connection;

  const { mutateAsync: deleteConnectionFromModel } =
    useDeleteConnectionFromModelMutation();

  const deleteRelation = async () => {
    setIsDeleteLoader(true);
    try {
      await deleteConnectionFromModel({
        from: modelName,
        to: model || "",
        known_as: known_as || undefined,
      });
      message.success(`${model} Relation Deleted!`);
      setIsDeleteModalVisible(false);
      await onMutationCompleted?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete relation";
      message.error(`Failed to delete relation: ${errorMessage}`);
    } finally {
      setIsDeleteLoader(false);
    }
  };

  const getRelationTypeColor = (type?: string) => {
    switch (type) {
      case "hasOne":
        return "blue";
      case "hasMany":
        return "green";
      case "belongsTo":
        return "orange";
      case "belongsToMany":
        return "purple";
      default:
        return "default";
    }
  };

  const _replace = (str: string) => str.replace(/_/g, " ");

  const isRemoved = overlayKind === "removed";
  const surfaceStyle = schemaOverlaySurfaceStyle(overlayKind, token);
  const textStyle = schemaOverlayTextStyle(overlayKind);

  const menuItems = [
    {
      key: "configure",
      label: "Configure",
      icon: <Settings size={16} strokeWidth={1.75} />,
      disabled: isRemoved,
      onClick: () => onOpneDrawer(index),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 size={16} strokeWidth={1.75} />,
      danger: true,
      disabled: isRemoved,
      onClick: () => setIsDeleteModalVisible(true),
    },
  ];

  return (
    <>
      <Card
        style={{
          marginBottom: "12px",
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorder}`,
          borderRadius: "8px",
          ...surfaceStyle,
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: 1,
            }}
          >
            <Database size={16} strokeWidth={1.75}
              style={{ color: token.colorPrimary, fontSize: "18px" }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <Text strong style={{ fontSize: "14px", ...textStyle }}>
                  {capitalize(model)}
                </Text>
                {known_as?.trim() ? (
                  <Tag color="default">known_as: {known_as}</Tag>
                ) : null}
                <SchemaOverlayBadge
                  kind={overlayKind}
                  draftVersionLabel={draftVersionLabel}
                />
                <Tag color={getRelationTypeColor(connection.type)}>
                  {connection.type || "unknown"}
                </Tag>
              </div>
              <Text
                style={{ fontSize: "12px", color: token.colorTextSecondary }}
              >
                {capitalize(modelName)}{" "}
                {_replace(relation || "")}{" "}
                {relation === "has_many"
                  ? pluralize(model || "")
                  : capitalize(model || "")}
                {known_as?.trim() ? (
                  <>
                    {" "}
                    · GraphQL field: <Text code>{known_as}</Text>
                  </>
                ) : null}
              </Text>
            </div>
          </div>
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<Settings size={16} strokeWidth={1.75} />}
              size="small"
              style={{ color: token.colorTextSecondary }}
            />
          </Dropdown>
        </div>
      </Card>

      <DeleteConfirmModal
        loader={isDeleteLoader}
        isVisible={isDeleteModalVisible}
        setIsVisible={setIsDeleteModalVisible}
        handleModelConfirm={deleteRelation}
        title="Delete Relation"
        description="Write DELETE in the box to confirm deletion of this relation:"
      />
    </>
  );
};

export default RelationContainer;
