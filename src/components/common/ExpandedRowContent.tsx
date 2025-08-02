import React from "react";
import { Typography, Descriptions, Tag, Space, Card } from "antd";
import {
  FileTextOutlined,
  DatabaseOutlined,
  LinkOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface ExpandedRowContentProps {
  record: Record<string, any>;
  complexFields: string[];
}

const ExpandedRowContent: React.FC<ExpandedRowContentProps> = ({
  record,
  complexFields,
}) => {
  const renderValue = (value: any, _key: string): React.ReactNode => {
    if (value === null || value === undefined) {
      return <Text type="secondary">No data</Text>;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <Text type="secondary">Empty array</Text>;
      }

      return (
        <div>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            {value.map((item, index) => (
              <Card key={index} size="small" style={{ marginBottom: 8 }}>
                <Text strong>Item {index + 1}:</Text>
                <div style={{ marginTop: 4 }}>
                  {typeof item === "object" ? (
                    <Descriptions
                      size="small"
                      column={1}
                      bordered
                      items={Object.entries(item).map(([subKey, subValue]) => ({
                        key: subKey,
                        label: subKey
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase()),
                        children:
                          typeof subValue === "object" ? (
                            <Text code>
                              {JSON.stringify(subValue, null, 2)}
                            </Text>
                          ) : (
                            String(subValue)
                          ),
                      }))}
                    />
                  ) : (
                    <Text>{String(item)}</Text>
                  )}
                </div>
              </Card>
            ))}
          </Space>
        </div>
      );
    }

    // Handle objects
    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return <Text type="secondary">Empty object</Text>;
      }

      return (
        <Descriptions
          size="small"
          column={1}
          bordered
          items={entries.map(([subKey, subValue]) => ({
            key: subKey,
            label: (
              <Text strong>
                {subKey
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Text>
            ),
            children:
              typeof subValue === "object" && subValue !== null ? (
                <div>
                  {/* Handle nested objects/arrays */}
                  {Array.isArray(subValue) ? (
                    <Space wrap>
                      {subValue.map((item, idx) => (
                        <Tag key={idx} color="blue">
                          {typeof item === "object"
                            ? JSON.stringify(item)
                            : String(item)}
                        </Tag>
                      ))}
                    </Space>
                  ) : (
                    <Text code style={{ whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(subValue, null, 2)}
                    </Text>
                  )}
                </div>
              ) : (
                <Text>{String(subValue)}</Text>
              ),
          }))}
        />
      );
    }

    // For primitive types that somehow ended up here
    return <Text>{String(value)}</Text>;
  };

  const getFieldIcon = (key: string) => {
    if (key.includes("address") || key.includes("location"))
      return <LinkOutlined />;
    if (key.includes("settings") || key.includes("config"))
      return <DatabaseOutlined />;
    return <FileTextOutlined />;
  };

  if (complexFields.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <Text type="secondary">No additional data to display</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, backgroundColor: "#fafafa" }}>
      <Title level={5} style={{ marginBottom: 16 }}>
        Additional Details
      </Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {complexFields.map((key) => {
          const value = record[key];
          const fieldName = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <Card key={key} size="small" style={{ width: "100%" }}>
              <div style={{ marginBottom: 8 }}>
                <Space>
                  {getFieldIcon(key)}
                  <Text strong style={{ fontSize: 16 }}>
                    {fieldName}
                  </Text>
                </Space>
              </div>
              <div style={{ marginLeft: 24 }}>{renderValue(value, key)}</div>
            </Card>
          );
        })}
      </Space>
    </div>
  );
};

export default ExpandedRowContent;
