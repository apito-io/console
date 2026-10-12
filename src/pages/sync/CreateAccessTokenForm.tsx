import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Collapse,
  DatePicker,
  Input,
  Select,
  Segmented,
  Skeleton,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { Plus, ShieldAlert } from "lucide-react";
import { ConsoleCard, ConsoleCardTitle } from "../../components/console";
import type {
  AccessTokenCatalog,
  AccessTokenPreset,
  AdministrableProject,
  CapabilityDescriptor,
  CreateAccessTokenPayload,
  ProjectGrantMode,
  TenantGrantMode,
} from "./types";
import {
  capabilityLabel,
  groupCapabilitiesByGroup,
  hasDangerSelection,
  resolveAccessTokenCatalog,
} from "./accessTokenUtils";
import { useProjectTenantsQuery } from "./tenantSearch";
import "../../components/console/ConsoleShell.css";

const { TextArea } = Input;
const { Text } = Typography;

function ProjectTenantSelect({
  projectId,
  value,
  onChange,
}: {
  projectId: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const { data, isLoading, isError, error } = useProjectTenantsQuery(projectId);
  const options = (data?.searchTenants?.tenants ?? [])
    .filter((t): t is NonNullable<typeof t> => !!t?.id)
    .map((t) => ({
      value: t.id as string,
      label: t.name?.trim() ? `${t.name} (${t.id})` : (t.id as string),
    }));

  return (
    <Select
      mode="tags"
      className="console-flex-1"
      placeholder={isLoading ? "Loading tenants…" : "Select or enter tenant IDs"}
      value={value}
      onChange={onChange}
      options={options}
      loading={isLoading}
      showSearch
      optionFilterProp="label"
      notFoundContent={
        isLoading
          ? "Loading…"
          : isError
            ? (error as Error)?.message || "Failed to load tenants"
            : "No tenants found"
      }
    />
  );
}

export interface SimpleProjectOption {
  id: string;
  name: string;
  isSaas?: boolean;
}

export interface CreateAccessTokenFormProps {
  catalog?: AccessTokenCatalog;
  catalogLoading?: boolean;
  administrableProjects: AdministrableProject[];
  projectOptions: SimpleProjectOption[];
  projectsLoading?: boolean;
  isSubmitting?: boolean;
  onSubmit: (payload: CreateAccessTokenPayload) => Promise<void> | void;
}

interface Draft {
  name: string;
  description: string;
  duration: dayjs.Dayjs | null;
  preset: string;
  projectGrantMode: ProjectGrantMode;
  projectIds: string[];
  tenantGrantMode: TenantGrantMode;
  tenantIdsByProject: Record<string, string[]>;
  capabilities: string[];
  acknowledgeDanger: boolean;
}

const initialDraft: Draft = {
  name: "",
  description: "",
  duration: null,
  preset: "cli_sync",
  projectGrantMode: "selected",
  projectIds: [],
  tenantGrantMode: "none",
  tenantIdsByProject: {},
  capabilities: [],
  acknowledgeDanger: false,
};

function riskTagClass(risk?: string): string {
  if (risk === "danger" || risk === "high") return "mono-badge--danger";
  return "";
}

export function CreateAccessTokenForm({
  catalog,
  catalogLoading,
  administrableProjects,
  projectOptions,
  projectsLoading,
  isSubmitting,
  onSubmit,
}: CreateAccessTokenFormProps) {
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [showErrors, setShowErrors] = useState(false);

  const resolvedCatalog = useMemo(
    () => resolveAccessTokenCatalog(catalog),
    [catalog],
  );
  const usingFallbackCatalog = !catalog?.presets?.length;

  const selectedPreset = useMemo<AccessTokenPreset | undefined>(
    () => resolvedCatalog.presets.find((p) => p.id === draft.preset),
    [resolvedCatalog, draft.preset],
  );
  const isCustomPreset = draft.preset === "custom";

  const effectiveCapabilities = isCustomPreset
    ? draft.capabilities
    : selectedPreset?.capabilities ?? [];

  const capabilityGroups = useMemo<Map<string, CapabilityDescriptor[]>>(
    () => groupCapabilitiesByGroup(resolvedCatalog.capabilities),
    [resolvedCatalog],
  );

  const hasDanger = hasDangerSelection(
    effectiveCapabilities,
    selectedPreset,
    resolvedCatalog,
  );

  const relevantProjectIds =
    draft.projectGrantMode === "all_admin_projects"
      ? administrableProjects.map((p) => p.id)
      : draft.projectIds;

  const saasRelevant = relevantProjectIds.some(
    (id) => projectOptions.find((p) => p.id === id)?.isSaas,
  );

  const projectNameLookup = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projectOptions) map.set(p.id, p.name);
    for (const p of administrableProjects) if (!map.has(p.id)) map.set(p.id, p.name);
    return map;
  }, [projectOptions, administrableProjects]);

  const errors: string[] = [];
  if (!draft.name.trim()) errors.push("Give the token a name.");
  if (!draft.preset) errors.push("Choose a usage preset.");
  if (draft.projectGrantMode === "selected" && draft.projectIds.length === 0) {
    errors.push("Select at least one project, or switch to all administrable projects.");
  }
  if (isCustomPreset && draft.capabilities.length === 0) {
    errors.push("Pick at least one capability for a custom token.");
  }
  if (hasDanger && !draft.acknowledgeDanger) {
    errors.push("Acknowledge the danger warning to continue.");
  }
  if (
    draft.tenantGrantMode === "selected" &&
    Object.values(draft.tenantIdsByProject).every((ids) => ids.length === 0)
  ) {
    errors.push("Add at least one tenant ID, or choose a different tenant scope.");
  }

  const canSubmit = errors.length === 0;

  const toggleCapability = (id: string, checked: boolean) => {
    setDraft((prev) => {
      const set = new Set(prev.capabilities);
      if (checked) {
        set.add(id);
        const implied = resolvedCatalog.capabilities.find((c) => c.id === id)?.implies ?? [];
        implied.forEach((i) => set.add(i));
      } else {
        set.delete(id);
      }
      return { ...prev, capabilities: Array.from(set) };
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setShowErrors(true);
      return;
    }
    const payload: CreateAccessTokenPayload = {
      name: draft.name.trim(),
      description: draft.description.trim() || undefined,
      duration: draft.duration ? draft.duration.format("YYYY-MM-DD") : "",
      preset: draft.preset,
      project_grant_mode: draft.projectGrantMode,
      project_ids: draft.projectGrantMode === "selected" ? draft.projectIds : [],
      tenant_grant_mode: saasRelevant ? draft.tenantGrantMode : "none",
      tenant_ids:
        saasRelevant && draft.tenantGrantMode === "selected"
          ? draft.tenantIdsByProject
          : undefined,
      capabilities: effectiveCapabilities,
      allowed_cidrs: [],
      acknowledge_danger: hasDanger ? draft.acknowledgeDanger : undefined,
    };
    await onSubmit(payload);
    setDraft(initialDraft);
    setShowErrors(false);
  };

  return (
    <ConsoleCard
      title={<ConsoleCardTitle icon={Plus} label="Create access token" />}
    >
      {/* Basics */}
      <div className="token-section">
        <div className="token-section-title">Basics</div>
        <Text type="secondary" className="token-section-desc">
          A descriptive name helps you find this token later.
        </Text>
        <div className="console-form-row console-mb-md">
          <div className="console-flex-1">
            <Text className="console-help-text">Name</Text>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="e.g. CI deploy pipeline"
              maxLength={120}
            />
          </div>
          <div className="console-flex-1">
            <Text className="console-help-text">Expiry</Text>
            <DatePicker
              className="console-control-full"
              format="YYYY-MM-DD"
              placeholder="Preset default"
              value={draft.duration}
              onChange={(value) => setDraft((d) => ({ ...d, duration: value }))}
              disabledDate={(current) => current != null && current < dayjs().endOf("day")}
            />
          </div>
        </div>
        <Text className="console-help-text">Description (optional)</Text>
        <TextArea
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          placeholder="What is this token for?"
          rows={2}
          maxLength={500}
        />
      </div>

      {/* Usage preset */}
      <div className="token-section">
        <div className="token-section-title">Usage preset</div>
        <Text type="secondary" className="token-section-desc">
          Click a card (or use the dropdown). Presets bundle common capability sets —
          choose Custom to hand-pick.
        </Text>
        {usingFallbackCatalog && !catalogLoading ? (
          <Alert
            type="warning"
            showIcon
            className="console-mb-md"
            message="Using built-in presets"
            description="The engine catalog endpoint was unavailable, so the Console is showing the default preset list. Restart the engine with the latest open-core for live catalog sync."
          />
        ) : null}
        {catalogLoading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <>
            <Select
              className="console-control-full console-mb-md"
              value={draft.preset || undefined}
              placeholder="Select a usage preset"
              onChange={(value) => setDraft((d) => ({ ...d, preset: value }))}
              options={resolvedCatalog.presets.map((p) => ({
                value: p.id,
                label: p.danger ? `${p.label} (danger)` : p.label,
              }))}
            />
            <div className="token-preset-grid">
              {resolvedCatalog.presets.map((preset) => {
                const active = draft.preset === preset.id;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    className={`token-preset-card${active ? " token-preset-card--active" : ""}`}
                    onClick={() => setDraft((d) => ({ ...d, preset: preset.id }))}
                  >
                    <div className="token-preset-card-header">
                      <span className="token-preset-card-title">{preset.label}</span>
                      {preset.danger ? <Tag className="mono-badge--danger">Danger</Tag> : null}
                    </div>
                    <Text className="token-preset-card-desc">{preset.description}</Text>
                    <div className="token-preset-card-meta">
                      {preset.id === "custom"
                        ? "Pick capabilities below"
                        : `${preset.capabilities?.length ?? 0} capabilities`}
                      {preset.default_days
                        ? ` · expires in ${preset.default_days}d by default`
                        : ""}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {!isCustomPreset && selectedPreset && selectedPreset.capabilities ? (
          <div className="console-mt-md">
            <Text className="console-help-text">Included capabilities</Text>
            <div className="console-tag-stack console-mt-xs">
              {selectedPreset.capabilities.map((id) => (
                <Tag key={id}>{capabilityLabel(id, resolvedCatalog)}</Tag>
              ))}
            </div>
          </div>
        ) : null}

        {isCustomPreset ? (
          <div className="console-mt-md">
            <Text className="console-help-text">Capabilities</Text>
            <Collapse
              className="console-mt-xs"
              items={Array.from(capabilityGroups.entries()).map(([group, caps]) => {
                const selectedCount = caps.filter((c) =>
                  draft.capabilities.includes(c.id),
                ).length;
                return {
                  key: group,
                  label: (
                    <div className="token-capability-group-header">
                      <span>{group}</span>
                      <span className="token-capability-group-count">
                        {selectedCount}/{caps.length} selected
                      </span>
                    </div>
                  ),
                  children: caps.map((cap) => (
                    <div key={cap.id} className="token-capability-row">
                      <div className="token-capability-row-main">
                        <Checkbox
                          checked={draft.capabilities.includes(cap.id)}
                          onChange={(e) => toggleCapability(cap.id, e.target.checked)}
                        >
                          {cap.label}
                        </Checkbox>
                        {cap.description ? (
                          <span className="token-capability-row-desc">{cap.description}</span>
                        ) : null}
                        {cap.implies && cap.implies.length > 0 ? (
                          <span className="token-capability-row-implies">
                            Includes:{" "}
                            {cap.implies
                              .map((i) => capabilityLabel(i, resolvedCatalog))
                              .join(", ")}
                          </span>
                        ) : null}
                      </div>
                      {cap.risk ? (
                        <Tag className={riskTagClass(cap.risk)}>{cap.risk}</Tag>
                      ) : null}
                    </div>
                  )),
                };
              })}
            />
          </div>
        ) : null}
      </div>

      {/* Resource scope */}
      <div className="token-section">
        <div className="token-section-title">Resource scope</div>
        <Text type="secondary" className="token-section-desc">
          Choose which projects this token can act on.
        </Text>
        <Segmented
          block
          value={draft.projectGrantMode}
          onChange={(value) =>
            setDraft((d) => ({ ...d, projectGrantMode: value as ProjectGrantMode }))
          }
          options={[
            { label: "All projects I can administer", value: "all_admin_projects" },
            { label: "Selected projects", value: "selected" },
          ]}
        />

        {draft.projectGrantMode === "all_admin_projects" ? (
          <div className="console-mt-md">
            {projectsLoading ? (
              <Skeleton.Input active className="console-skeleton-full" />
            ) : administrableProjects.length > 0 ? (
              <>
                <Text className="console-help-text">
                  Currently administrable ({administrableProjects.length}) — re-checked on
                  every request
                </Text>
                <div className="console-tag-stack console-mt-xs">
                  {administrableProjects.map((p) => (
                    <Tag key={p.id}>
                      {p.name} ({p.role})
                    </Tag>
                  ))}
                </div>
              </>
            ) : projectOptions.length > 0 ? (
              <Alert
                type="info"
                showIcon
                message="No admin-role projects detected"
                description="Switch to Selected projects and pick from your memberships, or use All projects only after you have owner/admin on a project."
              />
            ) : (
              <Text type="secondary">No projects found for this account.</Text>
            )}
          </div>
        ) : (
          <div className="console-mt-md">
            <Text className="console-help-text">Projects</Text>
            {projectsLoading ? (
              <Skeleton.Input active className="console-skeleton-full" />
            ) : (
              <Select
                mode="multiple"
                className="console-control-full"
                placeholder="Select one or more projects"
                value={draft.projectIds}
                onChange={(value) => setDraft((d) => ({ ...d, projectIds: value }))}
                options={projectOptions.map((p) => ({
                  label: p.isSaas ? `${p.name} (SaaS)` : p.name,
                  value: p.id,
                }))}
                notFoundContent="No projects available"
              />
            )}
          </div>
        )}
      </div>

      {/* Tenant scope — always visible */}
      <div className="token-section">
        <div className="token-section-title">Tenant scope</div>
        <Text type="secondary" className="token-section-desc">
          {saasRelevant
            ? "One or more projects in scope are multi-tenant (SaaS). Restrict which tenants this token may use."
            : "Applies when a SaaS (multi-tenant) project is in scope. For general projects this stays “No tenant access”."}
        </Text>
        <Segmented
          block
          disabled={!saasRelevant}
          value={saasRelevant ? draft.tenantGrantMode : "none"}
          onChange={(value) =>
            setDraft((d) => ({ ...d, tenantGrantMode: value as TenantGrantMode }))
          }
          options={[
            { label: "No tenant access", value: "none" },
            { label: "All tenants", value: "all" },
            { label: "Selected tenants", value: "selected" },
          ]}
        />
        {!saasRelevant ? (
          <Text type="secondary" className="console-mt-sm" style={{ display: "block" }}>
            Tip: pick a SaaS project under Resource scope to enable tenant options.
          </Text>
        ) : null}
        {saasRelevant && draft.tenantGrantMode === "selected" ? (
          <div className="console-mt-md">
            {relevantProjectIds
              .filter((id) => projectOptions.find((p) => p.id === id)?.isSaas)
              .map((id) => (
                <div key={id} className="token-tenant-project-row">
                  <span className="token-tenant-project-label">
                    {projectNameLookup.get(id) ?? id}
                  </span>
                  <ProjectTenantSelect
                    projectId={id}
                    value={draft.tenantIdsByProject[id] ?? []}
                    onChange={(value) =>
                      setDraft((d) => ({
                        ...d,
                        tenantIdsByProject: { ...d.tenantIdsByProject, [id]: value },
                      }))
                    }
                  />
                </div>
              ))}
          </div>
        ) : null}
      </div>

      {/* Danger acknowledgement */}
      {hasDanger ? (
        <Alert
          className="token-danger-banner"
          type="error"
          showIcon
          icon={<ShieldAlert size={16} strokeWidth={1.75} />}
          message="This token can perform destructive actions"
          description={
            <Checkbox
              checked={draft.acknowledgeDanger}
              onChange={(e) => setDraft((d) => ({ ...d, acknowledgeDanger: e.target.checked }))}
            >
              I understand this token can delete data, publish schema, or otherwise make
              irreversible changes, and I want to proceed.
            </Checkbox>
          }
        />
      ) : null}

      {/* Review + submit */}
      <div className="token-section console-mt-md">
        <div className="token-section-title">Review</div>
        <div className="token-review-grid console-mb-md">
          <div>
            <span className="token-review-label">Name</span>
            <span className="token-review-value">{draft.name || "—"}</span>
          </div>
          <div>
            <span className="token-review-label">Preset</span>
            <span className="token-review-value">
              {selectedPreset?.label ?? "Not selected"}
            </span>
          </div>
          <div>
            <span className="token-review-label">Scope</span>
            <span className="token-review-value">
              {draft.projectGrantMode === "all_admin_projects"
                ? "All administrable projects"
                : `${draft.projectIds.length} selected project(s)`}
            </span>
          </div>
          <div>
            <span className="token-review-label">Capabilities</span>
            <span className="token-review-value">{effectiveCapabilities.length}</span>
          </div>
          <div>
            <span className="token-review-label">Tenant scope</span>
            <span className="token-review-value">
              {saasRelevant
                ? draft.tenantGrantMode === "none"
                  ? "No tenant access"
                  : draft.tenantGrantMode === "all"
                    ? "All tenants"
                    : "Selected tenants"
                : "Not applicable (no SaaS project in scope)"}
            </span>
          </div>
          <div>
            <span className="token-review-label">Expires</span>
            <span className="token-review-value">
              {draft.duration ? draft.duration.format("YYYY-MM-DD") : "Preset default"}
            </span>
          </div>
        </div>

        {showErrors && errors.length > 0 ? (
          <Alert
            type="error"
            showIcon
            className="console-mb-md"
            message="Fix the following before creating this token"
            description={
              <ul className="console-list">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            }
          />
        ) : null}

        <Button
          type="primary"
          icon={<Plus size={16} strokeWidth={1.75} />}
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Generate access token
        </Button>
      </div>
    </ConsoleCard>
  );
}

export default CreateAccessTokenForm;
