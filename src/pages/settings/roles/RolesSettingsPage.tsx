import React, { useState } from "react";
import { Button, Card, Space, Typography, message } from "antd";
import { UserSwitchOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useGetProjectRolesQuery,
  useGetPermissionsAndScopesQuery,
  useUpsertRoleToProjectMutation,
  useDeleteSettingsRoleFromProjectMutation,
} from "../../../generated/graphql";
import RolesTable from "../../../components/roles/RolesTable";
import RolesDrawer from "../../../components/roles/RolesDrawer";
import type { RoleFormData } from "../../../types/roles";

const { Title, Paragraph } = Typography;

const RolesSettingsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRoleKey, setSelectedRoleKey] = useState<string | null>(null);

  // GraphQL queries
  const {
    data: rolesData,
    loading: rolesLoading,
    refetch: refetchRoles,
  } = useGetProjectRolesQuery();
  const { data: permissionsData, loading: permissionsLoading } =
    useGetPermissionsAndScopesQuery();

  // GraphQL mutations
  const [upsertRole, { loading: upsertLoading }] =
    useUpsertRoleToProjectMutation({
      onCompleted: () => {
        message.success(
          selectedRoleKey
            ? "Role updated successfully!"
            : "Role created successfully!"
        );
        setIsDrawerOpen(false);
        setSelectedRoleKey(null);
        refetchRoles();
      },
      onError: (error) => {
        message.error(error.message || "Failed to save role");
      },
    });

  const [deleteRole, { loading: deleteLoading }] =
    useDeleteSettingsRoleFromProjectMutation({
      onCompleted: () => {
        message.success("Role deleted successfully!");
        refetchRoles();
      },
      onError: (error) => {
        message.error(error.message || "Failed to delete role");
      },
    });

  const handleCreateRole = () => {
    setSelectedRoleKey(null);
    setIsDrawerOpen(true);
  };

  const handleEditRole = (roleKey: string) => {
    setSelectedRoleKey(roleKey);
    setIsDrawerOpen(true);
  };

  const handleDeleteRole = (roleKey: string) => {
    deleteRole({
      variables: {
        role: roleKey,
      },
    });
  };

  const handleSubmitRole = async (formData: RoleFormData) => {
    await upsertRole({
      variables: {
        name: formData.name,
        is_admin: formData.is_admin,
        logic_executions: formData.logic_executions,
        api_permissions: formData.api_permissions,
      },
    });
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRoleKey(null);
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title
          level={3}
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <UserSwitchOutlined />
          Roles & Permissions
        </Title>
        <Paragraph type="secondary">
          Manage user roles and permissions for your project
        </Paragraph>
      </div>

      <Card>
        <Space
          style={{
            marginBottom: 16,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Project Roles
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateRole}
          >
            Create Role
          </Button>
        </Space>

        <RolesTable
          rolesData={rolesData}
          loading={rolesLoading}
          onEditRole={handleEditRole}
          onDeleteRole={handleDeleteRole}
          deleteLoading={deleteLoading}
        />
      </Card>

      <RolesDrawer
        visible={isDrawerOpen}
        onClose={handleCloseDrawer}
        roleKey={selectedRoleKey}
        rolesData={rolesData!}
        permissionsData={permissionsData!}
        onSubmit={handleSubmitRole}
        loading={upsertLoading || permissionsLoading}
      />
    </div>
  );
};

export default RolesSettingsPage;
