import React from "react";
import { Table, Tag, Space, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/lib/table";
import type { GetProjectRolesQuery } from "../../generated/graphql";
import type { RoleTableData } from "../../types/roles";

interface RolesTableProps {
  rolesData: GetProjectRolesQuery | undefined;
  loading: boolean;
  onEditRole: (roleKey: string) => void;
  onDeleteRole: (roleKey: string) => void;
  deleteLoading: boolean;
}

const RolesTable: React.FC<RolesTableProps> = ({
  rolesData,
  loading,
  onEditRole,
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
    no_of_users: rolesObj[key]?.no_of_users || 0,
    is_admin: rolesObj[key]?.is_admin || false,
  }));

  const columns: ColumnType<RoleTableData>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span style={{ textTransform: "capitalize" }}>{text}</span>
      ),
    },
    {
      title: "Identifier",
      dataIndex: "identifier",
      key: "identifier",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "System Generated",
      dataIndex: "system_generated",
      key: "system_generated",
      align: "center",
      render: (systemGenerated: boolean) => (
        <Tag color={systemGenerated ? "green" : "blue"}>
          {systemGenerated ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Users",
      dataIndex: "no_of_users",
      key: "no_of_users",
      align: "center",
      render: (count: number) => (
        <span>
          {count} user{count !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEditRole(record.key)}
            disabled={record.system_generated}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Role"
            description={`Are you sure you want to delete the role "${record.name}"?`}
            onConfirm={() => onDeleteRole(record.key)}
            okText="Yes"
            cancelText="No"
            disabled={record.system_generated || deleteLoading}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={deleteLoading}
              disabled={record.system_generated}
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
        emptyText: "No roles found",
      }}
    />
  );
};

export default RolesTable;
