import { TypedDocumentString } from '../lib/typedDocumentString';
import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { graphqlFetcher } from '../lib/graphqlFetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: { [key: string]: any }; output: { [key: string]: any }; }
  JSONArray: { input: any[]; output: any[]; }
};

export type AccountWorkspace = {
  __typename?: 'AccountWorkspace';
  billing_status?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  kind?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  plan?: Maybe<Scalars['String']['output']>;
  primary_owner_user_id?: Maybe<Scalars['String']['output']>;
  sponsored_slot_limit?: Maybe<Scalars['Int']['output']>;
  trial_consumed?: Maybe<Scalars['Boolean']['output']>;
};

export type ApitoFunctionRuntimeConfig = {
  __typename?: 'ApitoFunctionRuntimeConfig';
  handler?: Maybe<Scalars['String']['output']>;
  memory?: Maybe<Scalars['Int']['output']>;
  runtime?: Maybe<Scalars['String']['output']>;
  time_out?: Maybe<Scalars['Int']['output']>;
};

export type ApproveSchemaChangesResponse = {
  __typename?: 'ApproveSchemaChangesResponse';
  changeset_id?: Maybe<Scalars['String']['output']>;
  done?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type AuditLogInfo = {
  __typename?: 'AuditLogInfo';
  _key?: Maybe<Scalars['String']['output']>;
  activity?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  graphql_operation_name?: Maybe<Scalars['String']['output']>;
  graphql_payload?: Maybe<Scalars['String']['output']>;
  graphql_variable?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  internal_error?: Maybe<Scalars['String']['output']>;
  internal_function?: Maybe<Scalars['String']['output']>;
  project?: Maybe<ProjectModel>;
  request_path?: Maybe<Scalars['String']['output']>;
  request_payload?: Maybe<Scalars['String']['output']>;
  response_code?: Maybe<Scalars['Int']['output']>;
  response_payload?: Maybe<Scalars['String']['output']>;
  user?: Maybe<SystemUserInfo>;
};

export type AuditWhereFilterArgObject = {
  graphql_operation_name?: InputMaybe<CommonFilter>;
  internal_function?: InputMaybe<CommonFilter>;
  project_id?: InputMaybe<CommonFilter>;
  response_code?: InputMaybe<IntegerFilter>;
  user_id?: InputMaybe<CommonFilter>;
};

export type BackupCapabilities = {
  __typename?: 'BackupCapabilities';
  continuous?: Maybe<Scalars['Boolean']['output']>;
  list_snapshots?: Maybe<Scalars['Boolean']['output']>;
  manual_snapshot?: Maybe<Scalars['Boolean']['output']>;
  point_in_time?: Maybe<Scalars['Boolean']['output']>;
  restore_in_place?: Maybe<Scalars['Boolean']['output']>;
};

export type BackupFieldOption = {
  __typename?: 'BackupFieldOption';
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type BackupFieldSpec = {
  __typename?: 'BackupFieldSpec';
  default?: Maybe<Scalars['String']['output']>;
  help?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<Maybe<BackupFieldOption>>>;
  placeholder?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  secret?: Maybe<Scalars['Boolean']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type BackupProvider = {
  __typename?: 'BackupProvider';
  capabilities?: Maybe<BackupCapabilities>;
  engines?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  fields?: Maybe<Array<Maybe<BackupFieldSpec>>>;
  id?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
};

export type BackupRun = {
  __typename?: 'BackupRun';
  error?: Maybe<Scalars['String']['output']>;
  finished_at?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  kind?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['String']['output']>;
  requested_by?: Maybe<Scalars['String']['output']>;
  size_bytes?: Maybe<Scalars['Float']['output']>;
  snapshot_ref?: Maybe<Scalars['String']['output']>;
  started_at?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  target_id?: Maybe<Scalars['String']['output']>;
  target_type?: Maybe<Scalars['String']['output']>;
};

export type BackupSnapshot = {
  __typename?: 'BackupSnapshot';
  created_at?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  kind?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  size_bytes?: Maybe<Scalars['Float']['output']>;
};

export type BackupTarget = {
  __typename?: 'BackupTarget';
  available_providers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  config?: Maybe<Scalars['String']['output']>;
  configured?: Maybe<Scalars['Boolean']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  engine?: Maybe<Scalars['String']['output']>;
  inherit_default?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['String']['output']>;
  retention_days?: Maybe<Scalars['Int']['output']>;
  schedule_cron?: Maybe<Scalars['String']['output']>;
  secrets_set?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  target_id?: Maybe<Scalars['String']['output']>;
  target_type?: Maybe<Scalars['String']['output']>;
};

export type BackupTargetToggleInput = {
  enabled: Scalars['Boolean']['input'];
  target_id?: InputMaybe<Scalars['String']['input']>;
  target_type: Scalars['String']['input'];
};

export type BackupTestResult = {
  __typename?: 'BackupTestResult';
  message?: Maybe<Scalars['String']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type BulkHardDeleteTenantReport = {
  __typename?: 'BulkHardDeleteTenantReport';
  hard_deleted?: Maybe<Scalars['Int']['output']>;
  requested?: Maybe<Scalars['Int']['output']>;
};

export type BulkTenantDeleteReport = {
  __typename?: 'BulkTenantDeleteReport';
  errors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  requested?: Maybe<Scalars['Int']['output']>;
  skipped?: Maybe<Scalars['Int']['output']>;
  soft_deleted?: Maybe<Scalars['Int']['output']>;
};

export type CloudFunctionRequestResponse = {
  __typename?: 'CloudFunctionRequestResponse';
  is_array?: Maybe<Scalars['Boolean']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  optional_payload?: Maybe<Scalars['Boolean']['output']>;
  params?: Maybe<Array<Maybe<FieldInfo>>>;
};

export type CloudFunctionType = {
  __typename?: 'CloudFunctionType';
  active_revision_hash?: Maybe<Scalars['String']['output']>;
  active_revision_id?: Maybe<Scalars['String']['output']>;
  binary_url?: Maybe<Scalars['String']['output']>;
  capabilities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  created_at?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  env_vars?: Maybe<Array<Maybe<EnvVariable>>>;
  function_connected?: Maybe<Scalars['Boolean']['output']>;
  function_exported_variable?: Maybe<Scalars['String']['output']>;
  function_path?: Maybe<Scalars['String']['output']>;
  function_provider_id?: Maybe<Scalars['String']['output']>;
  graphql_schema_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_exported_variable?: Maybe<Scalars['String']['output']>;
  request?: Maybe<CloudFunctionRequestResponse>;
  response?: Maybe<CloudFunctionRequestResponse>;
  rest_api_secret_url_key?: Maybe<Scalars['String']['output']>;
  runtime_config?: Maybe<ApitoFunctionRuntimeConfig>;
  source?: Maybe<Scalars['String']['output']>;
  trigger_type?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type CommonFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  /** When the field & value both of them are array */
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** When the field is string & value is array */
  in_index?: InputMaybe<Scalars['String']['input']>;
  /** In in reverse when the value is array but the field is not array */
  in_r?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ne?: InputMaybe<Scalars['String']['input']>;
  not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Field should only contains the value */
  only_contains?: InputMaybe<Scalars['String']['input']>;
};

export type CommonModelReconcileResult = {
  __typename?: 'CommonModelReconcileResult';
  orphans_removed?: Maybe<Scalars['Int']['output']>;
  promoted?: Maybe<Scalars['Int']['output']>;
  shadows_fixed?: Maybe<Scalars['Int']['output']>;
  tables_reduced?: Maybe<Scalars['Int']['output']>;
};

export type ConnectSupportResponse = {
  __typename?: 'ConnectSupportResponse';
  id_token?: Maybe<Scalars['String']['output']>;
};

export type ConnectionType = {
  __typename?: 'ConnectionType';
  known_as?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  relation?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type CreatedBySystemUserInfo = {
  __typename?: 'CreatedBySystemUserInfo';
  _key?: Maybe<Scalars['String']['output']>;
  administrative_permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  avatar?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  current_project_id?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  is_admin?: Maybe<Scalars['Boolean']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  project_access_permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  project_assigned_role?: Maybe<Scalars['String']['output']>;
  project_limit?: Maybe<Scalars['Int']['output']>;
  project_user?: Maybe<Scalars['Boolean']['output']>;
  read_only_project?: Maybe<Scalars['Boolean']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
  user_subscription_type?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type DateFilterFilter = {
  at_date?: InputMaybe<Scalars['String']['input']>;
  between_date?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type DeleteApiTokenResponse = {
  __typename?: 'DeleteApiTokenResponse';
  msg?: Maybe<Scalars['String']['output']>;
};

export type DeleteApitoFunctionResponse = {
  __typename?: 'DeleteApitoFunctionResponse';
  message?: Maybe<Scalars['String']['output']>;
};

export type DeleteModelDataResponse = {
  __typename?: 'DeleteModelDataResponse';
  id?: Maybe<Scalars['String']['output']>;
};

export type DeleteWebHookResponse = {
  __typename?: 'DeleteWebHookResponse';
  msg?: Maybe<Scalars['String']['output']>;
};

export type DeployFunctionDeploymentType = {
  __typename?: 'DeployFunctionDeploymentType';
  created_at?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  revision_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type DeployFunctionRevisionType = {
  __typename?: 'DeployFunctionRevisionType';
  artifact_hash?: Maybe<Scalars['String']['output']>;
  artifact_key?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  revision?: Maybe<Scalars['Float']['output']>;
};

export type DeployFunctionToProjectResponse = {
  __typename?: 'DeployFunctionToProjectResponse';
  deployment?: Maybe<DeployFunctionDeploymentType>;
  function?: Maybe<CloudFunctionType>;
  revision?: Maybe<DeployFunctionRevisionType>;
};

export type DocumentModelType = {
  __typename?: 'DocumentModelType';
  _key?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['JSON']['output']>;
  expire_at?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<MetaField>;
  relation_doc_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type DriverCredentials = {
  __typename?: 'DriverCredentials';
  database?: Maybe<Scalars['String']['output']>;
  database_dir?: Maybe<Scalars['String']['output']>;
  engine?: Maybe<Scalars['String']['output']>;
  file?: Maybe<Scalars['String']['output']>;
  host?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  port?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  schema?: Maybe<Scalars['String']['output']>;
  ssl_mode?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type DuplicateModelDataResponse = {
  __typename?: 'DuplicateModelDataResponse';
  id?: Maybe<Scalars['String']['output']>;
};

export type EnvVariable = {
  __typename?: 'EnvVariable';
  hide?: Maybe<Scalars['Boolean']['output']>;
  is_system?: Maybe<Scalars['Boolean']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export enum Field_Operation_Type_Enum {
  /** Change the Type of a Field */
  ChangeType = 'change_type',
  /** Delete a Field */
  Delete = 'delete',
  /** Duplicate a Field */
  Duplicate = 'duplicate',
  /** Move a Field */
  Move = 'move',
  /** Rename a Field */
  Rename = 'rename'
}

export enum Field_Sub_Type_Enum {
  /** Dropdown Field */
  Dropdown = 'dropdown',
  /** Incremental Dynamic List of Item */
  DynamicList = 'dynamicList',
  /** Multiple Select */
  MultiSelect = 'multiSelect'
}

export enum Field_Type_Enum {
  /** Module Type */
  Boolean = 'boolean',
  /** Floating Point Number */
  Date = 'date',
  /** Module Type */
  Geo = 'geo',
  /** Module Type */
  List = 'list',
  /** Media Module Type */
  Media = 'media',
  /** Multi Line Text */
  Multiline = 'multiline',
  /** Number Field */
  Number = 'number',
  /** Single Object Field Type */
  Object = 'object',
  /** Array of Object Field Type */
  Repeated = 'repeated',
  /** Text Field */
  Text = 'text'
}

export enum Filter_Status_Type_Enum {
  /** Filter All Status Document */
  All = 'all',
  /** When Document is in Draft */
  Draft = 'draft',
  /** When Document is published */
  Published = 'published'
}

export type FieldInfo = {
  __typename?: 'FieldInfo';
  description?: Maybe<Scalars['String']['output']>;
  enable_indexing?: Maybe<Scalars['Boolean']['output']>;
  field_sub_type?: Maybe<Scalars['String']['output']>;
  field_type?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  input_type?: Maybe<Scalars['String']['output']>;
  is_object_field?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  parent_field?: Maybe<Scalars['String']['output']>;
  plugin_field_type?: Maybe<Scalars['String']['output']>;
  plugin_id?: Maybe<Scalars['String']['output']>;
  serial?: Maybe<Scalars['Int']['output']>;
  sub_field_info?: Maybe<Array<Maybe<SubFieldInfo>>>;
  system_generated?: Maybe<Scalars['Boolean']['output']>;
  validation?: Maybe<Validation>;
};

export type FreelanceEngagement = {
  __typename?: 'FreelanceEngagement';
  accepted_at?: Maybe<Scalars['String']['output']>;
  client_email?: Maybe<Scalars['String']['output']>;
  client_user_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  delivery_status?: Maybe<Scalars['String']['output']>;
  destination_workspace_id?: Maybe<Scalars['String']['output']>;
  enterprise_quote?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invite_expires_at?: Maybe<Scalars['String']['output']>;
  lifecycle?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  selected_plan?: Maybe<Scalars['String']['output']>;
  sponsor_user_id?: Maybe<Scalars['String']['output']>;
  sponsor_workspace_id?: Maybe<Scalars['String']['output']>;
  template_id?: Maybe<Scalars['String']['output']>;
  trial_ends_at?: Maybe<Scalars['String']['output']>;
};

export type FunctionDeploymentType = {
  __typename?: 'FunctionDeploymentType';
  build_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  deployed_by?: Maybe<Scalars['String']['output']>;
  environment?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  revision_id?: Maybe<Scalars['String']['output']>;
  rollback_of?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type FunctionRevisionType = {
  __typename?: 'FunctionRevisionType';
  abi_version?: Maybe<Scalars['String']['output']>;
  artifact_hash?: Maybe<Scalars['String']['output']>;
  artifact_key?: Maybe<Scalars['String']['output']>;
  capabilities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  created_at?: Maybe<Scalars['String']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  revision?: Maybe<Scalars['Float']['output']>;
  runtime?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
};

export type Function_Provider_Config_Payload = {
  handler?: InputMaybe<Scalars['String']['input']>;
  memory?: InputMaybe<Scalars['Int']['input']>;
  runtime?: InputMaybe<Scalars['String']['input']>;
  time_out?: InputMaybe<Scalars['Int']['input']>;
};

export type Function_Provider_Env_Vars_Payload = {
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type GenerateProjectTokenResponse = {
  __typename?: 'GenerateProjectTokenResponse';
  token?: Maybe<Scalars['String']['output']>;
};

export type GenerateTenantTokenResponse = {
  __typename?: 'GenerateTenantTokenResponse';
  role?: Maybe<Scalars['String']['output']>;
  tenant_id?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type GetModelDataResponse = {
  __typename?: 'GetModelDataResponse';
  count?: Maybe<Scalars['Int']['output']>;
  results?: Maybe<Array<Maybe<DocumentModelType>>>;
};

export type GetTenantsResponse = {
  __typename?: 'GetTenantsResponse';
  tenants?: Maybe<Array<Maybe<TenantListItem>>>;
};

export type GoogleOAuthStatePayload = {
  __typename?: 'GoogleOAuthStatePayload';
  state?: Maybe<Scalars['String']['output']>;
};

export type HardDeleteTenantReport = {
  __typename?: 'HardDeleteTenantReport';
  app_users_deleted?: Maybe<Scalars['Int']['output']>;
  catalog_deleted?: Maybe<Scalars['Boolean']['output']>;
  content_deleted?: Maybe<Scalars['Int']['output']>;
  mirror_deleted?: Maybe<Scalars['Boolean']['output']>;
  per_tenant_db_dropped?: Maybe<Scalars['Boolean']['output']>;
  storage_failed?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  storage_objects_deleted?: Maybe<Scalars['Int']['output']>;
  tenant_id?: Maybe<Scalars['String']['output']>;
  warnings?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export enum Input_Type_Enum {
  /** True/ False Value */
  Bool = 'bool',
  /** Floating Point Number */
  Double = 'double',
  /** GEO Location Type */
  Geo = 'geo',
  /** Integer/Number Type */
  Int = 'int',
  /** Object Input Type */
  Object = 'object',
  /** Array Input Type */
  Repeated = 'repeated',
  /** String Type */
  String = 'string'
}

export type IntegerFilter = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
};

export type ListAllDataDetailedOfAModelConnectionPayload = {
  _id?: InputMaybe<Scalars['String']['input']>;
  connection_type?: InputMaybe<Scalars['String']['input']>;
  known_as?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  relation_type?: InputMaybe<Scalars['String']['input']>;
  to_model?: InputMaybe<Scalars['String']['input']>;
};

export type ListAvailableFunctionsResponse = {
  __typename?: 'ListAvailableFunctionsResponse';
  functions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ListExecutableFunctionsResponse = {
  __typename?: 'ListExecutableFunctionsResponse';
  functions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ListPermissionsAndScopesResponse = {
  __typename?: 'ListPermissionsAndScopesResponse';
  functions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  models?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ListPluginIDsResponse = {
  __typename?: 'ListPluginIDsResponse';
  plugins?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type: Plugin_Type_Enum;
};

export type LoginUserPayload = {
  __typename?: 'LoginUserPayload';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserItem>;
};

export type MetaField = {
  __typename?: 'MetaField';
  created_at?: Maybe<Scalars['String']['output']>;
  created_by?: Maybe<CreatedBySystemUserInfo>;
  last_modified_by?: Maybe<ModifiedBySystemUserInfo>;
  resource_id?: Maybe<Scalars['String']['output']>;
  revision?: Maybe<Scalars['Boolean']['output']>;
  revision_at?: Maybe<Scalars['String']['output']>;
  root_revision_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type ModelDocumentCountItem = {
  __typename?: 'ModelDocumentCountItem';
  count: Scalars['Int']['output'];
  model: Scalars['String']['output'];
};

export type ModelPhysicalHealth = {
  __typename?: 'ModelPhysicalHealth';
  expected_columns: Array<Scalars['String']['output']>;
  extra_columns: Array<Scalars['String']['output']>;
  is_common_model: Scalars['Boolean']['output'];
  missing_columns: Array<Scalars['String']['output']>;
  model_name: Scalars['String']['output'];
  physical_columns: Array<Scalars['String']['output']>;
  table_exists: Scalars['Boolean']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type ModelType = {
  __typename?: 'ModelType';
  connections?: Maybe<Array<Maybe<ConnectionType>>>;
  enable_revision?: Maybe<Scalars['Boolean']['output']>;
  fields?: Maybe<Array<Maybe<FieldInfo>>>;
  has_connections?: Maybe<Scalars['Boolean']['output']>;
  hook_ids?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  is_common_model?: Maybe<Scalars['Boolean']['output']>;
  is_project_auth_user_model?: Maybe<Scalars['Boolean']['output']>;
  is_tenant_model?: Maybe<Scalars['Boolean']['output']>;
  locals?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name?: Maybe<Scalars['String']['output']>;
  repeated_groups?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  revision_filter?: Maybe<Array<Maybe<RevisionFilter>>>;
  single_page?: Maybe<Scalars['Boolean']['output']>;
  single_page_uuid?: Maybe<Scalars['String']['output']>;
  system_generated?: Maybe<Scalars['Boolean']['output']>;
  unique_keys?: Maybe<Array<Maybe<UniqueKey>>>;
};

export type ModifiedBySystemUserInfo = {
  __typename?: 'ModifiedBySystemUserInfo';
  _key?: Maybe<Scalars['String']['output']>;
  administrative_permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  avatar?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  current_project_id?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  is_admin?: Maybe<Scalars['Boolean']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  project_access_permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  project_assigned_role?: Maybe<Scalars['String']['output']>;
  project_limit?: Maybe<Scalars['Int']['output']>;
  project_user?: Maybe<Scalars['Boolean']['output']>;
  read_only_project?: Maybe<Scalars['Boolean']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
  user_subscription_type?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type MutationQuery = {
  __typename?: 'MutationQuery';
  /** Client accepts delivery. Temporary credentials must already be reauthorized. */
  acceptFreelanceDelivery?: Maybe<Scalars['Boolean']['output']>;
  addModelToProject?: Maybe<Array<Maybe<ModelType>>>;
  approveSchemaChanges?: Maybe<ApproveSchemaChangesResponse>;
  /** Permanently delete soft-deleted tenants. confirm_text must be exactly "yes delete them all". Fail-closed if any id is not soft-deleted. */
  bulkHardDeleteTenants?: Maybe<BulkHardDeleteTenantReport>;
  /** Soft-delete multiple tenant catalog rows. Skips already-deleted ids. */
  bulkSoftDeleteTenants?: Maybe<BulkTenantDeleteReport>;
  cancelTenantSubscription?: Maybe<ProjectTenantSubscription>;
  /** Create a Personal or Client workspace owned by the caller */
  createAccountWorkspace?: Maybe<AccountWorkspace>;
  createPartner?: Maybe<ProPartner>;
  createTenant?: Maybe<ProTenantCatalogRow>;
  createTenantInvoice?: Maybe<ProjectTenantInvoice>;
  createTenantSubscription?: Maybe<ProjectTenantSubscription>;
  createUser?: Maybe<UserItem>;
  createWebHook?: Maybe<Webhook>;
  deleteConnectionFromModel?: Maybe<Array<Maybe<ConnectionType>>>;
  deleteFunctionFromProject?: Maybe<Array<Maybe<CloudFunctionType>>>;
  deleteModelData?: Maybe<DeleteModelDataResponse>;
  deletePlanFromProject?: Maybe<Array<Maybe<Plan>>>;
  deleteProjectToken?: Maybe<DeleteApiTokenResponse>;
  deleteRoleFromProject?: Maybe<DeleteApitoFunctionResponse>;
  /** Soft-delete tenant catalog row (status=deleted). Content and mirror remain until hardDeleteTenant. */
  deleteTenant?: Maybe<Scalars['Boolean']['output']>;
  deleteUniqueKey?: Maybe<UniqueKey>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  deleteWebHook?: Maybe<DeleteWebHookResponse>;
  deployFunctionToProject?: Maybe<DeployFunctionToProjectResponse>;
  discardSchemaDraft?: Maybe<Scalars['Boolean']['output']>;
  duplicateModelData?: Maybe<DuplicateModelDataResponse>;
  duplicatePlanInProject?: Maybe<Plan>;
  duplicateRoleInProject?: Maybe<Role>;
  flushSchemaSync?: Maybe<SchemaChangeRepairResponse>;
  generateProjectToken?: Maybe<GenerateProjectTokenResponse>;
  generateTenantToken?: Maybe<GenerateTenantTokenResponse>;
  /** Permanently delete a soft-deleted tenant after tenantHardDeleteImpact confirmation. */
  hardDeleteTenant?: Maybe<HardDeleteTenantReport>;
  /** Invite a SystemUser onto selected projects with console-section permissions */
  inviteWorkspaceMember?: Maybe<Scalars['Boolean']['output']>;
  /** Freelancer marks the project ready for handover (workflow only, never a billing trigger) */
  markFreelanceReady?: Maybe<Scalars['Boolean']['output']>;
  markInvoicePaid?: Maybe<ProjectTenantInvoice>;
  modelFieldOperation?: Maybe<FieldInfo>;
  /** Reassign a project to another workspace in place (same DB/runtime/endpoints) */
  moveProjectToWorkspace?: Maybe<Scalars['Boolean']['output']>;
  publishSchemaChangeExecutionRecord?: Maybe<SchemaChangeRepairResponse>;
  rearrangeSerialOfField?: Maybe<ModelType>;
  reconcileCommonModels?: Maybe<CommonModelReconcileResult>;
  registerUser?: Maybe<UserItem>;
  rejectSchemaChangeExecutionRecord?: Maybe<SchemaChangeRepairResponse>;
  rejectSchemaChanges?: Maybe<Scalars['Boolean']['output']>;
  removeProjectSpecificPlugin?: Maybe<RemoveProjectSpecificPluginResponse>;
  /** Remove one project grant, or all caller-managed grants when project_id is omitted */
  removeWorkspaceMember?: Maybe<Scalars['Boolean']['output']>;
  /** Send or resend the Day-7 client activation link. Does not reset the 30-day trial. */
  requestFreelanceClientBilling?: Maybe<Scalars['Boolean']['output']>;
  resetUserPassword?: Maybe<Scalars['Boolean']['output']>;
  restoreBackup?: Maybe<BackupRun>;
  retrySchemaChangeExecutionRecord?: Maybe<SchemaChangeRepairResponse>;
  retrySchemaOperation?: Maybe<SchemaOperation>;
  rollbackFunctionDeployment?: Maybe<RollbackFunctionDeploymentResponse>;
  rollbackSchemaVersion?: Maybe<RollbackSchemaVersionResponse>;
  runBackupNow?: Maybe<BackupRun>;
  runModelMigrations?: Maybe<Array<Maybe<ModelType>>>;
  send?: Maybe<SendMutationResponse>;
  stageRelationTransition?: Maybe<RelationTransitionStageResult>;
  stageSchemaVersionRevert?: Maybe<SchemaVersionRevertStageResponse>;
  submitSchemaChanges?: Maybe<Scalars['Boolean']['output']>;
  /** Block shop login and API. status stays active. reason banned is a ban. */
  suspendTenant?: Maybe<ProTenantCatalogRow>;
  testBackupSettings?: Maybe<BackupTestResult>;
  testFunctionDraft?: Maybe<TestFunctionDraftResponse>;
  /** Change the primary owner/payer. Requires typed confirmation TRANSFER. */
  transferWorkspaceOwnership?: Maybe<Scalars['Boolean']['output']>;
  /** Clear suspended_at and suspension_reason. */
  unsuspendTenant?: Maybe<ProTenantCatalogRow>;
  updateBackupSettings?: Maybe<BackupTarget>;
  updateBackupTargets?: Maybe<Array<Maybe<BackupTarget>>>;
  updateInvoiceProfile?: Maybe<ProInvoiceProfile>;
  updateModel?: Maybe<ModelType>;
  updatePartner?: Maybe<ProPartner>;
  updateProfile?: Maybe<SystemUserInfo>;
  updateProject?: Maybe<ProjectModel>;
  updateProjectAuthenticationSettings?: Maybe<ProjectAuthenticationSettingsPayload>;
  updateProjectPaymentProviders?: Maybe<ProjectPaymentProviderConfig>;
  updateProjectStorageSettings?: Maybe<ProjectStorageSettingsPayload>;
  updateTenant?: Maybe<ProTenantCatalogRow>;
  updateTenantSubscription?: Maybe<ProjectTenantSubscription>;
  updateUser?: Maybe<UserItem>;
  /** Replace a member's grants on caller-administered projects */
  updateWorkspaceMember?: Maybe<Scalars['Boolean']['output']>;
  upsertConnectionToModel?: Maybe<Array<Maybe<ConnectionType>>>;
  upsertFieldToModel?: Maybe<FieldInfo>;
  upsertFunctionToProject?: Maybe<CloudFunctionType>;
  upsertModelData?: Maybe<DocumentModelType>;
  upsertPartnerProjectRate?: Maybe<ProPartnerProjectRate>;
  upsertPlanToProject?: Maybe<Plan>;
  upsertPlugin?: Maybe<PluginDetailsFields>;
  upsertRoleToProject?: Maybe<Role>;
  upsertUniqueKey?: Maybe<UniqueKey>;
};


export type MutationQueryAcceptFreelanceDeliveryArgs = {
  engagement_id: Scalars['String']['input'];
  freelancer_role?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryAddModelToProjectArgs = {
  is_common_model?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  single_record?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationQueryApproveSchemaChangesArgs = {
  changeset_id: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryBulkHardDeleteTenantsArgs = {
  confirm_text: Scalars['String']['input'];
  tenant_ids: Array<Scalars['String']['input']>;
};


export type MutationQueryBulkSoftDeleteTenantsArgs = {
  tenant_ids: Array<Scalars['String']['input']>;
};


export type MutationQueryCancelTenantSubscriptionArgs = {
  force_ledger_only?: InputMaybe<Scalars['Boolean']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  subscription_id: Scalars['String']['input'];
};


export type MutationQueryCreateAccountWorkspaceArgs = {
  kind?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationQueryCreatePartnerArgs = {
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  commission_percent?: InputMaybe<Scalars['Int']['input']>;
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryCreateTenantArgs = {
  data?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  partner_id?: InputMaybe<Scalars['String']['input']>;
  plan_tier?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryCreateTenantInvoiceArgs = {
  amount: Scalars['Float']['input'];
  billing_purpose?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subscription_id: Scalars['String']['input'];
};


export type MutationQueryCreateTenantSubscriptionArgs = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  billing_contact_user_id?: InputMaybe<Scalars['String']['input']>;
  billing_interval_months?: InputMaybe<Scalars['Int']['input']>;
  billing_purpose?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  issue_invoice?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  partner_id?: InputMaybe<Scalars['String']['input']>;
  plan_tier: Scalars['String']['input'];
  tenant_id: Scalars['String']['input'];
};


export type MutationQueryCreateUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  project_id: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
  tenant_id?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryCreateWebHookArgs = {
  events: Array<InputMaybe<Scalars['String']['input']>>;
  logic_executions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  model: Scalars['String']['input'];
  name: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryDeleteConnectionFromModelArgs = {
  from: Scalars['String']['input'];
  known_as?: InputMaybe<Scalars['String']['input']>;
  to: Scalars['String']['input'];
};


export type MutationQueryDeleteFunctionFromProjectArgs = {
  function: Scalars['String']['input'];
};


export type MutationQueryDeleteModelDataArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  model_name: Scalars['String']['input'];
};


export type MutationQueryDeletePlanFromProjectArgs = {
  id: Scalars['String']['input'];
};


export type MutationQueryDeleteProjectTokenArgs = {
  duration: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
  token_id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryDeleteRoleFromProjectArgs = {
  role: Scalars['String']['input'];
};


export type MutationQueryDeleteTenantArgs = {
  tenant_id: Scalars['String']['input'];
};


export type MutationQueryDeleteUniqueKeyArgs = {
  model_name: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationQueryDeleteUserArgs = {
  user_id: Scalars['String']['input'];
};


export type MutationQueryDeleteWebHookArgs = {
  id: Scalars['String']['input'];
};


export type MutationQueryDeployFunctionToProjectArgs = {
  name: Scalars['String']['input'];
  source?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryDiscardSchemaDraftArgs = {
  changeset_id: Scalars['String']['input'];
};


export type MutationQueryDuplicateModelDataArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  model_name: Scalars['String']['input'];
};


export type MutationQueryDuplicatePlanInProjectArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  new_id: Scalars['String']['input'];
  source_id: Scalars['String']['input'];
};


export type MutationQueryDuplicateRoleInProjectArgs = {
  new_name: Scalars['String']['input'];
  source_role: Scalars['String']['input'];
};


export type MutationQueryFlushSchemaSyncArgs = {
  scope?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryGenerateProjectTokenArgs = {
  duration: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role: Scalars['String']['input'];
};


export type MutationQueryGenerateTenantTokenArgs = {
  duration: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
  tenant_id: Scalars['String']['input'];
};


export type MutationQueryHardDeleteTenantArgs = {
  confirm_text: Scalars['String']['input'];
  content_total: Scalars['Int']['input'];
  impact_token: Scalars['String']['input'];
  tenant_id: Scalars['String']['input'];
};


export type MutationQueryInviteWorkspaceMemberArgs = {
  administrative_permissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  email: Scalars['String']['input'];
  make_admin?: InputMaybe<Scalars['Boolean']['input']>;
  project_ids: Array<Scalars['String']['input']>;
};


export type MutationQueryMarkFreelanceReadyArgs = {
  engagement_id: Scalars['String']['input'];
};


export type MutationQueryMarkInvoicePaidArgs = {
  invoice_id: Scalars['String']['input'];
};


export type MutationQueryModelFieldOperationArgs = {
  changed_type?: InputMaybe<Scalars['String']['input']>;
  field_name: Scalars['String']['input'];
  known_as?: InputMaybe<Scalars['String']['input']>;
  model_name: Scalars['String']['input'];
  moved_to?: InputMaybe<Scalars['String']['input']>;
  new_name?: InputMaybe<Scalars['String']['input']>;
  parent_field?: InputMaybe<Scalars['String']['input']>;
  single_page_model?: InputMaybe<Scalars['Boolean']['input']>;
  type: Field_Operation_Type_Enum;
};


export type MutationQueryMoveProjectToWorkspaceArgs = {
  destination_workspace_id: Scalars['String']['input'];
  project_id: Scalars['String']['input'];
};


export type MutationQueryPublishSchemaChangeExecutionRecordArgs = {
  message?: InputMaybe<Scalars['String']['input']>;
  record_id: Scalars['String']['input'];
};


export type MutationQueryRearrangeSerialOfFieldArgs = {
  field_name: Scalars['String']['input'];
  model_name: Scalars['String']['input'];
  move_type: Scalars['String']['input'];
  new_position: Scalars['Int']['input'];
  parent_id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryReconcileCommonModelsArgs = {
  model_name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryRegisterUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  project_id: Scalars['String']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryRejectSchemaChangeExecutionRecordArgs = {
  note?: InputMaybe<Scalars['String']['input']>;
  record_id: Scalars['String']['input'];
};


export type MutationQueryRejectSchemaChangesArgs = {
  changeset_id: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryRemoveProjectSpecificPluginArgs = {
  id: Scalars['String']['input'];
};


export type MutationQueryRemoveWorkspaceMemberArgs = {
  project_id?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['String']['input'];
};


export type MutationQueryRequestFreelanceClientBillingArgs = {
  engagement_id: Scalars['String']['input'];
};


export type MutationQueryResetUserPasswordArgs = {
  password: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationQueryRestoreBackupArgs = {
  allow_system_restore?: InputMaybe<Scalars['Boolean']['input']>;
  confirm: Scalars['String']['input'];
  snapshot_id: Scalars['String']['input'];
  target_id?: InputMaybe<Scalars['String']['input']>;
  target_type: Scalars['String']['input'];
};


export type MutationQueryRetrySchemaChangeExecutionRecordArgs = {
  record_id: Scalars['String']['input'];
};


export type MutationQueryRetrySchemaOperationArgs = {
  operation_id: Scalars['String']['input'];
};


export type MutationQueryRollbackFunctionDeploymentArgs = {
  name: Scalars['String']['input'];
  revision_id: Scalars['String']['input'];
};


export type MutationQueryRollbackSchemaVersionArgs = {
  message?: InputMaybe<Scalars['String']['input']>;
  version: Scalars['Int']['input'];
};


export type MutationQueryRunBackupNowArgs = {
  target_id?: InputMaybe<Scalars['String']['input']>;
  target_type: Scalars['String']['input'];
};


export type MutationQueryRunModelMigrationsArgs = {
  force_recreate?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationQuerySendArgs = {
  message: Scalars['String']['input'];
};


export type MutationQueryStageRelationTransitionArgs = {
  acknowledgement?: InputMaybe<Scalars['String']['input']>;
  from_model: Scalars['String']['input'];
  from_relation?: InputMaybe<Scalars['String']['input']>;
  known_as?: InputMaybe<Scalars['String']['input']>;
  plan_hash: Scalars['String']['input'];
  schema_version?: InputMaybe<Scalars['String']['input']>;
  target_from_relation: Scalars['String']['input'];
  target_to_relation: Scalars['String']['input'];
  to_model: Scalars['String']['input'];
  to_relation?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryStageSchemaVersionRevertArgs = {
  acknowledgement: Scalars['String']['input'];
  plan_hash: Scalars['String']['input'];
  target_version: Scalars['Int']['input'];
};


export type MutationQuerySubmitSchemaChangesArgs = {
  changeset_id: Scalars['String']['input'];
};


export type MutationQuerySuspendTenantArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  tenant_id: Scalars['String']['input'];
};


export type MutationQueryTestBackupSettingsArgs = {
  config?: InputMaybe<Scalars['String']['input']>;
  inherit_default?: InputMaybe<Scalars['Boolean']['input']>;
  provider_id?: InputMaybe<Scalars['String']['input']>;
  target_id?: InputMaybe<Scalars['String']['input']>;
  target_type: Scalars['String']['input'];
};


export type MutationQueryTestFunctionDraftArgs = {
  name: Scalars['String']['input'];
  payload?: InputMaybe<Scalars['JSON']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  tenant_id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryTransferWorkspaceOwnershipArgs = {
  confirmation: Scalars['String']['input'];
  new_owner_email: Scalars['String']['input'];
  retained_role?: InputMaybe<Scalars['String']['input']>;
  workspace_id: Scalars['String']['input'];
};


export type MutationQueryUnsuspendTenantArgs = {
  tenant_id: Scalars['String']['input'];
};


export type MutationQueryUpdateBackupSettingsArgs = {
  config?: InputMaybe<Scalars['String']['input']>;
  inherit_default?: InputMaybe<Scalars['Boolean']['input']>;
  provider_id?: InputMaybe<Scalars['String']['input']>;
  retention_days?: InputMaybe<Scalars['Int']['input']>;
  schedule_cron?: InputMaybe<Scalars['String']['input']>;
  target_id?: InputMaybe<Scalars['String']['input']>;
  target_type: Scalars['String']['input'];
};


export type MutationQueryUpdateBackupTargetsArgs = {
  targets: Array<BackupTargetToggleInput>;
};


export type MutationQueryUpdateInvoiceProfileArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  extra_lines?: InputMaybe<Scalars['String']['input']>;
  legal_name?: InputMaybe<Scalars['String']['input']>;
  logo_url?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryUpdateModelArgs = {
  common_model_migration?: InputMaybe<Scalars['String']['input']>;
  is_common_model?: InputMaybe<Scalars['Boolean']['input']>;
  model_name: Scalars['String']['input'];
  new_name?: InputMaybe<Scalars['String']['input']>;
  single_page_model?: InputMaybe<Scalars['Boolean']['input']>;
  type: UpdateModelTypeEnum;
};


export type MutationQueryUpdatePartnerArgs = {
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  commission_percent?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryUpdateProfileArgs = {
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  new_pass?: InputMaybe<Scalars['String']['input']>;
  old_pass?: InputMaybe<Scalars['String']['input']>;
  organization_id?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryUpdateProjectArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  driver?: InputMaybe<UpdateProjectDriverDetails>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_icon?: InputMaybe<Scalars['String']['input']>;
  project_secret_key?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<UpdateSettingsPayload>;
};


export type MutationQueryUpdateProjectAuthenticationSettingsArgs = {
  input: UpdateProjectAuthenticationInput;
};


export type MutationQueryUpdateProjectPaymentProvidersArgs = {
  google_play?: InputMaybe<Scalars['JSON']['input']>;
  paddle?: InputMaybe<Scalars['JSON']['input']>;
};


export type MutationQueryUpdateProjectStorageSettingsArgs = {
  input: UpdateProjectStorageInput;
};


export type MutationQueryUpdateTenantArgs = {
  data?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  partner_id?: InputMaybe<Scalars['String']['input']>;
  plan_tier?: InputMaybe<Scalars['String']['input']>;
  tenant_id: Scalars['String']['input'];
};


export type MutationQueryUpdateTenantSubscriptionArgs = {
  billing_contact_user_id?: InputMaybe<Scalars['String']['input']>;
  billing_interval_months?: InputMaybe<Scalars['Int']['input']>;
  current_period_end?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  partner_id?: InputMaybe<Scalars['String']['input']>;
  plan_tier?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subscription_id: Scalars['String']['input'];
};


export type MutationQueryUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  tenant_id?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['String']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryUpdateWorkspaceMemberArgs = {
  administrative_permissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  make_admin?: InputMaybe<Scalars['Boolean']['input']>;
  project_ids: Array<Scalars['String']['input']>;
  user_id: Scalars['String']['input'];
};


export type MutationQueryUpsertConnectionToModelArgs = {
  forward_connection_type: Relation_Type_Enum;
  from: Scalars['String']['input'];
  known_as?: InputMaybe<Scalars['String']['input']>;
  reverse_connection_type: Relation_Type_Enum;
  to: Scalars['String']['input'];
};


export type MutationQueryUpsertFieldToModelArgs = {
  enable_indexing?: InputMaybe<Scalars['Boolean']['input']>;
  field_description?: InputMaybe<Scalars['String']['input']>;
  field_label: Scalars['String']['input'];
  field_sub_type?: InputMaybe<Field_Sub_Type_Enum>;
  field_type?: InputMaybe<Field_Type_Enum>;
  input_type?: InputMaybe<Input_Type_Enum>;
  is_object_field?: InputMaybe<Scalars['Boolean']['input']>;
  is_update?: InputMaybe<Scalars['Boolean']['input']>;
  model_name: Scalars['String']['input'];
  parent_field?: InputMaybe<Scalars['String']['input']>;
  plugin_field_type?: InputMaybe<Scalars['String']['input']>;
  plugin_id?: InputMaybe<Scalars['String']['input']>;
  serial?: InputMaybe<Scalars['Int']['input']>;
  validation?: InputMaybe<Module_Validation_Payload>;
};


export type MutationQueryUpsertFunctionToProjectArgs = {
  binary_url?: InputMaybe<Scalars['String']['input']>;
  capabilities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  env_vars?: InputMaybe<Array<InputMaybe<Function_Provider_Env_Vars_Payload>>>;
  function_connected?: InputMaybe<Scalars['Boolean']['input']>;
  function_exported_variable?: InputMaybe<Scalars['String']['input']>;
  function_path?: InputMaybe<Scalars['String']['input']>;
  function_provider_id?: InputMaybe<Scalars['String']['input']>;
  graphql_schema_type?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  provider_exported_variable?: InputMaybe<Scalars['String']['input']>;
  request?: InputMaybe<Scalars['String']['input']>;
  request_payload_is_optional?: InputMaybe<Scalars['Boolean']['input']>;
  response?: InputMaybe<Scalars['String']['input']>;
  response_is_array?: InputMaybe<Scalars['Boolean']['input']>;
  runtime_config?: InputMaybe<Function_Provider_Config_Payload>;
  source?: InputMaybe<Scalars['String']['input']>;
  trigger_type?: InputMaybe<Scalars['String']['input']>;
  update?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationQueryUpsertModelDataArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  connect?: InputMaybe<Scalars['JSON']['input']>;
  disconnect?: InputMaybe<Scalars['JSON']['input']>;
  force_update?: InputMaybe<Scalars['Boolean']['input']>;
  local?: InputMaybe<Scalars['String']['input']>;
  model_name: Scalars['String']['input'];
  payload?: InputMaybe<Scalars['JSON']['input']>;
  single_page_data?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryUpsertPartnerProjectRateArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  clear?: InputMaybe<Scalars['Boolean']['input']>;
  commission_percent?: InputMaybe<Scalars['Int']['input']>;
  partner_id: Scalars['String']['input'];
  project_id: Scalars['String']['input'];
};


export type MutationQueryUpsertPlanToProjectArgs = {
  api_permissions?: InputMaybe<Scalars['JSON']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  logic_executions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  paddle_price_id?: InputMaybe<Scalars['String']['input']>;
  play_base_plan_id?: InputMaybe<Scalars['String']['input']>;
  play_product_id?: InputMaybe<Scalars['String']['input']>;
  price_monthly?: InputMaybe<Scalars['Float']['input']>;
  prices?: InputMaybe<Scalars['JSON']['input']>;
  provider_products?: InputMaybe<Scalars['JSON']['input']>;
  quotas?: InputMaybe<Scalars['JSON']['input']>;
};


export type MutationQueryUpsertPluginArgs = {
  activate_status?: InputMaybe<Plugin_Activation_Type_Enum>;
  enable?: InputMaybe<Scalars['Boolean']['input']>;
  env_vars?: InputMaybe<Array<InputMaybe<PluginConfigEnvVarsPayload>>>;
  id: Scalars['String']['input'];
};


export type MutationQueryUpsertRoleToProjectArgs = {
  api_permissions?: InputMaybe<Scalars['JSON']['input']>;
  is_admin?: InputMaybe<Scalars['Boolean']['input']>;
  logic_executions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name: Scalars['String']['input'];
};


export type MutationQueryUpsertUniqueKeyArgs = {
  columns: Array<Scalars['String']['input']>;
  model_name: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type OAuthStatePayload = {
  __typename?: 'OAuthStatePayload';
  state?: Maybe<Scalars['String']['output']>;
};

export enum Plugin_Activation_Type_Enum {
  /** Third Party Plugin Gets Installed by Github */
  Activated = 'activated',
  /** Local Plugin Gets Build and Installed at Run Time */
  Deactivated = 'deactivated'
}

export enum Plugin_Load_Type_Enum {
  /** Plugin is is Building */
  Installed = 'installed',
  /** Plugin load failed */
  LoadFailed = 'load_failed',
  /** Plugin is Loaded */
  Loaded = 'loaded',
  /** Plugin is Loading */
  Loading = 'loading',
  /** Plugin is not Installed */
  NotInstalled = 'not_installed',
  /** Plugin is Built */
  ReInstall = 're_install'
}

export enum Plugin_Type_Enum {
  /** Deprecated. Reserved protobuf value; all plugins are system-installed. Use capabilities. */
  Project = 'project',
  /** System-installed plugin. Project exposure is via activation, not a second type. */
  System = 'system'
}

export type PartnerSearchPayload = {
  __typename?: 'PartnerSearchPayload';
  results?: Maybe<Array<Maybe<ProPartner>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Plan = {
  __typename?: 'Plan';
  api_permissions?: Maybe<Scalars['JSON']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  logic_executions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name?: Maybe<Scalars['String']['output']>;
  paddle_price_id?: Maybe<Scalars['String']['output']>;
  play_base_plan_id?: Maybe<Scalars['String']['output']>;
  play_product_id?: Maybe<Scalars['String']['output']>;
  price_monthly?: Maybe<Scalars['Float']['output']>;
  prices?: Maybe<Scalars['JSON']['output']>;
  provider_products?: Maybe<Scalars['JSON']['output']>;
  quotas?: Maybe<Scalars['JSON']['output']>;
  system_generated?: Maybe<Scalars['Boolean']['output']>;
};

export type PlatformAccount = {
  __typename?: 'PlatformAccount';
  created_at?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  is_super_admin?: Maybe<Scalars['Boolean']['output']>;
  last_logged_in?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  project_count?: Maybe<Scalars['Int']['output']>;
  projects?: Maybe<Array<Maybe<PlatformAccountProject>>>;
  register_provider?: Maybe<Scalars['String']['output']>;
};

export type PlatformAccountProject = {
  __typename?: 'PlatformAccountProject';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

export type PlatformAccountSearchPayload = {
  __typename?: 'PlatformAccountSearchPayload';
  results?: Maybe<Array<Maybe<PlatformAccount>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type PluginConfigEnvVarsPayload = {
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type PluginDetailsFields = {
  __typename?: 'PluginDetailsFields';
  activate_status?: Maybe<Plugin_Activation_Type_Enum>;
  author?: Maybe<Scalars['String']['output']>;
  branch?: Maybe<Scalars['String']['output']>;
  bundle_sha256?: Maybe<Scalars['String']['output']>;
  bundle_url?: Maybe<Scalars['String']['output']>;
  capabilities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  description?: Maybe<Scalars['String']['output']>;
  enable?: Maybe<Scalars['Boolean']['output']>;
  env_vars?: Maybe<Array<Maybe<EnvVariable>>>;
  exported_variable?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  load_status?: Maybe<Plugin_Load_Type_Enum>;
  official?: Maybe<Scalars['Boolean']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  repository_url?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  signed?: Maybe<Scalars['Boolean']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Plugin_Type_Enum>;
  used_in_projects?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  version?: Maybe<Scalars['String']['output']>;
};

export type ProInvoiceProfile = {
  __typename?: 'ProInvoiceProfile';
  address?: Maybe<Scalars['String']['output']>;
  extra_lines?: Maybe<Scalars['String']['output']>;
  legal_name?: Maybe<Scalars['String']['output']>;
  logo_url?: Maybe<Scalars['String']['output']>;
  organization_id?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type ProPartner = {
  __typename?: 'ProPartner';
  avatar_url?: Maybe<Scalars['String']['output']>;
  commission_percent?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  is_default?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organization_id?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type ProPartnerProjectRate = {
  __typename?: 'ProPartnerProjectRate';
  active?: Maybe<Scalars['Boolean']['output']>;
  commission_percent?: Maybe<Scalars['Int']['output']>;
  organization_id?: Maybe<Scalars['String']['output']>;
  partner_id?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
};

export type ProTenantCatalogRow = {
  __typename?: 'ProTenantCatalogRow';
  data?: Maybe<Scalars['String']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  partner_id?: Maybe<Scalars['String']['output']>;
  plan_tier?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  suspended_at?: Maybe<Scalars['String']['output']>;
  suspension_reason?: Maybe<Scalars['String']['output']>;
};

export type ProjectAuthenticationSettings = {
  __typename?: 'ProjectAuthenticationSettings';
  auto_provision_on_providers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  auto_provision_tenant_on_signup?: Maybe<Scalars['Boolean']['output']>;
  default_registration_role?: Maybe<Scalars['String']['output']>;
  enable_facebook_auth: Scalars['Boolean']['output'];
  enable_general_auth: Scalars['Boolean']['output'];
  enable_github_auth: Scalars['Boolean']['output'];
  enable_google_auth: Scalars['Boolean']['output'];
  enable_linkedin_auth: Scalars['Boolean']['output'];
  enable_x_auth: Scalars['Boolean']['output'];
  facebook_client_id?: Maybe<Scalars['String']['output']>;
  facebook_oauth_redirect_uri?: Maybe<Scalars['String']['output']>;
  general_authentication_method: Scalars['String']['output'];
  github_client_id?: Maybe<Scalars['String']['output']>;
  github_oauth_redirect_uri?: Maybe<Scalars['String']['output']>;
  google_client_id?: Maybe<Scalars['String']['output']>;
  google_oauth_redirect_uri?: Maybe<Scalars['String']['output']>;
  has_facebook_client_secret: Scalars['Boolean']['output'];
  has_github_client_secret: Scalars['Boolean']['output'];
  has_google_client_secret: Scalars['Boolean']['output'];
  has_linkedin_client_secret: Scalars['Boolean']['output'];
  has_x_client_secret: Scalars['Boolean']['output'];
  linkedin_client_id?: Maybe<Scalars['String']['output']>;
  linkedin_oauth_redirect_uri?: Maybe<Scalars['String']['output']>;
  tenant_base_domain?: Maybe<Scalars['String']['output']>;
  x_client_id?: Maybe<Scalars['String']['output']>;
  x_oauth_redirect_uri?: Maybe<Scalars['String']['output']>;
};

export type ProjectAuthenticationSettingsPayload = {
  __typename?: 'ProjectAuthenticationSettingsPayload';
  authentication_settings: ProjectAuthenticationSettings;
};

export type ProjectModel = {
  __typename?: 'ProjectModel';
  _key?: Maybe<Scalars['String']['output']>;
  authentication_settings?: Maybe<ProjectAuthenticationSettings>;
  auto_provision_on_providers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  auto_provision_tenant_on_signup?: Maybe<Scalars['Boolean']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  default_function_plugin?: Maybe<Scalars['String']['output']>;
  default_storage_plugin?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  driver?: Maybe<DriverCredentials>;
  expire_at?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  per_tenant_separate_database?: Maybe<Scalars['Boolean']['output']>;
  plans?: Maybe<Scalars['JSON']['output']>;
  plugins?: Maybe<Array<Maybe<PluginDetailsFields>>>;
  project_icon?: Maybe<Scalars['String']['output']>;
  project_plan?: Maybe<Scalars['String']['output']>;
  project_secret_key?: Maybe<Scalars['String']['output']>;
  project_template?: Maybe<Scalars['String']['output']>;
  project_type?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Scalars['JSON']['output']>;
  schema?: Maybe<UserDefinedSchema>;
  settings?: Maybe<ProjectSettings>;
  storage_settings?: Maybe<ProjectStorageSettings>;
  system_messages?: Maybe<Array<Maybe<SystemMessage>>>;
  teams?: Maybe<Array<Maybe<SystemUserInfo>>>;
  tenant_base_domain?: Maybe<Scalars['String']['output']>;
  tenant_model_name?: Maybe<Scalars['String']['output']>;
  tokens?: Maybe<Array<Maybe<ProjectToken>>>;
  trial_ends?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
  workspaces?: Maybe<Array<Maybe<Workspace>>>;
};

export type ProjectPaymentProviderConfig = {
  __typename?: 'ProjectPaymentProviderConfig';
  google_play?: Maybe<Scalars['JSON']['output']>;
  paddle?: Maybe<Scalars['JSON']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
  webhook_urls?: Maybe<Scalars['JSON']['output']>;
};

export type ProjectPluginsWhereFilterArgObject = {
  name?: InputMaybe<CommonFilter>;
};

export type ProjectSettings = {
  __typename?: 'ProjectSettings';
  auto_soft_delete_idle_tenants?: Maybe<Scalars['Boolean']['output']>;
  default_function_plugin?: Maybe<Scalars['String']['output']>;
  default_locale?: Maybe<Scalars['String']['output']>;
  default_storage_plugin?: Maybe<Scalars['String']['output']>;
  enable_revision_history?: Maybe<Scalars['Boolean']['output']>;
  idle_tenant_retention_days?: Maybe<Scalars['Int']['output']>;
  locals?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  project_id?: Maybe<Scalars['String']['output']>;
  system_graphql_hooks?: Maybe<Scalars['Boolean']['output']>;
};

export type ProjectStorageSettings = {
  __typename?: 'ProjectStorageSettings';
  access_key_id?: Maybe<Scalars['String']['output']>;
  bucket?: Maybe<Scalars['String']['output']>;
  endpoint?: Maybe<Scalars['String']['output']>;
  force_path_style?: Maybe<Scalars['Boolean']['output']>;
  has_secret_access_key: Scalars['Boolean']['output'];
  public_base_url?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  use_free_cloud_storage: Scalars['Boolean']['output'];
};

export type ProjectStorageSettingsPayload = {
  __typename?: 'ProjectStorageSettingsPayload';
  storage_settings: ProjectStorageSettings;
};

export type ProjectTenantInvoice = {
  __typename?: 'ProjectTenantInvoice';
  amount?: Maybe<Scalars['Float']['output']>;
  billing_purpose?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  external_payment_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  issued_at?: Maybe<Scalars['String']['output']>;
  line_items_json?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  paid_at?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subscription_id?: Maybe<Scalars['String']['output']>;
  tenant_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type ProjectTenantSubscription = {
  __typename?: 'ProjectTenantSubscription';
  billing_contact_user_id?: Maybe<Scalars['String']['output']>;
  billing_interval_months?: Maybe<Scalars['Int']['output']>;
  cancel_at?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  current_period_end?: Maybe<Scalars['String']['output']>;
  current_period_start?: Maybe<Scalars['String']['output']>;
  external_subscription_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  manage_url?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  partner_id?: Maybe<Scalars['String']['output']>;
  plan_tier?: Maybe<Scalars['String']['output']>;
  product_id?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  tenant_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type ProjectToken = {
  __typename?: 'ProjectToken';
  created_at?: Maybe<Scalars['String']['output']>;
  expire?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  token_fingerprint?: Maybe<Scalars['String']['output']>;
  token_id?: Maybe<Scalars['String']['output']>;
  token_prefix?: Maybe<Scalars['String']['output']>;
};

export type ProjectWhereFilterArgObject = {
  created_at?: InputMaybe<DateFilterFilter>;
  id?: InputMaybe<CommonFilter>;
  name?: InputMaybe<CommonFilter>;
  updated_at?: InputMaybe<CommonFilter>;
};

export type QueryType = {
  __typename?: 'QueryType';
  /** Workspaces the caller owns or belongs to */
  accountWorkspaces?: Maybe<Array<Maybe<AccountWorkspace>>>;
  auditLogs?: Maybe<Array<Maybe<AuditLogInfo>>>;
  backupProviders?: Maybe<Array<Maybe<BackupProvider>>>;
  backupRuns?: Maybe<Array<Maybe<BackupRun>>>;
  backupSnapshots?: Maybe<Array<Maybe<BackupSnapshot>>>;
  backupTargets?: Maybe<Array<Maybe<BackupTarget>>>;
  connectSupport?: Maybe<ConnectSupportResponse>;
  currentProject?: Maybe<ProjectModel>;
  getInvoiceProfile?: Maybe<ProInvoiceProfile>;
  getModelData?: Maybe<GetModelDataResponse>;
  getProject?: Maybe<ProjectModel>;
  getProjectPaymentProviders?: Maybe<ProjectPaymentProviderConfig>;
  getProjectPlans?: Maybe<Array<Maybe<Plan>>>;
  getProjectPlugins?: Maybe<Array<Maybe<PluginDetailsFields>>>;
  getSingleData?: Maybe<DocumentModelType>;
  getSystemPlugins?: Maybe<Array<Maybe<PluginDetailsFields>>>;
  getTenants?: Maybe<GetTenantsResponse>;
  getUser?: Maybe<SystemUserInfo>;
  googleOAuthState?: Maybe<GoogleOAuthStatePayload>;
  listAvailableFunctions?: Maybe<ListAvailableFunctionsResponse>;
  listExecutableFunctions?: Maybe<ListExecutableFunctionsResponse>;
  listFunctionDeployments?: Maybe<Array<Maybe<FunctionDeploymentType>>>;
  listFunctionRevisions?: Maybe<Array<Maybe<FunctionRevisionType>>>;
  listPartnerProjectRates?: Maybe<Array<Maybe<ProPartnerProjectRate>>>;
  listPermissionsAndScopes?: Maybe<ListPermissionsAndScopesResponse>;
  listPluginIds?: Maybe<ListPluginIDsResponse>;
  listProjects?: Maybe<Array<Maybe<ProjectModel>>>;
  listSingleModelRevisionData?: Maybe<Array<Maybe<RevisionHistoryResponse>>>;
  listTenantInvoices?: Maybe<TenantInvoicesPage>;
  listTenantSubscribers?: Maybe<TenantSubscribersPage>;
  listWebHooks?: Maybe<Array<Maybe<Webhook>>>;
  loginUser?: Maybe<LoginUserPayload>;
  modelDocumentCounts?: Maybe<Array<Maybe<ModelDocumentCountItem>>>;
  /** Read-only: compare published logical fields to physical table columns (no DDL). */
  modelPhysicalHealth?: Maybe<ModelPhysicalHealth>;
  /** Freelance Project engagements sponsored by the caller */
  myFreelanceClients?: Maybe<Array<Maybe<FreelanceEngagement>>>;
  /** Freelance Project engagements where the caller is the client */
  myFreelanceEngagements?: Maybe<Array<Maybe<FreelanceEngagement>>>;
  oauthState?: Maybe<OAuthStatePayload>;
  previewSchemaRelationTransition?: Maybe<RelationTransitionPreview>;
  previewSchemaVersionRevert?: Maybe<SchemaVersionRevertPreview>;
  projectFunctionsInfo?: Maybe<Array<Maybe<CloudFunctionType>>>;
  projectModelsInfo?: Maybe<Array<Maybe<ModelType>>>;
  /** Read-only: physical health for many models on the base project DB. Empty model_names = all models (capped). */
  projectPhysicalHealth: Array<ModelPhysicalHealth>;
  projectSchemaRelationGraph?: Maybe<Scalars['JSON']['output']>;
  schemaChangeEvents?: Maybe<Array<Maybe<SchemaChangeEventItem>>>;
  schemaChangeExecutionRecords?: Maybe<Array<Maybe<SchemaChangeExecutionRecord>>>;
  schemaDiff?: Maybe<Scalars['String']['output']>;
  schemaPreview?: Maybe<Scalars['String']['output']>;
  schemaVersioningStatus?: Maybe<SchemaVersioningStatus>;
  schemaVersions?: Maybe<Array<Maybe<SchemaVersionItem>>>;
  searchPartners?: Maybe<PartnerSearchPayload>;
  searchPlatformAccounts?: Maybe<PlatformAccountSearchPayload>;
  searchSchemaOperations?: Maybe<Array<Maybe<SchemaOperation>>>;
  searchSystemLogs?: Maybe<SystemLogSearchPayload>;
  searchSystemUsers?: Maybe<Array<Maybe<SystemUserInfo>>>;
  searchTenants?: Maybe<SearchTenantsPayload>;
  searchTenantsByDomain?: Maybe<SearchTenantsByDomainPayload>;
  searchUsers?: Maybe<SearchUsersPayload>;
  slowQueryLogs?: Maybe<SlowQueryLogsPayload>;
  systemLog?: Maybe<SystemLogEvent>;
  systemLogFacets?: Maybe<SystemLogFacetsPayload>;
  systemLogHealth?: Maybe<Scalars['String']['output']>;
  systemLogStats?: Maybe<SystemLogStatsPayload>;
  systemLogTrace?: Maybe<Array<Maybe<SystemLogEvent>>>;
  teamMembers?: Maybe<Array<Maybe<SystemUserInfo>>>;
  tenantHardDeleteImpact?: Maybe<TenantHardDeleteImpact>;
  /** Console operators grouped by user across projects the caller can administer */
  workspaceMembers?: Maybe<Array<Maybe<WorkspaceMember>>>;
};


export type QueryTypeAuditLogsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterArgumentObject>;
  where?: InputMaybe<AuditWhereFilterArgObject>;
};


export type QueryTypeBackupRunsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  target_id?: InputMaybe<Scalars['String']['input']>;
  target_type: Scalars['String']['input'];
};


export type QueryTypeBackupSnapshotsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  target_id?: InputMaybe<Scalars['String']['input']>;
  target_type: Scalars['String']['input'];
};


export type QueryTypeGetModelDataArgs = {
  _key?: InputMaybe<Scalars['JSON']['input']>;
  connection?: InputMaybe<ListAllDataDetailedOfAModelConnectionPayload>;
  intersect?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  model: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Filter_Status_Type_Enum>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryTypeGetProjectArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeGetProjectPluginsArgs = {
  filter?: InputMaybe<FilterArgumentObject>;
  where?: InputMaybe<ProjectPluginsWhereFilterArgObject>;
};


export type QueryTypeGetSingleDataArgs = {
  _id: Scalars['String']['input'];
  local?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  revision?: InputMaybe<Scalars['Boolean']['input']>;
  single_page_data?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryTypeGetSystemPluginsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterArgumentObject>;
  where?: InputMaybe<SystemPluginsWhereFilterArgObject>;
};


export type QueryTypeGetUserArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeGoogleOAuthStateArgs = {
  project_id: Scalars['String']['input'];
};


export type QueryTypeListAvailableFunctionsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  function_id: Scalars['String']['input'];
};


export type QueryTypeListExecutableFunctionsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  model_name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeListFunctionDeploymentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};


export type QueryTypeListFunctionRevisionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};


export type QueryTypeListPartnerProjectRatesArgs = {
  partner_id?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeListPluginIdsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  type: Plugin_Type_Enum;
};


export type QueryTypeListProjectsArgs = {
  filter?: InputMaybe<FilterArgumentObject>;
  where?: InputMaybe<ProjectWhereFilterArgObject>;
};


export type QueryTypeListSingleModelRevisionDataArgs = {
  _id: Scalars['String']['input'];
  model?: InputMaybe<Scalars['String']['input']>;
  single_page_data?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryTypeListTenantInvoicesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  subscription_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeListTenantSubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  paying_only?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryTypeListWebHooksArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeLoginUserArgs = {
  auth_method?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id_token?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  project_id: Scalars['String']['input'];
  signup?: InputMaybe<Scalars['Boolean']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  tenant_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeModelDocumentCountsArgs = {
  models?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryTypeModelPhysicalHealthArgs = {
  model_name: Scalars['String']['input'];
};


export type QueryTypeOauthStateArgs = {
  project_id: Scalars['String']['input'];
  provider: Scalars['String']['input'];
};


export type QueryTypePreviewSchemaRelationTransitionArgs = {
  from_model: Scalars['String']['input'];
  from_relation?: InputMaybe<Scalars['String']['input']>;
  known_as?: InputMaybe<Scalars['String']['input']>;
  schema_version?: InputMaybe<Scalars['String']['input']>;
  target_from_relation: Scalars['String']['input'];
  target_to_relation: Scalars['String']['input'];
  to_model: Scalars['String']['input'];
  to_relation?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypePreviewSchemaVersionRevertArgs = {
  target_version: Scalars['Int']['input'];
};


export type QueryTypeProjectFunctionsInfoArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeProjectModelsInfoArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  model_name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeProjectPhysicalHealthArgs = {
  model_names?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryTypeProjectSchemaRelationGraphArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSchemaChangeEventsArgs = {
  changeset_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSchemaChangeExecutionRecordsArgs = {
  changeset_id?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTypeSchemaDiffArgs = {
  changeset_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSchemaPreviewArgs = {
  source?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTypeSchemaVersionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTypeSearchPartnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSearchPlatformAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSearchSchemaOperationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  statuses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryTypeSearchSystemLogsArgs = {
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  driver_engine?: InputMaybe<Scalars['String']['input']>;
  environment?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_ns?: InputMaybe<Scalars['String']['input']>;
  kind?: InputMaybe<Scalars['String']['input']>;
  kinds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  level?: InputMaybe<Scalars['String']['input']>;
  levels?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  method?: InputMaybe<Scalars['String']['input']>;
  min_duration_ms?: InputMaybe<Scalars['Int']['input']>;
  min_duration_us?: InputMaybe<Scalars['Int']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  nats_subject?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['String']['input']>;
  request_id?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['String']['input']>;
  scope_key?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  sources?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_code?: InputMaybe<Scalars['Int']['input']>;
  statuses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tenant_id?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_ns?: InputMaybe<Scalars['String']['input']>;
  trace_id?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSearchSystemUsersArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterArgumentObject>;
  where?: InputMaybe<SearchSystemUsersWhereFilterArgObject>;
};


export type QueryTypeSearchTenantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  project_id: Scalars['String']['input'];
  q?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSearchTenantsByDomainArgs = {
  domain: Scalars['String']['input'];
  project_id: Scalars['String']['input'];
};


export type QueryTypeSearchUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  project_id: Scalars['String']['input'];
  q?: InputMaybe<Scalars['String']['input']>;
  tenant_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSlowQueryLogsArgs = {
  db_operation?: InputMaybe<Scalars['String']['input']>;
  driver_engine?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  min_duration_ms?: InputMaybe<Scalars['Int']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  project_id?: InputMaybe<Scalars['String']['input']>;
  query_kind?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tenant_id?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSystemLogArgs = {
  id: Scalars['String']['input'];
};


export type QueryTypeSystemLogFacetsArgs = {
  fields?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_ns?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  project_id?: InputMaybe<Scalars['String']['input']>;
  tenant_id?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_ns?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSystemLogStatsArgs = {
  from?: InputMaybe<Scalars['String']['input']>;
  from_ns?: InputMaybe<Scalars['String']['input']>;
  group_by?: InputMaybe<Scalars['String']['input']>;
  interval_s?: InputMaybe<Scalars['Int']['input']>;
  kinds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  levels?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  project_id?: InputMaybe<Scalars['String']['input']>;
  sources?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  statuses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tenant_id?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_ns?: InputMaybe<Scalars['String']['input']>;
  trace_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSystemLogTraceArgs = {
  trace_id: Scalars['String']['input'];
};


export type QueryTypeTeamMembersArgs = {
  filter?: InputMaybe<FilterArgumentObject>;
  organization_id?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TeamMembersWhereFilterArgObject>;
};


export type QueryTypeTenantHardDeleteImpactArgs = {
  tenant_id: Scalars['String']['input'];
};

export enum Relation_Type_Enum {
  /** Has Many Relations */
  HasMany = 'has_many',
  /** One to One Relation */
  HasOne = 'has_one'
}

export type RelationTransitionPreview = {
  __typename?: 'RelationTransitionPreview';
  backup_required?: Maybe<Scalars['Boolean']['output']>;
  blocked?: Maybe<Scalars['Boolean']['output']>;
  blockers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  disclaimers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  kind?: Maybe<Scalars['String']['output']>;
  plan_hash?: Maybe<Scalars['String']['output']>;
  preview_json?: Maybe<Scalars['String']['output']>;
  required_acknowledgement?: Maybe<Scalars['String']['output']>;
  reversibility?: Maybe<Scalars['String']['output']>;
  safety?: Maybe<Scalars['String']['output']>;
  source_storage?: Maybe<Scalars['String']['output']>;
  target_storage?: Maybe<Scalars['String']['output']>;
  warnings?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type RelationTransitionStageResult = {
  __typename?: 'RelationTransitionStageResult';
  message?: Maybe<Scalars['String']['output']>;
  plan_hash?: Maybe<Scalars['String']['output']>;
  staged?: Maybe<Scalars['Boolean']['output']>;
};

export type RemoveProjectSpecificPluginResponse = {
  __typename?: 'RemoveProjectSpecificPluginResponse';
  message?: Maybe<Scalars['String']['output']>;
};

export type RevisionFilter = {
  __typename?: 'RevisionFilter';
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type RevisionHistoryResponse = {
  __typename?: 'RevisionHistoryResponse';
  id?: Maybe<Scalars['String']['output']>;
  revision_at?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Role = {
  __typename?: 'Role';
  administrative_permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  api_permissions?: Maybe<Scalars['JSON']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  is_admin?: Maybe<Scalars['Boolean']['output']>;
  is_project_user?: Maybe<Scalars['Boolean']['output']>;
  logic_executions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  read_only_project?: Maybe<Scalars['Boolean']['output']>;
  system_generated?: Maybe<Scalars['Boolean']['output']>;
};

export type RollbackFunctionDeploymentResponse = {
  __typename?: 'RollbackFunctionDeploymentResponse';
  deployment?: Maybe<RollbackFunctionDeploymentType>;
  function?: Maybe<CloudFunctionType>;
  revision?: Maybe<RollbackFunctionRevisionType>;
};

export type RollbackFunctionDeploymentType = {
  __typename?: 'RollbackFunctionDeploymentType';
  created_at?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  revision_id?: Maybe<Scalars['String']['output']>;
  rollback_of?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type RollbackFunctionRevisionType = {
  __typename?: 'RollbackFunctionRevisionType';
  artifact_key?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
};

export type RollbackSchemaVersionResponse = {
  __typename?: 'RollbackSchemaVersionResponse';
  changeset_id?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type SchemaChangeEventItem = {
  __typename?: 'SchemaChangeEventItem';
  actor_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  event_type?: Maybe<Scalars['String']['output']>;
  payload_json?: Maybe<Scalars['String']['output']>;
};

export type SchemaChangeExecutionRecord = {
  __typename?: 'SchemaChangeExecutionRecord';
  action_key?: Maybe<Scalars['String']['output']>;
  attempt_count?: Maybe<Scalars['Int']['output']>;
  changeset_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  impact?: Maybe<Scalars['String']['output']>;
  local_status?: Maybe<Scalars['String']['output']>;
  operation_id?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  project_message?: Maybe<Scalars['String']['output']>;
  remote_status?: Maybe<Scalars['String']['output']>;
  requires_ddl?: Maybe<Scalars['Boolean']['output']>;
  retryable?: Maybe<Scalars['Boolean']['output']>;
  schema_operation_id?: Maybe<Scalars['String']['output']>;
  schema_version_id?: Maybe<Scalars['String']['output']>;
  scope_key?: Maybe<Scalars['String']['output']>;
  scope_kind?: Maybe<Scalars['String']['output']>;
  sequence?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  system_message?: Maybe<Scalars['String']['output']>;
  target_kind?: Maybe<Scalars['String']['output']>;
  target_name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type SchemaChangeRepairResponse = {
  __typename?: 'SchemaChangeRepairResponse';
  message?: Maybe<Scalars['String']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type SchemaOperation = {
  __typename?: 'SchemaOperation';
  attempt_count?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  operation_type?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  request_json?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  steps_json?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type SchemaVersionItem = {
  __typename?: 'SchemaVersionItem';
  changeset_id?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  parent_version?: Maybe<Scalars['Int']['output']>;
  published_at?: Maybe<Scalars['String']['output']>;
  published_by?: Maybe<Scalars['String']['output']>;
  rollback_of_version?: Maybe<Scalars['Int']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type SchemaVersionRevertPreview = {
  __typename?: 'SchemaVersionRevertPreview';
  active_hash?: Maybe<Scalars['String']['output']>;
  active_version?: Maybe<Scalars['Int']['output']>;
  backup_required?: Maybe<Scalars['Boolean']['output']>;
  blocked?: Maybe<Scalars['Boolean']['output']>;
  blockers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  destructive?: Maybe<Scalars['Boolean']['output']>;
  diff_json?: Maybe<Scalars['String']['output']>;
  disclaimer?: Maybe<Scalars['String']['output']>;
  next_version?: Maybe<Scalars['Int']['output']>;
  plan_hash?: Maybe<Scalars['String']['output']>;
  preview_json?: Maybe<Scalars['String']['output']>;
  required_acknowledgement?: Maybe<Scalars['String']['output']>;
  requires_physical_ddl?: Maybe<Scalars['Boolean']['output']>;
  target_hash?: Maybe<Scalars['String']['output']>;
  target_version?: Maybe<Scalars['Int']['output']>;
};

export type SchemaVersionRevertStageResponse = {
  __typename?: 'SchemaVersionRevertStageResponse';
  changeset_id?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  plan_hash?: Maybe<Scalars['String']['output']>;
  staged?: Maybe<Scalars['Boolean']['output']>;
};

export type SchemaVersioningStatus = {
  __typename?: 'SchemaVersioningStatus';
  active_version?: Maybe<Scalars['Int']['output']>;
  changeset_id?: Maybe<Scalars['String']['output']>;
  changeset_status?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  has_draft?: Maybe<Scalars['Boolean']['output']>;
  pending_operations?: Maybe<Scalars['Int']['output']>;
  publish_done?: Maybe<Scalars['Int']['output']>;
  publish_total?: Maybe<Scalars['Int']['output']>;
};

export type SearchSystemUsersWhereFilterArgObject = {
  email?: InputMaybe<CommonFilter>;
  first_name?: InputMaybe<CommonFilter>;
  last_name?: InputMaybe<CommonFilter>;
  organization_id?: InputMaybe<CommonFilter>;
  username?: InputMaybe<CommonFilter>;
};

export type SearchTenantsByDomainPayload = {
  __typename?: 'SearchTenantsByDomainPayload';
  tenant?: Maybe<TenantDomainSearchItem>;
};

export type SearchTenantsPayload = {
  __typename?: 'SearchTenantsPayload';
  count?: Maybe<Scalars['Int']['output']>;
  tenants?: Maybe<Array<Maybe<TenantSearchListItem>>>;
};

export type SearchUsersPayload = {
  __typename?: 'SearchUsersPayload';
  count?: Maybe<Scalars['Int']['output']>;
  users?: Maybe<Array<Maybe<UserItem>>>;
};

export type SendMutationResponse = {
  __typename?: 'SendMutationResponse';
  message?: Maybe<Scalars['String']['output']>;
};

export type SlowQueryLogItem = {
  __typename?: 'SlowQueryLogItem';
  created_at?: Maybe<Scalars['String']['output']>;
  db_operation?: Maybe<Scalars['String']['output']>;
  driver_engine?: Maybe<Scalars['String']['output']>;
  duration_ms?: Maybe<Scalars['Int']['output']>;
  error_message?: Maybe<Scalars['String']['output']>;
  graphql_query?: Maybe<Scalars['String']['output']>;
  graphql_variables_json?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  operation_name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  project_name?: Maybe<Scalars['String']['output']>;
  query_args_json?: Maybe<Scalars['String']['output']>;
  query_kind?: Maybe<Scalars['String']['output']>;
  query_text?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['String']['output']>;
  scope_key?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  tenant_id?: Maybe<Scalars['String']['output']>;
  threshold_ms?: Maybe<Scalars['Int']['output']>;
  truncated?: Maybe<Scalars['Boolean']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type SlowQueryLogsPayload = {
  __typename?: 'SlowQueryLogsPayload';
  rows?: Maybe<Array<Maybe<SlowQueryLogItem>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type SubFieldInfo = {
  __typename?: 'SubFieldInfo';
  description?: Maybe<Scalars['String']['output']>;
  field_sub_type?: Maybe<Scalars['String']['output']>;
  field_type?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  input_type?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  parent_field?: Maybe<Scalars['String']['output']>;
  plugin_field_type?: Maybe<Scalars['String']['output']>;
  plugin_id?: Maybe<Scalars['String']['output']>;
  serial?: Maybe<Scalars['Int']['output']>;
  sub_field_info?: Maybe<Array<Maybe<SubFieldInfo>>>;
  system_generated?: Maybe<Scalars['Boolean']['output']>;
  validation?: Maybe<Validation>;
};

export type SystemLogAggregates = {
  __typename?: 'SystemLogAggregates';
  buckets?: Maybe<Array<Maybe<SystemLogStatBucket>>>;
};

export type SystemLogEvent = {
  __typename?: 'SystemLogEvent';
  auth_plane?: Maybe<Scalars['String']['output']>;
  auth_type?: Maybe<Scalars['String']['output']>;
  client_ip?: Maybe<Scalars['String']['output']>;
  db_operation?: Maybe<Scalars['String']['output']>;
  driver_engine?: Maybe<Scalars['String']['output']>;
  duration_ms?: Maybe<Scalars['Float']['output']>;
  duration_us?: Maybe<Scalars['Float']['output']>;
  environment?: Maybe<Scalars['String']['output']>;
  error_class?: Maybe<Scalars['String']['output']>;
  error_code?: Maybe<Scalars['String']['output']>;
  error_message?: Maybe<Scalars['String']['output']>;
  error_stack?: Maybe<Scalars['String']['output']>;
  external_request?: Maybe<Scalars['Boolean']['output']>;
  graphql_op_name?: Maybe<Scalars['String']['output']>;
  graphql_op_type?: Maybe<Scalars['String']['output']>;
  graphql_query?: Maybe<Scalars['String']['output']>;
  graphql_root_fields?: Maybe<Scalars['String']['output']>;
  graphql_surface?: Maybe<Scalars['String']['output']>;
  graphql_variables?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invocation_id?: Maybe<Scalars['String']['output']>;
  kind?: Maybe<Scalars['String']['output']>;
  legacy_slow_query?: Maybe<Scalars['Boolean']['output']>;
  level?: Maybe<Scalars['String']['output']>;
  message_id?: Maybe<Scalars['String']['output']>;
  metadata_json?: Maybe<Scalars['String']['output']>;
  method?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  nats_direction?: Maybe<Scalars['String']['output']>;
  nats_subject?: Maybe<Scalars['String']['output']>;
  occurred_at?: Maybe<Scalars['String']['output']>;
  occurred_at_ns?: Maybe<Scalars['Float']['output']>;
  parent_event_id?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  project_name?: Maybe<Scalars['String']['output']>;
  query_args_json?: Maybe<Scalars['String']['output']>;
  query_string?: Maybe<Scalars['String']['output']>;
  query_text?: Maybe<Scalars['String']['output']>;
  queue_group?: Maybe<Scalars['String']['output']>;
  request_bytes?: Maybe<Scalars['Float']['output']>;
  request_id?: Maybe<Scalars['String']['output']>;
  request_payload?: Maybe<Scalars['String']['output']>;
  response_bytes?: Maybe<Scalars['Float']['output']>;
  response_payload?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['String']['output']>;
  route_template?: Maybe<Scalars['String']['output']>;
  runtime?: Maybe<Scalars['String']['output']>;
  scope_key?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  span_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  status_code?: Maybe<Scalars['Int']['output']>;
  tags_json?: Maybe<Scalars['String']['output']>;
  tenant_id?: Maybe<Scalars['String']['output']>;
  token_fingerprint?: Maybe<Scalars['String']['output']>;
  trace_id?: Maybe<Scalars['String']['output']>;
  truncated?: Maybe<Scalars['Boolean']['output']>;
  usage_tracking_eligible?: Maybe<Scalars['Boolean']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type SystemLogFacetsPayload = {
  __typename?: 'SystemLogFacetsPayload';
  facets?: Maybe<Scalars['String']['output']>;
};

export type SystemLogSearchPayload = {
  __typename?: 'SystemLogSearchPayload';
  next_cursor?: Maybe<Scalars['String']['output']>;
  results?: Maybe<Array<Maybe<SystemLogEvent>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type SystemLogStatBucket = {
  __typename?: 'SystemLogStatBucket';
  avg_duration_us?: Maybe<Scalars['Int']['output']>;
  bucket_ns?: Maybe<Scalars['String']['output']>;
  count?: Maybe<Scalars['Int']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  max_duration_us?: Maybe<Scalars['Int']['output']>;
};

export type SystemLogStatsPayload = {
  __typename?: 'SystemLogStatsPayload';
  aggregates?: Maybe<SystemLogAggregates>;
  health?: Maybe<SystemLogStoreHealth>;
  store?: Maybe<SystemLogStoreStats>;
};

export type SystemLogStoreHealth = {
  __typename?: 'SystemLogStoreHealth';
  engine?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  fts_enabled?: Maybe<Scalars['Boolean']['output']>;
  open?: Maybe<Scalars['Boolean']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  schema_version?: Maybe<Scalars['Int']['output']>;
  wal_enabled?: Maybe<Scalars['Boolean']['output']>;
  writable?: Maybe<Scalars['Boolean']['output']>;
};

export type SystemLogStoreStats = {
  __typename?: 'SystemLogStoreStats';
  appended?: Maybe<Scalars['Int']['output']>;
  batches_flushed?: Maybe<Scalars['Int']['output']>;
  dropped?: Maybe<Scalars['Int']['output']>;
  newest_ns?: Maybe<Scalars['String']['output']>;
  oldest_ns?: Maybe<Scalars['String']['output']>;
  size_bytes?: Maybe<Scalars['Int']['output']>;
  total_events?: Maybe<Scalars['Int']['output']>;
};

export type SystemMessage = {
  __typename?: 'SystemMessage';
  _key?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  hide?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  redirection?: Maybe<Scalars['String']['output']>;
};

export type SystemPluginsWhereFilterArgObject = {
  name?: InputMaybe<CommonFilter>;
};

export type SystemUserInfo = {
  __typename?: 'SystemUserInfo';
  _key?: Maybe<Scalars['String']['output']>;
  administrative_permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  avatar?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  current_project_id?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  is_admin?: Maybe<Scalars['Boolean']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  project_access_permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  project_assigned_role?: Maybe<Scalars['String']['output']>;
  project_limit?: Maybe<Scalars['Int']['output']>;
  project_user?: Maybe<Scalars['Boolean']['output']>;
  read_only_project?: Maybe<Scalars['Boolean']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
  user_subscription_type?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type TeamMembersWhereFilterArgObject = {
  email?: InputMaybe<CommonFilter>;
  first_name?: InputMaybe<CommonFilter>;
  last_name?: InputMaybe<CommonFilter>;
  organization_id?: InputMaybe<CommonFilter>;
  username?: InputMaybe<CommonFilter>;
};

export type TenantDomainSearchItem = {
  __typename?: 'TenantDomainSearchItem';
  data?: Maybe<Scalars['String']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  partner_id?: Maybe<Scalars['String']['output']>;
  plan_tier?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  suspended_at?: Maybe<Scalars['String']['output']>;
  suspension_reason?: Maybe<Scalars['String']['output']>;
};

export type TenantHardDeleteImpact = {
  __typename?: 'TenantHardDeleteImpact';
  app_user_count?: Maybe<Scalars['Int']['output']>;
  confirm_example?: Maybe<Scalars['String']['output']>;
  content_total?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  expires_at?: Maybe<Scalars['String']['output']>;
  impact_token?: Maybe<Scalars['String']['output']>;
  mirror_exists?: Maybe<Scalars['Boolean']['output']>;
  model_counts?: Maybe<Array<Maybe<TenantHardDeleteModelCount>>>;
  name?: Maybe<Scalars['String']['output']>;
  per_tenant_db?: Maybe<TenantHardDeletePerTenantDb>;
  status?: Maybe<Scalars['String']['output']>;
  tenant_id?: Maybe<Scalars['String']['output']>;
  warnings?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type TenantHardDeleteModelCount = {
  __typename?: 'TenantHardDeleteModelCount';
  count?: Maybe<Scalars['Int']['output']>;
  model?: Maybe<Scalars['String']['output']>;
};

export type TenantHardDeletePerTenantDb = {
  __typename?: 'TenantHardDeletePerTenantDB';
  database_name?: Maybe<Scalars['String']['output']>;
  engine?: Maybe<Scalars['String']['output']>;
  host?: Maybe<Scalars['String']['output']>;
  supported?: Maybe<Scalars['Boolean']['output']>;
  warning?: Maybe<Scalars['String']['output']>;
};

export type TenantInvoicesPage = {
  __typename?: 'TenantInvoicesPage';
  invoices?: Maybe<Array<Maybe<ProjectTenantInvoice>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type TenantListItem = {
  __typename?: 'TenantListItem';
  data?: Maybe<Scalars['String']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  partner_id?: Maybe<Scalars['String']['output']>;
  plan_tier?: Maybe<Scalars['String']['output']>;
  suspended_at?: Maybe<Scalars['String']['output']>;
  suspension_reason?: Maybe<Scalars['String']['output']>;
};

export type TenantSearchListItem = {
  __typename?: 'TenantSearchListItem';
  created_at?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  last_login_at?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  partner_id?: Maybe<Scalars['String']['output']>;
  plan_tier?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  suspended_at?: Maybe<Scalars['String']['output']>;
  suspension_reason?: Maybe<Scalars['String']['output']>;
};

export type TenantSubscribersPage = {
  __typename?: 'TenantSubscribersPage';
  subscriptions?: Maybe<Array<Maybe<ProjectTenantSubscription>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type TestFunctionDraftLogEntry = {
  __typename?: 'TestFunctionDraftLogEntry';
  level?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type TestFunctionDraftResponse = {
  __typename?: 'TestFunctionDraftResponse';
  duration_ms?: Maybe<Scalars['Int']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  error_class?: Maybe<Scalars['String']['output']>;
  invocation_id?: Maybe<Scalars['String']['output']>;
  logs?: Maybe<Array<Maybe<TestFunctionDraftLogEntry>>>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  response?: Maybe<Scalars['JSON']['output']>;
};

export type UniqueKey = {
  __typename?: 'UniqueKey';
  changeset_id?: Maybe<Scalars['String']['output']>;
  columns?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  message?: Maybe<Scalars['String']['output']>;
  model_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  staged?: Maybe<Scalars['Boolean']['output']>;
};

export enum UpdateModelTypeEnum {
  Convert = 'convert',
  Delete = 'delete',
  Duplicate = 'duplicate',
  Rename = 'rename',
  Update = 'update'
}

export type UpdateProjectAuthenticationInput = {
  auto_provision_on_providers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  auto_provision_tenant_on_signup?: InputMaybe<Scalars['Boolean']['input']>;
  default_registration_role?: InputMaybe<Scalars['String']['input']>;
  enable_facebook_auth?: InputMaybe<Scalars['Boolean']['input']>;
  enable_general_auth?: InputMaybe<Scalars['Boolean']['input']>;
  enable_github_auth?: InputMaybe<Scalars['Boolean']['input']>;
  enable_google_auth?: InputMaybe<Scalars['Boolean']['input']>;
  enable_linkedin_auth?: InputMaybe<Scalars['Boolean']['input']>;
  enable_x_auth?: InputMaybe<Scalars['Boolean']['input']>;
  facebook_client_id?: InputMaybe<Scalars['String']['input']>;
  facebook_client_secret?: InputMaybe<Scalars['String']['input']>;
  facebook_oauth_redirect_uri?: InputMaybe<Scalars['String']['input']>;
  general_authentication_method?: InputMaybe<Scalars['String']['input']>;
  github_client_id?: InputMaybe<Scalars['String']['input']>;
  github_client_secret?: InputMaybe<Scalars['String']['input']>;
  github_oauth_redirect_uri?: InputMaybe<Scalars['String']['input']>;
  google_client_id?: InputMaybe<Scalars['String']['input']>;
  google_client_secret?: InputMaybe<Scalars['String']['input']>;
  google_oauth_redirect_uri?: InputMaybe<Scalars['String']['input']>;
  linkedin_client_id?: InputMaybe<Scalars['String']['input']>;
  linkedin_client_secret?: InputMaybe<Scalars['String']['input']>;
  linkedin_oauth_redirect_uri?: InputMaybe<Scalars['String']['input']>;
  tenant_base_domain?: InputMaybe<Scalars['String']['input']>;
  x_client_id?: InputMaybe<Scalars['String']['input']>;
  x_client_secret?: InputMaybe<Scalars['String']['input']>;
  x_oauth_redirect_uri?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectDriverDetails = {
  access_key: Array<InputMaybe<Scalars['String']['input']>>;
  db: Array<InputMaybe<Scalars['String']['input']>>;
  host: Scalars['String']['input'];
  password: Array<InputMaybe<Scalars['String']['input']>>;
  port: Scalars['String']['input'];
  secret_key: Array<InputMaybe<Scalars['String']['input']>>;
  user: Array<InputMaybe<Scalars['String']['input']>>;
};

export type UpdateProjectStorageInput = {
  access_key_id?: InputMaybe<Scalars['String']['input']>;
  bucket?: InputMaybe<Scalars['String']['input']>;
  endpoint?: InputMaybe<Scalars['String']['input']>;
  force_path_style?: InputMaybe<Scalars['Boolean']['input']>;
  public_base_url?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  secret_access_key?: InputMaybe<Scalars['String']['input']>;
  use_free_cloud_storage?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateSettingsPayload = {
  /** When true, daily job soft-deletes free-tier idle tenants (never hard-deletes) */
  auto_soft_delete_idle_tenants?: InputMaybe<Scalars['Boolean']['input']>;
  default_function_plugin?: InputMaybe<Scalars['String']['input']>;
  default_locale?: InputMaybe<Scalars['String']['input']>;
  default_storage_plugin?: InputMaybe<Scalars['String']['input']>;
  enable_revision_history?: InputMaybe<Scalars['Boolean']['input']>;
  /** Days without login before a tenant is idle (minimum 90, default 90) */
  idle_tenant_retention_days?: InputMaybe<Scalars['Int']['input']>;
  locals?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  system_graphql_hooks?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserDefinedSchema = {
  __typename?: 'UserDefinedSchema';
  functions?: Maybe<Array<Maybe<CloudFunctionType>>>;
  models?: Maybe<Array<Maybe<ModelType>>>;
};

export type UserItem = {
  __typename?: 'UserItem';
  created_at?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  tenant_id?: Maybe<Scalars['String']['output']>;
  tenant_missing?: Maybe<Scalars['Boolean']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type Validation = {
  __typename?: 'Validation';
  as_title?: Maybe<Scalars['Boolean']['output']>;
  char_limit?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  double_range_limit?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  fixed_list_element_type?: Maybe<Scalars['String']['output']>;
  fixed_list_elements?: Maybe<Scalars['JSONArray']['output']>;
  hide?: Maybe<Scalars['Boolean']['output']>;
  hide_for_roles?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  int_range_limit?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  is_email?: Maybe<Scalars['Boolean']['output']>;
  is_gallery?: Maybe<Scalars['Boolean']['output']>;
  is_multi_choice?: Maybe<Scalars['Boolean']['output']>;
  is_password?: Maybe<Scalars['Boolean']['output']>;
  is_url?: Maybe<Scalars['Boolean']['output']>;
  locals?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  placeholder?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  unique?: Maybe<Scalars['Boolean']['output']>;
};

export type Webhook = {
  __typename?: 'Webhook';
  _key?: Maybe<Scalars['String']['output']>;
  events?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id?: Maybe<Scalars['String']['output']>;
  logic_executions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  model?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Workspace = {
  __typename?: 'Workspace';
  active?: Maybe<Scalars['Boolean']['output']>;
  is_default?: Maybe<Scalars['Boolean']['output']>;
  is_production?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
};

export type WorkspaceMember = {
  __typename?: 'WorkspaceMember';
  avatar?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  grants?: Maybe<Array<Maybe<WorkspaceMemberGrant>>>;
  id?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
};

export type WorkspaceMemberGrant = {
  __typename?: 'WorkspaceMemberGrant';
  invite_expires_at?: Maybe<Scalars['String']['output']>;
  invite_status?: Maybe<Scalars['String']['output']>;
  permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  project_id?: Maybe<Scalars['String']['output']>;
  project_name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

export type FilterArgumentObject = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type Module_Validation_Payload = {
  as_title?: InputMaybe<Scalars['Boolean']['input']>;
  fixed_list_element_type?: InputMaybe<Scalars['String']['input']>;
  fixed_list_elements?: InputMaybe<Scalars['JSONArray']['input']>;
  hide?: InputMaybe<Scalars['Boolean']['input']>;
  is_email?: InputMaybe<Scalars['Boolean']['input']>;
  is_gallery?: InputMaybe<Scalars['Boolean']['input']>;
  is_multi_choice?: InputMaybe<Scalars['Boolean']['input']>;
  is_url?: InputMaybe<Scalars['Boolean']['input']>;
  locals?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  unique?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpsertFunctionToProjectMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  function_connected?: InputMaybe<Scalars['Boolean']['input']>;
  function_provider_id?: InputMaybe<Scalars['String']['input']>;
  provider_exported_variable?: InputMaybe<Scalars['String']['input']>;
  function_exported_variable?: InputMaybe<Scalars['String']['input']>;
  graphql_schema_type?: InputMaybe<Scalars['String']['input']>;
  function_path?: InputMaybe<Scalars['String']['input']>;
  runtime_config?: InputMaybe<Function_Provider_Config_Payload>;
  env_vars?: InputMaybe<Array<InputMaybe<Function_Provider_Env_Vars_Payload>> | InputMaybe<Function_Provider_Env_Vars_Payload>>;
  request?: InputMaybe<Scalars['String']['input']>;
  request_payload_is_optional?: InputMaybe<Scalars['Boolean']['input']>;
  response?: InputMaybe<Scalars['String']['input']>;
  response_is_array?: InputMaybe<Scalars['Boolean']['input']>;
  update?: InputMaybe<Scalars['Boolean']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  trigger_type?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  capabilities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
}>;


export type UpsertFunctionToProjectMutation = { __typename?: 'MutationQuery', upsertFunctionToProject?: { __typename?: 'CloudFunctionType', name?: string | null, description?: string | null, graphql_schema_type?: string | null, created_at?: string | null, updated_at?: string | null, trigger_type?: string | null, source?: string | null, active_revision_id?: string | null, capabilities?: Array<string | null> | null, function_connected?: boolean | null, provider_exported_variable?: string | null, function_exported_variable?: string | null, function_provider_id?: string | null, rest_api_secret_url_key?: string | null, request?: { __typename?: 'CloudFunctionRequestResponse', model?: string | null, optional_payload?: boolean | null } | null, response?: { __typename?: 'CloudFunctionRequestResponse', model?: string | null, is_array?: boolean | null } | null, runtime_config?: { __typename?: 'ApitoFunctionRuntimeConfig', handler?: string | null, memory?: number | null, runtime?: string | null, time_out?: number | null } | null, env_vars?: Array<{ __typename?: 'EnvVariable', key?: string | null, value?: string | null } | null> | null } | null };

export type DeleteFunctionFromProjectMutationVariables = Exact<{
  function: Scalars['String']['input'];
}>;


export type DeleteFunctionFromProjectMutation = { __typename?: 'MutationQuery', deleteFunctionFromProject?: Array<{ __typename?: 'CloudFunctionType', id?: string | null, name?: string | null } | null> | null };

export type DeployFunctionToProjectMutationVariables = Exact<{
  name: Scalars['String']['input'];
  source?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeployFunctionToProjectMutation = { __typename?: 'MutationQuery', deployFunctionToProject?: { __typename?: 'DeployFunctionToProjectResponse', function?: { __typename?: 'CloudFunctionType', name?: string | null, source?: string | null, active_revision_id?: string | null, rest_api_secret_url_key?: string | null, updated_at?: string | null } | null, revision?: { __typename?: 'DeployFunctionRevisionType', id?: string | null, revision?: number | null, artifact_key?: string | null, artifact_hash?: string | null, created_at?: string | null } | null, deployment?: { __typename?: 'DeployFunctionDeploymentType', id?: string | null, revision_id?: string | null, status?: string | null, created_at?: string | null } | null } | null };

export type RollbackFunctionDeploymentMutationVariables = Exact<{
  name: Scalars['String']['input'];
  revision_id: Scalars['String']['input'];
}>;


export type RollbackFunctionDeploymentMutation = { __typename?: 'MutationQuery', rollbackFunctionDeployment?: { __typename?: 'RollbackFunctionDeploymentResponse', function?: { __typename?: 'CloudFunctionType', name?: string | null, source?: string | null, active_revision_id?: string | null, updated_at?: string | null } | null, revision?: { __typename?: 'RollbackFunctionRevisionType', id?: string | null, artifact_key?: string | null, created_at?: string | null } | null, deployment?: { __typename?: 'RollbackFunctionDeploymentType', id?: string | null, revision_id?: string | null, status?: string | null, rollback_of?: string | null, created_at?: string | null } | null } | null };

export type TestFunctionDraftMutationVariables = Exact<{
  name: Scalars['String']['input'];
  source?: InputMaybe<Scalars['String']['input']>;
  payload?: InputMaybe<Scalars['JSON']['input']>;
  tenant_id?: InputMaybe<Scalars['String']['input']>;
}>;


export type TestFunctionDraftMutation = { __typename?: 'MutationQuery', testFunctionDraft?: { __typename?: 'TestFunctionDraftResponse', ok?: boolean | null, response?: { [key: string]: any } | null, error?: string | null, error_class?: string | null, duration_ms?: number | null, invocation_id?: string | null, logs?: Array<{ __typename?: 'TestFunctionDraftLogEntry', level?: string | null, message?: string | null } | null> | null } | null };

export type UpsertFieldToModelMutationVariables = Exact<{
  model_name: Scalars['String']['input'];
  field_label: Scalars['String']['input'];
  field_type?: InputMaybe<Field_Type_Enum>;
  field_sub_type?: InputMaybe<Field_Sub_Type_Enum>;
  field_description?: InputMaybe<Scalars['String']['input']>;
  input_type?: InputMaybe<Input_Type_Enum>;
  serial?: InputMaybe<Scalars['Int']['input']>;
  validation?: InputMaybe<Module_Validation_Payload>;
  parent_field?: InputMaybe<Scalars['String']['input']>;
  is_update?: InputMaybe<Scalars['Boolean']['input']>;
  plugin_id?: InputMaybe<Scalars['String']['input']>;
  plugin_field_type?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertFieldToModelMutation = { __typename?: 'MutationQuery', upsertFieldToModel?: { __typename?: 'FieldInfo', serial?: number | null, identifier?: string | null, label?: string | null, input_type?: string | null, field_type?: string | null, field_sub_type?: string | null, description?: string | null, parent_field?: string | null, system_generated?: boolean | null, plugin_id?: string | null, plugin_field_type?: string | null, validation?: { __typename?: 'Validation', required?: boolean | null, locals?: Array<string | null> | null, is_multi_choice?: boolean | null, int_range_limit?: Array<number | null> | null, hide?: boolean | null, fixed_list_elements?: any[] | null, fixed_list_element_type?: string | null, double_range_limit?: Array<number | null> | null, char_limit?: Array<number | null> | null, as_title?: boolean | null, is_email?: boolean | null, unique?: boolean | null, placeholder?: string | null, is_gallery?: boolean | null } | null } | null };

export type CreateModelMutationVariables = Exact<{
  name: Scalars['String']['input'];
  single_record?: InputMaybe<Scalars['Boolean']['input']>;
  is_common_model?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateModelMutation = { __typename?: 'MutationQuery', addModelToProject?: Array<{ __typename?: 'ModelType', name?: string | null } | null> | null };

export type UpdateModelMutationVariables = Exact<{
  type: UpdateModelTypeEnum;
  new_name?: InputMaybe<Scalars['String']['input']>;
  model_name: Scalars['String']['input'];
}>;


export type UpdateModelMutation = { __typename?: 'MutationQuery', updateModel?: { __typename?: 'ModelType', name?: string | null } | null };

export type UpdateModelRelationMutationVariables = Exact<{
  forward_connection_type: Relation_Type_Enum;
  from: Scalars['String']['input'];
  reverse_connection_type: Relation_Type_Enum;
  to: Scalars['String']['input'];
  known_as?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateModelRelationMutation = { __typename?: 'MutationQuery', upsertConnectionToModel?: Array<{ __typename?: 'ConnectionType', type?: string | null, relation?: string | null, model?: string | null, known_as?: string | null } | null> | null };

export type DeleteConnectionFromModelMutationVariables = Exact<{
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
  known_as?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteConnectionFromModelMutation = { __typename?: 'MutationQuery', deleteConnectionFromModel?: Array<{ __typename?: 'ConnectionType', type?: string | null, relation?: string | null, model?: string | null, known_as?: string | null } | null> | null };

export type ModelFieldOperationMutationVariables = Exact<{
  type: Field_Operation_Type_Enum;
  model_name: Scalars['String']['input'];
  field_name: Scalars['String']['input'];
  new_name?: InputMaybe<Scalars['String']['input']>;
  parent_field?: InputMaybe<Scalars['String']['input']>;
  single_page_model?: InputMaybe<Scalars['Boolean']['input']>;
  known_as?: InputMaybe<Scalars['String']['input']>;
  moved_to?: InputMaybe<Scalars['String']['input']>;
  changed_type?: InputMaybe<Scalars['String']['input']>;
}>;


export type ModelFieldOperationMutation = { __typename?: 'MutationQuery', modelFieldOperation?: { __typename?: 'FieldInfo', serial?: number | null, identifier?: string | null, label?: string | null, input_type?: string | null, field_type?: string | null, description?: string | null, parent_field?: string | null, validation?: { __typename?: 'Validation', required?: boolean | null, locals?: Array<string | null> | null, is_multi_choice?: boolean | null, int_range_limit?: Array<number | null> | null, hide?: boolean | null, fixed_list_elements?: any[] | null, fixed_list_element_type?: string | null, double_range_limit?: Array<number | null> | null, char_limit?: Array<number | null> | null, as_title?: boolean | null, is_email?: boolean | null, unique?: boolean | null, placeholder?: string | null, is_gallery?: boolean | null } | null } | null };

export type RearrangeFieldSerialMutationVariables = Exact<{
  model_name: Scalars['String']['input'];
  field_name: Scalars['String']['input'];
  new_position: Scalars['Int']['input'];
  move_type: Scalars['String']['input'];
  parent_id?: InputMaybe<Scalars['String']['input']>;
}>;


export type RearrangeFieldSerialMutation = { __typename?: 'MutationQuery', rearrangeSerialOfField?: { __typename?: 'ModelType', name?: string | null, fields?: Array<{ __typename?: 'FieldInfo', identifier?: string | null, serial?: number | null } | null> | null } | null };

export type RemoveProjectSpecificPluginMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveProjectSpecificPluginMutation = { __typename?: 'MutationQuery', removeProjectSpecificPlugin?: { __typename?: 'RemoveProjectSpecificPluginResponse', message?: string | null } | null };

export type UpsertPluginDetailsMutationVariables = Exact<{
  id: Scalars['String']['input'];
  env_vars?: InputMaybe<Array<InputMaybe<PluginConfigEnvVarsPayload>> | InputMaybe<PluginConfigEnvVarsPayload>>;
  enable?: InputMaybe<Scalars['Boolean']['input']>;
  activate_status?: InputMaybe<Plugin_Activation_Type_Enum>;
}>;


export type UpsertPluginDetailsMutation = { __typename?: 'MutationQuery', upsertPlugin?: { __typename?: 'PluginDetailsFields', author?: string | null, branch?: string | null, description?: string | null, enable?: boolean | null, exported_variable?: string | null, icon?: string | null, id?: string | null, load_status?: Plugin_Load_Type_Enum | null, activate_status?: Plugin_Activation_Type_Enum | null, repository_url?: string | null, role?: string | null, title?: string | null, capabilities?: Array<string | null> | null, official?: boolean | null, signed?: boolean | null, version?: string | null, env_vars?: Array<{ __typename?: 'EnvVariable', key?: string | null, value?: string | null } | null> | null } | null };

export type UpdateProjectAuthenticationSettingsMutationVariables = Exact<{
  input: UpdateProjectAuthenticationInput;
}>;


export type UpdateProjectAuthenticationSettingsMutation = { __typename?: 'MutationQuery', updateProjectAuthenticationSettings?: { __typename?: 'ProjectAuthenticationSettingsPayload', authentication_settings: { __typename?: 'ProjectAuthenticationSettings', enable_general_auth: boolean, enable_google_auth: boolean, enable_facebook_auth: boolean, enable_github_auth: boolean, enable_x_auth: boolean, enable_linkedin_auth: boolean, general_authentication_method: string, google_client_id?: string | null, google_oauth_redirect_uri?: string | null, has_google_client_secret: boolean, facebook_client_id?: string | null, facebook_oauth_redirect_uri?: string | null, has_facebook_client_secret: boolean, github_client_id?: string | null, github_oauth_redirect_uri?: string | null, has_github_client_secret: boolean, x_client_id?: string | null, x_oauth_redirect_uri?: string | null, has_x_client_secret: boolean, linkedin_client_id?: string | null, linkedin_oauth_redirect_uri?: string | null, has_linkedin_client_secret: boolean, default_registration_role?: string | null } } | null };

export type UpdateProjectStorageSettingsMutationVariables = Exact<{
  input: UpdateProjectStorageInput;
}>;


export type UpdateProjectStorageSettingsMutation = { __typename?: 'MutationQuery', updateProjectStorageSettings?: { __typename?: 'ProjectStorageSettingsPayload', storage_settings: { __typename?: 'ProjectStorageSettings', use_free_cloud_storage: boolean, endpoint?: string | null, region?: string | null, bucket?: string | null, access_key_id?: string | null, has_secret_access_key: boolean, public_base_url?: string | null, force_path_style?: boolean | null } } | null };

export type GenerateProjectTokenMutationVariables = Exact<{
  name: Scalars['String']['input'];
  duration: Scalars['String']['input'];
  role: Scalars['String']['input'];
}>;


export type GenerateProjectTokenMutation = { __typename?: 'MutationQuery', generateProjectToken?: { __typename?: 'GenerateProjectTokenResponse', token?: string | null } | null };

export type DeleteProjectTokenMutationVariables = Exact<{
  duration: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
  token_id?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteProjectTokenMutation = { __typename?: 'MutationQuery', deleteProjectToken?: { __typename?: 'DeleteApiTokenResponse', msg?: string | null } | null };

export type UpdateProjectMutationVariables = Exact<{
  access_key?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  db?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  host?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  port?: InputMaybe<Scalars['String']['input']>;
  secret_key?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  user?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  _id?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateProjectMutation = { __typename?: 'MutationQuery', updateProject?: { __typename?: 'ProjectModel', driver?: { __typename?: 'DriverCredentials', engine?: string | null, database?: string | null, host?: string | null, port?: string | null, password?: string | null, user?: string | null } | null } | null };

export type StageRelationTransitionMutationVariables = Exact<{
  from_model: Scalars['String']['input'];
  to_model: Scalars['String']['input'];
  known_as?: InputMaybe<Scalars['String']['input']>;
  from_relation?: InputMaybe<Scalars['String']['input']>;
  to_relation?: InputMaybe<Scalars['String']['input']>;
  target_from_relation: Scalars['String']['input'];
  target_to_relation: Scalars['String']['input'];
  plan_hash: Scalars['String']['input'];
  acknowledgement?: InputMaybe<Scalars['String']['input']>;
}>;


export type StageRelationTransitionMutation = { __typename?: 'MutationQuery', stageRelationTransition?: { __typename?: 'RelationTransitionStageResult', staged?: boolean | null, message?: string | null, plan_hash?: string | null } | null };

export type UpsertRoleToProjectMutationVariables = Exact<{
  name: Scalars['String']['input'];
  is_admin?: InputMaybe<Scalars['Boolean']['input']>;
  logic_executions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  api_permissions?: InputMaybe<Scalars['JSON']['input']>;
}>;


export type UpsertRoleToProjectMutation = { __typename?: 'MutationQuery', upsertRoleToProject?: { __typename?: 'Role', administrative_permissions?: Array<string | null> | null, api_permissions?: { [key: string]: any } | null, is_admin?: boolean | null, logic_executions?: Array<string | null> | null, system_generated?: boolean | null } | null };

export type DuplicateRoleInProjectMutationVariables = Exact<{
  source_role: Scalars['String']['input'];
  new_name: Scalars['String']['input'];
}>;


export type DuplicateRoleInProjectMutation = { __typename?: 'MutationQuery', duplicateRoleInProject?: { __typename?: 'Role', administrative_permissions?: Array<string | null> | null, api_permissions?: { [key: string]: any } | null, is_admin?: boolean | null, logic_executions?: Array<string | null> | null, system_generated?: boolean | null } | null };

export type UpdateSettingGeneralMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateSettingGeneralMutation = { __typename?: 'MutationQuery', updateProject?: { __typename?: 'ProjectModel', _key?: string | null, id?: string | null, name?: string | null, description?: string | null } | null };

export type UpdateSettingsMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  project_icon?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<UpdateSettingsPayload>;
}>;


export type UpdateSettingsMutation = { __typename?: 'MutationQuery', updateProject?: { __typename?: 'ProjectModel', _key?: string | null, id?: string | null, name?: string | null, description?: string | null, project_icon?: string | null, project_secret_key?: string | null, settings?: { __typename?: 'ProjectSettings', locals?: Array<string | null> | null, system_graphql_hooks?: boolean | null, enable_revision_history?: boolean | null, default_storage_plugin?: string | null, default_function_plugin?: string | null, default_locale?: string | null, idle_tenant_retention_days?: number | null, auto_soft_delete_idle_tenants?: boolean | null } | null } | null };

export type CreateSettingsWebhookMutationVariables = Exact<{
  events: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
  model: Scalars['String']['input'];
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
  logic_executions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
}>;


export type CreateSettingsWebhookMutation = { __typename?: 'MutationQuery', createWebHook?: { __typename?: 'Webhook', _key?: string | null, events?: Array<string | null> | null, id?: string | null, model?: string | null, name?: string | null, type?: string | null, url?: string | null, logic_executions?: Array<string | null> | null } | null };

export type DeleteSettingsWeekhookMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteSettingsWeekhookMutation = { __typename?: 'MutationQuery', deleteWebHook?: { __typename?: 'DeleteWebHookResponse', msg?: string | null } | null };

export type DeleteSettingsRoleFromProjectMutationVariables = Exact<{
  role: Scalars['String']['input'];
}>;


export type DeleteSettingsRoleFromProjectMutation = { __typename?: 'MutationQuery', deleteRoleFromProject?: { __typename?: 'DeleteApitoFunctionResponse', message?: string | null } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  organization_id?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  new_pass?: InputMaybe<Scalars['String']['input']>;
  old_pass?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserProfileMutation = { __typename?: 'MutationQuery', updateProfile?: { __typename?: 'SystemUserInfo', id?: string | null, first_name?: string | null, last_name?: string | null, role?: string | null, is_admin?: boolean | null, avatar?: string | null, username?: string | null } | null };

export type CreateUserMutationVariables = Exact<{
  project_id: Scalars['String']['input'];
  password: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateUserMutation = { __typename?: 'MutationQuery', createUser?: { __typename?: 'UserItem', id?: string | null, email?: string | null, username?: string | null, phone?: string | null, role?: string | null, provider?: string | null, status?: string | null, created_at?: string | null, updated_at?: string | null } | null };

export type UpdateUserMutationVariables = Exact<{
  user_id: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserMutation = { __typename?: 'MutationQuery', updateUser?: { __typename?: 'UserItem', id?: string | null, email?: string | null, username?: string | null, phone?: string | null, role?: string | null, provider?: string | null, status?: string | null, created_at?: string | null, updated_at?: string | null } | null };

export type DeleteUserMutationVariables = Exact<{
  user_id: Scalars['String']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'MutationQuery', deleteUser?: boolean | null };

export type ResetUserPasswordMutationVariables = Exact<{
  user_id: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type ResetUserPasswordMutation = { __typename?: 'MutationQuery', resetUserPassword?: boolean | null };

export type GetLoggedInUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoggedInUserQuery = { __typename?: 'QueryType', getUser?: { __typename?: 'SystemUserInfo', id?: string | null, email?: string | null, first_name?: string | null, last_name?: string | null, avatar?: string | null, current_project_id?: string | null, is_admin?: boolean | null, project_limit?: number | null, user_subscription_type?: string | null, username?: string | null } | null };

export type GetAuditLogsQueryVariables = Exact<{
  project_id?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
  response_code?: InputMaybe<Scalars['Int']['input']>;
  filter_by_project_id?: InputMaybe<Scalars['String']['input']>;
  internal_function?: InputMaybe<Scalars['String']['input']>;
  graphql_operation_name?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAuditLogsQuery = { __typename?: 'QueryType', auditLogs?: Array<{ __typename?: 'AuditLogInfo', id?: string | null, activity?: string | null, created_at?: string | null, graphql_operation_name?: string | null, graphql_payload?: string | null, graphql_variable?: string | null, internal_error?: string | null, internal_function?: string | null, request_path?: string | null, request_payload?: string | null, response_code?: number | null, response_payload?: string | null, user?: { __typename?: 'SystemUserInfo', first_name?: string | null, id?: string | null } | null, project?: { __typename?: 'ProjectModel', id?: string | null, name?: string | null } | null } | null> | null };

export type UpdateSingleDataMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  single_page_data?: InputMaybe<Scalars['Boolean']['input']>;
  model_name: Scalars['String']['input'];
  local?: InputMaybe<Scalars['String']['input']>;
  payload?: InputMaybe<Scalars['JSON']['input']>;
  connect?: InputMaybe<Scalars['JSON']['input']>;
  disconnect?: InputMaybe<Scalars['JSON']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateSingleDataMutation = { __typename?: 'MutationQuery', upsertModelData?: { __typename?: 'DocumentModelType', _key?: string | null, data?: { [key: string]: any } | null, type?: string | null, id?: string | null, meta?: { __typename?: 'MetaField', created_at?: string | null, status?: string | null, updated_at?: string | null, last_modified_by?: { __typename?: 'ModifiedBySystemUserInfo', id?: string | null, first_name?: string | null } | null } | null } | null };

export type GetMultipleDataQueryVariables = Exact<{
  model: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
  connection?: InputMaybe<ListAllDataDetailedOfAModelConnectionPayload>;
  intersect?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetMultipleDataQuery = { __typename?: 'QueryType', getModelData?: { __typename?: 'GetModelDataResponse', count?: number | null, results?: Array<{ __typename?: 'DocumentModelType', relation_doc_id?: string | null, id?: string | null, data?: { [key: string]: any } | null, meta?: { __typename?: 'MetaField', created_at?: string | null, updated_at?: string | null, status?: string | null } | null } | null> | null } | null };

export type DeleteModelDataMutationVariables = Exact<{
  model_name: Scalars['String']['input'];
  _id?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteModelDataMutation = { __typename?: 'MutationQuery', deleteModelData?: { __typename?: 'DeleteModelDataResponse', id?: string | null } | null };

export type DuplicateModelDataMutationVariables = Exact<{
  model_name: Scalars['String']['input'];
  _id?: InputMaybe<Scalars['String']['input']>;
}>;


export type DuplicateModelDataMutation = { __typename?: 'MutationQuery', duplicateModelData?: { __typename?: 'DuplicateModelDataResponse', id?: string | null } | null };

export type FormDataQueryRevisionQueryVariables = Exact<{
  _id: Scalars['String']['input'];
  single_page_data?: InputMaybe<Scalars['Boolean']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
}>;


export type FormDataQueryRevisionQuery = { __typename?: 'QueryType', listSingleModelRevisionData?: Array<{ __typename?: 'RevisionHistoryResponse', status?: string | null, revision_at?: string | null, id?: string | null } | null> | null };

export type GetSingleDataQueryVariables = Exact<{
  _id: Scalars['String']['input'];
  model?: InputMaybe<Scalars['String']['input']>;
  local?: InputMaybe<Scalars['String']['input']>;
  revision?: InputMaybe<Scalars['Boolean']['input']>;
  single_page_data?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetSingleDataQuery = { __typename?: 'QueryType', getSingleData?: { __typename?: 'DocumentModelType', _key?: string | null, data?: { [key: string]: any } | null, id?: string | null, type?: string | null, meta?: { __typename?: 'MetaField', status?: string | null, updated_at?: string | null, created_at?: string | null, created_by?: { __typename?: 'CreatedBySystemUserInfo', avatar?: string | null, id?: string | null, first_name?: string | null, role?: string | null, email?: string | null } | null, last_modified_by?: { __typename?: 'ModifiedBySystemUserInfo', id?: string | null, first_name?: string | null, role?: string | null, email?: string | null, avatar?: string | null } | null } | null } | null };

export type CreateModelDataMutationVariables = Exact<{
  model_name: Scalars['String']['input'];
  local?: InputMaybe<Scalars['String']['input']>;
  payload?: InputMaybe<Scalars['JSON']['input']>;
  connect?: InputMaybe<Scalars['JSON']['input']>;
  disconnect?: InputMaybe<Scalars['JSON']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateModelDataMutation = { __typename?: 'MutationQuery', upsertModelData?: { __typename?: 'DocumentModelType', _key?: string | null, data?: { [key: string]: any } | null, type?: string | null, id?: string | null, meta?: { __typename?: 'MetaField', created_at?: string | null, status?: string | null, updated_at?: string | null, last_modified_by?: { __typename?: 'ModifiedBySystemUserInfo', id?: string | null, first_name?: string | null } | null } | null } | null };

export type ListAvailableFunctionsQueryVariables = Exact<{
  function_id: Scalars['String']['input'];
}>;


export type ListAvailableFunctionsQuery = { __typename?: 'QueryType', listAvailableFunctions?: { __typename?: 'ListAvailableFunctionsResponse', functions?: Array<string | null> | null } | null };

export type GetAllFunctionInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllFunctionInfoQuery = { __typename?: 'QueryType', projectFunctionsInfo?: Array<{ __typename?: 'CloudFunctionType', name?: string | null, description?: string | null, graphql_schema_type?: string | null, created_at?: string | null, updated_at?: string | null, trigger_type?: string | null, source?: string | null, active_revision_id?: string | null, capabilities?: Array<string | null> | null, function_connected?: boolean | null, function_provider_id?: string | null, rest_api_secret_url_key?: string | null, request?: { __typename?: 'CloudFunctionRequestResponse', model?: string | null, optional_payload?: boolean | null } | null, response?: { __typename?: 'CloudFunctionRequestResponse', model?: string | null, is_array?: boolean | null } | null, runtime_config?: { __typename?: 'ApitoFunctionRuntimeConfig', handler?: string | null, memory?: number | null, runtime?: string | null, time_out?: number | null } | null, env_vars?: Array<{ __typename?: 'EnvVariable', key?: string | null, value?: string | null } | null> | null } | null> | null };

export type ListFunctionRevisionsQueryVariables = Exact<{
  name: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListFunctionRevisionsQuery = { __typename?: 'QueryType', listFunctionRevisions?: Array<{ __typename?: 'FunctionRevisionType', id?: string | null, name?: string | null, revision?: number | null, source?: string | null, artifact_key?: string | null, artifact_hash?: string | null, created_by?: string | null, created_at?: string | null, capabilities?: Array<string | null> | null } | null> | null };

export type ListFunctionDeploymentsQueryVariables = Exact<{
  name: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListFunctionDeploymentsQuery = { __typename?: 'QueryType', listFunctionDeployments?: Array<{ __typename?: 'FunctionDeploymentType', id?: string | null, name?: string | null, revision_id?: string | null, status?: string | null, deployed_by?: string | null, rollback_of?: string | null, created_at?: string | null, environment?: string | null } | null> | null };

export type GetOnlyModelsInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOnlyModelsInfoQuery = { __typename?: 'QueryType', projectModelsInfo?: Array<{ __typename?: 'ModelType', name?: string | null, single_page?: boolean | null, single_page_uuid?: string | null, system_generated?: boolean | null, has_connections?: boolean | null, enable_revision?: boolean | null, revision_filter?: Array<{ __typename?: 'RevisionFilter', key?: string | null, value?: string | null } | null> | null } | null> | null };

export type ModelDocumentCountsQueryVariables = Exact<{
  models?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type ModelDocumentCountsQuery = { __typename?: 'QueryType', modelDocumentCounts?: Array<{ __typename?: 'ModelDocumentCountItem', model: string, count: number } | null> | null };

export type GetModelDetailsQueryVariables = Exact<{
  model_name?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetModelDetailsQuery = { __typename?: 'QueryType', projectModelsInfo?: Array<{ __typename?: 'ModelType', name?: string | null, locals?: Array<string | null> | null, single_page?: boolean | null, single_page_uuid?: string | null, system_generated?: boolean | null, has_connections?: boolean | null, enable_revision?: boolean | null, revision_filter?: Array<{ __typename?: 'RevisionFilter', key?: string | null, value?: string | null } | null> | null, fields?: Array<{ __typename?: 'FieldInfo', serial?: number | null, identifier?: string | null, label?: string | null, input_type?: string | null, field_type?: string | null, field_sub_type?: string | null, description?: string | null, system_generated?: boolean | null, plugin_id?: string | null, plugin_field_type?: string | null, sub_field_info?: Array<{ __typename?: 'SubFieldInfo', description?: string | null, field_type?: string | null, field_sub_type?: string | null, identifier?: string | null, input_type?: string | null, label?: string | null, serial?: number | null, system_generated?: boolean | null, parent_field?: string | null, validation?: { __typename?: 'Validation', as_title?: boolean | null, char_limit?: Array<number | null> | null, double_range_limit?: Array<number | null> | null, fixed_list_elements?: any[] | null, fixed_list_element_type?: string | null, hide?: boolean | null, is_email?: boolean | null, is_gallery?: boolean | null, is_multi_choice?: boolean | null, int_range_limit?: Array<number | null> | null, locals?: Array<string | null> | null, placeholder?: string | null, required?: boolean | null, unique?: boolean | null } | null, sub_field_info?: Array<{ __typename?: 'SubFieldInfo', description?: string | null, field_type?: string | null, field_sub_type?: string | null, identifier?: string | null, input_type?: string | null, label?: string | null, serial?: number | null, system_generated?: boolean | null, parent_field?: string | null, validation?: { __typename?: 'Validation', as_title?: boolean | null, char_limit?: Array<number | null> | null, double_range_limit?: Array<number | null> | null, fixed_list_elements?: any[] | null, fixed_list_element_type?: string | null, hide?: boolean | null, is_email?: boolean | null, is_gallery?: boolean | null, is_multi_choice?: boolean | null, int_range_limit?: Array<number | null> | null, locals?: Array<string | null> | null, placeholder?: string | null, required?: boolean | null, unique?: boolean | null } | null } | null> | null } | null> | null, validation?: { __typename?: 'Validation', required?: boolean | null, locals?: Array<string | null> | null, is_multi_choice?: boolean | null, int_range_limit?: Array<number | null> | null, hide?: boolean | null, fixed_list_elements?: any[] | null, fixed_list_element_type?: string | null, double_range_limit?: Array<number | null> | null, char_limit?: Array<number | null> | null, as_title?: boolean | null, is_email?: boolean | null, unique?: boolean | null, placeholder?: string | null, is_gallery?: boolean | null, is_password?: boolean | null } | null } | null> | null, connections?: Array<{ __typename?: 'ConnectionType', model?: string | null, relation?: string | null, type?: string | null, known_as?: string | null } | null> | null } | null> | null };

export type GetSystemPluginsQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  project_id?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSystemPluginsQuery = { __typename?: 'QueryType', getSystemPlugins?: Array<{ __typename?: 'PluginDetailsFields', role?: string | null, id?: string | null, icon?: string | null, title?: string | null, version?: string | null, exported_variable?: string | null, enable?: boolean | null, description?: string | null, load_status?: Plugin_Load_Type_Enum | null, activate_status?: Plugin_Activation_Type_Enum | null, repository_url?: string | null, branch?: string | null, author?: string | null, capabilities?: Array<string | null> | null, official?: boolean | null, signed?: boolean | null, publisher?: string | null, bundle_url?: string | null, env_vars?: Array<{ __typename?: 'EnvVariable', key?: string | null, value?: string | null } | null> | null } | null> | null };

export type GetProjectPluginsQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetProjectPluginsQuery = { __typename?: 'QueryType', getProjectPlugins?: Array<{ __typename?: 'PluginDetailsFields', role?: string | null, id?: string | null, icon?: string | null, title?: string | null, version?: string | null, exported_variable?: string | null, enable?: boolean | null, description?: string | null, load_status?: Plugin_Load_Type_Enum | null, activate_status?: Plugin_Activation_Type_Enum | null, repository_url?: string | null, branch?: string | null, author?: string | null, capabilities?: Array<string | null> | null, official?: boolean | null, signed?: boolean | null, publisher?: string | null, bundle_url?: string | null, env_vars?: Array<{ __typename?: 'EnvVariable', key?: string | null, value?: string | null } | null> | null } | null> | null };

export type ListPluginIdsQueryVariables = Exact<{
  type: Plugin_Type_Enum;
}>;


export type ListPluginIdsQuery = { __typename?: 'QueryType', listPluginIds?: { __typename?: 'ListPluginIDsResponse', type: Plugin_Type_Enum, plugins?: Array<string | null> | null } | null };

export type GetProjectAuthenticationQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetProjectAuthenticationQuery = { __typename?: 'QueryType', getProject?: { __typename?: 'ProjectModel', authentication_settings?: { __typename?: 'ProjectAuthenticationSettings', enable_general_auth: boolean, enable_google_auth: boolean, enable_facebook_auth: boolean, enable_github_auth: boolean, enable_x_auth: boolean, enable_linkedin_auth: boolean, general_authentication_method: string, google_client_id?: string | null, google_oauth_redirect_uri?: string | null, has_google_client_secret: boolean, facebook_client_id?: string | null, facebook_oauth_redirect_uri?: string | null, has_facebook_client_secret: boolean, github_client_id?: string | null, github_oauth_redirect_uri?: string | null, has_github_client_secret: boolean, x_client_id?: string | null, x_oauth_redirect_uri?: string | null, has_x_client_secret: boolean, linkedin_client_id?: string | null, linkedin_oauth_redirect_uri?: string | null, has_linkedin_client_secret: boolean, default_registration_role?: string | null } | null } | null };

export type GetProjectStorageQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetProjectStorageQuery = { __typename?: 'QueryType', getProject?: { __typename?: 'ProjectModel', storage_settings?: { __typename?: 'ProjectStorageSettings', use_free_cloud_storage: boolean, endpoint?: string | null, region?: string | null, bucket?: string | null, access_key_id?: string | null, has_secret_access_key: boolean, public_base_url?: string | null, force_path_style?: boolean | null } | null } | null };

export type GetCurrentProjectQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentProjectQuery = { __typename?: 'QueryType', currentProject?: { __typename?: 'ProjectModel', id?: string | null, _key?: string | null, name?: string | null, description?: string | null, trial_ends?: string | null, project_plan?: string | null, project_type?: string | null, default_storage_plugin?: string | null, default_function_plugin?: string | null, workspaces?: Array<{ __typename?: 'Workspace', active?: boolean | null, is_default?: boolean | null, is_production?: boolean | null, name?: string | null } | null> | null, system_messages?: Array<{ __typename?: 'SystemMessage', redirection?: string | null, message?: string | null, hide?: boolean | null, code?: string | null } | null> | null } | null };

export type GetCurrentProjectTokensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentProjectTokensQuery = { __typename?: 'QueryType', currentProject?: { __typename?: 'ProjectModel', id?: string | null, _key?: string | null, name?: string | null, project_secret_key?: string | null, tokens?: Array<{ __typename?: 'ProjectToken', name?: string | null, role?: string | null, expire?: string | null, created_at?: string | null, token_id?: string | null, token_prefix?: string | null, token_fingerprint?: string | null } | null> | null } | null };

export type GetProjectDriverInfoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetProjectDriverInfoQuery = { __typename?: 'QueryType', getProject?: { __typename?: 'ProjectModel', driver?: { __typename?: 'DriverCredentials', database?: string | null, engine?: string | null, host?: string | null, password?: string | null, port?: string | null, project_id?: string | null, user?: string | null } | null } | null };

export type PreviewSchemaRelationTransitionQueryVariables = Exact<{
  from_model: Scalars['String']['input'];
  to_model: Scalars['String']['input'];
  known_as?: InputMaybe<Scalars['String']['input']>;
  from_relation?: InputMaybe<Scalars['String']['input']>;
  to_relation?: InputMaybe<Scalars['String']['input']>;
  target_from_relation: Scalars['String']['input'];
  target_to_relation: Scalars['String']['input'];
}>;


export type PreviewSchemaRelationTransitionQuery = { __typename?: 'QueryType', previewSchemaRelationTransition?: { __typename?: 'RelationTransitionPreview', plan_hash?: string | null, kind?: string | null, safety?: string | null, reversibility?: string | null, blocked?: boolean | null, backup_required?: boolean | null, source_storage?: string | null, target_storage?: string | null, required_acknowledgement?: string | null, preview_json?: string | null, disclaimers?: Array<string | null> | null, warnings?: Array<string | null> | null, blockers?: Array<string | null> | null } | null };

export type GetSettingsWebhooksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsWebhooksQuery = { __typename?: 'QueryType', listWebHooks?: Array<{ __typename?: 'Webhook', _key?: string | null, events?: Array<string | null> | null, id?: string | null, model?: string | null, name?: string | null, type?: string | null, url?: string | null, logic_executions?: Array<string | null> | null } | null> | null };

export type GetSettingsWebhooksExecutableFunctionsByModelQueryVariables = Exact<{
  project_id?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSettingsWebhooksExecutableFunctionsByModelQuery = { __typename?: 'QueryType', listExecutableFunctions?: { __typename?: 'ListExecutableFunctionsResponse', functions?: Array<string | null> | null } | null };

export type GetProjectRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectRolesQuery = { __typename?: 'QueryType', currentProject?: { __typename?: 'ProjectModel', roles?: { [key: string]: any } | null } | null };

export type GetSettingsTeamsMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsTeamsMembersQuery = { __typename?: 'QueryType', teamMembers?: Array<{ __typename?: 'SystemUserInfo', id?: string | null, first_name?: string | null, last_name?: string | null, project_user?: boolean | null, email?: string | null, avatar?: string | null, project_assigned_role?: string | null, project_access_permissions?: Array<string | null> | null } | null> | null };

export type SearchSystemUsersQueryVariables = Exact<{
  project_id?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  organization_id?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchSystemUsersQuery = { __typename?: 'QueryType', searchSystemUsers?: Array<{ __typename?: 'SystemUserInfo', id?: string | null, avatar?: string | null, email?: string | null, first_name?: string | null, last_name?: string | null, role?: string | null } | null> | null };

export type GetPermissionsAndScopesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPermissionsAndScopesQuery = { __typename?: 'QueryType', listPermissionsAndScopes?: { __typename?: 'ListPermissionsAndScopesResponse', permissions?: Array<string | null> | null, models?: Array<string | null> | null, functions?: Array<string | null> | null } | null };

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = { __typename?: 'QueryType', currentProject?: { __typename?: 'ProjectModel', id?: string | null, name?: string | null, description?: string | null, project_icon?: string | null, roles?: { [key: string]: any } | null, project_secret_key?: string | null, created_at?: string | null, settings?: { __typename?: 'ProjectSettings', locals?: Array<string | null> | null, enable_revision_history?: boolean | null, system_graphql_hooks?: boolean | null, default_storage_plugin?: string | null, default_function_plugin?: string | null, default_locale?: string | null, idle_tenant_retention_days?: number | null, auto_soft_delete_idle_tenants?: boolean | null } | null } | null };

export type SearchUsersQueryVariables = Exact<{
  project_id: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchUsersQuery = { __typename?: 'QueryType', searchUsers?: { __typename?: 'SearchUsersPayload', count?: number | null, users?: Array<{ __typename?: 'UserItem', id?: string | null, email?: string | null, username?: string | null, phone?: string | null, role?: string | null, provider?: string | null, status?: string | null, created_at?: string | null, updated_at?: string | null } | null> | null } | null };



export const UpsertFunctionToProjectDocument = new TypedDocumentString(`
    mutation upsertFunctionToProject($name: String!, $description: String, $function_connected: Boolean, $function_provider_id: String, $provider_exported_variable: String, $function_exported_variable: String, $graphql_schema_type: String, $function_path: String, $runtime_config: Function_Provider_Config_Payload, $env_vars: [Function_Provider_Env_Vars_Payload], $request: String, $request_payload_is_optional: Boolean, $response: String, $response_is_array: Boolean, $update: Boolean, $source: String, $trigger_type: String, $language: String, $capabilities: [String]) {
  upsertFunctionToProject(
    name: $name
    description: $description
    function_connected: $function_connected
    function_provider_id: $function_provider_id
    provider_exported_variable: $provider_exported_variable
    function_exported_variable: $function_exported_variable
    function_path: $function_path
    graphql_schema_type: $graphql_schema_type
    runtime_config: $runtime_config
    env_vars: $env_vars
    request: $request
    request_payload_is_optional: $request_payload_is_optional
    response: $response
    response_is_array: $response_is_array
    update: $update
    source: $source
    trigger_type: $trigger_type
    language: $language
    capabilities: $capabilities
  ) {
    name
    description
    graphql_schema_type
    created_at
    updated_at
    trigger_type
    source
    active_revision_id
    capabilities
    function_connected
    provider_exported_variable
    function_exported_variable
    function_provider_id
    request {
      model
      optional_payload
    }
    response {
      model
      is_array
    }
    runtime_config {
      handler
      memory
      runtime
      time_out
    }
    env_vars {
      key
      value
    }
    rest_api_secret_url_key
  }
}
    `);

export const useUpsertFunctionToProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpsertFunctionToProjectMutation, TError, UpsertFunctionToProjectMutationVariables, TContext>) => {
    
    return useMutation<UpsertFunctionToProjectMutation, TError, UpsertFunctionToProjectMutationVariables, TContext>(
      {
    mutationKey: ['upsertFunctionToProject'],
    mutationFn: (variables?: UpsertFunctionToProjectMutationVariables) => graphqlFetcher<UpsertFunctionToProjectMutation, UpsertFunctionToProjectMutationVariables>(UpsertFunctionToProjectDocument, variables)(),
    ...options
  }
    )};


useUpsertFunctionToProjectMutation.fetcher = (variables: UpsertFunctionToProjectMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpsertFunctionToProjectMutation, UpsertFunctionToProjectMutationVariables>(UpsertFunctionToProjectDocument, variables, options);

export const DeleteFunctionFromProjectDocument = new TypedDocumentString(`
    mutation deleteFunctionFromProject($function: String!) {
  deleteFunctionFromProject(function: $function) {
    id
    name
  }
}
    `);

export const useDeleteFunctionFromProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteFunctionFromProjectMutation, TError, DeleteFunctionFromProjectMutationVariables, TContext>) => {
    
    return useMutation<DeleteFunctionFromProjectMutation, TError, DeleteFunctionFromProjectMutationVariables, TContext>(
      {
    mutationKey: ['deleteFunctionFromProject'],
    mutationFn: (variables?: DeleteFunctionFromProjectMutationVariables) => graphqlFetcher<DeleteFunctionFromProjectMutation, DeleteFunctionFromProjectMutationVariables>(DeleteFunctionFromProjectDocument, variables)(),
    ...options
  }
    )};


useDeleteFunctionFromProjectMutation.fetcher = (variables: DeleteFunctionFromProjectMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<DeleteFunctionFromProjectMutation, DeleteFunctionFromProjectMutationVariables>(DeleteFunctionFromProjectDocument, variables, options);

export const DeployFunctionToProjectDocument = new TypedDocumentString(`
    mutation deployFunctionToProject($name: String!, $source: String) {
  deployFunctionToProject(name: $name, source: $source) {
    function {
      name
      source
      active_revision_id
      rest_api_secret_url_key
      updated_at
    }
    revision {
      id
      revision
      artifact_key
      artifact_hash
      created_at
    }
    deployment {
      id
      revision_id
      status
      created_at
    }
  }
}
    `);

export const useDeployFunctionToProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeployFunctionToProjectMutation, TError, DeployFunctionToProjectMutationVariables, TContext>) => {
    
    return useMutation<DeployFunctionToProjectMutation, TError, DeployFunctionToProjectMutationVariables, TContext>(
      {
    mutationKey: ['deployFunctionToProject'],
    mutationFn: (variables?: DeployFunctionToProjectMutationVariables) => graphqlFetcher<DeployFunctionToProjectMutation, DeployFunctionToProjectMutationVariables>(DeployFunctionToProjectDocument, variables)(),
    ...options
  }
    )};


useDeployFunctionToProjectMutation.fetcher = (variables: DeployFunctionToProjectMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<DeployFunctionToProjectMutation, DeployFunctionToProjectMutationVariables>(DeployFunctionToProjectDocument, variables, options);

export const RollbackFunctionDeploymentDocument = new TypedDocumentString(`
    mutation rollbackFunctionDeployment($name: String!, $revision_id: String!) {
  rollbackFunctionDeployment(name: $name, revision_id: $revision_id) {
    function {
      name
      source
      active_revision_id
      updated_at
    }
    revision {
      id
      artifact_key
      created_at
    }
    deployment {
      id
      revision_id
      status
      rollback_of
      created_at
    }
  }
}
    `);

export const useRollbackFunctionDeploymentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RollbackFunctionDeploymentMutation, TError, RollbackFunctionDeploymentMutationVariables, TContext>) => {
    
    return useMutation<RollbackFunctionDeploymentMutation, TError, RollbackFunctionDeploymentMutationVariables, TContext>(
      {
    mutationKey: ['rollbackFunctionDeployment'],
    mutationFn: (variables?: RollbackFunctionDeploymentMutationVariables) => graphqlFetcher<RollbackFunctionDeploymentMutation, RollbackFunctionDeploymentMutationVariables>(RollbackFunctionDeploymentDocument, variables)(),
    ...options
  }
    )};


useRollbackFunctionDeploymentMutation.fetcher = (variables: RollbackFunctionDeploymentMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<RollbackFunctionDeploymentMutation, RollbackFunctionDeploymentMutationVariables>(RollbackFunctionDeploymentDocument, variables, options);

export const TestFunctionDraftDocument = new TypedDocumentString(`
    mutation testFunctionDraft($name: String!, $source: String, $payload: JSON, $tenant_id: String) {
  testFunctionDraft(
    name: $name
    source: $source
    payload: $payload
    tenant_id: $tenant_id
  ) {
    ok
    response
    error
    error_class
    duration_ms
    invocation_id
    logs {
      level
      message
    }
  }
}
    `);

export const useTestFunctionDraftMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<TestFunctionDraftMutation, TError, TestFunctionDraftMutationVariables, TContext>) => {
    
    return useMutation<TestFunctionDraftMutation, TError, TestFunctionDraftMutationVariables, TContext>(
      {
    mutationKey: ['testFunctionDraft'],
    mutationFn: (variables?: TestFunctionDraftMutationVariables) => graphqlFetcher<TestFunctionDraftMutation, TestFunctionDraftMutationVariables>(TestFunctionDraftDocument, variables)(),
    ...options
  }
    )};


useTestFunctionDraftMutation.fetcher = (variables: TestFunctionDraftMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<TestFunctionDraftMutation, TestFunctionDraftMutationVariables>(TestFunctionDraftDocument, variables, options);

export const UpsertFieldToModelDocument = new TypedDocumentString(`
    mutation upsertFieldToModel($model_name: String!, $field_label: String!, $field_type: FIELD_TYPE_ENUM, $field_sub_type: FIELD_SUB_TYPE_ENUM, $field_description: String, $input_type: INPUT_TYPE_ENUM, $serial: Int, $validation: module_validation_payload, $parent_field: String, $is_update: Boolean, $plugin_id: String, $plugin_field_type: String) {
  upsertFieldToModel(
    model_name: $model_name
    field_label: $field_label
    field_type: $field_type
    field_sub_type: $field_sub_type
    field_description: $field_description
    input_type: $input_type
    serial: $serial
    validation: $validation
    parent_field: $parent_field
    is_update: $is_update
    plugin_id: $plugin_id
    plugin_field_type: $plugin_field_type
  ) {
    serial
    identifier
    label
    input_type
    field_type
    field_sub_type
    description
    parent_field
    system_generated
    plugin_id
    plugin_field_type
    validation {
      required
      locals
      is_multi_choice
      int_range_limit
      hide
      fixed_list_elements
      fixed_list_element_type
      double_range_limit
      char_limit
      as_title
      is_email
      unique
      placeholder
      is_gallery
    }
  }
}
    `);

export const useUpsertFieldToModelMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpsertFieldToModelMutation, TError, UpsertFieldToModelMutationVariables, TContext>) => {
    
    return useMutation<UpsertFieldToModelMutation, TError, UpsertFieldToModelMutationVariables, TContext>(
      {
    mutationKey: ['upsertFieldToModel'],
    mutationFn: (variables?: UpsertFieldToModelMutationVariables) => graphqlFetcher<UpsertFieldToModelMutation, UpsertFieldToModelMutationVariables>(UpsertFieldToModelDocument, variables)(),
    ...options
  }
    )};


useUpsertFieldToModelMutation.fetcher = (variables: UpsertFieldToModelMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpsertFieldToModelMutation, UpsertFieldToModelMutationVariables>(UpsertFieldToModelDocument, variables, options);

export const CreateModelDocument = new TypedDocumentString(`
    mutation createModel($name: String!, $single_record: Boolean, $is_common_model: Boolean) {
  addModelToProject(
    name: $name
    single_record: $single_record
    is_common_model: $is_common_model
  ) {
    name
  }
}
    `);

export const useCreateModelMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateModelMutation, TError, CreateModelMutationVariables, TContext>) => {
    
    return useMutation<CreateModelMutation, TError, CreateModelMutationVariables, TContext>(
      {
    mutationKey: ['createModel'],
    mutationFn: (variables?: CreateModelMutationVariables) => graphqlFetcher<CreateModelMutation, CreateModelMutationVariables>(CreateModelDocument, variables)(),
    ...options
  }
    )};


useCreateModelMutation.fetcher = (variables: CreateModelMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<CreateModelMutation, CreateModelMutationVariables>(CreateModelDocument, variables, options);

export const UpdateModelDocument = new TypedDocumentString(`
    mutation updateModel($type: UpdateModelTypeEnum!, $new_name: String, $model_name: String!) {
  updateModel(type: $type, new_name: $new_name, model_name: $model_name) {
    name
  }
}
    `);

export const useUpdateModelMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateModelMutation, TError, UpdateModelMutationVariables, TContext>) => {
    
    return useMutation<UpdateModelMutation, TError, UpdateModelMutationVariables, TContext>(
      {
    mutationKey: ['updateModel'],
    mutationFn: (variables?: UpdateModelMutationVariables) => graphqlFetcher<UpdateModelMutation, UpdateModelMutationVariables>(UpdateModelDocument, variables)(),
    ...options
  }
    )};


useUpdateModelMutation.fetcher = (variables: UpdateModelMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpdateModelMutation, UpdateModelMutationVariables>(UpdateModelDocument, variables, options);

export const UpdateModelRelationDocument = new TypedDocumentString(`
    mutation updateModelRelation($forward_connection_type: RELATION_TYPE_ENUM!, $from: String!, $reverse_connection_type: RELATION_TYPE_ENUM!, $to: String!, $known_as: String) {
  upsertConnectionToModel(
    forward_connection_type: $forward_connection_type
    from: $from
    reverse_connection_type: $reverse_connection_type
    to: $to
    known_as: $known_as
  ) {
    type
    relation
    model
    known_as
  }
}
    `);

export const useUpdateModelRelationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateModelRelationMutation, TError, UpdateModelRelationMutationVariables, TContext>) => {
    
    return useMutation<UpdateModelRelationMutation, TError, UpdateModelRelationMutationVariables, TContext>(
      {
    mutationKey: ['updateModelRelation'],
    mutationFn: (variables?: UpdateModelRelationMutationVariables) => graphqlFetcher<UpdateModelRelationMutation, UpdateModelRelationMutationVariables>(UpdateModelRelationDocument, variables)(),
    ...options
  }
    )};


useUpdateModelRelationMutation.fetcher = (variables: UpdateModelRelationMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpdateModelRelationMutation, UpdateModelRelationMutationVariables>(UpdateModelRelationDocument, variables, options);

export const DeleteConnectionFromModelDocument = new TypedDocumentString(`
    mutation deleteConnectionFromModel($from: String!, $to: String!, $known_as: String) {
  deleteConnectionFromModel(from: $from, to: $to, known_as: $known_as) {
    type
    relation
    model
    known_as
  }
}
    `);

export const useDeleteConnectionFromModelMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteConnectionFromModelMutation, TError, DeleteConnectionFromModelMutationVariables, TContext>) => {
    
    return useMutation<DeleteConnectionFromModelMutation, TError, DeleteConnectionFromModelMutationVariables, TContext>(
      {
    mutationKey: ['deleteConnectionFromModel'],
    mutationFn: (variables?: DeleteConnectionFromModelMutationVariables) => graphqlFetcher<DeleteConnectionFromModelMutation, DeleteConnectionFromModelMutationVariables>(DeleteConnectionFromModelDocument, variables)(),
    ...options
  }
    )};


useDeleteConnectionFromModelMutation.fetcher = (variables: DeleteConnectionFromModelMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<DeleteConnectionFromModelMutation, DeleteConnectionFromModelMutationVariables>(DeleteConnectionFromModelDocument, variables, options);

export const ModelFieldOperationDocument = new TypedDocumentString(`
    mutation modelFieldOperation($type: FIELD_OPERATION_TYPE_ENUM!, $model_name: String!, $field_name: String!, $new_name: String, $parent_field: String, $single_page_model: Boolean, $known_as: String, $moved_to: String, $changed_type: String) {
  modelFieldOperation(
    type: $type
    model_name: $model_name
    new_name: $new_name
    field_name: $field_name
    parent_field: $parent_field
    single_page_model: $single_page_model
    known_as: $known_as
    moved_to: $moved_to
    changed_type: $changed_type
  ) {
    serial
    identifier
    label
    input_type
    field_type
    description
    parent_field
    validation {
      required
      locals
      is_multi_choice
      int_range_limit
      hide
      fixed_list_elements
      fixed_list_element_type
      double_range_limit
      char_limit
      as_title
      is_email
      unique
      placeholder
      is_gallery
    }
  }
}
    `);

export const useModelFieldOperationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ModelFieldOperationMutation, TError, ModelFieldOperationMutationVariables, TContext>) => {
    
    return useMutation<ModelFieldOperationMutation, TError, ModelFieldOperationMutationVariables, TContext>(
      {
    mutationKey: ['modelFieldOperation'],
    mutationFn: (variables?: ModelFieldOperationMutationVariables) => graphqlFetcher<ModelFieldOperationMutation, ModelFieldOperationMutationVariables>(ModelFieldOperationDocument, variables)(),
    ...options
  }
    )};


useModelFieldOperationMutation.fetcher = (variables: ModelFieldOperationMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<ModelFieldOperationMutation, ModelFieldOperationMutationVariables>(ModelFieldOperationDocument, variables, options);

export const RearrangeFieldSerialDocument = new TypedDocumentString(`
    mutation rearrangeFieldSerial($model_name: String!, $field_name: String!, $new_position: Int!, $move_type: String!, $parent_id: String) {
  rearrangeSerialOfField(
    model_name: $model_name
    field_name: $field_name
    new_position: $new_position
    move_type: $move_type
    parent_id: $parent_id
  ) {
    name
    fields {
      identifier
      serial
    }
  }
}
    `);

export const useRearrangeFieldSerialMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RearrangeFieldSerialMutation, TError, RearrangeFieldSerialMutationVariables, TContext>) => {
    
    return useMutation<RearrangeFieldSerialMutation, TError, RearrangeFieldSerialMutationVariables, TContext>(
      {
    mutationKey: ['rearrangeFieldSerial'],
    mutationFn: (variables?: RearrangeFieldSerialMutationVariables) => graphqlFetcher<RearrangeFieldSerialMutation, RearrangeFieldSerialMutationVariables>(RearrangeFieldSerialDocument, variables)(),
    ...options
  }
    )};


useRearrangeFieldSerialMutation.fetcher = (variables: RearrangeFieldSerialMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<RearrangeFieldSerialMutation, RearrangeFieldSerialMutationVariables>(RearrangeFieldSerialDocument, variables, options);

export const RemoveProjectSpecificPluginDocument = new TypedDocumentString(`
    mutation RemoveProjectSpecificPlugin($id: String!) {
  removeProjectSpecificPlugin(id: $id) {
    message
  }
}
    `);

export const useRemoveProjectSpecificPluginMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveProjectSpecificPluginMutation, TError, RemoveProjectSpecificPluginMutationVariables, TContext>) => {
    
    return useMutation<RemoveProjectSpecificPluginMutation, TError, RemoveProjectSpecificPluginMutationVariables, TContext>(
      {
    mutationKey: ['RemoveProjectSpecificPlugin'],
    mutationFn: (variables?: RemoveProjectSpecificPluginMutationVariables) => graphqlFetcher<RemoveProjectSpecificPluginMutation, RemoveProjectSpecificPluginMutationVariables>(RemoveProjectSpecificPluginDocument, variables)(),
    ...options
  }
    )};


useRemoveProjectSpecificPluginMutation.fetcher = (variables: RemoveProjectSpecificPluginMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<RemoveProjectSpecificPluginMutation, RemoveProjectSpecificPluginMutationVariables>(RemoveProjectSpecificPluginDocument, variables, options);

export const UpsertPluginDetailsDocument = new TypedDocumentString(`
    mutation upsertPluginDetails($id: String!, $env_vars: [PluginConfigEnvVarsPayload], $enable: Boolean, $activate_status: PLUGIN_ACTIVATION_TYPE_ENUM) {
  upsertPlugin(
    id: $id
    env_vars: $env_vars
    enable: $enable
    activate_status: $activate_status
  ) {
    author
    branch
    description
    enable
    env_vars {
      key
      value
    }
    exported_variable
    icon
    id
    load_status
    activate_status
    repository_url
    role
    title
    capabilities
    official
    signed
    version
  }
}
    `);

export const useUpsertPluginDetailsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpsertPluginDetailsMutation, TError, UpsertPluginDetailsMutationVariables, TContext>) => {
    
    return useMutation<UpsertPluginDetailsMutation, TError, UpsertPluginDetailsMutationVariables, TContext>(
      {
    mutationKey: ['upsertPluginDetails'],
    mutationFn: (variables?: UpsertPluginDetailsMutationVariables) => graphqlFetcher<UpsertPluginDetailsMutation, UpsertPluginDetailsMutationVariables>(UpsertPluginDetailsDocument, variables)(),
    ...options
  }
    )};


useUpsertPluginDetailsMutation.fetcher = (variables: UpsertPluginDetailsMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpsertPluginDetailsMutation, UpsertPluginDetailsMutationVariables>(UpsertPluginDetailsDocument, variables, options);

export const UpdateProjectAuthenticationSettingsDocument = new TypedDocumentString(`
    mutation updateProjectAuthenticationSettings($input: UpdateProjectAuthenticationInput!) {
  updateProjectAuthenticationSettings(input: $input) {
    authentication_settings {
      enable_general_auth
      enable_google_auth
      enable_facebook_auth
      enable_github_auth
      enable_x_auth
      enable_linkedin_auth
      general_authentication_method
      google_client_id
      google_oauth_redirect_uri
      has_google_client_secret
      facebook_client_id
      facebook_oauth_redirect_uri
      has_facebook_client_secret
      github_client_id
      github_oauth_redirect_uri
      has_github_client_secret
      x_client_id
      x_oauth_redirect_uri
      has_x_client_secret
      linkedin_client_id
      linkedin_oauth_redirect_uri
      has_linkedin_client_secret
      default_registration_role
    }
  }
}
    `);

export const useUpdateProjectAuthenticationSettingsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProjectAuthenticationSettingsMutation, TError, UpdateProjectAuthenticationSettingsMutationVariables, TContext>) => {
    
    return useMutation<UpdateProjectAuthenticationSettingsMutation, TError, UpdateProjectAuthenticationSettingsMutationVariables, TContext>(
      {
    mutationKey: ['updateProjectAuthenticationSettings'],
    mutationFn: (variables?: UpdateProjectAuthenticationSettingsMutationVariables) => graphqlFetcher<UpdateProjectAuthenticationSettingsMutation, UpdateProjectAuthenticationSettingsMutationVariables>(UpdateProjectAuthenticationSettingsDocument, variables)(),
    ...options
  }
    )};


useUpdateProjectAuthenticationSettingsMutation.fetcher = (variables: UpdateProjectAuthenticationSettingsMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpdateProjectAuthenticationSettingsMutation, UpdateProjectAuthenticationSettingsMutationVariables>(UpdateProjectAuthenticationSettingsDocument, variables, options);

export const UpdateProjectStorageSettingsDocument = new TypedDocumentString(`
    mutation updateProjectStorageSettings($input: UpdateProjectStorageInput!) {
  updateProjectStorageSettings(input: $input) {
    storage_settings {
      use_free_cloud_storage
      endpoint
      region
      bucket
      access_key_id
      has_secret_access_key
      public_base_url
      force_path_style
    }
  }
}
    `);

export const useUpdateProjectStorageSettingsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProjectStorageSettingsMutation, TError, UpdateProjectStorageSettingsMutationVariables, TContext>) => {
    
    return useMutation<UpdateProjectStorageSettingsMutation, TError, UpdateProjectStorageSettingsMutationVariables, TContext>(
      {
    mutationKey: ['updateProjectStorageSettings'],
    mutationFn: (variables?: UpdateProjectStorageSettingsMutationVariables) => graphqlFetcher<UpdateProjectStorageSettingsMutation, UpdateProjectStorageSettingsMutationVariables>(UpdateProjectStorageSettingsDocument, variables)(),
    ...options
  }
    )};


useUpdateProjectStorageSettingsMutation.fetcher = (variables: UpdateProjectStorageSettingsMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpdateProjectStorageSettingsMutation, UpdateProjectStorageSettingsMutationVariables>(UpdateProjectStorageSettingsDocument, variables, options);

export const GenerateProjectTokenDocument = new TypedDocumentString(`
    mutation generateProjectToken($name: String!, $duration: String!, $role: String!) {
  generateProjectToken(name: $name, duration: $duration, role: $role) {
    token
  }
}
    `);

export const useGenerateProjectTokenMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<GenerateProjectTokenMutation, TError, GenerateProjectTokenMutationVariables, TContext>) => {
    
    return useMutation<GenerateProjectTokenMutation, TError, GenerateProjectTokenMutationVariables, TContext>(
      {
    mutationKey: ['generateProjectToken'],
    mutationFn: (variables?: GenerateProjectTokenMutationVariables) => graphqlFetcher<GenerateProjectTokenMutation, GenerateProjectTokenMutationVariables>(GenerateProjectTokenDocument, variables)(),
    ...options
  }
    )};


useGenerateProjectTokenMutation.fetcher = (variables: GenerateProjectTokenMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<GenerateProjectTokenMutation, GenerateProjectTokenMutationVariables>(GenerateProjectTokenDocument, variables, options);

export const DeleteProjectTokenDocument = new TypedDocumentString(`
    mutation deleteProjectToken($duration: String!, $token: String, $token_id: String) {
  deleteProjectToken(duration: $duration, token: $token, token_id: $token_id) {
    msg
  }
}
    `);

export const useDeleteProjectTokenMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteProjectTokenMutation, TError, DeleteProjectTokenMutationVariables, TContext>) => {
    
    return useMutation<DeleteProjectTokenMutation, TError, DeleteProjectTokenMutationVariables, TContext>(
      {
    mutationKey: ['deleteProjectToken'],
    mutationFn: (variables?: DeleteProjectTokenMutationVariables) => graphqlFetcher<DeleteProjectTokenMutation, DeleteProjectTokenMutationVariables>(DeleteProjectTokenDocument, variables)(),
    ...options
  }
    )};


useDeleteProjectTokenMutation.fetcher = (variables: DeleteProjectTokenMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<DeleteProjectTokenMutation, DeleteProjectTokenMutationVariables>(DeleteProjectTokenDocument, variables, options);

export const UpdateProjectDocument = new TypedDocumentString(`
    mutation updateProject($access_key: [String] = "", $db: [String] = "", $host: String = "", $password: [String] = "", $port: String = "", $secret_key: [String] = "", $user: [String] = "", $_id: String = "") {
  updateProject(
    _id: $_id
    driver: {secret_key: $secret_key, host: $host, port: $port, db: $db, user: $user, password: $password, access_key: $access_key}
  ) {
    driver {
      engine
      database
      host
      port
      password
      user
    }
  }
}
    `);

export const useUpdateProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProjectMutation, TError, UpdateProjectMutationVariables, TContext>) => {
    
    return useMutation<UpdateProjectMutation, TError, UpdateProjectMutationVariables, TContext>(
      {
    mutationKey: ['updateProject'],
    mutationFn: (variables?: UpdateProjectMutationVariables) => graphqlFetcher<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, variables)(),
    ...options
  }
    )};


useUpdateProjectMutation.fetcher = (variables?: UpdateProjectMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, variables, options);

export const StageRelationTransitionDocument = new TypedDocumentString(`
    mutation StageRelationTransition($from_model: String!, $to_model: String!, $known_as: String, $from_relation: String, $to_relation: String, $target_from_relation: String!, $target_to_relation: String!, $plan_hash: String!, $acknowledgement: String) {
  stageRelationTransition(
    from_model: $from_model
    to_model: $to_model
    known_as: $known_as
    from_relation: $from_relation
    to_relation: $to_relation
    target_from_relation: $target_from_relation
    target_to_relation: $target_to_relation
    plan_hash: $plan_hash
    acknowledgement: $acknowledgement
  ) {
    staged
    message
    plan_hash
  }
}
    `);

export const useStageRelationTransitionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<StageRelationTransitionMutation, TError, StageRelationTransitionMutationVariables, TContext>) => {
    
    return useMutation<StageRelationTransitionMutation, TError, StageRelationTransitionMutationVariables, TContext>(
      {
    mutationKey: ['StageRelationTransition'],
    mutationFn: (variables?: StageRelationTransitionMutationVariables) => graphqlFetcher<StageRelationTransitionMutation, StageRelationTransitionMutationVariables>(StageRelationTransitionDocument, variables)(),
    ...options
  }
    )};


useStageRelationTransitionMutation.fetcher = (variables: StageRelationTransitionMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<StageRelationTransitionMutation, StageRelationTransitionMutationVariables>(StageRelationTransitionDocument, variables, options);

export const UpsertRoleToProjectDocument = new TypedDocumentString(`
    mutation upsertRoleToProject($name: String!, $is_admin: Boolean, $logic_executions: [String], $api_permissions: JSON) {
  upsertRoleToProject(
    name: $name
    is_admin: $is_admin
    logic_executions: $logic_executions
    api_permissions: $api_permissions
  ) {
    administrative_permissions
    api_permissions
    is_admin
    logic_executions
    system_generated
  }
}
    `);

export const useUpsertRoleToProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpsertRoleToProjectMutation, TError, UpsertRoleToProjectMutationVariables, TContext>) => {
    
    return useMutation<UpsertRoleToProjectMutation, TError, UpsertRoleToProjectMutationVariables, TContext>(
      {
    mutationKey: ['upsertRoleToProject'],
    mutationFn: (variables?: UpsertRoleToProjectMutationVariables) => graphqlFetcher<UpsertRoleToProjectMutation, UpsertRoleToProjectMutationVariables>(UpsertRoleToProjectDocument, variables)(),
    ...options
  }
    )};


useUpsertRoleToProjectMutation.fetcher = (variables: UpsertRoleToProjectMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpsertRoleToProjectMutation, UpsertRoleToProjectMutationVariables>(UpsertRoleToProjectDocument, variables, options);

export const DuplicateRoleInProjectDocument = new TypedDocumentString(`
    mutation duplicateRoleInProject($source_role: String!, $new_name: String!) {
  duplicateRoleInProject(source_role: $source_role, new_name: $new_name) {
    administrative_permissions
    api_permissions
    is_admin
    logic_executions
    system_generated
  }
}
    `);

export const useDuplicateRoleInProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DuplicateRoleInProjectMutation, TError, DuplicateRoleInProjectMutationVariables, TContext>) => {
    
    return useMutation<DuplicateRoleInProjectMutation, TError, DuplicateRoleInProjectMutationVariables, TContext>(
      {
    mutationKey: ['duplicateRoleInProject'],
    mutationFn: (variables?: DuplicateRoleInProjectMutationVariables) => graphqlFetcher<DuplicateRoleInProjectMutation, DuplicateRoleInProjectMutationVariables>(DuplicateRoleInProjectDocument, variables)(),
    ...options
  }
    )};


useDuplicateRoleInProjectMutation.fetcher = (variables: DuplicateRoleInProjectMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<DuplicateRoleInProjectMutation, DuplicateRoleInProjectMutationVariables>(DuplicateRoleInProjectDocument, variables, options);

export const UpdateSettingGeneralDocument = new TypedDocumentString(`
    mutation updateSettingGeneral($name: String, $description: String) {
  updateProject(name: $name, description: $description) {
    _key
    id
    name
    description
  }
}
    `);

export const useUpdateSettingGeneralMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateSettingGeneralMutation, TError, UpdateSettingGeneralMutationVariables, TContext>) => {
    
    return useMutation<UpdateSettingGeneralMutation, TError, UpdateSettingGeneralMutationVariables, TContext>(
      {
    mutationKey: ['updateSettingGeneral'],
    mutationFn: (variables?: UpdateSettingGeneralMutationVariables) => graphqlFetcher<UpdateSettingGeneralMutation, UpdateSettingGeneralMutationVariables>(UpdateSettingGeneralDocument, variables)(),
    ...options
  }
    )};


useUpdateSettingGeneralMutation.fetcher = (variables?: UpdateSettingGeneralMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpdateSettingGeneralMutation, UpdateSettingGeneralMutationVariables>(UpdateSettingGeneralDocument, variables, options);

export const UpdateSettingsDocument = new TypedDocumentString(`
    mutation updateSettings($name: String, $description: String, $project_icon: String, $settings: UpdateSettingsPayload) {
  updateProject(
    name: $name
    description: $description
    project_icon: $project_icon
    settings: $settings
  ) {
    _key
    id
    name
    description
    project_icon
    project_secret_key
    settings {
      locals
      system_graphql_hooks
      enable_revision_history
      default_storage_plugin
      default_function_plugin
      default_locale
      idle_tenant_retention_days
      auto_soft_delete_idle_tenants
      client_runtime {
        android { min_version_name min_build_number force_update store_url message_en message_bn maintenance maintenance_hours extras }
        ios { min_version_name min_build_number force_update store_url message_en message_bn maintenance maintenance_hours extras }
        web { min_version_name min_build_number force_update store_url message_en message_bn maintenance maintenance_hours extras }
      }
    }
  }
}
    `);

export const useUpdateSettingsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateSettingsMutation, TError, UpdateSettingsMutationVariables, TContext>) => {
    
    return useMutation<UpdateSettingsMutation, TError, UpdateSettingsMutationVariables, TContext>(
      {
    mutationKey: ['updateSettings'],
    mutationFn: (variables?: UpdateSettingsMutationVariables) => graphqlFetcher<UpdateSettingsMutation, UpdateSettingsMutationVariables>(UpdateSettingsDocument, variables)(),
    ...options
  }
    )};


useUpdateSettingsMutation.fetcher = (variables?: UpdateSettingsMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpdateSettingsMutation, UpdateSettingsMutationVariables>(UpdateSettingsDocument, variables, options);

export const CreateSettingsWebhookDocument = new TypedDocumentString(`
    mutation createSettingsWebhook($events: [String]!, $model: String!, $name: String!, $url: String!, $logic_executions: [String]) {
  createWebHook(
    events: $events
    model: $model
    name: $name
    url: $url
    logic_executions: $logic_executions
  ) {
    _key
    events
    id
    model
    name
    type
    url
    logic_executions
  }
}
    `);

export const useCreateSettingsWebhookMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateSettingsWebhookMutation, TError, CreateSettingsWebhookMutationVariables, TContext>) => {
    
    return useMutation<CreateSettingsWebhookMutation, TError, CreateSettingsWebhookMutationVariables, TContext>(
      {
    mutationKey: ['createSettingsWebhook'],
    mutationFn: (variables?: CreateSettingsWebhookMutationVariables) => graphqlFetcher<CreateSettingsWebhookMutation, CreateSettingsWebhookMutationVariables>(CreateSettingsWebhookDocument, variables)(),
    ...options
  }
    )};


useCreateSettingsWebhookMutation.fetcher = (variables: CreateSettingsWebhookMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<CreateSettingsWebhookMutation, CreateSettingsWebhookMutationVariables>(CreateSettingsWebhookDocument, variables, options);

export const DeleteSettingsWeekhookDocument = new TypedDocumentString(`
    mutation deleteSettingsWeekhook($id: String!) {
  deleteWebHook(id: $id) {
    msg
  }
}
    `);

export const useDeleteSettingsWeekhookMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteSettingsWeekhookMutation, TError, DeleteSettingsWeekhookMutationVariables, TContext>) => {
    
    return useMutation<DeleteSettingsWeekhookMutation, TError, DeleteSettingsWeekhookMutationVariables, TContext>(
      {
    mutationKey: ['deleteSettingsWeekhook'],
    mutationFn: (variables?: DeleteSettingsWeekhookMutationVariables) => graphqlFetcher<DeleteSettingsWeekhookMutation, DeleteSettingsWeekhookMutationVariables>(DeleteSettingsWeekhookDocument, variables)(),
    ...options
  }
    )};


useDeleteSettingsWeekhookMutation.fetcher = (variables: DeleteSettingsWeekhookMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<DeleteSettingsWeekhookMutation, DeleteSettingsWeekhookMutationVariables>(DeleteSettingsWeekhookDocument, variables, options);

export const DeleteSettingsRoleFromProjectDocument = new TypedDocumentString(`
    mutation deleteSettingsRoleFromProject($role: String!) {
  deleteRoleFromProject(role: $role) {
    message
  }
}
    `);

export const useDeleteSettingsRoleFromProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteSettingsRoleFromProjectMutation, TError, DeleteSettingsRoleFromProjectMutationVariables, TContext>) => {
    
    return useMutation<DeleteSettingsRoleFromProjectMutation, TError, DeleteSettingsRoleFromProjectMutationVariables, TContext>(
      {
    mutationKey: ['deleteSettingsRoleFromProject'],
    mutationFn: (variables?: DeleteSettingsRoleFromProjectMutationVariables) => graphqlFetcher<DeleteSettingsRoleFromProjectMutation, DeleteSettingsRoleFromProjectMutationVariables>(DeleteSettingsRoleFromProjectDocument, variables)(),
    ...options
  }
    )};


useDeleteSettingsRoleFromProjectMutation.fetcher = (variables: DeleteSettingsRoleFromProjectMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<DeleteSettingsRoleFromProjectMutation, DeleteSettingsRoleFromProjectMutationVariables>(DeleteSettingsRoleFromProjectDocument, variables, options);

export const UpdateUserProfileDocument = new TypedDocumentString(`
    mutation updateUserProfile($first_name: String, $last_name: String, $organization_id: String, $role: String, $new_pass: String, $old_pass: String, $username: String) {
  updateProfile(
    first_name: $first_name
    last_name: $last_name
    organization_id: $organization_id
    role: $role
    new_pass: $new_pass
    old_pass: $old_pass
    username: $username
  ) {
    id
    first_name
    last_name
    role
    is_admin
    avatar
    username
  }
}
    `);

export const useUpdateUserProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateUserProfileMutation, TError, UpdateUserProfileMutationVariables, TContext>) => {
    
    return useMutation<UpdateUserProfileMutation, TError, UpdateUserProfileMutationVariables, TContext>(
      {
    mutationKey: ['updateUserProfile'],
    mutationFn: (variables?: UpdateUserProfileMutationVariables) => graphqlFetcher<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, variables)(),
    ...options
  }
    )};


useUpdateUserProfileMutation.fetcher = (variables?: UpdateUserProfileMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, variables, options);

export const CreateUserDocument = new TypedDocumentString(`
    mutation createUser($project_id: String!, $password: String!, $email: String, $phone: String, $role: String) {
  createUser(
    project_id: $project_id
    password: $password
    email: $email
    phone: $phone
    role: $role
  ) {
    id
    email
    username
    phone
    role
    provider
    status
    created_at
    updated_at
  }
}
    `);

export const useCreateUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateUserMutation, TError, CreateUserMutationVariables, TContext>) => {
    
    return useMutation<CreateUserMutation, TError, CreateUserMutationVariables, TContext>(
      {
    mutationKey: ['createUser'],
    mutationFn: (variables?: CreateUserMutationVariables) => graphqlFetcher<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, variables)(),
    ...options
  }
    )};


useCreateUserMutation.fetcher = (variables: CreateUserMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, variables, options);

export const UpdateUserDocument = new TypedDocumentString(`
    mutation updateUser($user_id: String!, $email: String, $phone: String, $role: String) {
  updateUser(user_id: $user_id, email: $email, phone: $phone, role: $role) {
    id
    email
    username
    phone
    role
    provider
    status
    created_at
    updated_at
  }
}
    `);

export const useUpdateUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateUserMutation, TError, UpdateUserMutationVariables, TContext>) => {
    
    return useMutation<UpdateUserMutation, TError, UpdateUserMutationVariables, TContext>(
      {
    mutationKey: ['updateUser'],
    mutationFn: (variables?: UpdateUserMutationVariables) => graphqlFetcher<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, variables)(),
    ...options
  }
    )};


useUpdateUserMutation.fetcher = (variables: UpdateUserMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, variables, options);

export const DeleteUserDocument = new TypedDocumentString(`
    mutation deleteUser($user_id: String!) {
  deleteUser(user_id: $user_id)
}
    `);

export const useDeleteUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteUserMutation, TError, DeleteUserMutationVariables, TContext>) => {
    
    return useMutation<DeleteUserMutation, TError, DeleteUserMutationVariables, TContext>(
      {
    mutationKey: ['deleteUser'],
    mutationFn: (variables?: DeleteUserMutationVariables) => graphqlFetcher<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, variables)(),
    ...options
  }
    )};


useDeleteUserMutation.fetcher = (variables: DeleteUserMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, variables, options);

export const ResetUserPasswordDocument = new TypedDocumentString(`
    mutation resetUserPassword($user_id: String!, $password: String!) {
  resetUserPassword(user_id: $user_id, password: $password)
}
    `);

export const useResetUserPasswordMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ResetUserPasswordMutation, TError, ResetUserPasswordMutationVariables, TContext>) => {
    
    return useMutation<ResetUserPasswordMutation, TError, ResetUserPasswordMutationVariables, TContext>(
      {
    mutationKey: ['resetUserPassword'],
    mutationFn: (variables?: ResetUserPasswordMutationVariables) => graphqlFetcher<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>(ResetUserPasswordDocument, variables)(),
    ...options
  }
    )};


useResetUserPasswordMutation.fetcher = (variables: ResetUserPasswordMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>(ResetUserPasswordDocument, variables, options);

export const GetLoggedInUserDocument = new TypedDocumentString(`
    query getLoggedInUser {
  getUser {
    id
    email
    first_name
    last_name
    avatar
    current_project_id
    is_admin
    project_limit
    user_subscription_type
    username
  }
}
    `);

export const useGetLoggedInUserQuery = <
      TData = GetLoggedInUserQuery,
      TError = unknown
    >(
      variables?: GetLoggedInUserQueryVariables,
      options?: Omit<UseQueryOptions<GetLoggedInUserQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetLoggedInUserQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetLoggedInUserQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getLoggedInUser'] : ['getLoggedInUser', variables],
    queryFn: graphqlFetcher<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>(GetLoggedInUserDocument, variables),
    ...options
  }
    )};

useGetLoggedInUserQuery.getKey = (variables?: GetLoggedInUserQueryVariables) => variables === undefined ? ['getLoggedInUser'] : ['getLoggedInUser', variables];


useGetLoggedInUserQuery.fetcher = (variables?: GetLoggedInUserQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>(GetLoggedInUserDocument, variables, options);

export const GetAuditLogsDocument = new TypedDocumentString(`
    query getAuditLogs($project_id: String, $limit: Int, $page: Int, $user_id: String, $response_code: Int, $filter_by_project_id: String, $internal_function: String, $graphql_operation_name: String) {
  auditLogs(
    _id: $project_id
    filter: {limit: $limit, page: $page}
    where: {user_id: {eq: $user_id}, project_id: {eq: $filter_by_project_id}, response_code: {eq: $response_code}, internal_function: {eq: $internal_function}, graphql_operation_name: {eq: $graphql_operation_name}}
  ) {
    id
    activity
    created_at
    graphql_operation_name
    graphql_payload
    graphql_variable
    internal_error
    internal_function
    request_path
    request_payload
    response_code
    response_payload
    user {
      first_name
      id
    }
    project {
      id
      name
    }
  }
}
    `);

export const useGetAuditLogsQuery = <
      TData = GetAuditLogsQuery,
      TError = unknown
    >(
      variables?: GetAuditLogsQueryVariables,
      options?: Omit<UseQueryOptions<GetAuditLogsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetAuditLogsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetAuditLogsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getAuditLogs'] : ['getAuditLogs', variables],
    queryFn: graphqlFetcher<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, variables),
    ...options
  }
    )};

useGetAuditLogsQuery.getKey = (variables?: GetAuditLogsQueryVariables) => variables === undefined ? ['getAuditLogs'] : ['getAuditLogs', variables];


useGetAuditLogsQuery.fetcher = (variables?: GetAuditLogsQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, variables, options);

export const UpdateSingleDataDocument = new TypedDocumentString(`
    mutation updateSingleData($_id: String!, $single_page_data: Boolean, $model_name: String!, $local: String, $payload: JSON, $connect: JSON, $disconnect: JSON, $status: String) {
  upsertModelData(
    _id: $_id
    single_page_data: $single_page_data
    model_name: $model_name
    local: $local
    payload: $payload
    connect: $connect
    disconnect: $disconnect
    status: $status
  ) {
    _key
    data
    type
    id
    meta {
      created_at
      status
      updated_at
      last_modified_by {
        id
        first_name
      }
    }
  }
}
    `);

export const useUpdateSingleDataMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateSingleDataMutation, TError, UpdateSingleDataMutationVariables, TContext>) => {
    
    return useMutation<UpdateSingleDataMutation, TError, UpdateSingleDataMutationVariables, TContext>(
      {
    mutationKey: ['updateSingleData'],
    mutationFn: (variables?: UpdateSingleDataMutationVariables) => graphqlFetcher<UpdateSingleDataMutation, UpdateSingleDataMutationVariables>(UpdateSingleDataDocument, variables)(),
    ...options
  }
    )};


useUpdateSingleDataMutation.fetcher = (variables: UpdateSingleDataMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<UpdateSingleDataMutation, UpdateSingleDataMutationVariables>(UpdateSingleDataDocument, variables, options);

export const GetMultipleDataDocument = new TypedDocumentString(`
    query GetMultipleData($model: String!, $limit: Int, $page: Int, $search: String, $where: JSON, $connection: ListAllDataDetailedOfAModelConnectionPayload, $intersect: Boolean) {
  getModelData(
    model: $model
    limit: $limit
    page: $page
    search: $search
    where: $where
    connection: $connection
    intersect: $intersect
    status: all
  ) {
    results {
      relation_doc_id
      id
      data
      meta {
        created_at
        updated_at
        status
      }
    }
    count
  }
}
    `);

export const useGetMultipleDataQuery = <
      TData = GetMultipleDataQuery,
      TError = unknown
    >(
      variables: GetMultipleDataQueryVariables,
      options?: Omit<UseQueryOptions<GetMultipleDataQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMultipleDataQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetMultipleDataQuery, TError, TData>(
      {
    queryKey: ['GetMultipleData', variables],
    queryFn: graphqlFetcher<GetMultipleDataQuery, GetMultipleDataQueryVariables>(GetMultipleDataDocument, variables),
    ...options
  }
    )};

useGetMultipleDataQuery.getKey = (variables: GetMultipleDataQueryVariables) => ['GetMultipleData', variables];


useGetMultipleDataQuery.fetcher = (variables: GetMultipleDataQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetMultipleDataQuery, GetMultipleDataQueryVariables>(GetMultipleDataDocument, variables, options);

export const DeleteModelDataDocument = new TypedDocumentString(`
    mutation deleteModelData($model_name: String!, $_id: String) {
  deleteModelData(model_name: $model_name, _id: $_id) {
    id
  }
}
    `);

export const useDeleteModelDataMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteModelDataMutation, TError, DeleteModelDataMutationVariables, TContext>) => {
    
    return useMutation<DeleteModelDataMutation, TError, DeleteModelDataMutationVariables, TContext>(
      {
    mutationKey: ['deleteModelData'],
    mutationFn: (variables?: DeleteModelDataMutationVariables) => graphqlFetcher<DeleteModelDataMutation, DeleteModelDataMutationVariables>(DeleteModelDataDocument, variables)(),
    ...options
  }
    )};


useDeleteModelDataMutation.fetcher = (variables: DeleteModelDataMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<DeleteModelDataMutation, DeleteModelDataMutationVariables>(DeleteModelDataDocument, variables, options);

export const DuplicateModelDataDocument = new TypedDocumentString(`
    mutation duplicateModelData($model_name: String!, $_id: String) {
  duplicateModelData(model_name: $model_name, _id: $_id) {
    id
  }
}
    `);

export const useDuplicateModelDataMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DuplicateModelDataMutation, TError, DuplicateModelDataMutationVariables, TContext>) => {
    
    return useMutation<DuplicateModelDataMutation, TError, DuplicateModelDataMutationVariables, TContext>(
      {
    mutationKey: ['duplicateModelData'],
    mutationFn: (variables?: DuplicateModelDataMutationVariables) => graphqlFetcher<DuplicateModelDataMutation, DuplicateModelDataMutationVariables>(DuplicateModelDataDocument, variables)(),
    ...options
  }
    )};


useDuplicateModelDataMutation.fetcher = (variables: DuplicateModelDataMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<DuplicateModelDataMutation, DuplicateModelDataMutationVariables>(DuplicateModelDataDocument, variables, options);

export const FormDataQueryRevisionDocument = new TypedDocumentString(`
    query FormDataQueryRevision($_id: String!, $single_page_data: Boolean, $model: String) {
  listSingleModelRevisionData(
    _id: $_id
    single_page_data: $single_page_data
    model: $model
  ) {
    status
    revision_at
    id
  }
}
    `);

export const useFormDataQueryRevisionQuery = <
      TData = FormDataQueryRevisionQuery,
      TError = unknown
    >(
      variables: FormDataQueryRevisionQueryVariables,
      options?: Omit<UseQueryOptions<FormDataQueryRevisionQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<FormDataQueryRevisionQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<FormDataQueryRevisionQuery, TError, TData>(
      {
    queryKey: ['FormDataQueryRevision', variables],
    queryFn: graphqlFetcher<FormDataQueryRevisionQuery, FormDataQueryRevisionQueryVariables>(FormDataQueryRevisionDocument, variables),
    ...options
  }
    )};

useFormDataQueryRevisionQuery.getKey = (variables: FormDataQueryRevisionQueryVariables) => ['FormDataQueryRevision', variables];


useFormDataQueryRevisionQuery.fetcher = (variables: FormDataQueryRevisionQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<FormDataQueryRevisionQuery, FormDataQueryRevisionQueryVariables>(FormDataQueryRevisionDocument, variables, options);

export const GetSingleDataDocument = new TypedDocumentString(`
    query GetSingleData($_id: String!, $model: String, $local: String, $revision: Boolean, $single_page_data: Boolean) {
  getSingleData(
    _id: $_id
    model: $model
    local: $local
    revision: $revision
    single_page_data: $single_page_data
  ) {
    _key
    data
    id
    type
    meta {
      status
      updated_at
      created_at
      created_by {
        avatar
        id
        first_name
        role
        email
      }
      last_modified_by {
        id
        first_name
        role
        email
        avatar
      }
    }
  }
}
    `);

export const useGetSingleDataQuery = <
      TData = GetSingleDataQuery,
      TError = unknown
    >(
      variables: GetSingleDataQueryVariables,
      options?: Omit<UseQueryOptions<GetSingleDataQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSingleDataQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSingleDataQuery, TError, TData>(
      {
    queryKey: ['GetSingleData', variables],
    queryFn: graphqlFetcher<GetSingleDataQuery, GetSingleDataQueryVariables>(GetSingleDataDocument, variables),
    ...options
  }
    )};

useGetSingleDataQuery.getKey = (variables: GetSingleDataQueryVariables) => ['GetSingleData', variables];


useGetSingleDataQuery.fetcher = (variables: GetSingleDataQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetSingleDataQuery, GetSingleDataQueryVariables>(GetSingleDataDocument, variables, options);

export const CreateModelDataDocument = new TypedDocumentString(`
    mutation createModelData($model_name: String!, $local: String, $payload: JSON, $connect: JSON, $disconnect: JSON, $status: String) {
  upsertModelData(
    model_name: $model_name
    local: $local
    payload: $payload
    connect: $connect
    disconnect: $disconnect
    status: $status
  ) {
    _key
    data
    type
    id
    meta {
      created_at
      status
      updated_at
      last_modified_by {
        id
        first_name
      }
    }
  }
}
    `);

export const useCreateModelDataMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateModelDataMutation, TError, CreateModelDataMutationVariables, TContext>) => {
    
    return useMutation<CreateModelDataMutation, TError, CreateModelDataMutationVariables, TContext>(
      {
    mutationKey: ['createModelData'],
    mutationFn: (variables?: CreateModelDataMutationVariables) => graphqlFetcher<CreateModelDataMutation, CreateModelDataMutationVariables>(CreateModelDataDocument, variables)(),
    ...options
  }
    )};


useCreateModelDataMutation.fetcher = (variables: CreateModelDataMutationVariables, options?: RequestInit['headers']) => graphqlFetcher<CreateModelDataMutation, CreateModelDataMutationVariables>(CreateModelDataDocument, variables, options);

export const ListAvailableFunctionsDocument = new TypedDocumentString(`
    query listAvailableFunctions($function_id: String!) {
  listAvailableFunctions(function_id: $function_id) {
    functions
  }
}
    `);

export const useListAvailableFunctionsQuery = <
      TData = ListAvailableFunctionsQuery,
      TError = unknown
    >(
      variables: ListAvailableFunctionsQueryVariables,
      options?: Omit<UseQueryOptions<ListAvailableFunctionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ListAvailableFunctionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ListAvailableFunctionsQuery, TError, TData>(
      {
    queryKey: ['listAvailableFunctions', variables],
    queryFn: graphqlFetcher<ListAvailableFunctionsQuery, ListAvailableFunctionsQueryVariables>(ListAvailableFunctionsDocument, variables),
    ...options
  }
    )};

useListAvailableFunctionsQuery.getKey = (variables: ListAvailableFunctionsQueryVariables) => ['listAvailableFunctions', variables];


useListAvailableFunctionsQuery.fetcher = (variables: ListAvailableFunctionsQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<ListAvailableFunctionsQuery, ListAvailableFunctionsQueryVariables>(ListAvailableFunctionsDocument, variables, options);

export const GetAllFunctionInfoDocument = new TypedDocumentString(`
    query getAllFunctionInfo {
  projectFunctionsInfo {
    name
    description
    graphql_schema_type
    created_at
    updated_at
    trigger_type
    source
    active_revision_id
    capabilities
    function_connected
    function_provider_id
    request {
      model
      optional_payload
    }
    response {
      model
      is_array
    }
    runtime_config {
      handler
      memory
      runtime
      time_out
    }
    env_vars {
      key
      value
    }
    rest_api_secret_url_key
  }
}
    `);

export const useGetAllFunctionInfoQuery = <
      TData = GetAllFunctionInfoQuery,
      TError = unknown
    >(
      variables?: GetAllFunctionInfoQueryVariables,
      options?: Omit<UseQueryOptions<GetAllFunctionInfoQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetAllFunctionInfoQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetAllFunctionInfoQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getAllFunctionInfo'] : ['getAllFunctionInfo', variables],
    queryFn: graphqlFetcher<GetAllFunctionInfoQuery, GetAllFunctionInfoQueryVariables>(GetAllFunctionInfoDocument, variables),
    ...options
  }
    )};

useGetAllFunctionInfoQuery.getKey = (variables?: GetAllFunctionInfoQueryVariables) => variables === undefined ? ['getAllFunctionInfo'] : ['getAllFunctionInfo', variables];


useGetAllFunctionInfoQuery.fetcher = (variables?: GetAllFunctionInfoQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetAllFunctionInfoQuery, GetAllFunctionInfoQueryVariables>(GetAllFunctionInfoDocument, variables, options);

export const ListFunctionRevisionsDocument = new TypedDocumentString(`
    query listFunctionRevisions($name: String!, $limit: Int) {
  listFunctionRevisions(name: $name, limit: $limit) {
    id
    name
    revision
    source
    artifact_key
    artifact_hash
    created_by
    created_at
    capabilities
  }
}
    `);

export const useListFunctionRevisionsQuery = <
      TData = ListFunctionRevisionsQuery,
      TError = unknown
    >(
      variables: ListFunctionRevisionsQueryVariables,
      options?: Omit<UseQueryOptions<ListFunctionRevisionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ListFunctionRevisionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ListFunctionRevisionsQuery, TError, TData>(
      {
    queryKey: ['listFunctionRevisions', variables],
    queryFn: graphqlFetcher<ListFunctionRevisionsQuery, ListFunctionRevisionsQueryVariables>(ListFunctionRevisionsDocument, variables),
    ...options
  }
    )};

useListFunctionRevisionsQuery.getKey = (variables: ListFunctionRevisionsQueryVariables) => ['listFunctionRevisions', variables];


useListFunctionRevisionsQuery.fetcher = (variables: ListFunctionRevisionsQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<ListFunctionRevisionsQuery, ListFunctionRevisionsQueryVariables>(ListFunctionRevisionsDocument, variables, options);

export const ListFunctionDeploymentsDocument = new TypedDocumentString(`
    query listFunctionDeployments($name: String!, $limit: Int) {
  listFunctionDeployments(name: $name, limit: $limit) {
    id
    name
    revision_id
    status
    deployed_by
    rollback_of
    created_at
    environment
  }
}
    `);

export const useListFunctionDeploymentsQuery = <
      TData = ListFunctionDeploymentsQuery,
      TError = unknown
    >(
      variables: ListFunctionDeploymentsQueryVariables,
      options?: Omit<UseQueryOptions<ListFunctionDeploymentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ListFunctionDeploymentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ListFunctionDeploymentsQuery, TError, TData>(
      {
    queryKey: ['listFunctionDeployments', variables],
    queryFn: graphqlFetcher<ListFunctionDeploymentsQuery, ListFunctionDeploymentsQueryVariables>(ListFunctionDeploymentsDocument, variables),
    ...options
  }
    )};

useListFunctionDeploymentsQuery.getKey = (variables: ListFunctionDeploymentsQueryVariables) => ['listFunctionDeployments', variables];


useListFunctionDeploymentsQuery.fetcher = (variables: ListFunctionDeploymentsQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<ListFunctionDeploymentsQuery, ListFunctionDeploymentsQueryVariables>(ListFunctionDeploymentsDocument, variables, options);

export const GetOnlyModelsInfoDocument = new TypedDocumentString(`
    query getOnlyModelsInfo {
  projectModelsInfo {
    name
    single_page
    single_page_uuid
    system_generated
    has_connections
    enable_revision
    revision_filter {
      key
      value
    }
  }
}
    `);

export const useGetOnlyModelsInfoQuery = <
      TData = GetOnlyModelsInfoQuery,
      TError = unknown
    >(
      variables?: GetOnlyModelsInfoQueryVariables,
      options?: Omit<UseQueryOptions<GetOnlyModelsInfoQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetOnlyModelsInfoQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetOnlyModelsInfoQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getOnlyModelsInfo'] : ['getOnlyModelsInfo', variables],
    queryFn: graphqlFetcher<GetOnlyModelsInfoQuery, GetOnlyModelsInfoQueryVariables>(GetOnlyModelsInfoDocument, variables),
    ...options
  }
    )};

useGetOnlyModelsInfoQuery.getKey = (variables?: GetOnlyModelsInfoQueryVariables) => variables === undefined ? ['getOnlyModelsInfo'] : ['getOnlyModelsInfo', variables];


useGetOnlyModelsInfoQuery.fetcher = (variables?: GetOnlyModelsInfoQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetOnlyModelsInfoQuery, GetOnlyModelsInfoQueryVariables>(GetOnlyModelsInfoDocument, variables, options);

export const ModelDocumentCountsDocument = new TypedDocumentString(`
    query modelDocumentCounts($models: [String!]) {
  modelDocumentCounts(models: $models) {
    model
    count
  }
}
    `);

export const useModelDocumentCountsQuery = <
      TData = ModelDocumentCountsQuery,
      TError = unknown
    >(
      variables?: ModelDocumentCountsQueryVariables,
      options?: Omit<UseQueryOptions<ModelDocumentCountsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ModelDocumentCountsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ModelDocumentCountsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['modelDocumentCounts'] : ['modelDocumentCounts', variables],
    queryFn: graphqlFetcher<ModelDocumentCountsQuery, ModelDocumentCountsQueryVariables>(ModelDocumentCountsDocument, variables),
    ...options
  }
    )};

useModelDocumentCountsQuery.getKey = (variables?: ModelDocumentCountsQueryVariables) => variables === undefined ? ['modelDocumentCounts'] : ['modelDocumentCounts', variables];


useModelDocumentCountsQuery.fetcher = (variables?: ModelDocumentCountsQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<ModelDocumentCountsQuery, ModelDocumentCountsQueryVariables>(ModelDocumentCountsDocument, variables, options);

export const GetModelDetailsDocument = new TypedDocumentString(`
    query getModelDetails($model_name: String) {
  projectModelsInfo(model_name: $model_name) {
    name
    locals
    single_page
    single_page_uuid
    system_generated
    has_connections
    enable_revision
    revision_filter {
      key
      value
    }
    fields {
      serial
      identifier
      label
      input_type
      field_type
      field_sub_type
      description
      system_generated
      plugin_id
      plugin_field_type
      sub_field_info {
        description
        field_type
        field_sub_type
        identifier
        input_type
        label
        serial
        system_generated
        parent_field
        validation {
          as_title
          char_limit
          double_range_limit
          fixed_list_elements
          fixed_list_element_type
          hide
          is_email
          is_gallery
          is_multi_choice
          int_range_limit
          locals
          placeholder
          required
          unique
        }
        sub_field_info {
          description
          field_type
          field_sub_type
          identifier
          input_type
          label
          serial
          system_generated
          parent_field
          validation {
            as_title
            char_limit
            double_range_limit
            fixed_list_elements
            fixed_list_element_type
            hide
            is_email
            is_gallery
            is_multi_choice
            int_range_limit
            locals
            placeholder
            required
            unique
          }
        }
      }
      validation {
        required
        locals
        is_multi_choice
        int_range_limit
        hide
        fixed_list_elements
        fixed_list_element_type
        double_range_limit
        char_limit
        as_title
        is_email
        unique
        placeholder
        is_gallery
        is_password
      }
    }
    connections {
      model
      relation
      type
      known_as
    }
  }
}
    `);

export const useGetModelDetailsQuery = <
      TData = GetModelDetailsQuery,
      TError = unknown
    >(
      variables?: GetModelDetailsQueryVariables,
      options?: Omit<UseQueryOptions<GetModelDetailsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetModelDetailsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetModelDetailsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getModelDetails'] : ['getModelDetails', variables],
    queryFn: graphqlFetcher<GetModelDetailsQuery, GetModelDetailsQueryVariables>(GetModelDetailsDocument, variables),
    ...options
  }
    )};

useGetModelDetailsQuery.getKey = (variables?: GetModelDetailsQueryVariables) => variables === undefined ? ['getModelDetails'] : ['getModelDetails', variables];


useGetModelDetailsQuery.fetcher = (variables?: GetModelDetailsQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetModelDetailsQuery, GetModelDetailsQueryVariables>(GetModelDetailsDocument, variables, options);

export const GetSystemPluginsDocument = new TypedDocumentString(`
    query GetSystemPlugins($name: String, $limit: Int, $page: Int, $project_id: String) {
  getSystemPlugins(
    _id: $project_id
    filter: {limit: $limit, page: $page}
    where: {name: {eq: $name}}
  ) {
    role
    id
    icon
    title
    version
    exported_variable
    enable
    description
    load_status
    activate_status
    repository_url
    branch
    author
    capabilities
    official
    signed
    publisher
    bundle_url
    env_vars {
      key
      value
    }
  }
}
    `);

export const useGetSystemPluginsQuery = <
      TData = GetSystemPluginsQuery,
      TError = unknown
    >(
      variables?: GetSystemPluginsQueryVariables,
      options?: Omit<UseQueryOptions<GetSystemPluginsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSystemPluginsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSystemPluginsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetSystemPlugins'] : ['GetSystemPlugins', variables],
    queryFn: graphqlFetcher<GetSystemPluginsQuery, GetSystemPluginsQueryVariables>(GetSystemPluginsDocument, variables),
    ...options
  }
    )};

useGetSystemPluginsQuery.getKey = (variables?: GetSystemPluginsQueryVariables) => variables === undefined ? ['GetSystemPlugins'] : ['GetSystemPlugins', variables];


useGetSystemPluginsQuery.fetcher = (variables?: GetSystemPluginsQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetSystemPluginsQuery, GetSystemPluginsQueryVariables>(GetSystemPluginsDocument, variables, options);

export const GetProjectPluginsDocument = new TypedDocumentString(`
    query GetProjectPlugins($name: String, $limit: Int, $page: Int) {
  getProjectPlugins(
    filter: {limit: $limit, page: $page}
    where: {name: {eq: $name}}
  ) {
    role
    id
    icon
    title
    version
    exported_variable
    enable
    description
    load_status
    activate_status
    repository_url
    branch
    author
    capabilities
    official
    signed
    publisher
    bundle_url
    env_vars {
      key
      value
    }
  }
}
    `);

export const useGetProjectPluginsQuery = <
      TData = GetProjectPluginsQuery,
      TError = unknown
    >(
      variables?: GetProjectPluginsQueryVariables,
      options?: Omit<UseQueryOptions<GetProjectPluginsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetProjectPluginsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetProjectPluginsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetProjectPlugins'] : ['GetProjectPlugins', variables],
    queryFn: graphqlFetcher<GetProjectPluginsQuery, GetProjectPluginsQueryVariables>(GetProjectPluginsDocument, variables),
    ...options
  }
    )};

useGetProjectPluginsQuery.getKey = (variables?: GetProjectPluginsQueryVariables) => variables === undefined ? ['GetProjectPlugins'] : ['GetProjectPlugins', variables];


useGetProjectPluginsQuery.fetcher = (variables?: GetProjectPluginsQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetProjectPluginsQuery, GetProjectPluginsQueryVariables>(GetProjectPluginsDocument, variables, options);

export const ListPluginIdsDocument = new TypedDocumentString(`
    query listPluginIds($type: PLUGIN_TYPE_ENUM!) {
  listPluginIds(type: $type) {
    type
    plugins
  }
}
    `);

export const useListPluginIdsQuery = <
      TData = ListPluginIdsQuery,
      TError = unknown
    >(
      variables: ListPluginIdsQueryVariables,
      options?: Omit<UseQueryOptions<ListPluginIdsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ListPluginIdsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ListPluginIdsQuery, TError, TData>(
      {
    queryKey: ['listPluginIds', variables],
    queryFn: graphqlFetcher<ListPluginIdsQuery, ListPluginIdsQueryVariables>(ListPluginIdsDocument, variables),
    ...options
  }
    )};

useListPluginIdsQuery.getKey = (variables: ListPluginIdsQueryVariables) => ['listPluginIds', variables];


useListPluginIdsQuery.fetcher = (variables: ListPluginIdsQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<ListPluginIdsQuery, ListPluginIdsQueryVariables>(ListPluginIdsDocument, variables, options);

export const GetProjectAuthenticationDocument = new TypedDocumentString(`
    query getProjectAuthentication($_id: String = "") {
  getProject(_id: $_id) {
    authentication_settings {
      enable_general_auth
      enable_google_auth
      enable_facebook_auth
      enable_github_auth
      enable_x_auth
      enable_linkedin_auth
      general_authentication_method
      google_client_id
      google_oauth_redirect_uri
      has_google_client_secret
      facebook_client_id
      facebook_oauth_redirect_uri
      has_facebook_client_secret
      github_client_id
      github_oauth_redirect_uri
      has_github_client_secret
      x_client_id
      x_oauth_redirect_uri
      has_x_client_secret
      linkedin_client_id
      linkedin_oauth_redirect_uri
      has_linkedin_client_secret
      default_registration_role
    }
  }
}
    `);

export const useGetProjectAuthenticationQuery = <
      TData = GetProjectAuthenticationQuery,
      TError = unknown
    >(
      variables?: GetProjectAuthenticationQueryVariables,
      options?: Omit<UseQueryOptions<GetProjectAuthenticationQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetProjectAuthenticationQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetProjectAuthenticationQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getProjectAuthentication'] : ['getProjectAuthentication', variables],
    queryFn: graphqlFetcher<GetProjectAuthenticationQuery, GetProjectAuthenticationQueryVariables>(GetProjectAuthenticationDocument, variables),
    ...options
  }
    )};

useGetProjectAuthenticationQuery.getKey = (variables?: GetProjectAuthenticationQueryVariables) => variables === undefined ? ['getProjectAuthentication'] : ['getProjectAuthentication', variables];


useGetProjectAuthenticationQuery.fetcher = (variables?: GetProjectAuthenticationQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetProjectAuthenticationQuery, GetProjectAuthenticationQueryVariables>(GetProjectAuthenticationDocument, variables, options);

export const GetProjectStorageDocument = new TypedDocumentString(`
    query getProjectStorage($_id: String = "") {
  getProject(_id: $_id) {
    storage_settings {
      use_free_cloud_storage
      endpoint
      region
      bucket
      access_key_id
      has_secret_access_key
      public_base_url
      force_path_style
    }
  }
}
    `);

export const useGetProjectStorageQuery = <
      TData = GetProjectStorageQuery,
      TError = unknown
    >(
      variables?: GetProjectStorageQueryVariables,
      options?: Omit<UseQueryOptions<GetProjectStorageQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetProjectStorageQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetProjectStorageQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getProjectStorage'] : ['getProjectStorage', variables],
    queryFn: graphqlFetcher<GetProjectStorageQuery, GetProjectStorageQueryVariables>(GetProjectStorageDocument, variables),
    ...options
  }
    )};

useGetProjectStorageQuery.getKey = (variables?: GetProjectStorageQueryVariables) => variables === undefined ? ['getProjectStorage'] : ['getProjectStorage', variables];


useGetProjectStorageQuery.fetcher = (variables?: GetProjectStorageQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetProjectStorageQuery, GetProjectStorageQueryVariables>(GetProjectStorageDocument, variables, options);

export const GetCurrentProjectDocument = new TypedDocumentString(`
    query getCurrentProject {
  currentProject {
    id
    _key
    name
    description
    trial_ends
    project_plan
    project_type
    workspaces {
      active
      is_default
      is_production
      name
    }
    system_messages {
      redirection
      message
      hide
      code
    }
    default_storage_plugin
    default_function_plugin
  }
}
    `);

export const useGetCurrentProjectQuery = <
      TData = GetCurrentProjectQuery,
      TError = unknown
    >(
      variables?: GetCurrentProjectQueryVariables,
      options?: Omit<UseQueryOptions<GetCurrentProjectQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCurrentProjectQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCurrentProjectQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getCurrentProject'] : ['getCurrentProject', variables],
    queryFn: graphqlFetcher<GetCurrentProjectQuery, GetCurrentProjectQueryVariables>(GetCurrentProjectDocument, variables),
    ...options
  }
    )};

useGetCurrentProjectQuery.getKey = (variables?: GetCurrentProjectQueryVariables) => variables === undefined ? ['getCurrentProject'] : ['getCurrentProject', variables];


useGetCurrentProjectQuery.fetcher = (variables?: GetCurrentProjectQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetCurrentProjectQuery, GetCurrentProjectQueryVariables>(GetCurrentProjectDocument, variables, options);

export const GetCurrentProjectTokensDocument = new TypedDocumentString(`
    query getCurrentProjectTokens {
  currentProject {
    id
    _key
    name
    project_secret_key
    tokens {
      name
      role
      expire
      created_at
      token_id
      token_prefix
      token_fingerprint
    }
  }
}
    `);

export const useGetCurrentProjectTokensQuery = <
      TData = GetCurrentProjectTokensQuery,
      TError = unknown
    >(
      variables?: GetCurrentProjectTokensQueryVariables,
      options?: Omit<UseQueryOptions<GetCurrentProjectTokensQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCurrentProjectTokensQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCurrentProjectTokensQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getCurrentProjectTokens'] : ['getCurrentProjectTokens', variables],
    queryFn: graphqlFetcher<GetCurrentProjectTokensQuery, GetCurrentProjectTokensQueryVariables>(GetCurrentProjectTokensDocument, variables),
    ...options
  }
    )};

useGetCurrentProjectTokensQuery.getKey = (variables?: GetCurrentProjectTokensQueryVariables) => variables === undefined ? ['getCurrentProjectTokens'] : ['getCurrentProjectTokens', variables];


useGetCurrentProjectTokensQuery.fetcher = (variables?: GetCurrentProjectTokensQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetCurrentProjectTokensQuery, GetCurrentProjectTokensQueryVariables>(GetCurrentProjectTokensDocument, variables, options);

export const GetProjectDriverInfoDocument = new TypedDocumentString(`
    query getProjectDriverInfo($id: String = "") {
  getProject(_id: $id) {
    driver {
      database
      engine
      host
      password
      port
      project_id
      user
    }
  }
}
    `);

export const useGetProjectDriverInfoQuery = <
      TData = GetProjectDriverInfoQuery,
      TError = unknown
    >(
      variables?: GetProjectDriverInfoQueryVariables,
      options?: Omit<UseQueryOptions<GetProjectDriverInfoQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetProjectDriverInfoQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetProjectDriverInfoQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getProjectDriverInfo'] : ['getProjectDriverInfo', variables],
    queryFn: graphqlFetcher<GetProjectDriverInfoQuery, GetProjectDriverInfoQueryVariables>(GetProjectDriverInfoDocument, variables),
    ...options
  }
    )};

useGetProjectDriverInfoQuery.getKey = (variables?: GetProjectDriverInfoQueryVariables) => variables === undefined ? ['getProjectDriverInfo'] : ['getProjectDriverInfo', variables];


useGetProjectDriverInfoQuery.fetcher = (variables?: GetProjectDriverInfoQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetProjectDriverInfoQuery, GetProjectDriverInfoQueryVariables>(GetProjectDriverInfoDocument, variables, options);

export const PreviewSchemaRelationTransitionDocument = new TypedDocumentString(`
    query PreviewSchemaRelationTransition($from_model: String!, $to_model: String!, $known_as: String, $from_relation: String, $to_relation: String, $target_from_relation: String!, $target_to_relation: String!) {
  previewSchemaRelationTransition(
    from_model: $from_model
    to_model: $to_model
    known_as: $known_as
    from_relation: $from_relation
    to_relation: $to_relation
    target_from_relation: $target_from_relation
    target_to_relation: $target_to_relation
  ) {
    plan_hash
    kind
    safety
    reversibility
    blocked
    backup_required
    source_storage
    target_storage
    required_acknowledgement
    preview_json
    disclaimers
    warnings
    blockers
  }
}
    `);

export const usePreviewSchemaRelationTransitionQuery = <
      TData = PreviewSchemaRelationTransitionQuery,
      TError = unknown
    >(
      variables: PreviewSchemaRelationTransitionQueryVariables,
      options?: Omit<UseQueryOptions<PreviewSchemaRelationTransitionQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<PreviewSchemaRelationTransitionQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<PreviewSchemaRelationTransitionQuery, TError, TData>(
      {
    queryKey: ['PreviewSchemaRelationTransition', variables],
    queryFn: graphqlFetcher<PreviewSchemaRelationTransitionQuery, PreviewSchemaRelationTransitionQueryVariables>(PreviewSchemaRelationTransitionDocument, variables),
    ...options
  }
    )};

usePreviewSchemaRelationTransitionQuery.getKey = (variables: PreviewSchemaRelationTransitionQueryVariables) => ['PreviewSchemaRelationTransition', variables];


usePreviewSchemaRelationTransitionQuery.fetcher = (variables: PreviewSchemaRelationTransitionQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<PreviewSchemaRelationTransitionQuery, PreviewSchemaRelationTransitionQueryVariables>(PreviewSchemaRelationTransitionDocument, variables, options);

export const GetSettingsWebhooksDocument = new TypedDocumentString(`
    query getSettingsWebhooks {
  listWebHooks {
    _key
    events
    id
    model
    name
    type
    url
    logic_executions
  }
}
    `);

export const useGetSettingsWebhooksQuery = <
      TData = GetSettingsWebhooksQuery,
      TError = unknown
    >(
      variables?: GetSettingsWebhooksQueryVariables,
      options?: Omit<UseQueryOptions<GetSettingsWebhooksQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSettingsWebhooksQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSettingsWebhooksQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getSettingsWebhooks'] : ['getSettingsWebhooks', variables],
    queryFn: graphqlFetcher<GetSettingsWebhooksQuery, GetSettingsWebhooksQueryVariables>(GetSettingsWebhooksDocument, variables),
    ...options
  }
    )};

useGetSettingsWebhooksQuery.getKey = (variables?: GetSettingsWebhooksQueryVariables) => variables === undefined ? ['getSettingsWebhooks'] : ['getSettingsWebhooks', variables];


useGetSettingsWebhooksQuery.fetcher = (variables?: GetSettingsWebhooksQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetSettingsWebhooksQuery, GetSettingsWebhooksQueryVariables>(GetSettingsWebhooksDocument, variables, options);

export const GetSettingsWebhooksExecutableFunctionsByModelDocument = new TypedDocumentString(`
    query getSettingsWebhooksExecutableFunctionsByModel($project_id: String, $model: String) {
  listExecutableFunctions(_id: $project_id, model_name: $model) {
    functions
  }
}
    `);

export const useGetSettingsWebhooksExecutableFunctionsByModelQuery = <
      TData = GetSettingsWebhooksExecutableFunctionsByModelQuery,
      TError = unknown
    >(
      variables?: GetSettingsWebhooksExecutableFunctionsByModelQueryVariables,
      options?: Omit<UseQueryOptions<GetSettingsWebhooksExecutableFunctionsByModelQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSettingsWebhooksExecutableFunctionsByModelQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSettingsWebhooksExecutableFunctionsByModelQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getSettingsWebhooksExecutableFunctionsByModel'] : ['getSettingsWebhooksExecutableFunctionsByModel', variables],
    queryFn: graphqlFetcher<GetSettingsWebhooksExecutableFunctionsByModelQuery, GetSettingsWebhooksExecutableFunctionsByModelQueryVariables>(GetSettingsWebhooksExecutableFunctionsByModelDocument, variables),
    ...options
  }
    )};

useGetSettingsWebhooksExecutableFunctionsByModelQuery.getKey = (variables?: GetSettingsWebhooksExecutableFunctionsByModelQueryVariables) => variables === undefined ? ['getSettingsWebhooksExecutableFunctionsByModel'] : ['getSettingsWebhooksExecutableFunctionsByModel', variables];


useGetSettingsWebhooksExecutableFunctionsByModelQuery.fetcher = (variables?: GetSettingsWebhooksExecutableFunctionsByModelQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetSettingsWebhooksExecutableFunctionsByModelQuery, GetSettingsWebhooksExecutableFunctionsByModelQueryVariables>(GetSettingsWebhooksExecutableFunctionsByModelDocument, variables, options);

export const GetProjectRolesDocument = new TypedDocumentString(`
    query getProjectRoles {
  currentProject {
    roles
  }
}
    `);

export const useGetProjectRolesQuery = <
      TData = GetProjectRolesQuery,
      TError = unknown
    >(
      variables?: GetProjectRolesQueryVariables,
      options?: Omit<UseQueryOptions<GetProjectRolesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetProjectRolesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetProjectRolesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getProjectRoles'] : ['getProjectRoles', variables],
    queryFn: graphqlFetcher<GetProjectRolesQuery, GetProjectRolesQueryVariables>(GetProjectRolesDocument, variables),
    ...options
  }
    )};

useGetProjectRolesQuery.getKey = (variables?: GetProjectRolesQueryVariables) => variables === undefined ? ['getProjectRoles'] : ['getProjectRoles', variables];


useGetProjectRolesQuery.fetcher = (variables?: GetProjectRolesQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetProjectRolesQuery, GetProjectRolesQueryVariables>(GetProjectRolesDocument, variables, options);

export const GetSettingsTeamsMembersDocument = new TypedDocumentString(`
    query getSettingsTeamsMembers {
  teamMembers {
    id
    first_name
    last_name
    project_user
    email
    avatar
    project_assigned_role
    project_access_permissions
  }
}
    `);

export const useGetSettingsTeamsMembersQuery = <
      TData = GetSettingsTeamsMembersQuery,
      TError = unknown
    >(
      variables?: GetSettingsTeamsMembersQueryVariables,
      options?: Omit<UseQueryOptions<GetSettingsTeamsMembersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSettingsTeamsMembersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSettingsTeamsMembersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getSettingsTeamsMembers'] : ['getSettingsTeamsMembers', variables],
    queryFn: graphqlFetcher<GetSettingsTeamsMembersQuery, GetSettingsTeamsMembersQueryVariables>(GetSettingsTeamsMembersDocument, variables),
    ...options
  }
    )};

useGetSettingsTeamsMembersQuery.getKey = (variables?: GetSettingsTeamsMembersQueryVariables) => variables === undefined ? ['getSettingsTeamsMembers'] : ['getSettingsTeamsMembers', variables];


useGetSettingsTeamsMembersQuery.fetcher = (variables?: GetSettingsTeamsMembersQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetSettingsTeamsMembersQuery, GetSettingsTeamsMembersQueryVariables>(GetSettingsTeamsMembersDocument, variables, options);

export const SearchSystemUsersDocument = new TypedDocumentString(`
    query searchSystemUsers($project_id: String, $limit: Int, $page: Int, $first_name: String, $last_name: String, $organization_id: String, $username: String, $email: String) {
  searchSystemUsers(
    _id: $project_id
    filter: {limit: $limit, page: $page}
    where: {email: {eq: $email}, first_name: {eq: $first_name}, last_name: {eq: $last_name}, organization_id: {eq: $organization_id}, username: {eq: $username}}
  ) {
    id
    avatar
    email
    first_name
    last_name
    role
  }
}
    `);

export const useSearchSystemUsersQuery = <
      TData = SearchSystemUsersQuery,
      TError = unknown
    >(
      variables?: SearchSystemUsersQueryVariables,
      options?: Omit<UseQueryOptions<SearchSystemUsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<SearchSystemUsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<SearchSystemUsersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['searchSystemUsers'] : ['searchSystemUsers', variables],
    queryFn: graphqlFetcher<SearchSystemUsersQuery, SearchSystemUsersQueryVariables>(SearchSystemUsersDocument, variables),
    ...options
  }
    )};

useSearchSystemUsersQuery.getKey = (variables?: SearchSystemUsersQueryVariables) => variables === undefined ? ['searchSystemUsers'] : ['searchSystemUsers', variables];


useSearchSystemUsersQuery.fetcher = (variables?: SearchSystemUsersQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<SearchSystemUsersQuery, SearchSystemUsersQueryVariables>(SearchSystemUsersDocument, variables, options);

export const GetPermissionsAndScopesDocument = new TypedDocumentString(`
    query getPermissionsAndScopes {
  listPermissionsAndScopes {
    permissions
    models
    functions
  }
}
    `);

export const useGetPermissionsAndScopesQuery = <
      TData = GetPermissionsAndScopesQuery,
      TError = unknown
    >(
      variables?: GetPermissionsAndScopesQueryVariables,
      options?: Omit<UseQueryOptions<GetPermissionsAndScopesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetPermissionsAndScopesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetPermissionsAndScopesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getPermissionsAndScopes'] : ['getPermissionsAndScopes', variables],
    queryFn: graphqlFetcher<GetPermissionsAndScopesQuery, GetPermissionsAndScopesQueryVariables>(GetPermissionsAndScopesDocument, variables),
    ...options
  }
    )};

useGetPermissionsAndScopesQuery.getKey = (variables?: GetPermissionsAndScopesQueryVariables) => variables === undefined ? ['getPermissionsAndScopes'] : ['getPermissionsAndScopes', variables];


useGetPermissionsAndScopesQuery.fetcher = (variables?: GetPermissionsAndScopesQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetPermissionsAndScopesQuery, GetPermissionsAndScopesQueryVariables>(GetPermissionsAndScopesDocument, variables, options);

export const GetSettingsDocument = new TypedDocumentString(`
    query getSettings {
  currentProject {
    id
    name
    description
    project_icon
    roles
    project_secret_key
    settings {
      locals
      enable_revision_history
      system_graphql_hooks
      default_storage_plugin
      default_function_plugin
      default_locale
      idle_tenant_retention_days
      auto_soft_delete_idle_tenants
      client_runtime {
        android { min_version_name min_build_number force_update store_url message_en message_bn maintenance maintenance_hours extras }
        ios { min_version_name min_build_number force_update store_url message_en message_bn maintenance maintenance_hours extras }
        web { min_version_name min_build_number force_update store_url message_en message_bn maintenance maintenance_hours extras }
      }
    }
    created_at
  }
}
    `);

export const useGetSettingsQuery = <
      TData = GetSettingsQuery,
      TError = unknown
    >(
      variables?: GetSettingsQueryVariables,
      options?: Omit<UseQueryOptions<GetSettingsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetSettingsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetSettingsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['getSettings'] : ['getSettings', variables],
    queryFn: graphqlFetcher<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, variables),
    ...options
  }
    )};

useGetSettingsQuery.getKey = (variables?: GetSettingsQueryVariables) => variables === undefined ? ['getSettings'] : ['getSettings', variables];


useGetSettingsQuery.fetcher = (variables?: GetSettingsQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, variables, options);

export const SearchUsersDocument = new TypedDocumentString(`
    query searchUsers($project_id: String!, $limit: Int, $offset: Int, $q: String) {
  searchUsers(project_id: $project_id, limit: $limit, offset: $offset, q: $q) {
    count
    users {
      id
      email
      username
      phone
      role
      provider
      status
      created_at
      updated_at
    }
  }
}
    `);

export const useSearchUsersQuery = <
      TData = SearchUsersQuery,
      TError = unknown
    >(
      variables: SearchUsersQueryVariables,
      options?: Omit<UseQueryOptions<SearchUsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<SearchUsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<SearchUsersQuery, TError, TData>(
      {
    queryKey: ['searchUsers', variables],
    queryFn: graphqlFetcher<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, variables),
    ...options
  }
    )};

useSearchUsersQuery.getKey = (variables: SearchUsersQueryVariables) => ['searchUsers', variables];


useSearchUsersQuery.fetcher = (variables: SearchUsersQueryVariables, options?: RequestInit['headers']) => graphqlFetcher<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, variables, options);
