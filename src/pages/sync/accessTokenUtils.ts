import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type {
  AccessTokenCatalog,
  AccessTokenPreset,
  AccessTokenPublic,
  CapabilityDescriptor,
} from "./types";

dayjs.extend(relativeTime);

/** Client-side catalog so the create form stays usable if `/catalog` is down or engine is old. */
export const FALLBACK_ACCESS_TOKEN_CATALOG: AccessTokenCatalog = {
  presets: [
    {
      id: "read_only",
      label: "Read-only automation",
      description: "Read projects, schema, data, functions, files, settings, audit.",
      default_days: 90,
      capabilities: [
        "projects.read",
        "members.read",
        "roles.read",
        "tenants.read",
        "schema.read",
        "data.read",
        "functions.read",
        "files.read",
        "plugins.read",
        "sync.read",
        "audit.read",
        "settings.read",
      ],
    },
    {
      id: "cli_login",
      label: "CLI login",
      description:
        "Read the project list and published schema for apito types. Cannot read tenant documents or change the system.",
      default_days: 90,
      capabilities: ["projects.read", "schema.read"],
    },
    {
      id: "cli_sync",
      label: "CLI sync",
      description: "Sync read/write plus schema and function surfaces used by apito sync.",
      default_days: 90,
      capabilities: [
        "projects.read",
        "schema.read",
        "schema.write",
        "sync.read",
        "sync.write",
        "functions.read",
        "functions.write",
        "functions.deploy",
        "settings.read",
      ],
    },
    {
      id: "function_deploy",
      label: "Function deploy",
      description: "Read/write/test/deploy edge functions.",
      default_days: 30,
      danger: true,
      capabilities: [
        "projects.read",
        "functions.read",
        "functions.write",
        "functions.test",
        "functions.deploy",
      ],
    },
    {
      id: "data_import_export",
      label: "Data import/export",
      description: "Read and write documents and relations.",
      default_days: 90,
      capabilities: [
        "projects.read",
        "data.read",
        "data.write",
        "relations.write",
        "files.read",
        "files.write",
      ],
    },
    {
      id: "mcp_assistant",
      label: "MCP assistant",
      description: "Read-only tools for MCP assistants (default).",
      default_days: 90,
      capabilities: [
        "projects.read",
        "members.read",
        "roles.read",
        "tenants.read",
        "schema.read",
        "data.read",
        "functions.read",
        "files.read",
        "plugins.read",
        "settings.read",
        "audit.read",
      ],
    },
    {
      id: "mcp_advanced",
      label: "MCP advanced",
      description:
        "Stage schema, manage project data, and run the marketed MCP tools. Cannot publish schema.",
      default_days: 30,
      danger: true,
      capabilities: [
        "projects.read",
        "projects.write",
        "members.read",
        "members.write",
        "roles.read",
        "roles.write",
        "plans.read",
        "plans.write",
        "tenants.read",
        "tenants.write",
        "tenants.delete",
        "schema.read",
        "schema.write",
        "data.read",
        "data.write",
        "data.delete",
        "relations.write",
        "functions.read",
        "functions.write",
        "functions.test",
        "functions.deploy",
        "functions.delete",
        "files.read",
        "files.write",
        "files.delete",
        "plugins.read",
        "plugins.write",
        "settings.read",
        "settings.write",
        "audit.read",
        "database.read",
        "database.write",
        "auth.login",
      ],
    },
    {
      id: "sdk_bootstrap",
      label: "SDK bootstrap",
      description:
        "Server/edge bootstrap for login/register/policy reads. Do not embed in mobile or public web.",
      default_days: 90,
      capabilities: [
        "projects.read",
        "auth.login",
        "auth.register",
        "settings.read",
        "data.read",
      ],
    },
    {
      id: "full_access",
      label: "Full access",
      description: "All capabilities. Requires danger acknowledgement.",
      default_days: 30,
      danger: true,
      capabilities: [
        "projects.read",
        "projects.write",
        "members.read",
        "members.write",
        "roles.read",
        "roles.write",
        "tenants.read",
        "tenants.write",
        "tenants.delete",
        "schema.read",
        "schema.write",
        "schema.publish",
        "data.read",
        "data.write",
        "data.delete",
        "relations.write",
        "functions.read",
        "functions.write",
        "functions.test",
        "functions.deploy",
        "functions.delete",
        "files.read",
        "files.write",
        "files.delete",
        "plugins.read",
        "plugins.write",
        "plugins.deploy",
        "sync.read",
        "sync.write",
        "audit.read",
        "settings.read",
        "settings.write",
        "database.read",
        "database.write",
        "auth.login",
        "auth.register",
      ],
    },
    {
      id: "custom",
      label: "Custom",
      description: "Pick capabilities individually.",
      default_days: 90,
      capabilities: null,
    },
  ],
  capabilities: [
    { id: "projects.read", label: "Read projects", group: "Projects", risk: "low" },
    { id: "projects.write", label: "Write projects", group: "Projects", risk: "medium" },
    { id: "members.read", label: "Read members", group: "Members", risk: "low" },
    { id: "members.write", label: "Write members", group: "Members", risk: "medium" },
    { id: "roles.read", label: "Read roles", group: "Roles", risk: "low" },
    { id: "roles.write", label: "Write roles", group: "Roles", risk: "high" },
    { id: "tenants.read", label: "Read tenants", group: "Tenants", risk: "low" },
    { id: "tenants.write", label: "Write tenants", group: "Tenants", risk: "medium" },
    { id: "tenants.delete", label: "Delete tenants", group: "Tenants", risk: "danger", danger: true },
    { id: "schema.read", label: "Read schema", group: "Schema", risk: "low" },
    { id: "schema.write", label: "Write schema", group: "Schema", risk: "high" },
    { id: "schema.publish", label: "Publish schema", group: "Schema", risk: "danger", danger: true },
    { id: "data.read", label: "Read data", group: "Data", risk: "low" },
    { id: "data.write", label: "Write data", group: "Data", risk: "medium" },
    { id: "data.delete", label: "Delete data", group: "Data", risk: "danger", danger: true },
    { id: "relations.write", label: "Write relations", group: "Data", risk: "medium" },
    { id: "functions.read", label: "Read functions", group: "Functions", risk: "low" },
    { id: "functions.write", label: "Write functions", group: "Functions", risk: "medium" },
    { id: "functions.test", label: "Test functions", group: "Functions", risk: "medium" },
    { id: "functions.deploy", label: "Deploy functions", group: "Functions", risk: "danger", danger: true },
    { id: "functions.delete", label: "Delete functions", group: "Functions", risk: "danger", danger: true },
    { id: "files.read", label: "Read files", group: "Files", risk: "low" },
    { id: "files.write", label: "Write files", group: "Files", risk: "medium" },
    { id: "files.delete", label: "Delete files", group: "Files", risk: "high", danger: true },
    { id: "plugins.read", label: "Read plugins", group: "Plugins", risk: "low" },
    { id: "plugins.write", label: "Write plugins", group: "Plugins", risk: "high" },
    { id: "plugins.deploy", label: "Deploy plugins", group: "Plugins", risk: "danger", danger: true },
    { id: "sync.read", label: "Sync read", group: "Sync", risk: "low" },
    { id: "sync.write", label: "Sync write", group: "Sync", risk: "high" },
    { id: "audit.read", label: "Read audit", group: "Audit", risk: "low" },
    { id: "settings.read", label: "Read settings", group: "Settings", risk: "low" },
    { id: "settings.write", label: "Write settings", group: "Settings", risk: "high" },
    { id: "database.read", label: "Read database", group: "Database", risk: "danger", danger: true },
    { id: "database.write", label: "Write database", group: "Database", risk: "danger", danger: true },
    { id: "auth.login", label: "Login end-users", group: "Auth", risk: "low" },
    { id: "auth.register", label: "Public registerUser", group: "Auth", risk: "medium" },
  ],
  bindings: [],
};

export function resolveAccessTokenCatalog(
  catalog: AccessTokenCatalog | undefined,
): AccessTokenCatalog {
  if (catalog?.presets?.length) {
    return {
      presets: catalog.presets,
      capabilities:
        catalog.capabilities?.length > 0
          ? catalog.capabilities
          : FALLBACK_ACCESS_TOKEN_CATALOG.capabilities,
      bindings: catalog.bindings ?? [],
    };
  }
  return FALLBACK_ACCESS_TOKEN_CATALOG;
}

export function formatRelativeOrNever(value?: string, neverLabel = "Never"): string {
  if (!value) return neverLabel;
  const d = dayjs(value);
  if (!d.isValid()) return neverLabel;
  return d.fromNow();
}

export function isExpired(record: Pick<AccessTokenPublic, "expires_at">): boolean {
  if (!record.expires_at) return false;
  const d = dayjs(record.expires_at);
  return d.isValid() && d.isBefore(dayjs());
}

/** Effective display status: server `status` plus a client-side expiry check. */
export function effectiveStatus(
  record: Pick<AccessTokenPublic, "status" | "expires_at">,
): "active" | "revoked" | "expired" {
  if (record.status === "revoked") return "revoked";
  if (record.status === "expired" || isExpired(record)) return "expired";
  return "active";
}

export function presetLabel(
  presetId: string | undefined,
  presets: AccessTokenPreset[] | undefined,
): string {
  if (!presetId) return "Custom";
  const found = presets?.find((p) => p.id === presetId);
  if (found) return found.label;
  return presetId
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function groupCapabilitiesByGroup(
  capabilities: CapabilityDescriptor[],
): Map<string, CapabilityDescriptor[]> {
  const groups = new Map<string, CapabilityDescriptor[]>();
  for (const cap of capabilities) {
    const bucket = groups.get(cap.group) ?? [];
    bucket.push(cap);
    groups.set(cap.group, bucket);
  }
  return groups;
}

export function capabilityLabel(
  id: string,
  catalog: AccessTokenCatalog | undefined,
): string {
  return catalog?.capabilities.find((c) => c.id === id)?.label ?? id;
}

/** Any selected capability (or the preset itself) that requires danger acknowledgement. */
export function hasDangerSelection(
  capabilities: string[],
  preset: AccessTokenPreset | undefined,
  catalog: AccessTokenCatalog | undefined,
): boolean {
  if (preset?.danger) return true;
  if (!catalog) return false;
  const dangerIds = new Set(
    catalog.capabilities.filter((c) => c.danger).map((c) => c.id),
  );
  return capabilities.some((id) => dangerIds.has(id));
}
