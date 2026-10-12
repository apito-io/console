import type { GetProjectRolesQuery, GetPermissionsAndScopesQuery } from '../generated_gql/tanstack-query';

/** Permission scopes for read / update / delete. */
export type PermissionLevel = 'none' | 'all' | 'auth' | 'own';

/** Create cannot use `own` (no record yet). */
export type CreatePermissionLevel = 'none' | 'all' | 'auth';

export type CrudOperation = 'read' | 'create' | 'update' | 'delete';

// CRUD permission structure for a single model
export interface ModelPermissions {
  read: PermissionLevel;
  create: CreatePermissionLevel;
  update: PermissionLevel;
  delete: PermissionLevel;
}

// Complete API permissions structure (model name -> permissions)
export type ApiPermissions = Record<string, ModelPermissions>;

export const PERMISSION_LEVEL_LABELS: Record<PermissionLevel, string> = {
  none: 'No access',
  all: 'All records',
  auth: 'Authenticated users',
  own: 'Own records',
};

export const CRUD_PERMISSION_OPTIONS: { label: string; value: PermissionLevel }[] = [
  { label: PERMISSION_LEVEL_LABELS.none, value: 'none' },
  { label: PERMISSION_LEVEL_LABELS.all, value: 'all' },
  { label: PERMISSION_LEVEL_LABELS.auth, value: 'auth' },
  { label: PERMISSION_LEVEL_LABELS.own, value: 'own' },
];

export const CREATE_PERMISSION_OPTIONS: { label: string; value: CreatePermissionLevel }[] = [
  { label: PERMISSION_LEVEL_LABELS.none, value: 'none' },
  { label: PERMISSION_LEVEL_LABELS.all, value: 'all' },
  { label: PERMISSION_LEVEL_LABELS.auth, value: 'auth' },
];

export const EMPTY_MODEL_PERMISSIONS: ModelPermissions = {
  read: 'none',
  create: 'none',
  update: 'none',
  delete: 'none',
};

export type PermissionPresetId =
  | 'read_only'
  | 'authenticated_app_user'
  | 'own_data'
  | 'no_access';

export interface PermissionPreset {
  id: PermissionPresetId;
  label: string;
  permissions: ModelPermissions;
}

export const PERMISSION_PRESETS: PermissionPreset[] = [
  {
    id: 'read_only',
    label: 'Read only',
    permissions: { read: 'all', create: 'none', update: 'none', delete: 'none' },
  },
  {
    id: 'authenticated_app_user',
    label: 'Authenticated app user',
    permissions: { read: 'all', create: 'auth', update: 'auth', delete: 'none' },
  },
  {
    id: 'own_data',
    label: 'Own data',
    permissions: { read: 'own', create: 'auth', update: 'own', delete: 'own' },
  },
  {
    id: 'no_access',
    label: 'No access',
    permissions: { ...EMPTY_MODEL_PERMISSIONS },
  },
];

/** Legacy `custom_logic` (and unknown values) → `none` for form display. */
export function normalizePermissionLevel(
  value: unknown,
  operation: CrudOperation
): PermissionLevel | CreatePermissionLevel {
  if (value === 'all' || value === 'auth' || value === 'none') {
    return value;
  }
  if (value === 'own') {
    return operation === 'create' ? 'auth' : 'own';
  }
  // custom_logic and anything else
  return 'none';
}

export function normalizeModelPermissions(raw: unknown): ModelPermissions {
  const src =
    raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    read: normalizePermissionLevel(src.read, 'read') as PermissionLevel,
    create: normalizePermissionLevel(src.create, 'create') as CreatePermissionLevel,
    update: normalizePermissionLevel(src.update, 'update') as PermissionLevel,
    delete: normalizePermissionLevel(src.delete, 'delete') as PermissionLevel,
  };
}

export function normalizeApiPermissions(raw: unknown): ApiPermissions {
  if (!raw || typeof raw !== 'object') {
    return {};
  }
  const result: ApiPermissions = {};
  for (const [model, perms] of Object.entries(raw as Record<string, unknown>)) {
    result[model] = normalizeModelPermissions(perms);
  }
  return result;
}

// Role data structure based on the GraphQL schema and design requirements
export interface Role {
  name: string;
  identifier: string;
  is_admin: boolean;
  system_generated: boolean;
  api_permissions: ApiPermissions;
  logic_executions: string[];
  administrative_permissions?: string[];
}

// Form data structure for role creation/editing
export interface RoleFormData {
  name: string;
  is_admin: boolean;
  logic_executions: string[];
  api_permissions: ApiPermissions;
}

// Component prop interfaces

// Props for RolesTable component
export interface RolesTableProps {
  rolesData: GetProjectRolesQuery;
  onEditRole: (roleKey: string) => void;
  onDuplicateRole: (roleKey: string) => void;
  onDeleteRole: (roleKey: string) => void;
  loading: boolean;
  deleteLoading?: boolean;
}

// Props for RolesDrawer component
export interface RolesDrawerProps {
  visible: boolean;
  onClose: () => void;
  roleKey: string | null; // null for creation, string for editing
  rolesData: GetProjectRolesQuery;
  permissionsData: GetPermissionsAndScopesQuery;
  onSubmit: (formData: RoleFormData) => void;
  loading?: boolean;
}

// Props for ApiPermissionsTable component
export interface ApiPermissionsTableProps {
  models: string[];
  disabled?: boolean;
}

// Props for LogicPermissionsSection component
export interface LogicPermissionsSectionProps {
  functions: string[];
  value?: string[];
  onChange?: (selectedFunctions: string[]) => void;
  disabled?: boolean;
}

// Props for RoleActionButtons component
export interface RoleActionButtonsProps {
  role: {
    name: string;
    identifier: string;
    system_generated: boolean;
  };
  onEdit: (roleKey: string) => void;
  onDelete: (roleKey: string) => void;
}

// Table column data structure for roles table
export interface RoleTableData {
  key: string;
  name: string;
  identifier: string;
  system_generated: boolean;
  is_admin: boolean;
}

// Form validation error structure
export interface RoleFormErrors {
  name?: string;
  api_permissions?: Record<string, Record<string, string>>;
  logic_executions?: string;
}

// State management interfaces for the main page component
export interface RolesPageState {
  isDrawerOpen: boolean;
  selectedRoleKey: string | null;
  loading: boolean;
  deleteConfirmVisible: boolean;
  roleToDelete: string | null;
}

// Utility type for role data transformation
export type RoleDataTransformer = (rolesData: GetProjectRolesQuery) => RoleTableData[];

// Permission validation result
export interface PermissionValidationResult {
  isValid: boolean;
  errors: RoleFormErrors;
}

// Role operation result for mutations
export interface RoleOperationResult {
  success: boolean;
  message?: string;
  error?: string;
}
