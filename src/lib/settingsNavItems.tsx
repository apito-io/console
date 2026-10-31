import type { ReactNode } from "react";
import {
  Settings,
  Shield,
  Cloud,
  Key,
  Webhook,
  UserCog,
  AppWindow,
  Puzzle,
  GitBranch,
  Database,
  Wallet,
} from "lucide-react";
import type { ConsoleExtensions } from "../contexts/ConsoleExtensionsContext";

export interface SettingsNavItem {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
  description?: string;
  /** Sidebar section. Default: project settings. */
  group?: "project" | "monetization";
}

const CORE_SETTINGS: Omit<SettingsNavItem, "icon">[] = [
  {
    key: "general",
    label: "General",
    path: "/console/settings/general",
    description: "Basic project configuration",
  },
  {
    key: "plugins",
    label: "Plugins",
    path: "/console/settings/plugins",
    description: "Activate system-installed plugins for this project",
  },
  {
    key: "authentication",
    label: "Authentication",
    path: "/console/settings/authentication",
    description: "Manage app users and sign-in configuration",
  },
  {
    key: "storage",
    label: "Storage",
    path: "/console/settings/storage",
    description: "Free cloud storage or custom S3-compatible uploads",
  },
  {
    key: "payments",
    label: "Payments",
    path: "/console/settings/payments/providers",
    description: "Activated payment providers for this project",
  },
  {
    key: "api-secrets",
    label: "API Secrets",
    path: "/console/settings/api-secrets",
    description: "API keys and authentication",
  },
  {
    key: "webhooks",
    label: "Webhooks",
    path: "/console/settings/webhooks",
    description: "Event notifications and integrations",
  },
  {
    key: "roles",
    label: "Roles & Permissions",
    path: "/console/settings/roles",
    description: "User roles and permissions",
  },
  {
    key: "schema-changes",
    label: "Schema Changes",
    path: "/console/settings/schema-changes",
    description: "Review and publish local schema drafts",
  },
  {
    key: "db-explorer",
    label: "Database query",
    path: "/console/settings/db-explorer",
    description: "Read-only SQL for this project's database",
  },
];

const CORE_ICONS: Record<string, ReactNode> = {
  general: <Settings size={16} strokeWidth={1.75} />,
  authentication: <Shield size={16} strokeWidth={1.75} />,
  storage: <Cloud size={16} strokeWidth={1.75} />,
  payments: <Wallet size={16} strokeWidth={1.75} />,
  "api-secrets": <Key size={16} strokeWidth={1.75} />,
  webhooks: <Webhook size={16} strokeWidth={1.75} />,
  roles: <UserCog size={16} strokeWidth={1.75} />,
  plugins: <Puzzle size={16} strokeWidth={1.75} />,
  "schema-changes": <GitBranch size={16} strokeWidth={1.75} />,
  "db-explorer": <Database size={16} strokeWidth={1.75} />,
};

function mergeAfterGeneral<T extends { key: string }>(
  core: T[],
  injected: T[],
): T[] {
  const idx = core.findIndex((x) => x.key === "general");
  if (idx < 0) {
    return [...core, ...injected];
  }
  return [...core.slice(0, idx + 1), ...injected, ...core.slice(idx + 1)];
}

export interface BuildSettingsNavItemsOptions {
  settingsSidebarItems?: ConsoleExtensions["settingsSidebarItems"];
  pluginSettingsItems?: Array<{
    pluginName: string;
    label: string;
    path: string;
    icon?: string;
  }>;
}

export function buildSettingsNavItems(
  options: BuildSettingsNavItemsOptions = {},
): SettingsNavItem[] {
  const { settingsSidebarItems = [], pluginSettingsItems = [] } = options;

  const coreItems: SettingsNavItem[] = CORE_SETTINGS.map((item) => ({
    ...item,
    group: "project" as const,
    icon: CORE_ICONS[item.key] ?? <Settings size={16} strokeWidth={1.75} />,
  }));

  const extensionItems: SettingsNavItem[] = settingsSidebarItems.map((it) => ({
    key: it.key,
    label: it.label,
    path:
      it.path ??
      (it.key === "schema-changes"
        ? "/console/settings/schema-changes"
        : it.key === "db-explorer"
          ? "/console/settings/db-explorer"
          : `/console/settings/${it.key}`),
    icon: it.icon,
    description: it.description,
    group: it.group ?? (it.key.startsWith("monetization/") ? "monetization" : "project"),
  }));

  const coreKeys = new Set(coreItems.map((item) => item.key));
  const projectExtensions = extensionItems.filter(
    (it) => it.group !== "monetization" && !coreKeys.has(it.key),
  );
  const monetizationItems = extensionItems.filter(
    (it) => it.group === "monetization",
  );

  const pluginItems: SettingsNavItem[] = pluginSettingsItems.map((plugin) => ({
    key: `plugin-${plugin.pluginName}`,
    label: plugin.label,
    path: plugin.path,
    group: "project" as const,
    icon: <AppWindow size={16} strokeWidth={1.75} />,
  }));

  return [
    ...mergeAfterGeneral(coreItems, projectExtensions),
    ...pluginItems,
    ...monetizationItems,
  ];
}

export function partitionSettingsNavItems(items: SettingsNavItem[]): {
  project: SettingsNavItem[];
  monetization: SettingsNavItem[];
} {
  const project: SettingsNavItem[] = [];
  const monetization: SettingsNavItem[] = [];
  for (const item of items) {
    if (item.group === "monetization") {
      monetization.push(item);
    } else {
      project.push(item);
    }
  }
  return { project, monetization };
}

export function getActiveSettingsKey(pathname: string): string {
  if (!pathname.includes("/console/settings")) {
    return "";
  }
  const sub = pathname
    .replace("/console/settings/", "")
    .replace("/console/settings", "");
  if (!sub || sub === "") {
    return "general";
  }
  if (sub.startsWith("plugins/")) {
    return `plugin-${sub.replace("plugins/", "")}`;
  }
  // Nested monetization routes use full relative path as key.
  if (sub.startsWith("monetization/")) {
    return sub;
  }
  return sub.split("/")[0];
}
