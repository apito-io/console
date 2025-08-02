import React, { useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Checkbox,
  Button,
  Typography,
  Space,
  Alert,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import type { RolesDrawerProps } from "../../types/roles";
import ApiPermissionsTable from "./ApiPermissionsTable";
import LogicPermissionsSection from "./LogicPermissionsSection";
import type { RoleFormData } from "../../types/roles";

const { Title } = Typography;

const RolesDrawer: React.FC<RolesDrawerProps> = ({
  visible,
  onClose,
  roleKey,
  rolesData,
  permissionsData,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm<RoleFormData>();

  const isEditMode = roleKey !== null;
  const isSystemGenerated = roleKey
    ? rolesData?.currentProject?.roles?.[roleKey]?.system_generated
    : false;

  // Get existing role data for editing
  const existingRole = roleKey
    ? rolesData?.currentProject?.roles?.[roleKey]
    : null;

  useEffect(() => {
    if (visible) {
      if (isEditMode && existingRole) {
        form.setFieldsValue({
          name: roleKey,
          is_admin: existingRole.is_admin || false,
          logic_executions: existingRole.logic_executions || [],
          api_permissions: existingRole.api_permissions || {},
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          name: "",
          is_admin: false,
          logic_executions: [],
          api_permissions: {},
        });
      }
    }
  }, [visible, isEditMode, roleKey, existingRole, form]);

  const handleSubmit = async (values: RoleFormData) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting role:", error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSuperAdminChange = (checked: boolean) => {
    if (checked) {
      // When super admin is checked, clear other permissions
      form.setFieldsValue({
        is_admin: true,
        logic_executions: [],
        api_permissions: {},
      });
    } else {
      form.setFieldsValue({ is_admin: false });
    }
  };

  const functions = (
    permissionsData?.listPermissionsAndScopes?.functions || []
  ).filter((f): f is string => f !== null);
  const models = (
    permissionsData?.listPermissionsAndScopes?.models || []
  ).filter((m): m is string => m !== null);

  const isSuperAdmin = Form.useWatch("is_admin", form);

  return (
    <Drawer
      title={
        <Title level={4} style={{ margin: 0 }}>
          {isEditMode ? "Edit Role" : "Create New Role"}
        </Title>
      }
      width={720}
      placement="right"
      onClose={handleClose}
      open={visible}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={loading}
            disabled={isSystemGenerated}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </Space>
      }
    >
      {isSystemGenerated && (
        <Alert
          message="System Generated Role"
          description="This role is system generated and cannot be modified."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isSystemGenerated}
      >
        <Form.Item
          name="name"
          label="Role Name"
          rules={[
            { required: true, message: "Please enter a role name" },
            { min: 3, message: "Role name must be at least 3 characters" },
            { max: 50, message: "Role name must be less than 50 characters" },
            {
              pattern: /^[a-zA-Z0-9_-]+$/,
              message:
                "Role name can only contain letters, numbers, hyphens, and underscores",
            },
          ]}
        >
          <Input
            placeholder="Enter role name"
            disabled={isEditMode}
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          name="is_admin"
          valuePropName="checked"
          label="Super Admin"
          help="Super admins have full access to all features and data"
        >
          <Checkbox onChange={(e) => handleSuperAdminChange(e.target.checked)}>
            Grant super admin privileges
          </Checkbox>
        </Form.Item>

        {!isSuperAdmin && (
          <>
            <LogicPermissionsSection
              functions={functions}
              value={form.getFieldValue("logic_executions")}
              onChange={(selectedFunctions) =>
                form.setFieldsValue({ logic_executions: selectedFunctions })
              }
            />

            <ApiPermissionsTable
              models={models}
              value={form.getFieldValue("api_permissions")}
              onChange={(permissions) =>
                form.setFieldsValue({ api_permissions: permissions })
              }
            />
          </>
        )}
      </Form>
    </Drawer>
  );
};

export default RolesDrawer;
