/**
 * Maps current pathname to Ant Design sidebar `selectedKeys` entry.
 * Pure — unit-testable.
 */
export function getActiveMenuKey(pathname: string): string {
  const path = pathname || "/";

  if (path === "/projects" || (path.startsWith("/projects/") && !path.startsWith("/projects/new"))) {
    return "active-projects";
  }
  if (path === "/projects/new") return "new-project";
  if (path.includes("/administrator/accounts")) return "platform-accounts";
  if (path.includes("/accounts")) return "accounts";
  if (path === "/teams" || path.startsWith("/teams/")) return "teams";
  if (path === "/clients" || path.startsWith("/clients/")) return "clients";
  if (path.includes("/accounts/ownership")) return "accounts";
  if (path.includes("/support")) return "support";
  if (path.includes("/access-token") || path.includes("/sync")) return "access-token";
  if (path.includes("/mcp")) return "mcp";
  if (path.includes("/ai-builder")) return "ai-builder";
  if (path.includes("/instances")) return "instances";
  if (path.includes("/workspace/settings") || path.includes("/administrator/workspace") || path.includes("/workspace"))
    return "workspace-settings";
  if (path.includes("/system-api")) return "system-api";
  if (path.includes("/system-db")) return "system-db";
  if (path.includes("/backups")) return "backups";
  if (path.includes("/administrator/plugins")) return "administrator-plugins";
  if (path.includes("/invoice-settings")) return "invoice-settings";
  if (path.includes("/channel-monetization") || path.includes("/partners")) return "partners";
  if (path.includes("/subscriptions")) return "subscriptions";
  if (path.includes("/administrator/logs") || path.includes("/audit-log") || path.includes("/slow-queries") || path.includes("/logs"))
    return "logs";
  if (path.includes("/administrator/admin") || path === "/admin" || path.startsWith("/admin/"))
    return "admin";

  return "active-projects";
}
