import React from "react";
import { Space, Tag, Typography } from "antd";
import {
  camelFromCanonical,
  canonicalizeModelName,
  pascalFromCanonical,
} from "../../utils/apitoNaming";

interface ModelNamePreviewProps {
  rawName?: string;
}

const ModelNamePreview: React.FC<ModelNamePreviewProps> = ({ rawName }) => {
  if (!rawName || typeof rawName !== "string") return null;

  try {
    const canonical = canonicalizeModelName(rawName);
    const singularQuery = camelFromCanonical(canonical);
    const listQuery = `${singularQuery}List`;
    const pascalName = pascalFromCanonical(canonical);
    const createMutation = `create${pascalName}`;
    const updateMutation = `update${pascalName}`;
    const deleteMutation = `delete${pascalName}`;

    return (
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Space size={8} wrap>
          <Typography.Text strong>Canonical id</Typography.Text>
          <Tag>{canonical}</Tag>
        </Space>

        <Space size={8} wrap>
          <Typography.Text strong>GraphQL</Typography.Text>
          <Tag>{`Query: ${singularQuery}, ${listQuery}`}</Tag>
          <Tag>{`Mutation: ${createMutation}, ${updateMutation}, ${deleteMutation}`}</Tag>
        </Space>
      </Space>
    );
  } catch {
    return null;
  }
};

export default ModelNamePreview;
