import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Drawer,
  Grid,
  Modal,
  Space,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { LogicCodeEditor } from "./LogicCodeEditor";
import { FunctionTestPanel } from "./FunctionTestPanel";
import { FunctionDeploymentsPanel } from "./FunctionDeploymentsPanel";
import { FunctionSettingsForm } from "./FunctionSettingsForm";
import {
  deployProjectFunction,
  statusColor,
  statusLabel,
  upsertProjectFunction,
  type FunctionDeployStatus,
  type FunctionGraphQLExposure,
  type ProjectFunctionRow,
} from "../logicApi";

const LOGIC_QUERY_KEY = ["logic", "projectFunctions"];

export type EditorDraft = {
  name: string;
  source: string;
  description: string;
  runtime: "deno" | "wasm";
  graphqlExposure: FunctionGraphQLExposure;
  capabilities: string[];
  restSecret?: string;
  activeRevisionId?: string | null;
  baselineSource: string;
  isCreate: boolean;
  existsOnServer: boolean;
};

type Props = {
  open: boolean;
  draft: EditorDraft | null;
  projectId: string;
  onClose: () => void;
  onDraftChange: (patch: Partial<EditorDraft>) => void;
};

export function FunctionEditorDrawer({
  open,
  draft,
  projectId,
  onClose,
  onDraftChange,
}: Props) {
  const screens = Grid.useBreakpoint();
  const wide = !!screens.lg;
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [cookies] = useCookies(["temp_tenant_id"]);
  const [tenantId, setTenantId] = useState("");
  const [activeTab, setActiveTab] = useState("code");

  useEffect(() => {
    if (open) setActiveTab("code");
  }, [open, draft?.name]);

  // Default draft-test tenant from Console cookie without mutating it.
  useEffect(() => {
    if (!open) return;
    const fromCookie =
      typeof cookies.temp_tenant_id === "string"
        ? cookies.temp_tenant_id.trim()
        : "";
    if (fromCookie) {
      setTenantId(fromCookie);
    }
  }, [open, draft?.name, cookies.temp_tenant_id]);

  const dirty = useMemo(() => {
    if (!draft) return false;
    return draft.source !== draft.baselineSource;
  }, [draft]);

  const deployStatus: FunctionDeployStatus = useMemo(() => {
    if (!draft) return "never_deployed";
    if (!draft.activeRevisionId) return "never_deployed";
    if (dirty) return "draft_changes";
    return "deployed";
  }, [draft, dirty]);

  const requestClose = useCallback(() => {
    if (!dirty) {
      onClose();
      return;
    }
    Modal.confirm({
      title: "Discard unsaved draft changes?",
      content: "You have local edits that are not saved.",
      okText: "Discard",
      okButtonProps: { danger: true },
      onOk: () => onClose(),
    });
  }, [dirty, onClose]);

  const saveDraft = useCallback(async () => {
    if (!draft) return;
    const trimmed = draft.name.trim();
    if (!trimmed) {
      message.error("Function name is required");
      return;
    }
    setSaving(true);
    try {
      const saved = await upsertProjectFunction({
        name: trimmed,
        description: draft.description,
        graphqlSchemaType: draft.graphqlExposure,
        runtime: draft.runtime,
        source: draft.source,
        update: draft.existsOnServer,
        capabilities: draft.capabilities,
      });
      onDraftChange({
        name: saved.name ?? trimmed,
        restSecret: saved.rest_api_secret_url_key ?? draft.restSecret,
        activeRevisionId: saved.active_revision_id,
        baselineSource: draft.source,
        isCreate: false,
        existsOnServer: true,
      });
      await queryClient.invalidateQueries({ queryKey: LOGIC_QUERY_KEY });
      message.success("Draft saved");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [draft, onDraftChange, queryClient]);

  const deploy = useCallback(async () => {
    if (!draft) return;
    const trimmed = draft.name.trim();
    if (!trimmed) {
      message.error("Function name is required");
      return;
    }
    setDeploying(true);
    try {
      if (dirty || !draft.existsOnServer) {
        await upsertProjectFunction({
          name: trimmed,
          description: draft.description,
          graphqlSchemaType: draft.graphqlExposure,
          runtime: draft.runtime,
          source: draft.source,
          update: draft.existsOnServer,
          capabilities: draft.capabilities,
        });
      }
      const out = await deployProjectFunction(trimmed, draft.source);
      const fn = out.function as ProjectFunctionRow | undefined;
      onDraftChange({
        activeRevisionId: fn?.active_revision_id ?? out.revision?.id,
        restSecret: fn?.rest_api_secret_url_key ?? draft.restSecret,
        baselineSource: draft.source,
        existsOnServer: true,
        isCreate: false,
      });
      await queryClient.invalidateQueries({ queryKey: LOGIC_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: ["logic", "revisions", trimmed],
      });
      await queryClient.invalidateQueries({
        queryKey: ["logic", "deployments", trimmed],
      });
      message.success(
        `Deployed revision ${String(out.revision?.id ?? "").slice(0, 8)}…`,
      );
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Deploy failed");
    } finally {
      setDeploying(false);
    }
  }, [draft, dirty, onDraftChange, queryClient]);

  if (!draft) return null;

  return (
    <Drawer
      open={open}
      onClose={requestClose}
      width={wide ? "80vw" : "100%"}
      destroyOnClose
      title={
        <Space wrap>
          <Typography.Text strong>
            {draft.isCreate ? "Create function" : draft.name}
          </Typography.Text>
          <Tag color={statusColor(deployStatus)}>{statusLabel(deployStatus)}</Tag>
          {dirty ? <Tag color="orange">Unsaved</Tag> : null}
          {draft.activeRevisionId ? (
            <Typography.Text type="secondary" code>
              rev {draft.activeRevisionId.slice(0, 8)}…
            </Typography.Text>
          ) : null}
        </Space>
      }
      styles={{
        body: { paddingTop: 8, display: "flex", flexDirection: "column", height: "100%" },
        footer: { borderTop: "1px solid var(--ant-color-border-secondary, #f0f0f0)" },
      }}
      footer={
        <Space style={{ width: "100%", justifyContent: "flex-end" }} wrap>
          <Button onClick={requestClose}>Close</Button>
          <Button loading={saving} onClick={saveDraft} aria-label="Save draft">
            Save draft
          </Button>
          <Button
            type="primary"
            loading={deploying}
            onClick={deploy}
            aria-label="Deploy function"
          >
            Deploy
          </Button>
        </Space>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ flex: 1, minHeight: 0 }}
        items={[
          {
            key: "code",
            label: "Code",
            children: (
              <div style={{ minHeight: wide ? "60vh" : 360 }}>
                <LogicCodeEditor
                  value={draft.source}
                  onChange={(source) => onDraftChange({ source })}
                  language="typescript"
                  height={wide ? "60vh" : "360px"}
                  ariaLabel="Function TypeScript source"
                />
              </div>
            ),
          },
          {
            key: "test",
            label: "Test",
            children: (
              <FunctionTestPanel
                functionName={draft.name}
                source={draft.source}
                tenantId={tenantId}
                onTenantIdChange={setTenantId}
                saved={draft.existsOnServer}
              />
            ),
          },
          {
            key: "deployments",
            label: "Deployments",
            children: (
              <FunctionDeploymentsPanel
                functionName={draft.name}
                activeRevisionId={draft.activeRevisionId}
                enabled={open && draft.existsOnServer}
              />
            ),
          },
          {
            key: "settings",
            label: "Settings",
            children: (
              <FunctionSettingsForm
                projectId={projectId}
                name={draft.name}
                isCreate={draft.isCreate}
                onNameChange={(name) => onDraftChange({ name })}
                graphqlExposure={draft.graphqlExposure}
                onGraphqlExposureChange={(graphqlExposure) =>
                  onDraftChange({ graphqlExposure })
                }
                runtime={draft.runtime}
                onRuntimeChange={(runtime) => onDraftChange({ runtime })}
                capabilities={draft.capabilities}
                onCapabilitiesChange={(capabilities) =>
                  onDraftChange({ capabilities })
                }
                restSecret={draft.restSecret}
                description={draft.description}
                onDescriptionChange={(description) =>
                  onDraftChange({ description })
                }
              />
            ),
          },
        ]}
      />
    </Drawer>
  );
}
