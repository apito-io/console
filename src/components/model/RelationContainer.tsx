import React, { useState, useContext } from "react";
import { Card, Button, Typography, theme, Tag, Dropdown, message } from "antd";
import {
  SettingOutlined,
  DeleteOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { capitalize } from "lodash";
import pluralize from "pluralize";
import type { ConnectionInfo } from "../../types/model";
import { ContentContext } from "../../contexts/ContentContext";
import {
  useModelFieldOperationMutation,
  Field_Operation_Type_Enum,
} from "../../generated/graphql";
import DeleteConfirmModal from "../common/DeleteConfirmModal";

const { Text } = Typography;

interface RelationContainerProps {
  connection: ConnectionInfo;
  index: number;
  onOpneDrawer: (index: number) => void;
  modelName: string; // Add modelName prop
}

const RelationContainer: React.FC<RelationContainerProps> = ({
  connection,
  index,
  onOpneDrawer,
  modelName,
}) => {
  const { token } = theme.useToken();
  const context = useContext(ContentContext);
  const state = context?.state || { target: "" };

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleteLoader, setIsDeleteLoader] = useState(false);

  const { model, relation, known_as } = connection;

  const [deleteRelationFromModel] = useModelFieldOperationMutation({
    onError: (error) => {
      message.error(`Failed to delete relation: ${error.message}`);
      setIsDeleteLoader(false);
    },
    onCompleted: () => {
      message.success(`${model} Relation Deleted!`);
      setIsDeleteModalVisible(false);
      setIsDeleteLoader(false);
      // Refresh the page to update the model data
      window.location.reload();
    },
  });

  const deleteRelation = async () => {
    setIsDeleteLoader(true);
    await deleteRelationFromModel({
      variables: {
        type: Field_Operation_Type_Enum.Delete,
        model_name: modelName, // Use the prop instead of state.target
        field_name: model || "",
        is_relation: true,
        known_as: known_as || "",
      },
    });
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

  const menuItems = [
    {
      key: "configure",
      label: "Configure",
      icon: <SettingOutlined />,
      onClick: () => onOpneDrawer(index),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
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
            <DatabaseOutlined
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
                <Text strong style={{ fontSize: "14px" }}>
                  {known_as ? (
                    <>
                      {capitalize(model)} {`-> ${capitalize(known_as)}`}
                    </>
                  ) : (
                    capitalize(model)
                  )}
                </Text>
                <Tag color={getRelationTypeColor(connection.type)}>
                  {connection.type || "unknown"}
                </Tag>
              </div>
              <Text
                style={{ fontSize: "12px", color: token.colorTextSecondary }}
              >
                {known_as
                  ? capitalize(
                      `${state.target} ${_replace(relation || "")} ${
                        relation === "has_many" ? pluralize(known_as) : known_as
                      }`
                    )
                  : capitalize(
                      `${state.target} ${_replace(relation || "")} ${
                        relation === "has_many" ? pluralize(model || "") : model
                      }`
                    )}
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
              icon={<SettingOutlined />}
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
