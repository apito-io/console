import { httpService } from "../../services/httpService";
import {
  PROJECT_LIST,
  PROJECT_SWITCH,
  PROJECT_DELETE,
} from "../../constants/api";
import type { Project, ProjectDeleteRequest, ProjectListResponse } from "../../types/project";

type RawListRow = Record<string, unknown>;

export function normalizeProjectListRow(row: RawListRow): Project {
  const driver = row.driver as { engine?: string } | undefined;
  const engineFromDriver =
    driver && typeof driver.engine === "string" ? driver.engine : "";
  const db = engineFromDriver || (typeof row.db === "string" ? row.db : "");

  const pt = row.project_type;
  let projectType = 0;
  if (typeof pt === "number" && !Number.isNaN(pt)) {
    projectType = pt;
  } else if (pt === "1") {
    projectType = 1;
  } else if (typeof pt === "string" && pt.toLowerCase() === "saas") {
    projectType = 1;
  }

  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    description: String(row.description ?? ""),
    created_at: String(row.created_at ?? ""),
    plan: "free",
    db,
    status: row.status as Project["status"],
    project_type: projectType,
    role: typeof row.role === "string" ? row.role : undefined,
    plan_type: typeof row.plan_type === "string" ? row.plan_type : undefined,
    tire_type: typeof row.tire_type === "string" ? row.tire_type : undefined,
    tenant_model_name:
      typeof row.tenant_model_name === "string"
        ? row.tenant_model_name
        : undefined,
  };
}

export function normalizeProjectListResponse(
  raw: ProjectListResponse
): ProjectListResponse {
  const body = raw.body;
  if (!Array.isArray(body)) {
    return raw;
  }
  return {
    ...raw,
    body: body.map((row) => normalizeProjectListRow(row as RawListRow)),
  };
}

export async function fetchProjectList(): Promise<ProjectListResponse> {
  const response = await httpService.post(PROJECT_LIST);
  return normalizeProjectListResponse(response.data);
}

export async function switchProjectApi(projectId: string) {
  return httpService.post(PROJECT_SWITCH, { id: projectId });
}

export async function deleteProjectApi(payload: ProjectDeleteRequest) {
  return httpService.post(PROJECT_DELETE, payload);
}
