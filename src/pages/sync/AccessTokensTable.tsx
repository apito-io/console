import { Button, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { CircleAlert, RotateCw, Trash2 } from "lucide-react";
import type { AccessTokenPreset, AccessTokenPublic } from "./types";
import { effectiveStatus, formatRelativeOrNever, presetLabel } from "./accessTokenUtils";
import "../../components/console/ConsoleShell.css";

const { Text } = Typography;

export interface AccessTokensTableProps {
  tokens: AccessTokenPublic[];
  presets?: AccessTokenPreset[];
  projectNameById?: Record<string, string>;
  loading?: boolean;
  revokingId?: string | null;
  rotatingId?: string | null;
  onRevoke: (id: string) => void;
  onRotate: (id: string) => void;
  emptyText?: string;
}

function statusTag(record: AccessTokenPublic) {
  const status = effectiveStatus(record);
  if (status === "active") {
    return <Tag className="mono-badge--live">Active</Tag>;
  }
  if (status === "revoked") {
    return <Tag className="mono-badge--danger">Revoked</Tag>;
  }
  return <Tag className="mono-badge--danger">Expired</Tag>;
}

function projectGrantCell(
  record: AccessTokenPublic,
  projectNameById?: Record<string, string>,
) {
  if (record.project_grant_mode === "all_admin_projects") {
    return <Tag>All admin projects</Tag>;
  }
  const ids = record.project_ids ?? [];
  if (ids.length === 0) {
    return <Text type="secondary">—</Text>;
  }
  const names = ids.map((id) => projectNameById?.[id] ?? id);
  if (names.length <= 2) {
    return (
      <div className="console-tag-stack">
        {names.map((n, i) => (
          <Tag key={i}>{n}</Tag>
        ))}
      </div>
    );
  }
  return (
    <Tooltip title={names.join(", ")}>
      <Tag>{names.length} projects</Tag>
    </Tooltip>
  );
}

export function AccessTokensTable({
  tokens,
  presets,
  projectNameById,
  loading,
  revokingId,
  rotatingId,
  onRevoke,
  onRotate,
  emptyText = "No access tokens found.",
}: AccessTokensTableProps) {
  const columns = [
    {
      title: "Name",
      key: "name",
      width: 200,
      render: (_: unknown, record: AccessTokenPublic) => (
        <div>
          <div className="mono-cell-title">{record.name || "Untitled token"}</div>
          {record.secret_prefix ? (
            <div className="mono-cell-subtitle">{record.secret_prefix}…</div>
          ) : null}
        </div>
      ),
    },
    {
      title: "Preset",
      key: "preset",
      width: 140,
      render: (_: unknown, record: AccessTokenPublic) => (
        <Tag>{presetLabel(record.preset, presets)}</Tag>
      ),
    },
    {
      title: "Project grant",
      key: "project_grant",
      width: 200,
      render: (_: unknown, record: AccessTokenPublic) =>
        projectGrantCell(record, projectNameById),
    },
    {
      title: "Capabilities",
      key: "capabilities",
      width: 110,
      render: (_: unknown, record: AccessTokenPublic) => (
        <Tag>{record.capability_count ?? record.capabilities?.length ?? 0}</Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 90,
      render: (_: unknown, record: AccessTokenPublic) => statusTag(record),
    },
    {
      title: "Expires",
      key: "expires_at",
      width: 120,
      render: (_: unknown, record: AccessTokenPublic) => {
        if (!record.expires_at) return <Text type="secondary">Never</Text>;
        const expired = dayjs(record.expires_at).isBefore(dayjs());
        return (
          <Tag className={expired ? "mono-badge--danger" : undefined}>
            {expired ? "Expired" : dayjs(record.expires_at).fromNow()}
          </Tag>
        );
      },
    },
    {
      title: "Created",
      key: "created_at",
      width: 120,
      render: (_: unknown, record: AccessTokenPublic) => (
        <Text type="secondary">{formatRelativeOrNever(record.created_at, "—")}</Text>
      ),
    },
    {
      title: "Last used",
      key: "last_used_at",
      width: 120,
      render: (_: unknown, record: AccessTokenPublic) => (
        <Text type="secondary">{formatRelativeOrNever(record.last_used_at, "Never")}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_: unknown, record: AccessTokenPublic) => {
        const status = effectiveStatus(record);
        const isRevoked = status === "revoked";
        return (
          <Space>
            <Popconfirm
              title="Rotate token"
              description="A new secret will be issued with the same grants. The old secret stops working immediately."
              onConfirm={() => onRotate(record.id)}
              okText="Rotate"
              cancelText="Cancel"
              icon={<CircleAlert size={16} strokeWidth={1.75} className="console-icon-danger" />}
              disabled={isRevoked}
            >
              <Tooltip title="Rotate token">
                <Button
                  type="text"
                  icon={<RotateCw size={16} strokeWidth={1.75} />}
                  size="small"
                  disabled={isRevoked}
                  loading={rotatingId === record.id}
                />
              </Tooltip>
            </Popconfirm>
            <Popconfirm
              title="Revoke token"
              description="This immediately disables the token. This can't be undone."
              onConfirm={() => onRevoke(record.id)}
              okText="Revoke"
              cancelText="Cancel"
              icon={<CircleAlert size={16} strokeWidth={1.75} className="console-icon-danger" />}
              disabled={isRevoked}
            >
              <Tooltip title="Revoke token">
                <Button
                  type="text"
                  icon={<Trash2 size={16} strokeWidth={1.75} />}
                  size="small"
                  danger
                  disabled={isRevoked}
                  loading={revokingId === record.id}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      className="mono-table"
      columns={columns}
      dataSource={tokens}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} tokens`,
      }}
      locale={{ emptyText }}
    />
  );
}
