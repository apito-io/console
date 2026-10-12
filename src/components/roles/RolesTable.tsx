import React from 'react';
import { Table, Tag, Space, Button, Popconfirm } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { GetProjectRolesQuery } from '../../generated_gql/tanstack-query';
import type { RoleTableData } from '../../types/roles';
import { Copy, Pencil, Trash2 } from 'lucide-react';

interface RolesTableProps {
  rolesData: GetProjectRolesQuery | undefined;
  loading: boolean;
  onEditRole: (roleKey: string) => void;
  onDuplicateRole: (roleKey: string) => void;
  onDeleteRole: (roleKey: string) => void;
  deleteLoading: boolean;
}

const RolesTable: React.FC<RolesTableProps> = ({
  rolesData,
  loading,
  onEditRole,
  onDuplicateRole,
  onDeleteRole,
  deleteLoading,
}) => {
  const rolesObj = rolesData?.currentProject?.roles || {};
  const rolesKey = Object.keys(rolesObj);

  const tableData: RoleTableData[] = rolesKey.map((key) => ({
    key,
    name: key,
    identifier: key,
    system_generated: rolesObj[key]?.system_generated || false,
    is_admin: rolesObj[key]?.is_admin || false,
  }));

  const columns: ColumnType<RoleTableData>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="mono-badge">{text}</span>,
    },
    {
      title: 'Identifier',
      dataIndex: 'identifier',
      key: 'identifier',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Flags',
      key: 'flags',
      render: (_, record) => (
        <Space size={4} wrap>
          {record.is_admin ? <Tag color="gold">Admin</Tag> : null}
          {record.system_generated ? <Tag>System</Tag> : <Tag color="blue">Custom</Tag>}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<Pencil size={16} strokeWidth={1.75} />}
            onClick={() => onEditRole(record.key)}
            disabled={record.system_generated}
          >
            Edit
          </Button>
          <Button
            type="text"
            icon={<Copy size={16} strokeWidth={1.75} />}
            onClick={() => onDuplicateRole(record.key)}
          >
            Duplicate
          </Button>
          <Popconfirm
            title="Delete Role"
            description={`Are you sure you want to delete the role "${record.name}"?`}
            onConfirm={() => onDeleteRole(record.key)}
            okText="Yes"
            cancelText="No"
            disabled={record.system_generated || record.is_admin || deleteLoading}
          >
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} strokeWidth={1.75} />}
              loading={deleteLoading}
              disabled={record.system_generated || record.is_admin}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      className="mono-table"
      dataSource={tableData}
      columns={columns}
      loading={loading}
      rowKey="key"
      bordered
      size="small"
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} roles`,
      }}
      locale={{
        emptyText: 'No roles found',
      }}
    />
  );
};

export default RolesTable;
