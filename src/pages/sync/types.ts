// Cloudflare-style access tokens — types mirror apito/pkg/open-core/models/access_token.go
// and apito/pkg/open-core/authz/capability_registry.go. Keep in sync with the backend contract.

export type AccessTokenPresetId =
  | "full_access"
  | "read_only"
  | "cli_login"
  | "cli_sync"
  | "function_deploy"
  | "data_import_export"
  | "mcp_assistant"
  | "mcp_advanced"
  | "sdk_bootstrap"
  | "custom";

export type ProjectGrantMode = "selected" | "all_admin_projects";
export type TenantGrantMode = "all" | "selected" | "none";
export type AccessTokenStatus = "active" | "revoked" | "expired";
export type CapabilityRisk = "low" | "medium" | "high" | "danger";

/** Safe list/detail projection returned by the API — never includes the raw secret. */
export interface AccessTokenPublic {
  id: string;
  secret_prefix?: string;
  name?: string;
  description?: string;
  issuer_user_id?: string;
  status?: AccessTokenStatus | string;
  preset?: string;
  expires_at?: string;
  last_used_at?: string;
  last_used_ip?: string;
  last_used_user_agent?: string;
  created_at?: string;
  revoked_at?: string;
  project_grant_mode?: ProjectGrantMode | string;
  project_ids?: string[];
  tenant_grant_mode?: TenantGrantMode | string;
  tenant_ids?: Record<string, string[]>;
  capabilities?: string[];
  allowed_cidrs?: string[];
  capability_count?: number;
}

export interface AccessTokenListResponse {
  tokens: AccessTokenPublic[];
  code?: number;
}

export interface CreateAccessTokenPayload {
  name: string;
  description?: string;
  /** YYYY-MM-DD, or "" to use the preset default / never-expiring. */
  duration?: string;
  preset: AccessTokenPresetId | string;
  project_grant_mode: ProjectGrantMode;
  project_ids: string[];
  tenant_grant_mode: TenantGrantMode;
  tenant_ids?: Record<string, string[]>;
  capabilities: string[];
  allowed_cidrs?: string[];
  acknowledge_danger?: boolean;
}

/** Reveal-once response for both mint and rotate. */
export interface MintAccessTokenResponse {
  token: string;
  record: AccessTokenPublic;
  message?: string;
  code?: number;
}

export interface RevokeAccessTokenPayload {
  id?: string;
  token?: string;
}

export interface RotateAccessTokenPayload {
  id: string;
}

export interface CapabilityDescriptor {
  id: string;
  label: string;
  group: string;
  description?: string;
  risk?: CapabilityRisk | string;
  implies?: string[];
  danger?: boolean;
}

export interface AccessTokenPreset {
  id: string;
  label: string;
  description?: string;
  capabilities: string[] | null;
  danger?: boolean;
  default_days?: number;
}

export interface OperationBinding {
  operation: string;
  capability: string;
  surface: string;
}

export interface AccessTokenCatalog {
  capabilities: CapabilityDescriptor[];
  presets: AccessTokenPreset[];
  bindings: OperationBinding[];
}

export interface AdministrableProject {
  id: string;
  name: string;
  role: string;
}

export interface AdministrableProjectsResponse {
  projects: AdministrableProject[];
  count: number;
}
