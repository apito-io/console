import React, { useCallback, useMemo, useState } from "react";
import { Alert, Button, Form, Input, Modal, message } from "antd";
import {
  useGetProjectRolesQuery,
  useGetPermissionsAndScopesQuery,
  useUpsertRoleToProjectMutation,
  useDeleteSettingsRoleFromProjectMutation,
  useDuplicateRoleInProjectMutation,
} from "../../../generated_gql/tanstack-query";
import RolesTable from "../../../components/roles/RolesTable";
import RolesDrawer from "../../../components/roles/RolesDrawer";
import type { RoleFormData } from "../../../types/roles";
import { useSettingsPageMeta } from "../../../contexts/SettingsPageMetaContext";
import { Plus, Shield } from "lucide-react";
import {
  ConsoleCard,
  ConsoleCardTitle,
} from "../../../components/console";

interface DuplicateRoleFormValues {
  new_name: string;
}

const RolesSettingsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRoleKey, setSelectedRoleKey] = useState<string | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateSourceKey, setDuplicateSourceKey] = useState<string | null>(
    null
  );
  const [duplicateForm] = Form.useForm<DuplicateRoleFormValues>();

  const {
    data: rolesData,
    isLoading: rolesLoading,
    isError: rolesError,
    error: rolesQueryError,
    refetch: refetchRoles,
  } = useGetProjectRolesQuery();
  const { data: permissionsData, isLoading: permissionsLoading } =
    useGetPermissionsAndScopesQuery();

  const { mutateAsync: upsertRole, isPending: upsertLoading } =
    useUpsertRoleToProjectMutation({
      onSuccess: () => {
        message.success(
          selectedRoleKey
            ? "Role updated successfully!"
            : "Role created successfully!"
        );
        setIsDrawerOpen(false);
        setSelectedRoleKey(null);
        void refetchRoles();
      },
      onError: (error) => {
        message.error(
          error instanceof Error ? error.message : "Failed to save role"
        );
      },
    });

  const { mutateAsync: deleteRole, isPending: deleteLoading } =
    useDeleteSettingsRoleFromProjectMutation({
      onSuccess: () => {
        message.success("Role deleted successfully!");
        void refetchRoles();
      },
      onError: (error) => {
        message.error(
          error instanceof Error ? error.message : "Failed to delete role"
        );
      },
    });

  const { mutateAsync: duplicateRole, isPending: duplicateLoading } =
    useDuplicateRoleInProjectMutation({
      onSuccess: (_data, variables) => {
        message.success("Role duplicated successfully!");
        setDuplicateModalOpen(false);
        setDuplicateSourceKey(null);
        duplicateForm.resetFields();
        void refetchRoles();
        setSelectedRoleKey(variables.new_name);
        setIsDrawerOpen(true);
      },
      onError: (error) => {
        message.error(
          error instanceof Error ? error.message : "Failed to duplicate role"
        );
      },
    });

  const handleCreateRole = useCallback(() => {
    setSelectedRoleKey(null);
    setIsDrawerOpen(true);
  }, []);

  const handleEditRole = (roleKey: string) => {
    setSelectedRoleKey(roleKey);
    setIsDrawerOpen(true);
  };

  const handleDuplicateRole = (roleKey: string) => {
    setDuplicateSourceKey(roleKey);
    duplicateForm.setFieldsValue({ new_name: `${roleKey}_copy` });
    setDuplicateModalOpen(true);
  };

  const handleDeleteRole = (roleKey: string) => {
    void deleteRole({ role: roleKey });
  };

  const handleSubmitRole = async (formData: RoleFormData) => {
    await upsertRole({
      name: formData.name,
      // Standard role create/edit never grants admin; built-in admin is separate.
      is_admin: false,
      logic_executions: formData.logic_executions,
      api_permissions: formData.api_permissions,
    });
  };

  const handleDuplicateSubmit = async (values: DuplicateRoleFormValues) => {
    if (!duplicateSourceKey) {
      return;
    }
    await duplicateRole({
      source_role: duplicateSourceKey,
      new_name: values.new_name.trim(),
    });
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRoleKey(null);
  };

  const handleCloseDuplicateModal = () => {
    setDuplicateModalOpen(false);
    setDuplicateSourceKey(null);
    duplicateForm.resetFields();
  };

  const headerActions = useMemo(
    () => (
      <Button type="primary" icon={<Plus size={16} strokeWidth={1.75} />} onClick={handleCreateRole}>
        Create Role
      </Button>
    ),
    [handleCreateRole],
  );

  useSettingsPageMeta({ actions: headerActions });

  return (
    <div>
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="Project roles apply to app and API users"
        description="Console collaborators are invited from Teams. These roles do not control workspace membership."
      />
      {rolesError ? (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message="Failed to load project roles"
          description={
            rolesQueryError instanceof Error
              ? rolesQueryError.message
              : "An unexpected error occurred"
          }
        />
      ) : null}
      <ConsoleCard
        className="mono-table-card"
        title={<ConsoleCardTitle icon={Shield} label="Project roles" />}
      >
        <RolesTable
          rolesData={rolesData}
          loading={rolesLoading}
          onEditRole={handleEditRole}
          onDuplicateRole={handleDuplicateRole}
          onDeleteRole={handleDeleteRole}
          deleteLoading={deleteLoading}
        />
      </ConsoleCard>

      <Modal
        title="Duplicate Role"
        open={duplicateModalOpen}
        onCancel={handleCloseDuplicateModal}
        onOk={() => duplicateForm.submit()}
        confirmLoading={duplicateLoading}
        okText="Duplicate"
      >
        <Form
          form={duplicateForm}
          layout="vertical"
          onFinish={handleDuplicateSubmit}
        >
          <Form.Item
            name="new_name"
            label="New role name"
            rules={[
              { required: true, message: "Please enter a name for the new role" },
              {
                pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/,
                message:
                  "Use letters, numbers, underscores, or hyphens (must start with a letter)",
              },
            ]}
          >
            <Input placeholder="e.g. receptionist_copy" />
          </Form.Item>
        </Form>
      </Modal>

      {rolesData && permissionsData ? (
        <RolesDrawer
          visible={isDrawerOpen}
          onClose={handleCloseDrawer}
          roleKey={selectedRoleKey}
          rolesData={rolesData}
          permissionsData={permissionsData}
          onSubmit={handleSubmitRole}
          loading={upsertLoading || permissionsLoading}
        />
      ) : null}
    </div>
  );
};

export default RolesSettingsPage;
