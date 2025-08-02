import React from "react";
import { Checkbox, Typography, Space } from "antd";
import type { LogicPermissionsSectionProps } from "../../types/roles";

const { Title } = Typography;
// const { Group } = Checkbox; // Removed unused Group

const LogicPermissionsSection: React.FC<LogicPermissionsSectionProps> = ({
  functions,
  value = [],
  onChange,
  disabled = false,
}) => {
  const handleChange = (checkedValues: string[]) => {
    onChange?.(checkedValues);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={5} style={{ marginBottom: 16 }}>
        Logic Execution Permissions
      </Title>
      {functions.length > 0 ? (
        <Checkbox.Group
          value={value}
          onChange={handleChange}
          disabled={disabled}
          style={{ width: "100%" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {functions.map((func) => (
              <Checkbox key={func} value={func}>
                {func}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      ) : (
        <Typography.Text type="secondary">
          No functions available for permission assignment
        </Typography.Text>
      )}
    </div>
  );
};

export default LogicPermissionsSection;
