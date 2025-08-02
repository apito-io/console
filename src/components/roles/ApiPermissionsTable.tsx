import React from 'react';
import { Form, Table, Select, Typography } from 'antd';
import type { ApiPermissionsTableProps } from '../../types/roles';
import type { PermissionLevel } from '../../types/roles';

const { Title } = Typography;
const { Option } = Select;

const ApiPermissionsTable: React.FC<ApiPermissionsTableProps> = ({
  models,
  value = {},
  onChange,
  disabled = false,
}) => {
  const permissionOptions: { label: string; value: PermissionLevel }[] = [
    { label: 'No Access', value: 'none' },
    { label: 'Everyone', value: 'all' },
    { label: 'Custom Logic', value: 'custom_logic' },
  ];

  const tableData = models.map((model) => ({
    key: model,
    model,
    read: value[model]?.read || 'none',
    create: value[model]?.create || 'none',
    update: value[model]?.update || 'none',
    delete: value[model]?.delete || 'none',
  }));

  const handlePermissionChange = (model: string, action: string, level: PermissionLevel) => {
    const newPermissions = {
      ...value,
      [model]: {
        ...value[model],
        [action]: level,
      },
    };
    onChange?.(newPermissions);
  };

  const columns = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      width: 200,
    },
    {
      title: 'Read',
      dataIndex: 'read',
      key: 'read',
      align: 'center' as const,
      width: 120,
      render: (_: string, record: any) => (
        <Form.Item
          name={['api_permissions', record.model, 'read']}
          noStyle
        >
          <Select
            value={record.read}
            onChange={(level) => handlePermissionChange(record.model, 'read', level)}
            disabled={disabled}
            style={{ width: 100 }}
          >
            {permissionOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Create',
      dataIndex: 'create',
      key: 'create',
      align: 'center' as const,
      width: 120,
      render: (_: string, record: any) => (
        <Form.Item
          name={['api_permissions', record.model, 'create']}
          noStyle
        >
          <Select
            value={record.create}
            onChange={(level) => handlePermissionChange(record.model, 'create', level)}
            disabled={disabled}
            style={{ width: 100 }}
          >
            {permissionOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Update',
      dataIndex: 'update',
      key: 'update',
      align: 'center' as const,
      width: 120,
      render: (_: string, record: any) => (
        <Form.Item
          name={['api_permissions', record.model, 'update']}
          noStyle
        >
          <Select
            value={record.update}
            onChange={(level) => handlePermissionChange(record.model, 'update', level)}
            disabled={disabled}
            style={{ width: 100 }}
          >
            {permissionOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      align: 'center' as const,
      width: 120,
      render: (_: string, record: any) => (
        <Form.Item
          name={['api_permissions', record.model, 'delete']}
          noStyle
        >
          <Select
            value={record.delete}
            onChange={(level) => handlePermissionChange(record.model, 'delete', level)}
            disabled={disabled}
            style={{ width: 100 }}
          >
            {permissionOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
  ];

  return (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>
        API Permissions
      </Title>
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        rowKey="key"
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: 'No models available',
        }}
      />
    </div>
  );
};

export default ApiPermissionsTable;
