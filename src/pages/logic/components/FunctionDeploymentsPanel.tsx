import { Button, Space, Table, Tag, Typography, message } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFunctionDeployments,
  fetchFunctionRevisions,
  rollbackProjectFunction,
  type FunctionRevisionRow,
} from "../logicApi";

type Props = {
  functionName: string;
  activeRevisionId?: string | null;
  enabled: boolean;
};

export function FunctionDeploymentsPanel({
  functionName,
  activeRevisionId,
  enabled,
}: Props) {
  const queryClient = useQueryClient();
  const revisionsQuery = useQuery({
    queryKey: ["logic", "revisions", functionName],
    queryFn: () => fetchFunctionRevisions(functionName),
    enabled: enabled && !!functionName,
  });
  const deploymentsQuery = useQuery({
    queryKey: ["logic", "deployments", functionName],
    queryFn: () => fetchFunctionDeployments(functionName),
    enabled: enabled && !!functionName,
  });

  const onRollback = async (revisionId: string) => {
    try {
      await rollbackProjectFunction(functionName, revisionId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["logic", "projectFunctions"] }),
        queryClient.invalidateQueries({
          queryKey: ["logic", "revisions", functionName],
        }),
        queryClient.invalidateQueries({
          queryKey: ["logic", "deployments", functionName],
        }),
      ]);
      message.success(`Rolled back to revision ${revisionId.slice(0, 8)}…`);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Rollback failed");
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Typography.Title level={5}>Deployments</Typography.Title>
        <Table
          size="small"
          loading={deploymentsQuery.isLoading}
          pagination={false}
          rowKey={(r) => r.id ?? `${r.revision_id}-${r.created_at}`}
          dataSource={deploymentsQuery.data ?? []}
          locale={{ emptyText: "No deployments yet — Deploy from the Code tab." }}
          columns={[
            {
              title: "Status",
              dataIndex: "status",
              render: (v: string) => (
                <Tag color={v === "active" ? "green" : "default"}>{v}</Tag>
              ),
            },
            {
              title: "Revision",
              dataIndex: "revision_id",
              render: (v: string) => (
                <Typography.Text code>
                  {v?.slice(0, 10) ?? "—"}
                  {activeRevisionId === v ? " (active)" : ""}
                </Typography.Text>
              ),
            },
            { title: "When", dataIndex: "created_at" },
            {
              title: "Rollback of",
              dataIndex: "rollback_of",
              render: (v: string | null | undefined) =>
                v ? (
                  <Typography.Text code>{v.slice(0, 10)}</Typography.Text>
                ) : (
                  "—"
                ),
            },
          ]}
        />
      </div>

      <div>
        <Typography.Title level={5}>Revisions</Typography.Title>
        <Table
          size="small"
          loading={revisionsQuery.isLoading}
          pagination={false}
          rowKey={(r) => r.id ?? String(r.revision)}
          dataSource={revisionsQuery.data ?? []}
          locale={{ emptyText: "No revisions yet." }}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              render: (v: string) => (
                <Typography.Text code>{v?.slice(0, 10) ?? "—"}</Typography.Text>
              ),
            },
            { title: "Rev", dataIndex: "revision" },
            { title: "Created", dataIndex: "created_at" },
            {
              title: "",
              key: "actions",
              render: (_: unknown, row: FunctionRevisionRow) =>
                row.id && row.id !== activeRevisionId ? (
                  <Button
                    size="small"
                    onClick={() => onRollback(row.id!)}
                    aria-label={`Rollback to ${row.id}`}
                  >
                    Rollback
                  </Button>
                ) : row.id === activeRevisionId ? (
                  <Tag color="green">Active</Tag>
                ) : null,
            },
          ]}
        />
      </div>
    </Space>
  );
}
