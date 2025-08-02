import type { GetProjectRolesQuery, GetPermissionsAndScopesQuery } from '../generated/graphql';

// Permission level options for API permissions
export type PermissionLevel = 'none' | 'all' | 'custom_logic';

// CRUD permission structure for a single model
export interface ModelPermissions {
  read: PermissionLevel;
  create: PermissionLevel;
  update: PermissionLevel;
  delete: PermissionLevel;
}

// Complete API permissions structure (model name -> permissions)
export type ApiPermissions = Record<string, ModelPermissions>;

// Role data structure based on the GraphQL schema and design requirements
export interface Role {
  name: string;
  identifier: string;
  is_admin: boolean;
  system_generated: boolean;
  no_of_users?: number;
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
  onDeleteRole: (roleKey: string) => void;
  loading: boolean;
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
  value?: ApiPermissions;
  onChange?: (permissions: ApiPermissions) => void;
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

// Props for SuperAdminToggle component
export interface SuperAdminToggleProps {
  value?: boolean;
  onChange?: (isAdmin: boolean) => void;
  disabled?: boolean;
}

// Table column data structure for roles table
export interface RoleTableData {
  key: string;
  name: string;
  identifier: string;
  system_generated: boolean;
  no_of_users: number;
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