import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AutoComplete,
  Avatar,
  Button,
  Checkbox,
  Dropdown,
  Form,
  Modal,
  Select,
  Space,
  Switch,
  Typography,
  message,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ellipsis, Plus, Trash2, User, Users } from "lucide-react";
import { useSearchSystemUsersQuery } from "../../generated_gql/tanstack-query";
import { CONSOLE_SECTIONS } from "../../constants/consoleSections";
import {
  ConsoleCard,
  ConsoleCardTitle,
  MonoTableCard,
} from "../../components/console";
import { graphqlFetcher } from "../../lib/graphqlFetcher";
import { settingsKeys } from "../../lib/queryKeys";
import { useAdministrableProjectsQuery } from "../sync/queries";
import {
  GET_WORKSPACE_MEMBERS,
  INVITE_WORKSPACE_MEMBER,
  REMOVE_WORKSPACE_MEMBER,
  UPDATE_WORKSPACE_MEMBER,
} from "../../graphql/workspaceTeams";

const { Text } = Typography;

interface WorkspaceMemberGrant {
  project_id?: string | null;
  project_name?: string | null;
  role?: string | null;
  permissions?: Array<string | null> | null;
  invite_status?: string | null;
  invite_expires_at?: string | null;
}

interface WorkspaceMember {
  id?: string | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  avatar?: string | null;
  grants?: Array<WorkspaceMemberGrant | null> | null;
}

interface InviteForm {
  email: string;
  project_ids: string[];
  administrative_permissions: string[];
  make_admin: boolean;
}

function isAdminRole(role?: string | null): boolean {
  const r = (role || "").toLowerCase();
  return r === "admin" || r === "owner" || r === "project_admin";
}

const WorkspaceTeamsPage: React.FC = () => {
  const [form] = Form.useForm<InviteForm>();
  const [editMember, setEditMember] = useState<WorkspaceMember | null>(null);
  const [editForm] = Form.useForm<InviteForm>();
  const queryClient = useQueryClient();
  const [emailQ, setEmailQ] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const makeAdmin = Form.useWatch("make_admin", form);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedEmail(emailQ), 300);
    return () => window.clearTimeout(t);
  }, [emailQ]);

  const membersQuery = useQuery({
    queryKey: settingsKeys.teams(),
    queryFn: graphqlFetcher<{ workspaceMembers?: WorkspaceMember[] }, Record<string, never>>(
      GET_WORKSPACE_MEMBERS,
      {},
    ),
  });
  const { data: adminProjectsData } = useAdministrableProjectsQuery();
  const { data: userSearch } = useSearchSystemUsersQuery(
    { email: debouncedEmail, limit: 8 },
    { enabled: debouncedEmail.trim().length >= 2 },
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: settingsKeys.teams() });

  const inviteM = useMutation({
    mutationFn: (vars: InviteForm) =>
      graphqlFetcher(INVITE_WORKSPACE_MEMBER, {
        email: vars.email,
        project_ids: vars.project_ids,
        administrative_permissions: vars.make_admin
          ? []
          : vars.administrative_permissions,
        make_admin: vars.make_admin,
      })(),
    onSuccess: () => {
      message.success("Member invited");
      form.resetFields();
      void invalidate();
    },
    onError: (error: Error) => message.error(error.message),
  });

  const updateM = useMutation({
    mutationFn: (vars: InviteForm & { user_id: string }) =>
      graphqlFetcher(UPDATE_WORKSPACE_MEMBER, {
        user_id: vars.user_id,
        project_ids: vars.project_ids,
        administrative_permissions: vars.make_admin
          ? []
          : vars.administrative_permissions,
        make_admin: vars.make_admin,
      })(),
    onSuccess: () => {
      message.success("Access updated");
      setEditMember(null);
      void invalidate();
    },
    onError: (error: Error) => message.error(error.message),
  });

  const removeM = useMutation({
    mutationFn: (vars: { user_id: string; project_id?: string }) =>
      graphqlFetcher(REMOVE_WORKSPACE_MEMBER, vars)(),
    onSuccess: () => {
      message.success("Member removed");
      void invalidate();
    },
    onError: (error: Error) => message.error(error.message),
  });

  const adminProjects = adminProjectsData?.projects || [];
  const members = membersQuery.data?.workspaceMembers || [];
  const canManage = adminProjects.length > 0;

  const columns = useMemo(
    () => [
      {
        title: "Member",
        dataIndex: "email",
        key: "email",
        render: (email: string, record: WorkspaceMember) => (
          <Space>
            <Avatar
              src={record.avatar || undefined}
              icon={<User size={16} strokeWidth={1.75} />}
            />
            <div>
              <div className="mono-cell-title">{email}</div>
              <div className="mono-cell-subtitle">
                {record.first_name} {record.last_name}
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: "Projects",
        dataIndex: "grants",
        key: "projects",
        render: (grants: WorkspaceMember["grants"]) => (
          <div>
            {(grants || []).map((g) =>
              g?.project_id ? (
                <span key={g.project_id} className="mono-badge console-tag-spaced">
                  {g.project_name || g.project_id}
                </span>
              ) : null,
            )}
          </div>
        ),
      },
      {
        title: "Access",
        dataIndex: "grants",
        key: "access",
        render: (grants: WorkspaceMember["grants"]) => {
          const allAdmin = (grants || []).every((g) => isAdminRole(g?.role));
          if (allAdmin && (grants || []).length > 0) {
            return <span className="mono-badge">Admin</span>;
          }
          const perms = new Set<string>();
          for (const g of grants || []) {
            for (const p of g?.permissions || []) {
              if (p) perms.add(p);
            }
          }
          return (
            <div>
              {Array.from(perms).map((p) => (
                <span key={p} className="mono-badge console-tag-spaced">
                  {p}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "grants",
        key: "status",
        render: (grants: WorkspaceMember["grants"]) => {
          const statuses = new Set(
            (grants || []).map((g) => (g?.invite_status || "accepted").toLowerCase()),
          );
          if (statuses.has("invited")) {
            return <span className="mono-badge">Invited</span>;
          }
          if (statuses.has("expired")) {
            return <span className="mono-badge">Expired</span>;
          }
          return <span className="mono-badge">Accepted</span>;
        },
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: unknown, record: WorkspaceMember) =>
          canManage && record.id ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "edit",
                    label: "Edit access",
                    onClick: () => {
                      setEditMember(record);
                      const grants = (record.grants || []).filter(Boolean) as WorkspaceMemberGrant[];
                      const admin = grants.every((g) => isAdminRole(g.role));
                      editForm.setFieldsValue({
                        email: record.email || "",
                        project_ids: grants
                          .map((g) => g.project_id)
                          .filter((id): id is string => Boolean(id)),
                        administrative_permissions: Array.from(
                          new Set(
                            grants.flatMap((g) =>
                              (g.permissions || []).filter((p): p is string => Boolean(p)),
                            ),
                          ),
                        ),
                        make_admin: admin,
                      });
                    },
                  },
                  ...((record.grants || [])
                    .filter((g): g is WorkspaceMemberGrant => Boolean(g?.project_id))
                    .map((g) => ({
                      key: `remove-${g.project_id}`,
                      label: `Remove from ${g.project_name || g.project_id}`,
                      onClick: () =>
                        removeM.mutate({
                          user_id: record.id as string,
                          project_id: g.project_id as string,
                        }),
                    })) || []),
                  {
                    key: "remove",
                    label: "Remove from all managed projects",
                    icon: <Trash2 size={16} strokeWidth={1.75} />,
                    danger: true,
                    onClick: () =>
                      removeM.mutate({ user_id: record.id as string }),
                  },
                ],
              }}
            >
              <Button type="text" icon={<Ellipsis size={16} strokeWidth={1.75} />} />
            </Dropdown>
          ) : null,
      },
    ],
    [canManage, editForm, removeM],
  );

  return (
    <div className="console-page">
      <div className="console-stack">
        {!canManage ? (
          <Alert
            type="info"
            showIcon
            message="Only project admins can invite collaborators"
            description="You can see people who share projects with you. Ask an owner to grant admin if you need to invite others."
            style={{ marginBottom: 16 }}
          />
        ) : null}

        {canManage ? (
          <ConsoleCard
            className="console-card-spaced"
            title={<ConsoleCardTitle icon={Plus} label="Invite teammate" />}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{ make_admin: false, project_ids: [], administrative_permissions: [] }}
              onFinish={(values) => inviteM.mutate(values)}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
              >
                <AutoComplete
                  placeholder="teammate@example.com"
                  onSearch={setEmailQ}
                  options={(userSearch?.searchSystemUsers || [])
                    .filter((u): u is NonNullable<typeof u> => Boolean(u?.email))
                    .map((u) => ({
                      value: u.email as string,
                      label: `${u.email}${u.first_name ? ` — ${u.first_name} ${u.last_name || ""}` : ""}`,
                    }))}
                />
              </Form.Item>
              <Form.Item
                name="project_ids"
                label="Projects"
                rules={[{ required: true, message: "Select at least one project" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select projects this person can open"
                  options={adminProjects.map((p) => ({
                    value: p.id,
                    label: p.name || p.id,
                  }))}
                />
              </Form.Item>
              <Form.Item name="make_admin" label="Full project admin" valuePropName="checked">
                <Switch />
              </Form.Item>
              {!makeAdmin ? (
                <Form.Item
                  name="administrative_permissions"
                  label="Console sections"
                  rules={[{ required: true, message: "Pick at least one section" }]}
                >
                  <Checkbox.Group style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
                    {CONSOLE_SECTIONS.map((section) => (
                      <Checkbox key={section.value} value={section.value}>
                        {section.label}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Form.Item>
              ) : (
                <Text type="secondary">
                  Admin can open every console section on the selected projects.
                </Text>
              )}
              <Button type="primary" htmlType="submit" loading={inviteM.isPending}>
                Invite
              </Button>
            </Form>
          </ConsoleCard>
        ) : null}

        <MonoTableCard
          title={<ConsoleCardTitle icon={Users} label="Team members" />}
          tableProps={{
            loading: membersQuery.isLoading,
            columns,
            dataSource: members,
            rowKey: (row) => row.id || row.email || "",
            pagination: false,
          }}
        />
      </div>

      <Modal
        title="Edit access"
        open={Boolean(editMember)}
        onCancel={() => setEditMember(null)}
        onOk={() => editForm.submit()}
        confirmLoading={updateM.isPending}
        okText="Save"
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={(values) => {
            if (!editMember?.id) return;
            updateM.mutate({ ...values, user_id: editMember.id });
          }}
        >
          <Form.Item
            name="project_ids"
            label="Projects"
            rules={[{ required: true, message: "Select at least one project" }]}
          >
            <Select
              mode="multiple"
              options={adminProjects.map((p) => ({
                value: p.id,
                label: p.name || p.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="make_admin" label="Full project admin" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {() =>
              editForm.getFieldValue("make_admin") ? (
                <Text type="secondary">Admin can open every console section.</Text>
              ) : (
                <Form.Item
                  name="administrative_permissions"
                  label="Console sections"
                  rules={[{ required: true, message: "Pick at least one section" }]}
                >
                  <Checkbox.Group style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
                    {CONSOLE_SECTIONS.map((section) => (
                      <Checkbox key={section.value} value={section.value}>
                        {section.label}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Form.Item>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkspaceTeamsPage;
