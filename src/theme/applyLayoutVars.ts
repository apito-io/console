import { apitoTokens } from "./tokens";

function setVar(root: HTMLElement, name: string, value: string | number): void {
  root.style.setProperty(name, typeof value === "number" ? `${value}px` : value);
}

/**
 * Shell + layout CSS variables on `:root`.
 * Ant Design cssVar tokens live on ConfigProvider; shell CSS bridges via `--console-*`
 * aliases that reference these names — they must exist on `:root` for the cascade to work.
 */
export function applyLayoutVars(): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const { palette, radii, spacing, layout, semantic } = apitoTokens;

  setVar(root, "--apito-layout-sidebar-width", layout.sidebarWidth);
  setVar(root, "--apito-layout-header-height", layout.headerHeight);
  setVar(root, "--apito-layout-project-max-width", layout.projectSpaceMaxWidth);
  setVar(root, "--apito-layout-settings-max-width", layout.settingsMaxWidth);

  setVar(root, "--apito-space-xs", spacing.xs);
  setVar(root, "--apito-space-sm", spacing.sm);
  setVar(root, "--apito-space-md", spacing.md);
  setVar(root, "--apito-space-lg", spacing.lg);
  setVar(root, "--apito-space-xl", spacing.xl);

  setVar(root, "--apito-color-primary", palette.primary);
  setVar(root, "--apito-color-bg-layout", palette.bgLayout);
  setVar(root, "--apito-color-bg-container", palette.surface);
  setVar(root, "--apito-color-fill-tertiary", palette.surfaceMuted);
  setVar(root, "--apito-color-border-secondary", palette.border);
  setVar(root, "--apito-color-border", palette.borderMuted);
  setVar(root, "--apito-color-text", palette.text);
  setVar(root, "--apito-color-text-secondary", palette.textSecondary);
  setVar(root, "--apito-color-text-light-solid", semantic.textLightSolid);
  setVar(root, "--apito-color-info", palette.info);
  setVar(root, "--apito-color-success", palette.success);
  setVar(root, "--apito-color-warning", palette.warning);
  setVar(root, "--apito-color-error", palette.error);
  setVar(root, "--apito-color-link", semantic.link);
  setVar(root, "--apito-color-info-bg", semantic.infoBg);
  setVar(root, "--apito-color-success-bg", semantic.successBg);
  setVar(root, "--apito-color-error-bg", semantic.errorBg);
  setVar(root, "--apito-color-warning-bg", semantic.warningBg);

  setVar(root, "--apito-border-radius-sm", radii.sm);
  setVar(root, "--apito-border-radius", radii.md);
  setVar(root, "--apito-border-radius-lg", radii.lg);
}
