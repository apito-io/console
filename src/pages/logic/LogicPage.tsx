import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ConsoleCard, ConsoleCardTitle } from "../../components/console";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import { Plus, Trash2, Workflow } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  deleteProjectFunction,
  deriveFunctionStatus,
  fetchProjectFunctions,
  statusColor,
  statusLabel,
  type ProjectFunctionRow,
} from "./logicApi";
import {
  FunctionEditorDrawer,
  type EditorDraft,
} from "./components/FunctionEditorDrawer";
import { FUNCTION_TEMPLATES, type FunctionTemplateId } from "./templates";
import "../../components/console/ConsoleShell.css";

const LOGIC_QUERY_KEY = ["logic", "projectFunctions"];

/**
 * Console /logic — production functions inventory + authoring drawer.
 */
const LogicPage = () => {
  const { decodeTokenData } = useAuth();
  const projectId = decodeTokenData()?.project_id ?? "";
  const queryClient = useQueryClient();

  const { data: functions = [], isLoading, refetch } = useQuery({
    queryKey: LOGIC_QUERY_KEY,
    queryFn: fetchProjectFunctions,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [draft, setDraft] = useState<EditorDraft | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [createTemplate, setCreateTemplate] =
    useState<FunctionTemplateId>("hello");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return functions.filter((fn) => {
      if (!fn.name) return false;
      if (q && !fn.name.toLowerCase().includes(q)) return false;
      const status = deriveFunctionStatus(fn);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      return true;
    });
  }, [functions, search, statusFilter]);

  const openCreate = useCallback(() => {
    const tpl =
      FUNCTION_TEMPLATES.find((t) => t.id === createTemplate) ??
      FUNCTION_TEMPLATES[0];
    setDraft({
      name: tpl.name,
      source: tpl.source,
      description: tpl.label,
      runtime: "deno",
      graphqlExposure: tpl.graphqlExposure,
      capabilities: [...tpl.capabilities],
      baselineSource: tpl.source,
      isCreate: true,
      existsOnServer: false,
    });
    setDrawerOpen(true);
  }, [createTemplate]);

  const openEdit = useCallback((fn: ProjectFunctionRow) => {
    if (!fn.name) return;
    const source = fn.source || "";
    setDraft({
      name: fn.name,
      source,
      description: fn.description ?? "",
      runtime: fn.runtime_config?.runtime === "wasm" ? "wasm" : "deno",
      graphqlExposure:
        fn.graphql_schema_type === "Mutation" ? "Mutation" : "Query",
      capabilities: (fn.capabilities ?? []).filter(
        (c): c is string => typeof c === "string" && c.length > 0,
      ),
      restSecret: fn.rest_api_secret_url_key ?? undefined,
      activeRevisionId: fn.active_revision_id,
      baselineSource: source,
      isCreate: false,
      existsOnServer: true,
    });
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setDraft(null);
  }, []);

  const onDraftChange = useCallback((patch: Partial<EditorDraft>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const onDelete = useCallback(
    async (functionName: string) => {
      if (!functionName) return;
      setDeleting(true);
      try {
        await deleteProjectFunction(functionName);
        await queryClient.invalidateQueries({ queryKey: LOGIC_QUERY_KEY });
        await refetch();
        if (draft?.name === functionName) closeDrawer();
        setDeleteTarget(null);
        message.success(`Deleted function ${functionName}`);
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Delete failed");
      } finally {
        setDeleting(false);
      }
    },
    [closeDrawer, draft?.name, queryClient, refetch],
  );

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (v: string) => <Typography.Text strong>{v}</Typography.Text>,
      },
      {
        title: "Status",
        key: "status",
        render: (_: unknown, row: ProjectFunctionRow) => {
          const status = deriveFunctionStatus(row);
          return <Tag color={statusColor(status)}>{statusLabel(status)}</Tag>;
        },
      },
      {
        title: "Runtime",
        key: "runtime",
        render: (_: unknown, row: ProjectFunctionRow) => (
          <Tag>{row.runtime_config?.runtime ?? "deno"}</Tag>
        ),
      },
      {
        title: "GraphQL",
        key: "graphql",
        render: (_: unknown, row: ProjectFunctionRow) => (
          <Tag>{row.graphql_schema_type ?? "Query"}</Tag>
        ),
      },
      {
        title: "Updated",
        dataIndex: "updated_at",
        key: "updated_at",
        render: (v: string | null | undefined) => v ?? "—",
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        render: (_: unknown, row: ProjectFunctionRow) =>
          row.name ? (
            <Space>
              <Button
                type="link"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(row);
                }}
                aria-label={`Edit ${row.name}`}
              >
                Edit
              </Button>
              <Button
                type="text"
                danger
                size="middle"
                icon={<Trash2 size={16} />}
                aria-label={`Delete ${row.name}`}
                style={{ minWidth: 40, minHeight: 40 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(row.name!);
                }}
              />
            </Space>
          ) : null,
      },
    ],
    [openEdit],
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {!projectId ? (
        <Alert
          type="warning"
          showIcon
          message="No active project"
          description="Open Projects and switch into Rosna (or your target project) before managing functions."
        />
      ) : null}

      <ConsoleCard
        title={<ConsoleCardTitle icon={Workflow} label="Logic / Functions" />}
      >
        <p className="console-text-muted-block">
          Draft, test, and deploy Deno functions. Live callable/public GraphQL
          runs the active revision; the editor Source is the editable draft.
        </p>

        <Space wrap style={{ marginBottom: 16, width: "100%" }}>
          <Input.Search
            allowClear
            placeholder="Search functions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
            aria-label="Search functions"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 180 }}
            options={[
              { value: "all", label: "All statuses" },
              { value: "never_deployed", label: "Never deployed" },
              { value: "draft_changes", label: "Draft changes" },
              { value: "deployed", label: "Deployed" },
            ]}
            aria-label="Filter by status"
          />
          <Select
            value={createTemplate}
            onChange={setCreateTemplate}
            style={{ width: 260 }}
            options={FUNCTION_TEMPLATES.map((t) => ({
              value: t.id,
              label: t.label,
            }))}
            aria-label="Create from template"
          />
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={openCreate}
            aria-label="Create function"
          >
            Create function
          </Button>
        </Space>

        <Table
          size="middle"
          loading={isLoading}
          pagination={false}
          columns={columns}
          dataSource={filtered.map((f) => ({ ...f, key: f.name }))}
          locale={{
            emptyText:
              "No functions yet — choose a template and Create function.",
          }}
          onRow={(record) => ({
            onClick: () => openEdit(record),
            style: { cursor: "pointer" },
          })}
        />
      </ConsoleCard>

      <FunctionEditorDrawer
        open={drawerOpen}
        draft={draft}
        projectId={projectId}
        onClose={closeDrawer}
        onDraftChange={onDraftChange}
      />

      <DeleteConfirmModal
        isVisible={!!deleteTarget}
        setIsVisible={(v) => {
          if (!v) setDeleteTarget(null);
        }}
        loader={deleting}
        title="Delete function"
        description={
          deleteTarget
            ? `Type DELETE to permanently remove function “${deleteTarget}”.`
            : "Write DELETE in the box to confirm!"
        }
        handleModelConfirm={() => {
          if (deleteTarget) void onDelete(deleteTarget);
        }}
      />
    </Space>
  );
};

export default LogicPage;
