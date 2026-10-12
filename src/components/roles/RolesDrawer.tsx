import React, { useEffect, useMemo, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Alert,
  Divider,
} from 'antd';
import type {
  ApiPermissions,
  RolesDrawerProps,
  RoleFormData,
} from '../../types/roles';
import {
  EMPTY_MODEL_PERMISSIONS,
  normalizeApiPermissions,
} from '../../types/roles';
import ApiPermissionsTable from './ApiPermissionsTable';
import LogicPermissionsSection from './LogicPermissionsSection';
import { Save } from 'lucide-react';

const { Title, Text } = Typography;

function useResponsiveDrawerWidth(maxWidth = 960): number {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? Math.min(maxWidth, window.innerWidth) : maxWidth
  );

  useEffect(() => {
    const update = () => setWidth(Math.min(maxWidth, window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [maxWidth]);

  return width;
}

function seedApiPermissions(
  models: string[],
  existing?: ApiPermissions
): ApiPermissions {
  const seeded: ApiPermissions = {};
  for (const model of models) {
    seeded[model] = existing?.[model]
      ? { ...EMPTY_MODEL_PERMISSIONS, ...existing[model] }
      : { ...EMPTY_MODEL_PERMISSIONS };
  }
  return seeded;
}

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
  const drawerWidth = useResponsiveDrawerWidth(960);

  const isEditMode = roleKey !== null;
  const existingRole = roleKey
    ? rolesData?.currentProject?.roles?.[roleKey]
    : null;

  const isSystemGenerated = Boolean(existingRole?.system_generated);
  const isAdminRole = Boolean(existingRole?.is_admin);
  const formLocked = isSystemGenerated || isAdminRole;

  const models = useMemo(
    () =>
      (permissionsData?.listPermissionsAndScopes?.models || []).filter(
        (m): m is string => m !== null
      ),
    [permissionsData]
  );

  useEffect(() => {
    if (!visible) return;

    if (isEditMode && existingRole) {
      const normalized = normalizeApiPermissions(existingRole.api_permissions);
      form.setFieldsValue({
        name: roleKey ?? '',
        is_admin: false,
        logic_executions: (existingRole.logic_executions || []).filter(
          (f): f is string => f !== null
        ),
        api_permissions: seedApiPermissions(models, normalized),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        name: '',
        is_admin: false,
        logic_executions: [],
        api_permissions: seedApiPermissions(models),
      });
    }
  }, [visible, isEditMode, roleKey, existingRole, form, models]);

  const handleSubmit = async (values: RoleFormData) => {
    if (formLocked) return;
    try {
      await onSubmit({
        ...values,
        is_admin: false,
        api_permissions: normalizeApiPermissions(values.api_permissions),
      });
    } catch (error) {
      console.error('Error submitting role:', error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const functions = useMemo(
    () =>
      (permissionsData?.listPermissionsAndScopes?.functions || []).filter(
        (f): f is string => f !== null
      ),
    [permissionsData]
  );

  const logicExecutions = Form.useWatch('logic_executions', form) || [];

  const footer = (
    <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
      <Button onClick={handleClose}>Cancel</Button>
      <Button
        type="primary"
        icon={<Save size={16} strokeWidth={1.75} />}
        onClick={() => form.submit()}
        loading={loading}
        disabled={formLocked}
      >
        {isEditMode ? 'Update' : 'Create'}
      </Button>
    </Space>
  );

  return (
    <Drawer
      title={
        <Title level={4} style={{ margin: 0 }}>
          {isEditMode ? 'Edit Role' : 'Create New Role'}
        </Title>
      }
      width={drawerWidth}
      placement="right"
      onClose={handleClose}
      open={visible}
      destroyOnClose
      footer={footer}
      styles={{
        footer: {
          borderTop: '1px solid var(--ant-color-border-secondary, #f0f0f0)',
        },
      }}
    >
      {isSystemGenerated ? (
        <Alert
          message="System Generated Role"
          description="This role is system generated and cannot be modified."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : null}

      {isAdminRole ? (
        <Alert
          message="Admin roles are managed as the built-in admin role"
          description="Admin privileges cannot be granted or edited from this form. Use the built-in admin role instead."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={formLocked}
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Identity
        </Text>
        <Form.Item name="is_admin" hidden initialValue={false}>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          name="name"
          label="Role Name"
          rules={[
            { required: true, message: 'Please enter a role name' },
            { min: 3, message: 'Role name must be at least 3 characters' },
            { max: 50, message: 'Role name must be less than 50 characters' },
            {
              pattern: /^[a-zA-Z0-9_-]+$/,
              message:
                'Role name can only contain letters, numbers, hyphens, and underscores',
            },
          ]}
        >
          <Input
            placeholder="Enter role name"
            disabled={isEditMode || formLocked}
            maxLength={50}
          />
        </Form.Item>

        <Divider style={{ margin: '8px 0 16px' }} />

        <ApiPermissionsTable models={models} disabled={formLocked} />

        <Divider style={{ margin: '8px 0 16px' }} />

        <LogicPermissionsSection
          functions={functions}
          value={logicExecutions}
          onChange={(selectedFunctions) =>
            form.setFieldsValue({ logic_executions: selectedFunctions })
          }
          disabled={formLocked}
        />
      </Form>
    </Drawer>
  );
};

export default RolesDrawer;
