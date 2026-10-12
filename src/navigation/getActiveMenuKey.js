/**
 * Maps current pathname to Ant Design sidebar `selectedKeys` entry.
 * Pure — unit-testable.
 */
export function getActiveMenuKey(pathname) {
    const path = pathname || "/";
    if (path === "/projects" || (path.startsWith("/projects/") && !path.startsWith("/projects/new"))) {
        return "active-projects";
    }
    if (path === "/projects/new")
        return "new-project";
    if (path.includes("/accounts"))
        return "accounts";
    if (path.includes("/support"))
        return "support";
    if (path.includes("/access-token") || path.includes("/sync"))
        return "access-token";
    if (path.includes("/mcp"))
        return "mcp";
    if (path.includes("/system-api"))
        return "system-api";
    if (path.includes("/system-db"))
        return "system-db";
    if (path.includes("/backups"))
        return "backups";
    if (path.includes("/plugins"))
        return "plugins";
    if (path.includes("/subscriptions"))
        return "subscriptions";
    if (path.includes("/admin"))
        return "admin";
    if (path.includes("/audit-log"))
        return "logs";
    if (path.includes("/slow-queries"))
        return "logs";
    if (path.includes("/logs"))
        return "logs";
    return "active-projects";
}
