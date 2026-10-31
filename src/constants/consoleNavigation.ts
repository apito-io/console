import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Database,
  Network,
  Users,
  Shield,
  Images,
  Workflow,
  Globe,
  Radio,
  Terminal,
} from "lucide-react";
import { getSettingsHeaderTitle } from "./settingsNavigation";
import { getHeaderTitle } from "./navigation";

export type ConsoleSectionKey =
  | "content"
  | "database"
  | "model"
  | "users"
  | "graphql"
  | "rest"
  | "realtime"
  | "auth"
  | "storage"
  | "logic"
  | "plugins";

export interface ConsoleNavItem {
  key: ConsoleSectionKey | string;
  label: string;
  path: string;
  icon: LucideIcon;
  /** When true, section can expand to show model/collection list */
  expandable?: boolean;
  /** tour data attribute */
  tourId?: string;
}

export const CONSOLE_PRIMARY_NAV: ConsoleNavItem[] = [
  {
    key: "content",
    label: "Content",
    path: "/console/content",
    icon: FileText,
    expandable: true,
    tourId: "content-tab",
  },
  {
    key: "database",
    label: "Database query",
    path: "/console/settings/db-explorer",
    icon: Database,
  },
  {
    key: "model",
    label: "Models",
    path: "/console/model",
    icon: Network,
    expandable: true,
    tourId: "model-tab",
  },
  {
    key: "users",
    label: "Users",
    path: "/console/users",
    icon: Users,
    tourId: "users-tab",
  },
  {
    key: "storage",
    label: "Files",
    path: "/console/storage",
    icon: Images,
    tourId: "storage-tab",
  },
  {
    key: "graphql",
    label: "GraphQL API",
    path: "/console/graphql",
    icon: Terminal,
    tourId: "api-tab",
  },
  {
    key: "rest",
    label: "REST API",
    path: "/console/rest",
    icon: Globe,
  },
  {
    key: "realtime",
    label: "Realtime",
    path: "/console/realtime",
    icon: Radio,
  },
  {
    key: "auth",
    label: "Auth",
    path: "/console/settings/authentication",
    icon: Shield,
  },
  {
    key: "logic",
    label: "Logic",
    path: "/console/logic",
    icon: Workflow,
  },
];

/** Primary console routes shown under the NAVIGATION sidebar group. */
export const CONSOLE_NAVIGATION_NAV: ConsoleNavItem[] =
  CONSOLE_PRIMARY_NAV.filter(
    (item) => !["database", "auth"].includes(item.key),
  );

export interface ConsoleBreadcrumbSegment {
  label: string;
  path?: string;
}

/** Derive the active console section from the current pathname. */
export function getConsoleSection(pathname: string): string {
  if (pathname.includes("/console/settings/db-explorer")) {
    return "database";
  }
  if (pathname.includes("/console/settings/authentication")) {
    return "auth";
  }
  if (pathname.startsWith("/console/settings")) {
    return "settings";
  }
  if (pathname.startsWith("/console/plugin/")) {
    const pluginName = pathname.split("/console/plugin/")[1]?.split("/")[0];
    return pluginName ? `plugin-${pluginName}` : "plugins";
  }
  const segment =
    pathname.replace("/console/", "").split("/").filter(Boolean)[0] ?? "content";
  return segment;
}

/** Build breadcrumb segments for the console top bar. */
export function getConsoleBreadcrumbs(
  pathname: string,
  modelName?: string | null,
): ConsoleBreadcrumbSegment[] {
  if (pathname.includes("/console/settings")) {
    const settingsKey = pathname
      .replace("/console/settings/", "")
      .replace("/console/settings", "general");
    const title = getSettingsHeaderTitle(settingsKey);
    return [
      { label: "Settings", path: "/console/settings/general" },
      { label: title },
    ];
  }

  const section = getConsoleSection(pathname);
  const navItem =
    CONSOLE_PRIMARY_NAV.find((item) => item.key === section) ??
    (section === "tenants"
      ? { key: "tenants", label: "Tenants", path: "/console/tenants" }
      : undefined);

  if (section.startsWith("plugin-")) {
    const pluginLabel = section.replace("plugin-", "");
    return [
      { label: "Plugins", path: "/console/plugins" },
      { label: pluginLabel },
    ];
  }

  const sectionLabel =
    section === "content"
      ? "Contents"
      : (navItem?.label ?? getHeaderTitle(section));

  const crumbs: ConsoleBreadcrumbSegment[] = [
    {
      label: sectionLabel,
      path: navItem?.path ?? `/console/${section}`,
    },
  ];

  if (modelName && (section === "content" || section === "model")) {
    crumbs.push({ label: modelName.toLowerCase() });
  }

  return crumbs;
}

/** Whether a nav item should appear active for the current route. */
export function isConsoleNavActive(
  item: ConsoleNavItem,
  pathname: string,
): boolean {
  if (item.key === "database") {
    return pathname.includes("/console/settings/db-explorer");
  }
  if (item.key === "auth") {
    return pathname.includes("/console/settings/authentication");
  }
  if (item.key === "content") {
    return pathname.startsWith("/console/content");
  }
  if (item.key === "model") {
    return pathname.startsWith("/console/model");
  }
  if (item.key === "users") {
    return pathname.startsWith("/console/users");
  }
  if (item.key === "tenants") {
    return pathname.startsWith("/console/tenants");
  }
  if (item.key === "storage") {
    return (
      pathname.startsWith("/console/storage") ||
      pathname.startsWith("/console/media")
    );
  }
  if (item.key === "graphql") {
    return (
      pathname.startsWith("/console/graphql") ||
      pathname.startsWith("/console/api")
    );
  }
  if (item.key === "rest") {
    return pathname.startsWith("/console/rest");
  }
  if (item.key === "realtime") {
    return pathname.startsWith("/console/realtime");
  }
  return pathname.startsWith(item.path);
}
