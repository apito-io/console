import { httpService } from "../../services/httpService";
import { PROJECT_LIST, PROJECT_SWITCH, PROJECT_DELETE, } from "../../constants/api";
export function normalizeProjectListRow(row) {
    const driver = row.driver;
    const engineFromDriver = driver && typeof driver.engine === "string" ? driver.engine : "";
    const db = engineFromDriver || (typeof row.db === "string" ? row.db : "");
    const pt = row.project_type;
    let projectType = 0;
    if (typeof pt === "number" && !Number.isNaN(pt)) {
        projectType = pt;
    }
    else if (pt === "1") {
        projectType = 1;
    }
    else if (typeof pt === "string" && pt.toLowerCase() === "saas") {
        projectType = 1;
    }
    return {
        id: String(row.id ?? ""),
        name: String(row.name ?? ""),
        description: String(row.description ?? ""),
        created_at: String(row.created_at ?? ""),
        plan: "free",
        db,
        status: row.status,
        project_type: projectType,
        role: typeof row.role === "string" ? row.role : undefined,
        plan_type: typeof row.plan_type === "string" ? row.plan_type : undefined,
        tire_type: typeof row.tire_type === "string" ? row.tire_type : undefined,
        tenant_model_name: typeof row.tenant_model_name === "string"
            ? row.tenant_model_name
            : undefined,
    };
}
export function normalizeProjectListResponse(raw) {
    const body = raw.body;
    if (!Array.isArray(body)) {
        return raw;
    }
    return {
        ...raw,
        body: body.map((row) => normalizeProjectListRow(row)),
    };
}
export async function fetchProjectList() {
    const response = await httpService.post(PROJECT_LIST);
    return normalizeProjectListResponse(response.data);
}
export async function switchProjectApi(projectId) {
    return httpService.post(PROJECT_SWITCH, { id: projectId });
}
export async function deleteProjectApi(payload) {
    return httpService.post(PROJECT_DELETE, payload);
}
