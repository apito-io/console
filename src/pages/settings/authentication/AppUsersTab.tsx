import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tag,
  Typography,
  message,
  type MenuProps,
} from "antd";
import dayjs from "dayjs";
import { useAuth } from "../../../contexts/AuthContext";
import {
  useGetProjectAuthenticationQuery,
  useGetCurrentProjectQuery,
  useGetProjectRolesQuery,
} from "../../../generated_gql/tanstack-query";
import type { AppUserRow, AppUsersApi } from "./appUserApi";
import { useOpenCoreAppUsersApi } from "./openCoreAppUsersApi";
import { Ellipsis, Key, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { MonoTableCard } from "../../../components/console";
import { useTenantLabelQuery } from "../../sync/tenantSearch";

const { Text } = Typography;
const { Option } = Select;

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

export type AppUsersTabProps = {
  /** When set, passed to searchUsers/createUser/updateUser for SaaS tenant scope. */
  tenantId?: string | null;
  /** Show tenant_id column (SaaS projects). */
  showTenantColumn?: boolean;
  /** When true and no tenantId, warn and block create — list still loads. */
  requireTenant?: boolean;
  api?: AppUsersApi;
};

const AppUsersTab: React.FC<AppUsersTabProps> = ({
  tenantId,
  showTenantColumn = false,
  requireTenant = false,
  api: apiProp,
}) => {
  const defaultApi = useOpenCoreAppUsersApi();
  const api = apiProp ?? defaultApi;

  const { decodeTokenData } = useAuth();
  const tokenProjectId = decodeTokenData()?.project_id ?? "";
  const { data: currentProjectData } = useGetCurrentProjectQuery(undefined, {
    enabled: !tokenProjectId,
  });
  const projectId =
    tokenProjectId || currentProjectData?.currentProject?.id || "";

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUserRow | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const tenantBlocked = requireTenant && !tenantId;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(searchQuery.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [tenantId]);

  const searchVariables = useMemo(
    () => ({
      project_id: projectId,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      ...(debouncedQ ? { q: debouncedQ } : {}),
      ...(tenantId ? { tenant_id: tenantId } : {}),
    }),
    [projectId, page, debouncedQ, tenantId]
  );

  const { data, isLoading, isFetching, refetch } = api.useSearchUsersQuery(
    searchVariables,
    { enabled: Boolean(projectId) }
  );

  const { data: authData } = useGetProjectAuthenticationQuery(
    { _id: projectId },
    { enabled: Boolean(projectId) }
  );

  const authMethod =
    authData?.getProject?.authentication_settings
      ?.general_authentication_method ?? "email";

  const { data: rolesData, isLoading: rolesLoading } =
    useGetProjectRolesQuery();

  const rolesList = rolesData?.currentProject?.roles
    ? Object.keys(rolesData.currentProject.roles)
    : [];

  const users = (data?.searchUsers?.users ?? []).filter(Boolean) as AppUserRow[];
  const total = data?.searchUsers?.count ?? 0;

  const invalidateList = () => void refetch();

  const { mutateAsync: createUser, isPending: creating } =
    api.useCreateUserMutation({
      onSuccess: () => {
        message.success("User created");
        createForm.resetFields();
        setCreateOpen(false);
        invalidateList();
      },
      onError: (e) =>
        message.error(e instanceof Error ? e.message : "Failed to create user"),
    });

  const { mutateAsync: updateUser, isPending: updating } =
    api.useUpdateUserMutation({
      onSuccess: () => {
        message.success("User updated");
        editForm.resetFields();
        setEditOpen(false);
        setEditingUser(null);
        invalidateList();
      },
      onError: (e) =>
        message.error(e instanceof Error ? e.message : "Failed to update user"),
    });

  const { mutateAsync: deleteUser } = api.useDeleteUserMutation({
    onSuccess: () => {
      message.success("User deleted");
      invalidateList();
    },
    onError: (e) =>
      message.error(e instanceof Error ? e.message : "Failed to delete user"),
  });

  const { mutateAsync: resetPassword, isPending: resetting } =
    api.useResetUserPasswordMutation({
      onSuccess: () => {
        message.success("Password reset");
        resetForm.resetFields();
        setResetOpen(false);
        setEditingUser(null);
      },
      onError: (e) =>
        message.error(
          e instanceof Error ? e.message : "Failed to reset password"
        ),
    });

  const editingTenantId = String(editingUser?.tenant_id ?? "").trim();
  const tenantLabelEnabled =
    showTenantColumn &&
    Boolean(projectId) &&
    Boolean(editingTenantId) &&
    (editOpen || resetOpen) &&
    !editingUser?.tenant_missing;
  const { data: tenantLabel, isFetching: tenantLabelLoading } =
    useTenantLabelQuery(projectId, editingTenantId, tenantLabelEnabled);
  const tenantDisplayName =
    tenantLabel?.name ||
    (tenantLabelLoading ? "Loading…" : editingTenantId || "—");

  const openEdit = (user: AppUserRow) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      tenant_id: user.tenant_id ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      role: user.role ?? undefined,
    });
    setEditOpen(true);
  };

  const openReset = (user: AppUserRow) => {
    setEditingUser(user);
    resetForm.resetFields();
    setResetOpen(true);
  };

  const handleCreate = async (values: Record<string, unknown>) => {
    const email = String(values.email ?? "").trim();
    const phone = String(values.phone ?? "").trim();
    if (!email && !phone) {
      message.error("Email or phone is required");
      return;
    }
    await createUser({
      project_id: projectId,
      password: String(values.password),
      email: email || undefined,
      phone: phone || undefined,
      role: values.role ? String(values.role) : undefined,
      ...(tenantId ? { tenant_id: tenantId } : {}),
    });
  };

  const handleEdit = async (values: Record<string, unknown>) => {
    if (!editingUser?.id) return;
    const rowTenant = String(
      values.tenant_id ?? editingUser.tenant_id ?? ""
    ).trim();
    await updateUser({
      user_id: editingUser.id,
      email: String(values.email ?? "").trim(),
      phone: String(values.phone ?? "").trim(),
      role: values.role != null && values.role !== undefined ? String(values.role) : "",
      // Required for per-tenant SaaS when sidebar is "All tenants".
      ...(rowTenant ? { tenant_id: rowTenant } : {}),
    });
  };

  const handleReset = async (values: Record<string, unknown>) => {
    if (!editingUser?.id) return;
    const password = String(values.password);
    const confirm = String(values.confirm);
    if (password !== confirm) {
      message.error("Passwords do not match");
      return;
    }
    // Engine resolves user across tenant DBs when tenant_id arg is absent.
    await resetPassword({ user_id: editingUser.id, password });
  };

  const actionMenu = (user: AppUserRow): MenuProps["items"] => [
    {
      key: "edit",
      icon: <Pencil size={16} strokeWidth={1.75} />,
      label: "Edit",
      onClick: () => openEdit(user),
    },
    {
      key: "reset",
      icon: <Key size={16} strokeWidth={1.75} />,
      label: "Reset password",
      onClick: () => openReset(user),
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <Trash2 size={16} strokeWidth={1.75} />,
      label: (
        <Popconfirm
          title="Delete this user?"
          description="This cannot be undone."
          onConfirm={() => {
            if (user.id) void deleteUser({ user_id: user.id });
          }}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <span>Delete</span>
        </Popconfirm>
      ),
    },
  ];

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (v: string | null | undefined) => v || "—",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (v: string | null | undefined) => v || "—",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (v: string | null | undefined) => v || "—",
    },
    ...(showTenantColumn
      ? [
          {
            title: "Tenant ID",
            dataIndex: "tenant_id",
            key: "tenant_id",
            ellipsis: true,
            render: (v: string | null | undefined, record: AppUserRow) => {
              if (record.tenant_missing) {
                return <Tag color="error">Tenant missing</Tag>;
              }
              return v ? <Text code>{v}</Text> : "—";
            },
          },
        ]
      : []),
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (v: string | null | undefined) =>
        v ? <span className="mono-badge">{v}</span> : "—",
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
      render: (v: string | null | undefined) =>
        v ? <span className="mono-badge">{v}</span> : "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: string | null | undefined) =>
        v ? (
          <span
            className={
              v === "active"
                ? "mono-badge mono-badge--live"
                : "mono-badge"
            }
          >
            {v}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (v: string | null | undefined) =>
        v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "—",
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (v: string | null | undefined) =>
        v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "—",
    },
    {
      title: "",
      key: "actions",
      width: 56,
      render: (_: unknown, record: AppUserRow) => (
        <Dropdown menu={{ items: actionMenu(record) }} trigger={["click"]}>
          <Button type="text" icon={<Ellipsis size={16} strokeWidth={1.75} />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="console-page">
      {tenantBlocked && (
        <Alert
          type="info"
          showIcon
          className="console-mb-md"
          message="All tenants lists every user (newest first). Select a tenant in the sidebar to filter or create users."
          description="Search works across all tenants. Orphan users (tenant_id set but catalog row gone) show Tenant missing — delete them manually when ready. Empty tenant_id on shared-DB projects is normal until a billing tenant is linked."
        />
      )}

      <div className="console-inline-row console-inline-row--between console-mb-md">
        <div>
          <Text type="secondary">
            Project app end-users stored in the reserved <Text code>users</Text>{" "}
            table (not exposed as a schema model).
          </Text>{" "}
          <span className="mono-badge">
            {total}{" "}
            {debouncedQ
              ? "matching users"
              : tenantId
                ? "users in tenant"
                : showTenantColumn
                  ? "users across tenants"
                  : "users"}
          </span>
        </div>
        <Button
          type="primary"
          icon={<Plus size={16} strokeWidth={1.75} />}
          disabled={tenantBlocked || !projectId}
          onClick={() => {
            createForm.resetFields();
            setCreateOpen(true);
          }}
        >
          Add user
        </Button>
      </div>

      <div className="console-mb-md" style={{ maxWidth: 320 }}>
        <Input
          allowClear
          prefix={<Search size={16} strokeWidth={1.75} />}
          placeholder={
            showTenantColumn && !tenantId
              ? "Search any user across all tenants"
              : "Search by email, username, phone, or id"
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <MonoTableCard
        tableProps={{
          rowKey: (r) => r.id ?? "",
          columns,
          dataSource: users,
          loading: isLoading || isFetching,
          rowClassName: (record: AppUserRow) =>
            record.tenant_missing ? "apito-user-row--orphan" : "",
          onRow: (record: AppUserRow) =>
            record.tenant_missing
              ? {
                  style: {
                    background: "rgba(255, 77, 79, 0.08)",
                  },
                }
              : {},
          pagination: {
            current: page,
            pageSize: PAGE_SIZE,
            total,
            showSizeChanger: false,
            showTotal: (t) =>
              debouncedQ
                ? `Total ${t} matching users`
                : tenantId
                  ? `Total ${t} users in tenant`
                  : showTenantColumn
                    ? `Total ${t} users across tenants`
                    : `Total ${t} users`,
            onChange: (p) => setPage(p),
          },
          scroll: { x: true },
        }}
      />

      <Modal
        title="Add user"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="email"
            label="Email"
            rules={
              authMethod === "email"
                ? [{ required: true, message: "Email is required" }]
                : undefined
            }
          >
            <Input placeholder="user@example.com" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={
              authMethod === "phone"
                ? [{ required: true, message: "Phone is required" }]
                : undefined
            }
          >
            <Input placeholder="+1234567890" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Initial password" />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select
              placeholder="Select role"
              allowClear
              loading={rolesLoading}
            >
              {rolesList.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {showTenantColumn && tenantId ? (
            <>
              <Alert
                type="info"
                showIcon
                className="console-mb-md"
                message={
                  <>
                    User will be created in tenant <Text code>{tenantId}</Text>.
                  </>
                }
              />
              <Form.Item
                name="auto_provision_tenant"
                valuePropName="checked"
                initialValue={false}
                extra="Signup-only. Console create always attaches to the selected tenant."
              >
                <Checkbox disabled>Auto-provision tenant on create</Checkbox>
              </Form.Item>
            </>
          ) : null}
          <Space>
            <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={creating}>
              Create
            </Button>
          </Space>
        </Form>
      </Modal>

      <Modal
        title="Edit user"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditingUser(null);
        }}
        footer={null}
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          {showTenantColumn ? (
            <>
              {editingUser?.tenant_missing || !editingTenantId ? (
                <Alert
                  type="warning"
                  showIcon
                  className="console-mb-md"
                  message="No catalog tenant on this user"
                  description="Orphan or unscoped row. Save may still work via engine cross-tenant lookup; prefer deleting orphans after cleanup."
                />
              ) : null}
              <Form.Item name="tenant_id" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label="Tenant"
                extra={
                  !tenantId
                    ? "Auto-picked from the user row. Used to scope the update."
                    : "Tenant for this user."
                }
              >
                <Input
                  readOnly
                  disabled
                  value={
                    editingUser?.tenant_missing || !editingTenantId
                      ? "—"
                      : tenantDisplayName
                  }
                  placeholder={tenantLabelLoading ? "Loading…" : "—"}
                />
              </Form.Item>
            </>
          ) : null}
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select allowClear loading={rolesLoading}>
              {rolesList.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Space>
            <Button
              onClick={() => {
                setEditOpen(false);
                setEditingUser(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={updating}>
              Save
            </Button>
          </Space>
        </Form>
      </Modal>

      <Modal
        title="Reset password"
        open={resetOpen}
        onCancel={() => {
          setResetOpen(false);
          setEditingUser(null);
        }}
        footer={null}
        destroyOnHidden
      >
        <Form form={resetForm} layout="vertical" onFinish={handleReset}>
          {showTenantColumn && editingUser ? (
            <Form.Item label="Tenant">
              <Input
                readOnly
                disabled
                value={
                  editingUser.tenant_missing || !editingTenantId
                    ? "—"
                    : tenantDisplayName
                }
              />
            </Form.Item>
          ) : null}
          <Form.Item
            name="password"
            label="New password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm password"
            rules={[{ required: true, message: "Confirm password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Space>
            <Button
              onClick={() => {
                setResetOpen(false);
                setEditingUser(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={resetting}>
              Reset password
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default AppUsersTab;
