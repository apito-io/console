import { useMemo, useState } from "react";
import { Alert, Result, message } from "antd";
import { useLocation } from "../../router/navigation";
import { useProjectsQuery } from "../projects/queries";
import {
  useAccessTokenCatalogQuery,
  useAdministrableProjectsQuery,
} from "./queries";
import { CreateAccessTokenForm, type SimpleProjectOption } from "./CreateAccessTokenForm";
import { httpService } from "../../services/httpService";
import type { CreateAccessTokenPayload } from "./types";
import "../../components/console/ConsoleShell.css";

export type DeviceApprovalAudience = "cli" | "mcp";

type DeviceApprovalPageProps = {
  audience: DeviceApprovalAudience;
};

const copy: Record<
  DeviceApprovalAudience,
  {
    approvePath: string;
    allowedPresets: string[];
    cardLabel: string;
    submitLabel: string;
    successTitle: string;
    missingMessage: string;
    missingDescription: string;
    confirmFallback: string;
    scopeDescription: string;
    grantNote: string;
    namePrefix: string;
    errorFallback: string;
  }
> = {
  cli: {
    approvePath: "/system/cli/v1/login/approve",
    allowedPresets: ["cli_login", "cli_sync", "custom"],
    cardLabel: "Give CLI access",
    submitLabel: "Give CLI access",
    successTitle: "CLI access granted",
    missingMessage: "This page was opened without a CLI device code.",
    missingDescription: "Run apito login again and open the link it prints.",
    confirmFallback: "Approve this CLI login",
    scopeDescription:
      "Choose CLI login, CLI sync, or Custom. Then choose the projects this token may use.",
    grantNote: "",
    namePrefix: "CLI",
    errorFallback: "Could not approve the CLI",
  },
  mcp: {
    approvePath: "/system/mcp/v1/login/approve",
    allowedPresets: ["mcp_assistant", "mcp_advanced", "custom"],
    cardLabel: "Give MCP access",
    submitLabel: "Give MCP access",
    successTitle: "MCP access granted",
    missingMessage: "This page was opened without an MCP device code.",
    missingDescription: "Run apito mcp connect again and open the link it prints.",
    confirmFallback: "Approve this MCP connection",
    scopeDescription:
      "Choose MCP assistant, MCP advanced, or Custom. Then choose the projects and tenants this token may use.",
    grantNote: "",
    namePrefix: "MCP",
    errorFallback: "Could not approve MCP",
  },
};

function errorText(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { message?: string } } }).response?.data;
    if (data?.message) return data.message;
  }
  return err instanceof Error ? err.message : fallback;
}

const DeviceApprovalPage = ({ audience }: DeviceApprovalPageProps) => {
  const text = copy[audience];
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const deviceCode = params.get("device_code")?.trim() ?? "";
  const requestId = audience === "mcp" ? params.get("request_id")?.trim() ?? "" : "";
  const userCode = params.get("user_code")?.trim() ?? "";
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: catalog, isLoading: catalogLoading } = useAccessTokenCatalogQuery();
  const { data: administrableData, isLoading: administrableLoading } =
    useAdministrableProjectsQuery();
  const { data: projectListData, isLoading: projectListLoading } = useProjectsQuery();

  const administrableProjects = useMemo(
    () =>
      administrableData?.projects.filter(
        (p, i, self) => i === self.findIndex((x) => x.id === p.id),
      ) ?? [],
    [administrableData],
  );

  const projectTypeById = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projectListData?.body ?? []) {
      map.set(p.id, p.project_type ?? 0);
    }
    return map;
  }, [projectListData]);

  const projectOptions: SimpleProjectOption[] = useMemo(() => {
    const fromList = (projectListData?.body ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      isSaas: projectTypeById.get(p.id) === 1,
    }));
    if (fromList.length > 0) {
      return fromList.filter((p, i, self) => i === self.findIndex((x) => x.id === p.id));
    }
    return administrableProjects.map((p) => ({
      id: p.id,
      name: p.name,
      isSaas: projectTypeById.get(p.id) === 1,
    }));
  }, [administrableProjects, projectListData, projectTypeById]);

  const approve = async (payload: CreateAccessTokenPayload) => {
    setSubmitting(true);
    try {
      const response = await httpService.post(
        requestId ? "/system/oauth/mcp/approve" : text.approvePath,
        requestId
          ? {
              request_id: requestId,
              name: payload.name,
              description: payload.description,
              duration: payload.duration,
              preset: payload.preset,
              capabilities: payload.preset === "custom" ? payload.capabilities : [],
              project_grant_mode: payload.project_grant_mode,
              project_ids: payload.project_ids,
              tenant_grant_mode: payload.tenant_grant_mode,
              tenant_ids: payload.tenant_ids,
              acknowledge_danger: Boolean(payload.acknowledge_danger),
            }
          : {
              device_code: deviceCode,
              name: payload.name,
              description: payload.description,
              duration: payload.duration,
              preset: payload.preset,
              capabilities: payload.preset === "custom" ? payload.capabilities : [],
              project_grant_mode: payload.project_grant_mode,
              project_ids: payload.project_ids,
              tenant_grant_mode: payload.tenant_grant_mode,
              tenant_ids: payload.tenant_ids,
              acknowledge_danger: Boolean(payload.acknowledge_danger),
            },
      );
      const redirectTo = (response.data as { redirect_to?: string } | undefined)?.redirect_to;
      if (redirectTo) {
        window.location.assign(redirectTo);
        return;
      }
      setDone(true);
    } catch (err) {
      message.error(errorText(err, text.errorFallback));
    } finally {
      setSubmitting(false);
    }
  };

  if (!deviceCode && !requestId) {
    return (
      <div className="console-page">
        <Alert
          type="error"
          showIcon
          message={text.missingMessage}
          description={text.missingDescription}
        />
      </div>
    );
  }

  if (done) {
    return (
      <div className="console-page">
        <Result
          status="success"
          title={text.successTitle}
          subTitle={
            requestId
              ? "Return to the MCP client. The access token stays on the server."
              : "Return to the terminal. The access token is delivered there once."
          }
        />
      </div>
    );
  }

  return (
    <div className="console-page">
      <div className="console-stack">
        <Alert
          type="info"
          showIcon
          message={
            userCode
              ? `Confirm this code matches the terminal: ${userCode}`
              : text.confirmFallback
          }
          description={text.scopeDescription}
        />
        <CreateAccessTokenForm
          catalog={catalog}
          catalogLoading={catalogLoading}
          administrableProjects={administrableProjects}
          projectOptions={projectOptions}
          projectsLoading={administrableLoading || projectListLoading}
          isSubmitting={submitting}
          allowedPresets={text.allowedPresets}
          grantNote={text.grantNote}
          defaultName={userCode ? `${text.namePrefix} ${userCode}` : text.namePrefix}
          cardLabel={text.cardLabel}
          submitLabel={text.submitLabel}
          onSubmit={approve}
        />
      </div>
    </div>
  );
};

export default DeviceApprovalPage;
