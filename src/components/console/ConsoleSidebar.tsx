import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "../../router/navigation";
import { Button, Empty, Spin } from "antd";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Puzzle,
} from "lucide-react";
import {
  CONSOLE_NAVIGATION_NAV,
  getConsoleSection,
  isConsoleNavActive,
  type ConsoleNavItem,
} from "../../constants/consoleNavigation";
import type {
  ConsoleExtensionNavItem,
  ConsoleExtensions,
} from "../../contexts/ConsoleExtensionsContext";
import { useAuth } from "../../contexts/AuthContext";
import { usePluginManager } from "../../plugins/PluginManager";
import { insertByPlacement } from "../../plugins/navPlacement";
import {
  buildSettingsNavItems,
  getActiveSettingsKey,
  partitionSettingsNavItems,
} from "../../lib/settingsNavItems";
import type { SchemaDraftOverlay } from "../../types/schemaDraftOverlay";
import SchemaOverlayBadge, {
  schemaOverlayTextStyle,
} from "../model/SchemaOverlayBadge";
import ModelOperationsDropdown from "../model/ModelOperationsDropdown";
import HelpMenu from "./HelpMenu";
import { assetUrl } from "../../utils/url";
import { getLogoPath, getProductName } from "../../utils/env";
import "./ConsoleShell.css";

export interface ConsoleSidebarModel {
  id: string;
  name: string;
  overlayKind?: "live" | "added" | "modified" | "removed";
  previousName?: string;
}

export interface ConsoleSidebarProps {
  contentModels: ConsoleSidebarModel[];
  modelModels: ConsoleSidebarModel[];
  loading: boolean;
  error: unknown;
  selectedModel: string | null;
  documentCountByModel: Map<string, number>;
  sidebarHeaderExtra?: React.ReactNode;
  modelMenuDecorator?: (modelName: string) => React.ReactNode;
  schemaDraftOverlay?: SchemaDraftOverlay;
  settingsSidebarItems?: ConsoleExtensions["settingsSidebarItems"];
  extraPrimaryNavItems?: ConsoleExtensionNavItem[];
  showHelpSupport?: boolean;
  onModelClick: (modelName: string, section: "content" | "model") => void;
  onCreateModel: () => void;
  onModelUpdated: () => void | Promise<void>;
}

const ConsoleSidebar: React.FC<ConsoleSidebarProps> = ({
  contentModels,
  modelModels,
  loading,
  error,
  selectedModel,
  documentCountByModel,
  sidebarHeaderExtra,
  modelMenuDecorator,
  schemaDraftOverlay,
  settingsSidebarItems = [],
  extraPrimaryNavItems = [],
  showHelpSupport = false,
  onModelClick,
  onCreateModel,
  onModelUpdated,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { decodeTokenData } = useAuth();
  const tokenData = decodeTokenData();
  const [, pluginAPI] = usePluginManager();

  const section = getConsoleSection(location.pathname);
  const activeSettingsKey = getActiveSettingsKey(location.pathname);
  const isSettingsRoute = location.pathname.includes("/console/settings");

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    content:
      section === "content" || location.pathname.startsWith("/console/content"),
    model:
      section === "model" || location.pathname.startsWith("/console/model"),
  });

  const pluginSettingsItems = useMemo(
    () => pluginAPI.getPluginSettingsItems(),
    [pluginAPI],
  );

  const settingsMenuItems = useMemo(
    () =>
      buildSettingsNavItems({
        settingsSidebarItems,
        pluginSettingsItems,
      }),
    [settingsSidebarItems, pluginSettingsItems],
  );

  const { project: projectSettingsItems, monetization: monetizationSettingsItems } =
    useMemo(() => partitionSettingsNavItems(settingsMenuItems), [settingsMenuItems]);

  const renderSettingsNavButton = (item: (typeof settingsMenuItems)[number]) => (
    <button
      key={item.key}
      type="button"
      className={`console-nav-item${
        isSettingsRoute && activeSettingsKey === item.key ? " active" : ""
      }`}
      onClick={() => navigate(item.path)}
    >
      <span className="console-nav-item-main">
        {item.icon}
        <span>{item.label}</span>
      </span>
    </button>
  );

  const navItems = useMemo(() => {
    const pluginMenuItems = pluginAPI.getPluginMenuItems().map((plugin) => ({
      key: `plugin-${plugin.pluginName || plugin.path.replace("/console/plugin/", "")}`,
      label: plugin.label,
      path: plugin.path,
      icon: Puzzle,
      placement: plugin.placement,
    }));

    const mergedCore: ConsoleNavItem[] = [...CONSOLE_NAVIGATION_NAV];
    for (const extra of extraPrimaryNavItems) {
      const item: ConsoleNavItem = {
        key: extra.key,
        label: extra.label,
        path: extra.path,
        icon: extra.icon,
        expandable: extra.expandable,
        tourId: extra.tourId,
      };
      if (extra.insertBefore) {
        const idx = mergedCore.findIndex((n) => n.key === extra.insertBefore);
        if (idx >= 0) {
          mergedCore.splice(idx, 0, item);
        } else {
          mergedCore.unshift(item);
        }
      } else {
        mergedCore.unshift(item);
      }
    }

    return insertByPlacement(mergedCore, pluginMenuItems) as Array<
      ConsoleNavItem & { path: string; label: string }
    >;
  }, [pluginAPI, extraPrimaryNavItems]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavClick = (item: {
    key: string;
    path: string;
    expandable?: boolean;
  }) => {
    if (item.expandable) {
      toggleSection(item.key);
    }
    navigate(item.path);
  };

  const renderModelList = (listSection: "content" | "model") => {
    const models = listSection === "content" ? contentModels : modelModels;
    if (loading) {
      return (
        <div style={{ padding: "12px 20px", textAlign: "center" }}>
          <Spin size="small" />
        </div>
      );
    }

    if (error && models.length === 0) {
      return (
        <div style={{ padding: "12px 16px" }}>
          <Empty
            description="Failed to load models"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      );
    }

    if (models.length === 0) {
      return (
        <div style={{ padding: "12px 16px" }}>
          <Empty
            description="No models found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ marginBottom: 8 }}
          />
          {listSection === "model" ? (
            <Button
              type="primary"
              size="small"
              icon={<Plus size={14} />}
              onClick={onCreateModel}
              data-tour="add-model-button"
              block
            >
              Add Model
            </Button>
          ) : null}
        </div>
      );
    }

    const label = listSection === "content" ? "Collections" : "Models";

    return (
      <div className="console-nav-nested">
        <div className="console-nav-nested-label">
          <span>{label}</span>
          {listSection === "model" ? (
            <button
              type="button"
              className="console-topbar-action"
              onClick={onCreateModel}
              aria-label="Add model"
              data-tour="add-model-button"
              style={{ padding: 2 }}
            >
              <Plus size={14} />
            </button>
          ) : null}
        </div>
        {models.map((model) => {
          const overlayModel =
            schemaDraftOverlay?.getModelOverlay(model.name) ?? null;
          const overlayKind =
            overlayModel?.overlayMeta.kind ?? model.overlayKind ?? "live";
          const isRemoved = overlayKind === "removed";
          const isActive = selectedModel === model.name;

          return (
            <div
              key={model.name}
              className={`console-nav-model-item${isActive ? " active" : ""}`}
              onClick={() => {
                if (!isRemoved) {
                  onModelClick(model.name, listSection);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isRemoved) {
                  onModelClick(model.name, listSection);
                }
              }}
            >
              <div className="console-nav-model-label">
                {modelMenuDecorator?.(model.name)}
                <span
                  className="console-nav-model-name"
                  style={schemaOverlayTextStyle(overlayKind)}
                >
                  {(overlayModel?.overlayMeta.previousName ??
                    model.previousName) ? (
                    <>
                      <span style={{ textDecoration: "line-through", opacity: 0.65 }}>
                        {overlayModel?.overlayMeta.previousName ??
                          model.previousName}
                      </span>
                      {" → "}
                    </>
                  ) : null}
                  {model.name}
                </span>
                {documentCountByModel.has(model.name) ? (
                  <span className="console-nav-model-count">
                    {documentCountByModel.get(model.name)}
                  </span>
                ) : null}
                <SchemaOverlayBadge
                  kind={overlayKind}
                  draftVersionLabel={schemaDraftOverlay?.draftVersionLabel}
                />
              </div>
              {listSection === "model" && !isRemoved ? (
                <ModelOperationsDropdown
                  modelName={model.name}
                  onModelUpdated={onModelUpdated}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  const renderNavigationItems = () =>
    navItems.map((item) => {
      const Icon = item.icon;
      const active = isConsoleNavActive(item, location.pathname);
      const isExpandable = item.expandable;
      const isExpanded =
        expandedSections[item.key] ??
        (item.key === "content"
          ? location.pathname.startsWith("/console/content")
          : item.key === "model"
            ? location.pathname.startsWith("/console/model")
            : false);

      return (
        <div key={item.key}>
          <button
            type="button"
            className={`console-nav-item${active ? " active" : ""}`}
            onClick={() => handleNavClick(item)}
            data-tour={item.tourId}
          >
            <span className="console-nav-item-main">
              <Icon size={18} strokeWidth={1.75} />
              <span>{item.label}</span>
            </span>
            {isExpandable ? (
              isExpanded ? (
                <ChevronDown size={16} className="console-nav-chevron" />
              ) : (
                <ChevronRight size={16} className="console-nav-chevron" />
              )
            ) : null}
          </button>
          {isExpandable && isExpanded
            ? renderModelList(item.key as "content" | "model")
            : null}
        </div>
      );
    });

  return (
    <aside className="console-sidebar">
      <div className="console-sidebar-header">
        <div
          className="console-sidebar-brand"
          onClick={() => navigate("/projects")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate("/projects");
          }}
        >
          <img
            src={assetUrl(getLogoPath())}
            alt={getProductName()}
            style={{ width: 20, height: 20 }}
          />
          <div>
            <div className="console-sidebar-brand-title">
              {tokenData?.project_name || `${getProductName()} Workspace`}
            </div>
            <div className="console-sidebar-brand-subtitle">
              {tokenData?.project_id || "Production"}
            </div>
          </div>
        </div>
        {sidebarHeaderExtra ? (
          <div className="console-sidebar-tenant-slot">{sidebarHeaderExtra}</div>
        ) : null}
      </div>

      {section === "model" ? (
        <div className="console-sidebar-add-model">
          <Button
            type="primary"
            icon={<Plus size={14} />}
            onClick={onCreateModel}
            data-tour="add-model-button"
            block
            style={{
              background: "#000",
              borderColor: "#000",
              fontSize: 12,
              height: 32,
            }}
          >
            Add Model
          </Button>
        </div>
      ) : null}

      <div className="console-sidebar-nav">
        <section className="console-sidebar-section" aria-label="Navigation">
          <div className="console-sidebar-section-label">Navigation</div>
          {renderNavigationItems()}
        </section>

        <section
          className="console-sidebar-section"
          aria-label="Project settings"
        >
          <div className="console-sidebar-section-label">Project Settings</div>
          {projectSettingsItems.map(renderSettingsNavButton)}
        </section>

        {monetizationSettingsItems.length > 0 ? (
          <section
            className="console-sidebar-section"
            aria-label="Monetization settings"
          >
            <div className="console-sidebar-section-label">
              Monetization Settings
            </div>
            {monetizationSettingsItems.map(renderSettingsNavButton)}
          </section>
        ) : null}
      </div>

      <div className="console-sidebar-footer">
        <HelpMenu showSales={showHelpSupport} />
      </div>
    </aside>
  );
};

export default ConsoleSidebar;
