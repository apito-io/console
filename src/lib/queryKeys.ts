/** TanStack Query key factories — import from feature `queries.ts` files. */

export const projectKeys = {
  all: ["projects"] as const,
  list: () => [...projectKeys.all, "list"] as const,
};

export const accountKeys = {
  all: ["accounts"] as const,
  profile: () => [...accountKeys.all, "profile"] as const,
};

/** @deprecated Superseded by accessTokenKeys; kept in case other callers still reference it. */
export const syncKeys = {
  all: ["sync"] as const,
  tokens: () => [...syncKeys.all, "tokens"] as const,
};

export const accessTokenKeys = {
  all: ["accessTokens"] as const,
  list: () => [...accessTokenKeys.all, "list"] as const,
  catalog: () => [...accessTokenKeys.all, "catalog"] as const,
  administrableProjects: () =>
    [...accessTokenKeys.all, "administrableProjects"] as const,
};

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  list: () => [...subscriptionKeys.all, "list"] as const,
  plan: () => [...subscriptionKeys.all, "plan"] as const,
  instances: () => [...subscriptionKeys.all, "instances"] as const,
};

export const partnerKeys = {
  all: ["partners"] as const,
  list: (q?: string) => [...partnerKeys.all, "list", q ?? ""] as const,
};

export const pluginRegistryKeys = {
  all: ["plugins"] as const,
  registry: (projectId?: string) =>
    [...pluginRegistryKeys.all, "registry", projectId ?? ""] as const,
};

export const adminKeys = {
  all: ["admin"] as const,
  projects: () => [...adminKeys.all, "projects"] as const,
};

export const auditKeys = {
  all: ["audit"] as const,
  list: (page: number, pageSize: number, org?: string, user?: string) =>
    [
      ...auditKeys.all,
      "list",
      { page, pageSize, org: org ?? "", user: user ?? "" },
    ] as const,
};

export const slowQueryKeys = {
  all: ["slow-queries"] as const,
  list: (params: Record<string, unknown>) =>
    [...slowQueryKeys.all, "list", params] as const,
};

export const logKeys = {
  all: ["logs"] as const,
  search: (params: Record<string, unknown>) =>
    [...logKeys.all, "search", params] as const,
  detail: (id: string) => [...logKeys.all, "detail", id] as const,
  trace: (traceId: string) => [...logKeys.all, "trace", traceId] as const,
  stats: (params: Record<string, unknown>) =>
    [...logKeys.all, "stats", params] as const,
  facets: (params: Record<string, unknown>) =>
    [...logKeys.all, "facets", params] as const,
  health: () => [...logKeys.all, "health"] as const,
};

export const backupKeys = {
  all: ["backups"] as const,
  providers: () => [...backupKeys.all, "providers"] as const,
  targets: () => [...backupKeys.all, "targets"] as const,
  snapshots: (targetType: string, targetId: string, limit?: number) =>
    [...backupKeys.all, "snapshots", targetType, targetId, limit ?? 20] as const,
  runs: (targetType: string, targetId: string, limit?: number) =>
    [...backupKeys.all, "runs", targetType, targetId, limit ?? 20] as const,
};

export const schemaKeys = {
  all: ["schema"] as const,
  status: () => [...schemaKeys.all, "status"] as const,
  preview: (source: "live" | "draft") =>
    [...schemaKeys.all, "preview", source] as const,
  diff: (changesetId?: string) =>
    [...schemaKeys.all, "diff", changesetId ?? ""] as const,
  events: (changesetId?: string) =>
    [...schemaKeys.all, "events", changesetId ?? ""] as const,
  execution: (changesetId?: string, version?: number, limit?: number) =>
    [
      ...schemaKeys.all,
      "execution",
      changesetId ?? "",
      version ?? "",
      limit ?? "",
    ] as const,
  versions: () => [...schemaKeys.all, "versions"] as const,
};

export const modelKeys = {
  all: ["models"] as const,
  list: () => [...modelKeys.all, "list"] as const,
  detail: (name: string) => [...modelKeys.all, "detail", name] as const,
};

export const contentKeys = {
  all: ["content"] as const,
  list: (modelName: string) => [...contentKeys.all, "list", modelName] as const,
  detail: (modelName: string, id: string) =>
    [...contentKeys.all, "detail", modelName, id] as const,
};

export const settingsKeys = {
  all: ["settings"] as const,
  storage: () => [...settingsKeys.all, "storage"] as const,
  authentication: () => [...settingsKeys.all, "authentication"] as const,
  roles: () => [...settingsKeys.all, "roles"] as const,
  plugins: () => [...settingsKeys.all, "plugins"] as const,
  webhooks: () => [...settingsKeys.all, "webhooks"] as const,
  apiSecrets: () => [...settingsKeys.all, "apiSecrets"] as const,
  general: () => [...settingsKeys.all, "general"] as const,
  teams: () => [...settingsKeys.all, "teams"] as const,
};

export const tenantKeys = {
  all: ["tenants"] as const,
  list: () => [...tenantKeys.all, "list"] as const,
  search: (projectId: string, q?: string) =>
    [...tenantKeys.all, "search", projectId, q ?? ""] as const,
};

export const proUserKeys = {
  all: ["proUsers"] as const,
  search: (params?: Record<string, unknown>) =>
    [...proUserKeys.all, "search", params ?? {}] as const,
};

export const projectFileKeys = {
  all: ["projectFiles"] as const,
  list: (filters?: {
    fileType?: string;
    limit?: number;
    offset?: number;
  }) => [...projectFileKeys.all, "list", filters ?? {}] as const,
};
