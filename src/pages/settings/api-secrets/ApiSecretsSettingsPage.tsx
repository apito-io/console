import React, { useMemo, useState, useEffect } from "react";
import {
  Alert,
  Button,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Space,
  Tooltip,
  Typography,
  message,
  Popconfirm,
} from "antd";
import {
  useGetProjectRolesQuery,
  useGenerateProjectTokenMutation,
  useGetCurrentProjectTokensQuery,
  useDeleteProjectTokenMutation,
} from "../../../generated_gql/tanstack-query";
import { CopyToClipboard } from "react-copy-to-clipboard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import {
  CircleAlert,
  Copy,
  ExternalLink,
  Key,
  Plus,
  Shield,
  Trash2,
  Webhook,
} from "lucide-react";
import {
  ConsoleCard,
  ConsoleCardTitle,
  MonoTableCard,
} from "../../../components/console";
import { useNavigate } from "../../../router/navigation";
dayjs.extend(relativeTime);
dayjs.extend(duration);

const { Text, Paragraph } = Typography;

/** Prefer non-admin bootstrap roles for client/BFF login keys. */
const LOGIN_ROLE_HINTS = ["login", "anonymous", "public", "guest"];

type RoleMeta = {
  is_admin?: boolean | null;
  system_generated?: boolean | null;
};

type ProjectTokenRow = {
  name?: string | null;
  role?: string | null;
  expire?: string | null;
  created_at?: string | null;
  token_id?: string | null;
  token_prefix?: string | null;
  token_fingerprint?: string | null;
};

const tokenRowKey = (r: ProjectTokenRow) =>
  String(
    r.token_id ||
      r.token_fingerprint ||
      `${r.name ?? ""}-${r.created_at ?? ""}`,
  );

const ApiSecretsSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [generateOpen, setGenerateOpen] = useState(false);
  const [revealedToken, setRevealedToken] = useState<string | null>(null);
  const [projectTokenList, setProjectTokenList] = useState<ProjectTokenRow[]>(
    [],
  );

  const { data: rolesData, isLoading: rolesLoading } = useGetProjectRolesQuery();
  const {
    isLoading: tokenDataLoading,
    data: currentProjectData,
    refetch: refetchTokens,
  } = useGetCurrentProjectTokensQuery();

  const { mutateAsync: generateAPIKey, isPending: generateLoading } =
    useGenerateProjectTokenMutation({
      onSuccess: (data) => {
        if (data?.generateProjectToken?.token) {
          setRevealedToken(data.generateProjectToken.token);
          setGenerateOpen(false);
          form.resetFields();
          void refetchTokens();
          message.success("API token generated — copy it now");
        } else {
          setGenerateOpen(false);
          form.resetFields();
          void refetchTokens();
          message.warning(
            "Token generated, but the secret was not returned. Check the list.",
          );
        }
      },
      onError: (error) => {
        message.error(
          error instanceof Error ? error.message : "Generate failed",
        );
      },
    });

  const { mutateAsync: deleteToken, isPending: deleteLoading } =
    useDeleteProjectTokenMutation({
      onSuccess: () => {
        message.success("Token deleted");
        void refetchTokens();
      },
      onError: (error) => {
        message.error(
          error instanceof Error ? error.message : "Delete failed",
        );
      },
    });

  const rolesObj = (rolesData?.currentProject?.roles ?? {}) as Record<
    string,
    RoleMeta
  >;
  const roleList = Object.keys(rolesObj);

  const nonAdminRoles = useMemo(
    () =>
      roleList.filter((name) => {
        const meta = rolesObj[name];
        return !meta?.is_admin;
      }),
    [roleList, rolesObj],
  );

  const recommendedLoginRole = useMemo(() => {
    for (const hint of LOGIN_ROLE_HINTS) {
      if (nonAdminRoles.includes(hint)) return hint;
    }
    return nonAdminRoles[0] ?? null;
  }, [nonAdminRoles]);

  const projectSecretKey =
    currentProjectData?.currentProject?.project_secret_key;

  const graphqlEndpoint =
    import.meta.env.REACT_APP_GRAPHQL_ENDPOINT ||
    `${window.location.origin}/graphql`;
  const restEndpoint =
    import.meta.env.REACT_APP_REST_API_ENDPOINT ||
    `${window.location.origin}/api`;

  useEffect(() => {
    const tokenList = currentProjectData?.currentProject?.tokens ?? [];
    setProjectTokenList(
      tokenList.filter((t): t is ProjectTokenRow => t != null),
    );
  }, [currentProjectData]);

  useEffect(() => {
    if (!generateOpen) return;
    if (recommendedLoginRole && !form.getFieldValue("role")) {
      form.setFieldsValue({ role: recommendedLoginRole });
    }
  }, [generateOpen, recommendedLoginRole, form]);

  const onFinish = (values: {
    name: string;
    role: string;
    duration?: dayjs.Dayjs | null;
  }) => {
    void generateAPIKey({
      name: values.name,
      role: values.role,
      duration: values.duration ? values.duration.format("YYYY-MM-DD") : null,
    });
  };

  const handleDeleteToken = (record: ProjectTokenRow) => {
    if (!record.token_id) {
      message.error("Missing token id — cannot delete");
      return;
    }
    void deleteToken({
      token_id: record.token_id,
      duration:
        record.expire || dayjs().add(1, "year").format("YYYY-MM-DD"),
    });
  };

  const formatReadableDate = (raw?: string | null) => {
    if (!raw) return null;
    const d = dayjs(raw);
    if (!d.isValid()) return null;
    return d.format("MMM D, YYYY");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role: string) => (
        <span className="mono-badge console-capitalize">{role}</span>
      ),
    },
    {
      title: "Prefix",
      dataIndex: "token_prefix",
      key: "token_prefix",
      width: 140,
      ellipsis: true,
      render: (prefix: string | null | undefined) =>
        prefix ? (
          <Text code className="console-code-sm">
            {prefix}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Generated",
      dataIndex: "created_at",
      key: "created_at",
      width: 130,
      render: (createdAt: string | null | undefined) => {
        const label = formatReadableDate(createdAt);
        if (!label) return <Text type="secondary">—</Text>;
        return (
          <Tooltip title={dayjs(createdAt).format("MMM D, YYYY HH:mm")}>
            <Text>{label}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: "Expires",
      dataIndex: "expire",
      key: "expire",
      width: 140,
      render: (expire: string) => {
        if (!expire) return <Text type="secondary">Never</Text>;
        const d = dayjs(expire);
        const isExpired = d.isBefore(new Date());
        const readable = d.isValid() ? d.format("MMM D, YYYY") : expire;
        const timeRemaining = d.isValid()
          ? dayjs.duration(d.diff(new Date())).humanize(true)
          : "";
        return (
          <Tooltip title={isExpired ? "Expired" : timeRemaining}>
            <span
              className={
                isExpired
                  ? "mono-badge console-badge--inactive"
                  : "mono-badge console-badge--active"
              }
            >
              {isExpired ? `Expired ${readable}` : readable}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 64,
      render: (_: unknown, record: ProjectTokenRow) => (
        <Popconfirm
          title="Delete this token?"
          description="Clients using it will fail immediately."
          onConfirm={() => handleDeleteToken(record)}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
          icon={
            <CircleAlert
              size={16}
              strokeWidth={1.75}
              className="console-icon-danger"
            />
          }
        >
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              danger
              className="cursor-pointer"
              loading={deleteLoading}
              icon={<Trash2 size={16} strokeWidth={1.75} />}
              aria-label="Delete token"
            />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="console-page">
      <Alert
        type={nonAdminRoles.length === 0 ? "warning" : "info"}
        showIcon
        icon={<Shield size={16} strokeWidth={1.75} />}
        className="console-mb-md"
        message={
          nonAdminRoles.length === 0
            ? "Create a non-admin role before minting a login key"
            : "Login / BFF keys need a non-admin role (prefer login)"
        }
        description={
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <Text type="secondary">
              Project API tokens (`ak_…`) inherit the selected role. Never use{" "}
              <Text code>admin</Text> for Flutter or Astro login. Preferred
              role: <Text code>login</Text> (not admin, minimal model CRUD).
            </Text>
            <Space wrap>
              <Button
                size="small"
                className="cursor-pointer"
                icon={<ExternalLink size={14} strokeWidth={1.75} />}
                onClick={() => navigate("/console/settings/roles")}
              >
                Manage roles
              </Button>
              {recommendedLoginRole ? (
                <Text type="secondary">
                  Suggested for generate:{" "}
                  <Text code>{recommendedLoginRole}</Text>
                </Text>
              ) : null}
            </Space>
          </Space>
        }
      />

      <div className="console-inline-row console-inline-row--between console-mb-md">
        <div>
          <Text strong>Project API tokens</Text>
          <div>
            <Text type="secondary">
              {projectTokenList.length} active · used as{" "}
              <Text code>APITO_LOGIN_API_KEY</Text> / Flutter defines
            </Text>
          </div>
        </div>
        <Button
          type="primary"
          className="cursor-pointer"
          icon={<Plus size={16} strokeWidth={1.75} />}
          disabled={rolesLoading || nonAdminRoles.length === 0}
          onClick={() => {
            form.resetFields();
            if (recommendedLoginRole) {
              form.setFieldsValue({ role: recommendedLoginRole });
            }
            setGenerateOpen(true);
          }}
        >
          Generate token
        </Button>
      </div>

      {tokenDataLoading ? (
        <ConsoleCard
          title={<ConsoleCardTitle icon={Key} label="Tokens" />}
        >
          <Skeleton active paragraph={{ rows: 4 }} />
        </ConsoleCard>
      ) : (
        <MonoTableCard
          title={
            <ConsoleCardTitle
              icon={Key}
              label={`Tokens (${projectTokenList.length})`}
            />
          }
          tableProps={{
            columns,
            dataSource: projectTokenList,
            rowKey: (r) => tokenRowKey(r as ProjectTokenRow),
            size: "small",
            pagination:
              projectTokenList.length > 8
                ? {
                    pageSize: 8,
                    showSizeChanger: false,
                    showTotal: (total, range) =>
                      `${range[0]}–${range[1]} of ${total}`,
                  }
                : false,
            locale: {
              emptyText:
                "No tokens yet. Create a login role, then Generate token.",
            },
            scroll: { x: true },
          }}
        />
      )}

      <Collapse
        className="console-mt-md"
        defaultActiveKey={[]}
        items={[
          {
            key: "endpoints",
            label: (
              <Space>
                <Webhook size={16} strokeWidth={1.75} />
                <span>Connection details</span>
                <Text type="secondary">(endpoints + project secret)</Text>
              </Space>
            ),
            children: (
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text strong>GraphQL</Text>
                  <Space.Compact style={{ width: "100%" }}>
                    <Input
                      readOnly
                      value={graphqlEndpoint}
                      aria-label="GraphQL endpoint"
                    />
                    <CopyToClipboard
                      text={graphqlEndpoint}
                      onCopy={() => message.success("Copied GraphQL URL")}
                    >
                      <Button
                        className="cursor-pointer"
                        icon={<Copy size={14} strokeWidth={1.75} />}
                        aria-label="Copy GraphQL URL"
                      />
                    </CopyToClipboard>
                  </Space.Compact>
                </div>
                <div>
                  <Text strong>REST</Text>
                  <Space.Compact style={{ width: "100%" }}>
                    <Input
                      readOnly
                      value={restEndpoint}
                      aria-label="REST endpoint"
                    />
                    <CopyToClipboard
                      text={restEndpoint}
                      onCopy={() => message.success("Copied REST URL")}
                    >
                      <Button
                        className="cursor-pointer"
                        icon={<Copy size={14} strokeWidth={1.75} />}
                        aria-label="Copy REST URL"
                      />
                    </CopyToClipboard>
                  </Space.Compact>
                </div>
                <Alert
                  type="info"
                  showIcon
                  message="Auth header"
                  description={
                    <Text code>
                      Authorization: Bearer &lt;ak_…&gt;
                    </Text>
                  }
                />
                {projectSecretKey ? (
                  <div>
                    <Text strong>Project secret key</Text>
                    <Paragraph type="secondary" style={{ marginBottom: 8 }}>
                      Server-side only. Not a login token — do not put in Flutter
                      or <Text code>PUBLIC_*</Text>.
                    </Paragraph>
                    <Space.Compact style={{ width: "100%" }}>
                      <Input.Password
                        readOnly
                        value={projectSecretKey}
                        visibilityToggle
                        aria-label="Project secret key"
                      />
                      <CopyToClipboard
                        text={projectSecretKey}
                        onCopy={() => message.success("Secret key copied")}
                      >
                        <Button
                          className="cursor-pointer"
                          icon={<Copy size={14} strokeWidth={1.75} />}
                          aria-label="Copy project secret"
                        >
                          Copy
                        </Button>
                      </CopyToClipboard>
                    </Space.Compact>
                  </div>
                ) : null}
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title="Generate API token"
        open={generateOpen}
        onCancel={() => setGenerateOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name required" }]}
            extra="e.g. protiva-astro-login, protiva-app-login"
          >
            <Input placeholder="protiva-login" autoFocus />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Role required" }]}
            extra={
              <span>
                Must be non-admin.{" "}
                <Button
                  type="link"
                  size="small"
                  className="cursor-pointer"
                  style={{ padding: 0, height: "auto" }}
                  onClick={() => navigate("/console/settings/roles")}
                >
                  Edit roles
                </Button>
              </span>
            }
          >
            {rolesLoading ? (
              <Skeleton.Input active block />
            ) : (
              <Select
                placeholder="Select role"
                options={roleList.map((role) => {
                  const admin = Boolean(rolesObj[role]?.is_admin);
                  return {
                    value: role,
                    label: admin ? `${role} (admin — avoid for login)` : role,
                    disabled: admin,
                  };
                })}
              />
            )}
          </Form.Item>
          <Form.Item
            name="duration"
            label="Expires"
            extra="Empty = never expires (prefer a date for login keys)"
          >
            <DatePicker
              className="console-date-full"
              format="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              disabledDate={(current) =>
                Boolean(current && current < dayjs().endOf("day"))
              }
            />
          </Form.Item>
          <Space>
            <Button onClick={() => setGenerateOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={generateLoading}
              className="cursor-pointer"
              icon={<Plus size={16} strokeWidth={1.75} />}
            >
              Generate
            </Button>
          </Space>
        </Form>
      </Modal>

      <Modal
        title="Copy your API token"
        open={Boolean(revealedToken)}
        onCancel={() => setRevealedToken(null)}
        footer={
          <Button
            type="primary"
            className="cursor-pointer"
            onClick={() => setRevealedToken(null)}
          >
            OK
          </Button>
        }
        destroyOnHidden
      >
        <Alert
          type="warning"
          showIcon
          icon={<CircleAlert size={16} strokeWidth={1.75} />}
          className="console-mb-md"
          message="You won't see this again"
          description="Store this token securely. The list only shows a prefix after you close this dialog."
        />
        <Space.Compact style={{ width: "100%" }}>
          <Input.Password
            readOnly
            value={revealedToken ?? ""}
            visibilityToggle
            aria-label="Generated API token"
          />
          <CopyToClipboard
            text={revealedToken ?? ""}
            onCopy={() => message.success("Token copied")}
          >
            <Button
              className="cursor-pointer"
              icon={<Copy size={14} strokeWidth={1.75} />}
              aria-label="Copy API token"
            >
              Copy
            </Button>
          </CopyToClipboard>
        </Space.Compact>
      </Modal>
    </div>
  );
};

export default ApiSecretsSettingsPage;
