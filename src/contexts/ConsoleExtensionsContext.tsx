import React, { createContext, useContext } from "react";
import type { LucideIcon } from "lucide-react";
import type { Project } from "../types/project";
import type { SchemaDraftOverlay } from "../types/schemaDraftOverlay";
import { EMPTY_SCHEMA_DRAFT_OVERLAY } from "../types/schemaDraftOverlay";

/** Sidebar model row passed to filterSidebarModels. */
export interface ConsoleSidebarModelRef {
  id: string;
  name: string;
}

/** Extra primary nav item registered by pro/plugins (open-core merges into sidebar). */
export interface ConsoleExtensionNavItem {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
  expandable?: boolean;
  tourId?: string;
  /** Insert before the core nav item with this key (e.g. "content"). */
  insertBefore?: string;
}

/** Passed to optional relation-drawer notices; open-core stays product-agnostic — pro fills this in. */
export interface FieldConfigurationRelationNoticeProps {
  drawerVisible: boolean;
  isRelationField: boolean;
  sourceModelName: string;
  relatedModelName?: string;
}

export interface ConsoleExtensions {
  /** Rendered in the sidebar header area, below the project name (e.g. TenantSelector). */
  sidebarHeaderExtra?: React.ReactNode;

  /** Returns extra UI to display next to a model name in the sidebar menu. */
  modelMenuDecorator?: (modelName: string) => React.ReactNode;

  /** Extra form items rendered inside the General Settings page. */
  settingsExtra?: React.ReactNode;

  /**
   * Pro / extensions: sidebar entries under Console › Settings (merged after Teams).
   * Open-core ignores; pro registers routes and items together.
   */
  settingsSidebarItems?: Array<{
    key: string;
    icon: React.ReactNode;
    label: string;
    /** Shown as secondary line on the settings home grid (optional). */
    description?: string;
    /** Optional explicit path; defaults to `/console/settings/${key}`. */
    path?: string;
    /** Sidebar section. Default project; use monetization for Plans/Providers/Invoices. */
    group?: "project" | "monetization";
    onClick: () => void;
  }>;

  /** Pro layer: run before switching active project (e.g. clear SaaS-only client state). */
  onBeforeProjectSwitch?: (project: Project) => void;

  /** Rendered inside TourProvider (e.g. modals that call useTour). */
  insideTourProvider?: React.ReactNode;

  /** Optional banner row below the console top bar (e.g. schema draft alert). */
  consoleTopBarExtra?: React.ReactNode;

  /**
   * Optional notices when configuring a relation field in the field drawer.
   * Pro uses this for hosting-/billing-specific guidance without coupling open-core to those concepts.
   */
  FieldConfigurationRelationNotice?: React.ComponentType<FieldConfigurationRelationNoticeProps>;

  /**
   * Pro schema versioning: merged live + draft overlay for model sidebar/editor.
   * Open-core falls back to live GraphQL when unset or hasDraft is false.
   */
  schemaDraftOverlay?: SchemaDraftOverlay;

  /** Called after a schema mutation completes so pro can refresh draft preview queries. */
  onSchemaMutationCompleted?: () => void | Promise<void>;

  /**
   * Pro / extensions: extra items in the console primary Navigation group.
   * Open-core merges these before core items when insertBefore is set.
   */
  extraPrimaryNavItems?: ConsoleExtensionNavItem[];

  /** Clickable Free/Pro plan badge in the console top bar (before the user menu). */
  topBarTrailing?: React.ReactNode;

  /** Cloud console shows Help & Support. The public console leaves this unset. */
  showHelpSupport?: boolean;

  /**
   * Filter models shown under Content vs Models in the sidebar.
   * When unset, the same model list is used for both sections.
   */
  filterSidebarModels?: (
    models: ConsoleSidebarModelRef[],
    section: "content" | "model",
  ) => ConsoleSidebarModelRef[];

  /**
   * Resolve the console entry path after switching to / opening a project.
   * Defaults to /console/content when unset.
   */
  resolveConsoleEntryPath?: (project?: Project) => string;

  /**
   * Pro SaaS: controlled tenant picker for Logic draft tests (no cookie/reload).
   * When unset, open-core hides the tenant field (general projects).
   */
  LogicTenantPicker?: React.ComponentType<{
    value?: string;
    onChange: (tenantId: string) => void;
    required?: boolean;
    style?: React.CSSProperties;
  }>;

  /** When true, Logic draft test requires a concrete tenant before run. */
  logicTenantRequired?: boolean;
}

const ConsoleExtensionsContext = createContext<ConsoleExtensions>({
  schemaDraftOverlay: EMPTY_SCHEMA_DRAFT_OVERLAY,
});

export const useConsoleExtensions = () => useContext(ConsoleExtensionsContext);

export const ConsoleExtensionsProvider: React.FC<{
  value: ConsoleExtensions;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <ConsoleExtensionsContext.Provider value={value}>
    {children}
  </ConsoleExtensionsContext.Provider>
);

export default ConsoleExtensionsContext;
