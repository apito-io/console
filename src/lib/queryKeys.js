/** TanStack Query key factories — import from feature `queries.ts` files. */
export const projectKeys = {
    all: ["projects"],
    list: () => [...projectKeys.all, "list"],
};
export const accountKeys = {
    all: ["accounts"],
    profile: () => [...accountKeys.all, "profile"],
};
export const syncKeys = {
    all: ["sync"],
    tokens: () => [...syncKeys.all, "tokens"],
};
export const subscriptionKeys = {
    all: ["subscriptions"],
    list: () => [...subscriptionKeys.all, "list"],
};
export const pluginRegistryKeys = {
    all: ["plugins"],
    registry: () => [...pluginRegistryKeys.all, "registry"],
};
export const adminKeys = {
    all: ["admin"],
    projects: () => [...adminKeys.all, "projects"],
};
export const auditKeys = {
    all: ["audit"],
    list: (page, pageSize, org, user) => [
        ...auditKeys.all,
        "list",
        { page, pageSize, org: org ?? "", user: user ?? "" },
    ],
};
export const schemaKeys = {
    all: ["schema"],
    status: () => [...schemaKeys.all, "status"],
    preview: (source) => [...schemaKeys.all, "preview", source],
    diff: (changesetId) => [...schemaKeys.all, "diff", changesetId ?? ""],
    events: (changesetId) => [...schemaKeys.all, "events", changesetId ?? ""],
    execution: (changesetId, version, limit) => [
        ...schemaKeys.all,
        "execution",
        changesetId ?? "",
        version ?? "",
        limit ?? "",
    ],
    versions: () => [...schemaKeys.all, "versions"],
};
export const modelKeys = {
    all: ["models"],
    list: () => [...modelKeys.all, "list"],
    detail: (name) => [...modelKeys.all, "detail", name],
};
export const contentKeys = {
    all: ["content"],
    list: (modelName) => [...contentKeys.all, "list", modelName],
    detail: (modelName, id) => [...contentKeys.all, "detail", modelName, id],
};
export const settingsKeys = {
    all: ["settings"],
    storage: () => [...settingsKeys.all, "storage"],
    authentication: () => [...settingsKeys.all, "authentication"],
    roles: () => [...settingsKeys.all, "roles"],
    plugins: () => [...settingsKeys.all, "plugins"],
    webhooks: () => [...settingsKeys.all, "webhooks"],
    apiSecrets: () => [...settingsKeys.all, "apiSecrets"],
    general: () => [...settingsKeys.all, "general"],
    teams: () => [...settingsKeys.all, "teams"],
};
export const tenantKeys = {
    all: ["tenants"],
    list: () => [...tenantKeys.all, "list"],
};
export const proUserKeys = {
    all: ["proUsers"],
    search: (params) => [...proUserKeys.all, "search", params ?? {}],
};
export const projectFileKeys = {
    all: ["projectFiles"],
    list: (filters) => [...projectFileKeys.all, "list", filters ?? {}],
};
