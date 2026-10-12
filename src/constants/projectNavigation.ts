import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  FolderKanban,
  User,
  KeyRound,
} from "lucide-react";
import {
  getHeaderTitle,
  getHeaderSubtitle,
  type NavigationConfig,
} from "./navigation";
import { getActiveMenuKey } from "../navigation/getActiveMenuKey";

export interface ProjectNavItem {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
  /** Workspace extras default. Channel partners/monetization use `saas-monetization`. */
  group?: "workspace" | "saas-monetization";
}

export interface ProjectBreadcrumbSegment {
  label: string;
  path?: string;
}

export interface ProjectExtensionNavItem {
  key: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const PROJECT_PRIMARY_NAV: ProjectNavItem[] = [
  {
    key: "projects",
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    key: "accounts",
    label: "Account",
    path: "/accounts",
    icon: User,
  },
  {
    key: "access-token",
    label: "Access Token",
    path: "/access-token",
    icon: KeyRound,
  },
  {
    key: "mcp",
    label: "MCP",
    path: "/mcp",
    icon: Bot,
  },
];

export const PROJECT_FOOTER_NAV: ProjectNavItem[] = [];

export function getProjectPageConfig(
  pathname: string,
  navigationOverride?: NavigationConfig,
): NavigationConfig {
  if (navigationOverride) {
    return navigationOverride;
  }

  const menuKey = getActiveMenuKey(pathname);
  const cleanPath = pathname.replace(/^\//, "");

  if (cleanPath === "projects/new") {
    return {
      title: getHeaderTitle("projects/new"),
      subtitle: getHeaderSubtitle("projects/new"),
    };
  }

  return {
    title: getHeaderTitle(menuKey),
    subtitle: getHeaderSubtitle(menuKey),
  };
}

export function getProjectBreadcrumbs(
  pathname: string,
  navigationOverride?: NavigationConfig,
): ProjectBreadcrumbSegment[] {
  const menuKey = getActiveMenuKey(pathname);

  if (pathname === "/projects/new") {
    return [
      { label: "Workspace", path: "/projects" },
      { label: "New Project" },
    ];
  }

  if (menuKey === "active-projects" || pathname === "/projects") {
    return [{ label: "Projects" }];
  }

  const navItem = [
    ...PROJECT_PRIMARY_NAV,
    ...PROJECT_FOOTER_NAV,
  ].find((item) => item.key === menuKey);

  const label =
    navigationOverride?.title ??
    navItem?.label ??
    getHeaderTitle(menuKey);

  return [
    { label: "Workspace", path: "/projects" },
    { label },
  ];
}

export function isProjectNavActive(
  item: ProjectNavItem,
  pathname: string,
): boolean {
  const menuKey = getActiveMenuKey(pathname);

  if (item.key === "projects") {
    return (
      menuKey === "active-projects" ||
      menuKey === "new-project" ||
      pathname.startsWith("/projects")
    );
  }

  return menuKey === item.key || pathname.startsWith(item.path);
}
