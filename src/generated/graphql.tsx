import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
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

export type ApiToken = {
  __typename?: 'APIToken';
  expire?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type AddTeamMemberPayload = {
  administrative_permissions: Array<InputMaybe<Scalars['String']['input']>>;
  email: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
  team_id?: InputMaybe<Scalars['String']['input']>;
};

export type ApitoFunctionRuntimeConfig = {
  __typename?: 'ApitoFunctionRuntimeConfig';
  handler?: Maybe<Scalars['String']['output']>;
  memory?: Maybe<Scalars['Int']['output']>;
  runtime?: Maybe<Scalars['String']['output']>;
  time_out?: Maybe<Scalars['Int']['output']>;
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

export type CloudFunctionRequestResponse = {
  __typename?: 'CloudFunctionRequestResponse';
  is_array?: Maybe<Scalars['Boolean']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  optional_payload?: Maybe<Scalars['Boolean']['output']>;
  params?: Maybe<Array<Maybe<FieldInfo>>>;
};

export type CloudFunctionType = {
  __typename?: 'CloudFunctionType';
  created_at?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  env_vars?: Maybe<Array<Maybe<EnvVariable>>>;
  function_connected?: Maybe<Scalars['Boolean']['output']>;
  function_exported_variable?: Maybe<Scalars['String']['output']>;
  function_path?: Maybe<Scalars['String']['output']>;
  function_provider_id?: Maybe<Scalars['String']['output']>;
  graphql_schema_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_exported_variable?: Maybe<Scalars['String']['output']>;
  request?: Maybe<CloudFunctionRequestResponse>;
  response?: Maybe<CloudFunctionRequestResponse>;
  rest_api_secret_url_key?: Maybe<Scalars['String']['output']>;
  runtime_config?: Maybe<ApitoFunctionRuntimeConfig>;
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

export type DeleteApiKeyResponse = {
  __typename?: 'DeleteApiKeyResponse';
  msg?: Maybe<Scalars['String']['output']>;
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
  access_key?: Maybe<Scalars['String']['output']>;
  database?: Maybe<Scalars['String']['output']>;
  database_dir?: Maybe<Scalars['String']['output']>;
  engine?: Maybe<Scalars['String']['output']>;
  firebase_project_credential_json?: Maybe<Scalars['String']['output']>;
  firebase_project_id?: Maybe<Scalars['String']['output']>;
  host?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  port?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['String']['output']>;
  secret_key?: Maybe<Scalars['String']['output']>;
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
  serial?: Maybe<Scalars['Int']['output']>;
  sub_field_info?: Maybe<Array<Maybe<SubFieldInfo>>>;
  system_generated?: Maybe<Scalars['Boolean']['output']>;
  validation?: Maybe<Validation>;
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

export type GenerateApiKeyResponse = {
  __typename?: 'GenerateApiKeyResponse';
  name?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type GenerateApiTokenResponse = {
  __typename?: 'GenerateApiTokenResponse';
  token?: Maybe<Scalars['String']['output']>;
};

export type GenerateTenantTokenResponse = {
  __typename?: 'GenerateTenantTokenResponse';
  token?: Maybe<Scalars['String']['output']>;
};

export type GetModelDataResponse = {
  __typename?: 'GetModelDataResponse';
  count?: Maybe<Scalars['Int']['output']>;
  results?: Maybe<Array<Maybe<DocumentModelType>>>;
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
  tenant_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type ModelType = {
  __typename?: 'ModelType';
  connections?: Maybe<Array<Maybe<ConnectionType>>>;
  enable_revision?: Maybe<Scalars['Boolean']['output']>;
  fields?: Maybe<Array<Maybe<FieldInfo>>>;
  has_connections?: Maybe<Scalars['Boolean']['output']>;
  hook_ids?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  is_tenant_model?: Maybe<Scalars['Boolean']['output']>;
  locals?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name?: Maybe<Scalars['String']['output']>;
  repeated_groups?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  revision_filter?: Maybe<Array<Maybe<RevisionFilter>>>;
  single_page?: Maybe<Scalars['Boolean']['output']>;
  single_page_uuid?: Maybe<Scalars['String']['output']>;
  system_generated?: Maybe<Scalars['Boolean']['output']>;
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
  addModelToProject?: Maybe<Array<Maybe<ModelType>>>;
  createWebHook?: Maybe<Webhook>;
  deleteApiKey?: Maybe<DeleteApiKeyResponse>;
  deleteApiToken?: Maybe<DeleteApiTokenResponse>;
  deleteFunctionFromProject?: Maybe<Array<Maybe<CloudFunctionType>>>;
  deleteModelData?: Maybe<DeleteModelDataResponse>;
  deleteRoleFromProject?: Maybe<DeleteApitoFunctionResponse>;
  deleteWebHook?: Maybe<DeleteWebHookResponse>;
  duplicateModelData?: Maybe<DuplicateModelDataResponse>;
  generateApiKey?: Maybe<GenerateApiKeyResponse>;
  generateApiToken?: Maybe<GenerateApiTokenResponse>;
  generateTenantToken?: Maybe<GenerateTenantTokenResponse>;
  modelFieldOperation?: Maybe<FieldInfo>;
  rearrangeSerialOfField?: Maybe<ModelType>;
  runModelMigrations?: Maybe<Array<Maybe<ModelType>>>;
  send?: Maybe<SendMutationResponse>;
  updateModel?: Maybe<ModelType>;
  updateProfile?: Maybe<SystemUserInfo>;
  updateProject?: Maybe<ProjectModel>;
  upsertConnectionToModel?: Maybe<Array<Maybe<ConnectionType>>>;
  upsertFieldToModel?: Maybe<FieldInfo>;
  upsertFunctionToProject?: Maybe<CloudFunctionType>;
  upsertModelData?: Maybe<DocumentModelType>;
  upsertPlugin?: Maybe<PluginDetailsFields>;
  upsertRoleToProject?: Maybe<Role>;
};


export type MutationQueryAddModelToProjectArgs = {
  name: Scalars['String']['input'];
  single_record?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationQueryCreateWebHookArgs = {
  events: Array<InputMaybe<Scalars['String']['input']>>;
  logic_executions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  model: Scalars['String']['input'];
  name: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryDeleteApiKeyArgs = {
  duration: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationQueryDeleteApiTokenArgs = {
  duration: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationQueryDeleteFunctionFromProjectArgs = {
  function: Scalars['String']['input'];
};


export type MutationQueryDeleteModelDataArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  model_name: Scalars['String']['input'];
};


export type MutationQueryDeleteRoleFromProjectArgs = {
  role: Scalars['String']['input'];
};


export type MutationQueryDeleteWebHookArgs = {
  id: Scalars['String']['input'];
};


export type MutationQueryDuplicateModelDataArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  model_name: Scalars['String']['input'];
};


export type MutationQueryGenerateApiKeyArgs = {
  duration: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationQueryGenerateApiTokenArgs = {
  duration: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role: Scalars['String']['input'];
};


export type MutationQueryGenerateTenantTokenArgs = {
  tenant_id: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationQueryModelFieldOperationArgs = {
  changed_type?: InputMaybe<Scalars['String']['input']>;
  field_name: Scalars['String']['input'];
  is_relation?: InputMaybe<Scalars['Boolean']['input']>;
  known_as?: InputMaybe<Scalars['String']['input']>;
  model_name: Scalars['String']['input'];
  moved_to?: InputMaybe<Scalars['String']['input']>;
  new_name?: InputMaybe<Scalars['String']['input']>;
  parent_field?: InputMaybe<Scalars['String']['input']>;
  single_page_model?: InputMaybe<Scalars['Boolean']['input']>;
  type: Field_Operation_Type_Enum;
};


export type MutationQueryRearrangeSerialOfFieldArgs = {
  field_name: Scalars['String']['input'];
  model_name: Scalars['String']['input'];
  move_type: Scalars['String']['input'];
  new_position: Scalars['Int']['input'];
  parent_id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryRunModelMigrationsArgs = {
  force_recreate?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationQuerySendArgs = {
  message: Scalars['String']['input'];
};


export type MutationQueryUpdateModelArgs = {
  model_name: Scalars['String']['input'];
  new_name?: InputMaybe<Scalars['String']['input']>;
  single_page_model?: InputMaybe<Scalars['Boolean']['input']>;
  type: UpdateModelTypeEnum;
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
  add_team_member?: InputMaybe<AddTeamMemberPayload>;
  description?: InputMaybe<Scalars['String']['input']>;
  driver?: InputMaybe<UpdateProjectDriverDetails>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_secret_key?: InputMaybe<Scalars['String']['input']>;
  remove_team_member?: InputMaybe<RemoveTeamMemberPayload>;
  settings?: InputMaybe<UpdateSettingsPayload>;
  tenant_model_name?: InputMaybe<Scalars['String']['input']>;
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
  serial?: InputMaybe<Scalars['Int']['input']>;
  validation?: InputMaybe<Module_Validation_Payload>;
};


export type MutationQueryUpsertFunctionToProjectArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  env_vars?: InputMaybe<Array<InputMaybe<Function_Provider_Env_Vars_Payload>>>;
  function_connected?: InputMaybe<Scalars['Boolean']['input']>;
  function_exported_variable?: InputMaybe<Scalars['String']['input']>;
  function_path?: InputMaybe<Scalars['String']['input']>;
  function_provider_id?: InputMaybe<Scalars['String']['input']>;
  graphql_schema_type?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  provider_exported_variable?: InputMaybe<Scalars['String']['input']>;
  request?: InputMaybe<Scalars['String']['input']>;
  request_payload_is_optional?: InputMaybe<Scalars['Boolean']['input']>;
  response?: InputMaybe<Scalars['String']['input']>;
  response_is_array?: InputMaybe<Scalars['Boolean']['input']>;
  runtime_config?: InputMaybe<Function_Provider_Config_Payload>;
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


export type MutationQueryUpsertPluginArgs = {
  activate_status?: InputMaybe<Plugin_Activation_Type_Enum>;
  author?: InputMaybe<Scalars['String']['input']>;
  branch?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enable?: InputMaybe<Scalars['Boolean']['input']>;
  env_vars?: InputMaybe<Array<InputMaybe<PluginConfigEnvVarsPayload>>>;
  exported_variable?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  repository_url?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Plugin_Type_Enum>;
  version?: InputMaybe<Scalars['String']['input']>;
};


export type MutationQueryUpsertRoleToProjectArgs = {
  api_permissions?: InputMaybe<Scalars['JSON']['input']>;
  is_admin?: InputMaybe<Scalars['Boolean']['input']>;
  logic_executions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name: Scalars['String']['input'];
};

export type NestedSubFieldInfo = {
  __typename?: 'NestedSubFieldInfo';
  description?: Maybe<Scalars['String']['output']>;
  field_sub_type?: Maybe<Scalars['String']['output']>;
  field_type?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  input_type?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  parent_field?: Maybe<Scalars['String']['output']>;
  serial?: Maybe<Scalars['Int']['output']>;
  system_generated?: Maybe<Scalars['Boolean']['output']>;
  validation?: Maybe<Validation>;
};

export type Organization = {
  __typename?: 'Organization';
  _key?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  teams?: Maybe<Array<Maybe<OrganizationTeam>>>;
  users?: Maybe<Array<Maybe<OrganizationSystemUserInfo>>>;
};

export type OrganizationSystemUserInfo = {
  __typename?: 'OrganizationSystemUserInfo';
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

export type OrganizationTeam = {
  __typename?: 'OrganizationTeam';
  _key?: Maybe<Scalars['String']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  users?: Maybe<Array<Maybe<OrganizationTeamSystemUserInfo>>>;
};

export type OrganizationTeamSystemUserInfo = {
  __typename?: 'OrganizationTeamSystemUserInfo';
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

export type OrganizationsWhereFilterArgObject = {
  name?: InputMaybe<CommonFilter>;
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
  /** Function Type Plugin */
  Project = 'project',
  /** Extension Type Plugin */
  System = 'system'
}

export type PluginConfigEnvVarsPayload = {
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type PluginDetailsFields = {
  __typename?: 'PluginDetailsFields';
  activate_status?: Maybe<Plugin_Activation_Type_Enum>;
  author?: Maybe<Scalars['String']['output']>;
  branch?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enable?: Maybe<Scalars['Boolean']['output']>;
  env_vars?: Maybe<Array<Maybe<EnvVariable>>>;
  exported_variable?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  load_status?: Maybe<Plugin_Load_Type_Enum>;
  repository_url?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Plugin_Type_Enum>;
  version?: Maybe<Scalars['String']['output']>;
};

export type PluginsWhereFilterArgObject = {
  name?: InputMaybe<CommonFilter>;
};

export type ProjectModel = {
  __typename?: 'ProjectModel';
  _key?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  default_function_plugin?: Maybe<Scalars['String']['output']>;
  default_storage_plugin?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  driver?: Maybe<DriverCredentials>;
  expire_at?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  per_tenant_separate_database?: Maybe<Scalars['Boolean']['output']>;
  plugins?: Maybe<Array<Maybe<PluginDetailsFields>>>;
  project_plan?: Maybe<Scalars['String']['output']>;
  project_secret_key?: Maybe<Scalars['String']['output']>;
  project_template?: Maybe<Scalars['String']['output']>;
  project_type?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Scalars['JSON']['output']>;
  schema?: Maybe<UserDefinedSchema>;
  settings?: Maybe<ProjectSettings>;
  system_messages?: Maybe<Array<Maybe<SystemMessage>>>;
  teams?: Maybe<Array<Maybe<SystemUserInfo>>>;
  tenant_model_name?: Maybe<Scalars['String']['output']>;
  tokens?: Maybe<Array<Maybe<ApiToken>>>;
  trial_ends?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['String']['output']>;
  workspaces?: Maybe<Array<Maybe<Workspace>>>;
};

export type ProjectSettings = {
  __typename?: 'ProjectSettings';
  default_function_plugin?: Maybe<Scalars['String']['output']>;
  default_locale?: Maybe<Scalars['String']['output']>;
  default_storage_plugin?: Maybe<Scalars['String']['output']>;
  enable_revision_history?: Maybe<Scalars['Boolean']['output']>;
  locals?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  project_id?: Maybe<Scalars['String']['output']>;
  system_graphql_hooks?: Maybe<Scalars['Boolean']['output']>;
};

export type ProjectTenantsResponse = {
  __typename?: 'ProjectTenantsResponse';
  id?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ProjectWhereFilterArgObject = {
  created_at?: InputMaybe<DateFilterFilter>;
  id?: InputMaybe<CommonFilter>;
  name?: InputMaybe<CommonFilter>;
  updated_at?: InputMaybe<CommonFilter>;
};

export type QueryType = {
  __typename?: 'QueryType';
  auditLogs?: Maybe<Array<Maybe<AuditLogInfo>>>;
  connectSupport?: Maybe<ConnectSupportResponse>;
  currentProject?: Maybe<ProjectModel>;
  getModelData?: Maybe<GetModelDataResponse>;
  getPlugins?: Maybe<Array<Maybe<PluginDetailsFields>>>;
  getProject?: Maybe<ProjectModel>;
  getSingleData?: Maybe<DocumentModelType>;
  getTenants?: Maybe<Array<Maybe<ProjectTenantsResponse>>>;
  getUser?: Maybe<SystemUserInfo>;
  listAvailableFunctions?: Maybe<ListAvailableFunctionsResponse>;
  listExecutableFunctions?: Maybe<ListExecutableFunctionsResponse>;
  listPermissionsAndScopes?: Maybe<ListPermissionsAndScopesResponse>;
  listPluginIds?: Maybe<ListPluginIDsResponse>;
  listProjects?: Maybe<Array<Maybe<ProjectModel>>>;
  listSingleModelRevisionData?: Maybe<Array<Maybe<RevisionHistoryResponse>>>;
  listWebHooks?: Maybe<Array<Maybe<Webhook>>>;
  organizations?: Maybe<Array<Maybe<Organization>>>;
  projectFunctionsInfo?: Maybe<Array<Maybe<CloudFunctionType>>>;
  projectModelsInfo?: Maybe<Array<Maybe<ModelType>>>;
  searchUsers?: Maybe<Array<Maybe<SystemUserInfo>>>;
  teamMembers?: Maybe<Array<Maybe<SystemUserInfo>>>;
  teams?: Maybe<Array<Maybe<Team>>>;
};


export type QueryTypeAuditLogsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterArgumentObject>;
  where?: InputMaybe<AuditWhereFilterArgObject>;
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


export type QueryTypeGetPluginsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterArgumentObject>;
  where?: InputMaybe<PluginsWhereFilterArgObject>;
};


export type QueryTypeGetProjectArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeGetSingleDataArgs = {
  _id: Scalars['String']['input'];
  local?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  revision?: InputMaybe<Scalars['Boolean']['input']>;
  single_page_data?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryTypeGetUserArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeListAvailableFunctionsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  function_id: Scalars['String']['input'];
};


export type QueryTypeListExecutableFunctionsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  model_name?: InputMaybe<Scalars['String']['input']>;
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


export type QueryTypeListWebHooksArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeOrganizationsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterArgumentObject>;
  where?: InputMaybe<OrganizationsWhereFilterArgObject>;
};


export type QueryTypeProjectFunctionsInfoArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeProjectModelsInfoArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  model_name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTypeSearchUsersArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterArgumentObject>;
  where?: InputMaybe<SearchUsersWhereFilterArgObject>;
};


export type QueryTypeTeamMembersArgs = {
  filter?: InputMaybe<FilterArgumentObject>;
  organization_id?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TeamMembersWhereFilterArgObject>;
};


export type QueryTypeTeamsArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterArgumentObject>;
  where?: InputMaybe<TeamsWhereFilterArgObject>;
};

export enum Relation_Type_Enum {
  /** Has Many Relations */
  HasMany = 'has_many',
  /** One to One Relation */
  HasOne = 'has_one'
}

export type RemoveTeamMemberPayload = {
  member_id: Scalars['String']['input'];
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

export type SearchUsersWhereFilterArgObject = {
  email?: InputMaybe<CommonFilter>;
  first_name?: InputMaybe<CommonFilter>;
  last_name?: InputMaybe<CommonFilter>;
  organization_id?: InputMaybe<CommonFilter>;
  username?: InputMaybe<CommonFilter>;
};

export type SendMutationResponse = {
  __typename?: 'SendMutationResponse';
  message?: Maybe<Scalars['String']['output']>;
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
  serial?: Maybe<Scalars['Int']['output']>;
  sub_field_info?: Maybe<Array<Maybe<NestedSubFieldInfo>>>;
  system_generated?: Maybe<Scalars['Boolean']['output']>;
  validation?: Maybe<Validation>;
};

export type SystemMessage = {
  __typename?: 'SystemMessage';
  _key?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  hide?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  redirection?: Maybe<Scalars['String']['output']>;
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

export type Team = {
  __typename?: 'Team';
  _key?: Maybe<Scalars['String']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  users?: Maybe<Array<Maybe<TeamSystemUserInfo>>>;
};

export type TeamMembersWhereFilterArgObject = {
  email?: InputMaybe<CommonFilter>;
  first_name?: InputMaybe<CommonFilter>;
  last_name?: InputMaybe<CommonFilter>;
  organization_id?: InputMaybe<CommonFilter>;
  username?: InputMaybe<CommonFilter>;
};

export type TeamSystemUserInfo = {
  __typename?: 'TeamSystemUserInfo';
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

export type TeamsWhereFilterArgObject = {
  name?: InputMaybe<CommonFilter>;
};

export enum UpdateModelTypeEnum {
  Convert = 'convert',
  Delete = 'delete',
  Duplicate = 'duplicate',
  Rename = 'rename'
}

export type UpdateProjectDriverDetails = {
  access_key: Array<InputMaybe<Scalars['String']['input']>>;
  db: Array<InputMaybe<Scalars['String']['input']>>;
  host: Scalars['String']['input'];
  password: Array<InputMaybe<Scalars['String']['input']>>;
  port: Scalars['String']['input'];
  secret_key: Array<InputMaybe<Scalars['String']['input']>>;
  user: Array<InputMaybe<Scalars['String']['input']>>;
};

export type UpdateSettingsPayload = {
  default_function_plugin?: InputMaybe<Scalars['String']['input']>;
  default_locale?: InputMaybe<Scalars['String']['input']>;
  default_storage_plugin?: InputMaybe<Scalars['String']['input']>;
  enable_revision_history?: InputMaybe<Scalars['Boolean']['input']>;
  locals?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  system_graphql_hooks?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserDefinedSchema = {
  __typename?: 'UserDefinedSchema';
  functions?: Maybe<Array<Maybe<CloudFunctionType>>>;
  models?: Maybe<Array<Maybe<ModelType>>>;
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

export type GenerateApiKeyMutationVariables = Exact<{
  name: Scalars['String']['input'];
  duration: Scalars['String']['input'];
  role: Scalars['String']['input'];
}>;


export type GenerateApiKeyMutation = { __typename?: 'MutationQuery', generateApiToken?: { __typename?: 'GenerateApiTokenResponse', token?: string | null } | null };

export type DeleteApiCredentialMutationVariables = Exact<{
  duration: Scalars['String']['input'];
  token: Scalars['String']['input'];
}>;


export type DeleteApiCredentialMutation = { __typename?: 'MutationQuery', deleteApiToken?: { __typename?: 'DeleteApiTokenResponse', msg?: string | null } | null };

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
}>;


export type UpsertFunctionToProjectMutation = { __typename?: 'MutationQuery', upsertFunctionToProject?: { __typename?: 'CloudFunctionType', name?: string | null, description?: string | null, graphql_schema_type?: string | null, created_at?: string | null, updated_at?: string | null, function_connected?: boolean | null, provider_exported_variable?: string | null, function_exported_variable?: string | null, function_provider_id?: string | null, request?: { __typename?: 'CloudFunctionRequestResponse', model?: string | null, optional_payload?: boolean | null } | null, response?: { __typename?: 'CloudFunctionRequestResponse', model?: string | null, is_array?: boolean | null } | null, runtime_config?: { __typename?: 'ApitoFunctionRuntimeConfig', handler?: string | null, memory?: number | null, runtime?: string | null, time_out?: number | null } | null, env_vars?: Array<{ __typename?: 'EnvVariable', key?: string | null, value?: string | null } | null> | null } | null };

export type DeleteFunctionFromProjectMutationVariables = Exact<{
  function: Scalars['String']['input'];
}>;


export type DeleteFunctionFromProjectMutation = { __typename?: 'MutationQuery', deleteFunctionFromProject?: Array<{ __typename?: 'CloudFunctionType', id?: string | null, name?: string | null } | null> | null };

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
}>;


export type UpsertFieldToModelMutation = { __typename?: 'MutationQuery', upsertFieldToModel?: { __typename?: 'FieldInfo', serial?: number | null, identifier?: string | null, label?: string | null, input_type?: string | null, field_type?: string | null, field_sub_type?: string | null, description?: string | null, parent_field?: string | null, system_generated?: boolean | null, validation?: { __typename?: 'Validation', required?: boolean | null, locals?: Array<string | null> | null, is_multi_choice?: boolean | null, int_range_limit?: Array<number | null> | null, hide?: boolean | null, fixed_list_elements?: any[] | null, fixed_list_element_type?: string | null, double_range_limit?: Array<number | null> | null, char_limit?: Array<number | null> | null, as_title?: boolean | null, is_email?: boolean | null, unique?: boolean | null, placeholder?: string | null, is_gallery?: boolean | null } | null } | null };

export type CreateModelMutationVariables = Exact<{
  name: Scalars['String']['input'];
  single_record?: InputMaybe<Scalars['Boolean']['input']>;
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

export type ModelFieldOperationMutationVariables = Exact<{
  type: Field_Operation_Type_Enum;
  model_name: Scalars['String']['input'];
  field_name: Scalars['String']['input'];
  new_name?: InputMaybe<Scalars['String']['input']>;
  parent_field?: InputMaybe<Scalars['String']['input']>;
  single_page_model?: InputMaybe<Scalars['Boolean']['input']>;
  is_relation?: InputMaybe<Scalars['Boolean']['input']>;
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

export type UpsertPluginDetailsMutationVariables = Exact<{
  id: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Plugin_Type_Enum>;
  role?: InputMaybe<Scalars['String']['input']>;
  exported_variable?: InputMaybe<Scalars['String']['input']>;
  env_vars?: InputMaybe<Array<InputMaybe<PluginConfigEnvVarsPayload>> | InputMaybe<PluginConfigEnvVarsPayload>>;
  enable?: InputMaybe<Scalars['Boolean']['input']>;
  repository_url?: InputMaybe<Scalars['String']['input']>;
  branch?: InputMaybe<Scalars['String']['input']>;
  author?: InputMaybe<Scalars['String']['input']>;
  activate_status?: InputMaybe<Plugin_Activation_Type_Enum>;
}>;


export type UpsertPluginDetailsMutation = { __typename?: 'MutationQuery', upsertPlugin?: { __typename?: 'PluginDetailsFields', author?: string | null, branch?: string | null, description?: string | null, enable?: boolean | null, exported_variable?: string | null, icon?: string | null, id?: string | null, load_status?: Plugin_Load_Type_Enum | null, activate_status?: Plugin_Activation_Type_Enum | null, repository_url?: string | null, role?: string | null, title?: string | null, type?: Plugin_Type_Enum | null, version?: string | null, env_vars?: Array<{ __typename?: 'EnvVariable', key?: string | null, value?: string | null } | null> | null } | null };

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


export type UpdateProjectMutation = { __typename?: 'MutationQuery', updateProject?: { __typename?: 'ProjectModel', driver?: { __typename?: 'DriverCredentials', engine?: string | null, database?: string | null, host?: string | null, port?: string | null, firebase_project_credential_json?: string | null, firebase_project_id?: string | null, password?: string | null, user?: string | null } | null } | null };

export type UpsertRoleToProjectMutationVariables = Exact<{
  name: Scalars['String']['input'];
  is_admin?: InputMaybe<Scalars['Boolean']['input']>;
  logic_executions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  api_permissions?: InputMaybe<Scalars['JSON']['input']>;
}>;


export type UpsertRoleToProjectMutation = { __typename?: 'MutationQuery', upsertRoleToProject?: { __typename?: 'Role', administrative_permissions?: Array<string | null> | null, api_permissions?: { [key: string]: any } | null, is_admin?: boolean | null, logic_executions?: Array<string | null> | null, system_generated?: boolean | null } | null };

export type UpdateSettingGeneralMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateSettingGeneralMutation = { __typename?: 'MutationQuery', updateProject?: { __typename?: 'ProjectModel', _key?: string | null, id?: string | null, name?: string | null, description?: string | null } | null };

export type UpdateSettingTeamsMutationVariables = Exact<{
  add_team_member?: InputMaybe<AddTeamMemberPayload>;
  remove_team_member?: InputMaybe<RemoveTeamMemberPayload>;
}>;


export type UpdateSettingTeamsMutation = { __typename?: 'MutationQuery', updateProject?: { __typename?: 'ProjectModel', _key?: string | null, id?: string | null } | null };

export type UpdateSettingsMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<UpdateSettingsPayload>;
  tenant_model_name?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateSettingsMutation = { __typename?: 'MutationQuery', updateProject?: { __typename?: 'ProjectModel', _key?: string | null, id?: string | null, name?: string | null, description?: string | null, project_secret_key?: string | null, tenant_model_name?: string | null, settings?: { __typename?: 'ProjectSettings', locals?: Array<string | null> | null, system_graphql_hooks?: boolean | null, enable_revision_history?: boolean | null, default_storage_plugin?: string | null, default_function_plugin?: string | null, default_locale?: string | null } | null } | null };

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


export type GetAllFunctionInfoQuery = { __typename?: 'QueryType', projectFunctionsInfo?: Array<{ __typename?: 'CloudFunctionType', name?: string | null, description?: string | null, graphql_schema_type?: string | null, created_at?: string | null, updated_at?: string | null, function_connected?: boolean | null, function_provider_id?: string | null, rest_api_secret_url_key?: string | null, request?: { __typename?: 'CloudFunctionRequestResponse', model?: string | null, optional_payload?: boolean | null } | null, response?: { __typename?: 'CloudFunctionRequestResponse', model?: string | null, is_array?: boolean | null } | null, runtime_config?: { __typename?: 'ApitoFunctionRuntimeConfig', handler?: string | null, memory?: number | null, runtime?: string | null, time_out?: number | null } | null, env_vars?: Array<{ __typename?: 'EnvVariable', key?: string | null, value?: string | null } | null> | null } | null> | null };

export type GetOnlyModelsInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOnlyModelsInfoQuery = { __typename?: 'QueryType', projectModelsInfo?: Array<{ __typename?: 'ModelType', name?: string | null, single_page?: boolean | null, single_page_uuid?: string | null, system_generated?: boolean | null, has_connections?: boolean | null, is_tenant_model?: boolean | null, enable_revision?: boolean | null, revision_filter?: Array<{ __typename?: 'RevisionFilter', key?: string | null, value?: string | null } | null> | null } | null> | null };

export type GetModelDetailsQueryVariables = Exact<{
  model_name?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetModelDetailsQuery = { __typename?: 'QueryType', projectModelsInfo?: Array<{ __typename?: 'ModelType', name?: string | null, locals?: Array<string | null> | null, single_page?: boolean | null, single_page_uuid?: string | null, system_generated?: boolean | null, fields?: Array<{ __typename?: 'FieldInfo', serial?: number | null, identifier?: string | null, label?: string | null, input_type?: string | null, field_type?: string | null, field_sub_type?: string | null, description?: string | null, system_generated?: boolean | null, sub_field_info?: Array<{ __typename?: 'SubFieldInfo', description?: string | null, field_type?: string | null, field_sub_type?: string | null, identifier?: string | null, input_type?: string | null, label?: string | null, serial?: number | null, system_generated?: boolean | null, parent_field?: string | null, validation?: { __typename?: 'Validation', as_title?: boolean | null, char_limit?: Array<number | null> | null, double_range_limit?: Array<number | null> | null, fixed_list_elements?: any[] | null, fixed_list_element_type?: string | null, hide?: boolean | null, is_email?: boolean | null, is_gallery?: boolean | null, is_multi_choice?: boolean | null, int_range_limit?: Array<number | null> | null, locals?: Array<string | null> | null, placeholder?: string | null, required?: boolean | null, unique?: boolean | null } | null, sub_field_info?: Array<{ __typename?: 'NestedSubFieldInfo', description?: string | null, field_type?: string | null, field_sub_type?: string | null, identifier?: string | null, input_type?: string | null, label?: string | null, serial?: number | null, system_generated?: boolean | null, parent_field?: string | null, validation?: { __typename?: 'Validation', as_title?: boolean | null, char_limit?: Array<number | null> | null, double_range_limit?: Array<number | null> | null, fixed_list_elements?: any[] | null, fixed_list_element_type?: string | null, hide?: boolean | null, is_email?: boolean | null, is_gallery?: boolean | null, is_multi_choice?: boolean | null, int_range_limit?: Array<number | null> | null, locals?: Array<string | null> | null, placeholder?: string | null, required?: boolean | null, unique?: boolean | null } | null } | null> | null } | null> | null, validation?: { __typename?: 'Validation', required?: boolean | null, locals?: Array<string | null> | null, is_multi_choice?: boolean | null, int_range_limit?: Array<number | null> | null, hide?: boolean | null, fixed_list_elements?: any[] | null, fixed_list_element_type?: string | null, double_range_limit?: Array<number | null> | null, char_limit?: Array<number | null> | null, as_title?: boolean | null, is_email?: boolean | null, unique?: boolean | null, placeholder?: string | null, is_gallery?: boolean | null, is_password?: boolean | null } | null } | null> | null, connections?: Array<{ __typename?: 'ConnectionType', model?: string | null, relation?: string | null, type?: string | null, known_as?: string | null } | null> | null } | null> | null };

export type GetPluginsQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  project_id?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPluginsQuery = { __typename?: 'QueryType', getPlugins?: Array<{ __typename?: 'PluginDetailsFields', type?: Plugin_Type_Enum | null, role?: string | null, id?: string | null, icon?: string | null, title?: string | null, version?: string | null, exported_variable?: string | null, enable?: boolean | null, description?: string | null, load_status?: Plugin_Load_Type_Enum | null, activate_status?: Plugin_Activation_Type_Enum | null, repository_url?: string | null, branch?: string | null, author?: string | null, env_vars?: Array<{ __typename?: 'EnvVariable', key?: string | null, value?: string | null } | null> | null } | null> | null };

export type ListPluginIdsQueryVariables = Exact<{
  type: Plugin_Type_Enum;
}>;


export type ListPluginIdsQuery = { __typename?: 'QueryType', listPluginIds?: { __typename?: 'ListPluginIDsResponse', type: Plugin_Type_Enum, plugins?: Array<string | null> | null } | null };

export type GetTenantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTenantsQuery = { __typename?: 'QueryType', getTenants?: Array<{ __typename?: 'ProjectTenantsResponse', name?: string | null, logo?: string | null, id?: string | null } | null> | null };

export type GetCurrentProjectQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentProjectQuery = { __typename?: 'QueryType', currentProject?: { __typename?: 'ProjectModel', id?: string | null, _key?: string | null, name?: string | null, description?: string | null, trial_ends?: string | null, project_plan?: string | null, project_type?: string | null, default_storage_plugin?: string | null, default_function_plugin?: string | null, workspaces?: Array<{ __typename?: 'Workspace', active?: boolean | null, is_default?: boolean | null, is_production?: boolean | null, name?: string | null } | null> | null, system_messages?: Array<{ __typename?: 'SystemMessage', redirection?: string | null, message?: string | null, hide?: boolean | null, code?: string | null } | null> | null } | null };

export type GetCurrentProjectTokensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentProjectTokensQuery = { __typename?: 'QueryType', currentProject?: { __typename?: 'ProjectModel', id?: string | null, _key?: string | null, name?: string | null, project_secret_key?: string | null, tokens?: Array<{ __typename?: 'APIToken', name?: string | null, token?: string | null, role?: string | null, expire?: string | null } | null> | null } | null };

export type GetProjectDriverInfoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetProjectDriverInfoQuery = { __typename?: 'QueryType', getProject?: { __typename?: 'ProjectModel', driver?: { __typename?: 'DriverCredentials', access_key?: string | null, database?: string | null, engine?: string | null, host?: string | null, password?: string | null, port?: string | null, project_id?: string | null, secret_key?: string | null, user?: string | null } | null } | null };

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

export type SearchUsersQueryVariables = Exact<{
  project_id?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  organization_id?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchUsersQuery = { __typename?: 'QueryType', searchUsers?: Array<{ __typename?: 'SystemUserInfo', id?: string | null, avatar?: string | null, email?: string | null, first_name?: string | null, last_name?: string | null, role?: string | null } | null> | null };

export type GetPermissionsAndScopesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPermissionsAndScopesQuery = { __typename?: 'QueryType', listPermissionsAndScopes?: { __typename?: 'ListPermissionsAndScopesResponse', permissions?: Array<string | null> | null, models?: Array<string | null> | null, functions?: Array<string | null> | null } | null };

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = { __typename?: 'QueryType', currentProject?: { __typename?: 'ProjectModel', id?: string | null, name?: string | null, description?: string | null, roles?: { [key: string]: any } | null, tenant_model_name?: string | null, project_secret_key?: string | null, created_at?: string | null, settings?: { __typename?: 'ProjectSettings', locals?: Array<string | null> | null, enable_revision_history?: boolean | null, system_graphql_hooks?: boolean | null, default_storage_plugin?: string | null, default_function_plugin?: string | null, default_locale?: string | null } | null } | null };


export const GenerateApiKeyDocument = gql`
    mutation generateApiKey($name: String!, $duration: String!, $role: String!) {
  generateApiToken(name: $name, duration: $duration, role: $role) {
    token
  }
}
    `;
export type GenerateApiKeyMutationFn = Apollo.MutationFunction<GenerateApiKeyMutation, GenerateApiKeyMutationVariables>;

/**
 * __useGenerateApiKeyMutation__
 *
 * To run a mutation, you first call `useGenerateApiKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateApiKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateApiKeyMutation, { data, loading, error }] = useGenerateApiKeyMutation({
 *   variables: {
 *      name: // value for 'name'
 *      duration: // value for 'duration'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useGenerateApiKeyMutation(baseOptions?: Apollo.MutationHookOptions<GenerateApiKeyMutation, GenerateApiKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateApiKeyMutation, GenerateApiKeyMutationVariables>(GenerateApiKeyDocument, options);
      }
export type GenerateApiKeyMutationHookResult = ReturnType<typeof useGenerateApiKeyMutation>;
export type GenerateApiKeyMutationResult = Apollo.MutationResult<GenerateApiKeyMutation>;
export type GenerateApiKeyMutationOptions = Apollo.BaseMutationOptions<GenerateApiKeyMutation, GenerateApiKeyMutationVariables>;
export const DeleteApiCredentialDocument = gql`
    mutation deleteApiCredential($duration: String!, $token: String!) {
  deleteApiToken(duration: $duration, token: $token) {
    msg
  }
}
    `;
export type DeleteApiCredentialMutationFn = Apollo.MutationFunction<DeleteApiCredentialMutation, DeleteApiCredentialMutationVariables>;

/**
 * __useDeleteApiCredentialMutation__
 *
 * To run a mutation, you first call `useDeleteApiCredentialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteApiCredentialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteApiCredentialMutation, { data, loading, error }] = useDeleteApiCredentialMutation({
 *   variables: {
 *      duration: // value for 'duration'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useDeleteApiCredentialMutation(baseOptions?: Apollo.MutationHookOptions<DeleteApiCredentialMutation, DeleteApiCredentialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteApiCredentialMutation, DeleteApiCredentialMutationVariables>(DeleteApiCredentialDocument, options);
      }
export type DeleteApiCredentialMutationHookResult = ReturnType<typeof useDeleteApiCredentialMutation>;
export type DeleteApiCredentialMutationResult = Apollo.MutationResult<DeleteApiCredentialMutation>;
export type DeleteApiCredentialMutationOptions = Apollo.BaseMutationOptions<DeleteApiCredentialMutation, DeleteApiCredentialMutationVariables>;
export const UpsertFunctionToProjectDocument = gql`
    mutation upsertFunctionToProject($name: String!, $description: String, $function_connected: Boolean, $function_provider_id: String, $provider_exported_variable: String, $function_exported_variable: String, $graphql_schema_type: String, $function_path: String, $runtime_config: Function_Provider_Config_Payload, $env_vars: [Function_Provider_Env_Vars_Payload], $request: String, $request_payload_is_optional: Boolean, $response: String, $response_is_array: Boolean, $update: Boolean) {
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
  ) {
    name
    description
    graphql_schema_type
    created_at
    updated_at
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
  }
}
    `;
export type UpsertFunctionToProjectMutationFn = Apollo.MutationFunction<UpsertFunctionToProjectMutation, UpsertFunctionToProjectMutationVariables>;

/**
 * __useUpsertFunctionToProjectMutation__
 *
 * To run a mutation, you first call `useUpsertFunctionToProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertFunctionToProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertFunctionToProjectMutation, { data, loading, error }] = useUpsertFunctionToProjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      function_connected: // value for 'function_connected'
 *      function_provider_id: // value for 'function_provider_id'
 *      provider_exported_variable: // value for 'provider_exported_variable'
 *      function_exported_variable: // value for 'function_exported_variable'
 *      graphql_schema_type: // value for 'graphql_schema_type'
 *      function_path: // value for 'function_path'
 *      runtime_config: // value for 'runtime_config'
 *      env_vars: // value for 'env_vars'
 *      request: // value for 'request'
 *      request_payload_is_optional: // value for 'request_payload_is_optional'
 *      response: // value for 'response'
 *      response_is_array: // value for 'response_is_array'
 *      update: // value for 'update'
 *   },
 * });
 */
export function useUpsertFunctionToProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpsertFunctionToProjectMutation, UpsertFunctionToProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertFunctionToProjectMutation, UpsertFunctionToProjectMutationVariables>(UpsertFunctionToProjectDocument, options);
      }
export type UpsertFunctionToProjectMutationHookResult = ReturnType<typeof useUpsertFunctionToProjectMutation>;
export type UpsertFunctionToProjectMutationResult = Apollo.MutationResult<UpsertFunctionToProjectMutation>;
export type UpsertFunctionToProjectMutationOptions = Apollo.BaseMutationOptions<UpsertFunctionToProjectMutation, UpsertFunctionToProjectMutationVariables>;
export const DeleteFunctionFromProjectDocument = gql`
    mutation deleteFunctionFromProject($function: String!) {
  deleteFunctionFromProject(function: $function) {
    id
    name
  }
}
    `;
export type DeleteFunctionFromProjectMutationFn = Apollo.MutationFunction<DeleteFunctionFromProjectMutation, DeleteFunctionFromProjectMutationVariables>;

/**
 * __useDeleteFunctionFromProjectMutation__
 *
 * To run a mutation, you first call `useDeleteFunctionFromProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFunctionFromProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFunctionFromProjectMutation, { data, loading, error }] = useDeleteFunctionFromProjectMutation({
 *   variables: {
 *      function: // value for 'function'
 *   },
 * });
 */
export function useDeleteFunctionFromProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFunctionFromProjectMutation, DeleteFunctionFromProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFunctionFromProjectMutation, DeleteFunctionFromProjectMutationVariables>(DeleteFunctionFromProjectDocument, options);
      }
export type DeleteFunctionFromProjectMutationHookResult = ReturnType<typeof useDeleteFunctionFromProjectMutation>;
export type DeleteFunctionFromProjectMutationResult = Apollo.MutationResult<DeleteFunctionFromProjectMutation>;
export type DeleteFunctionFromProjectMutationOptions = Apollo.BaseMutationOptions<DeleteFunctionFromProjectMutation, DeleteFunctionFromProjectMutationVariables>;
export const UpsertFieldToModelDocument = gql`
    mutation upsertFieldToModel($model_name: String!, $field_label: String!, $field_type: FIELD_TYPE_ENUM, $field_sub_type: FIELD_SUB_TYPE_ENUM, $field_description: String, $input_type: INPUT_TYPE_ENUM, $serial: Int, $validation: module_validation_payload, $parent_field: String, $is_update: Boolean) {
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
    `;
export type UpsertFieldToModelMutationFn = Apollo.MutationFunction<UpsertFieldToModelMutation, UpsertFieldToModelMutationVariables>;

/**
 * __useUpsertFieldToModelMutation__
 *
 * To run a mutation, you first call `useUpsertFieldToModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertFieldToModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertFieldToModelMutation, { data, loading, error }] = useUpsertFieldToModelMutation({
 *   variables: {
 *      model_name: // value for 'model_name'
 *      field_label: // value for 'field_label'
 *      field_type: // value for 'field_type'
 *      field_sub_type: // value for 'field_sub_type'
 *      field_description: // value for 'field_description'
 *      input_type: // value for 'input_type'
 *      serial: // value for 'serial'
 *      validation: // value for 'validation'
 *      parent_field: // value for 'parent_field'
 *      is_update: // value for 'is_update'
 *   },
 * });
 */
export function useUpsertFieldToModelMutation(baseOptions?: Apollo.MutationHookOptions<UpsertFieldToModelMutation, UpsertFieldToModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertFieldToModelMutation, UpsertFieldToModelMutationVariables>(UpsertFieldToModelDocument, options);
      }
export type UpsertFieldToModelMutationHookResult = ReturnType<typeof useUpsertFieldToModelMutation>;
export type UpsertFieldToModelMutationResult = Apollo.MutationResult<UpsertFieldToModelMutation>;
export type UpsertFieldToModelMutationOptions = Apollo.BaseMutationOptions<UpsertFieldToModelMutation, UpsertFieldToModelMutationVariables>;
export const CreateModelDocument = gql`
    mutation createModel($name: String!, $single_record: Boolean) {
  addModelToProject(name: $name, single_record: $single_record) {
    name
  }
}
    `;
export type CreateModelMutationFn = Apollo.MutationFunction<CreateModelMutation, CreateModelMutationVariables>;

/**
 * __useCreateModelMutation__
 *
 * To run a mutation, you first call `useCreateModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createModelMutation, { data, loading, error }] = useCreateModelMutation({
 *   variables: {
 *      name: // value for 'name'
 *      single_record: // value for 'single_record'
 *   },
 * });
 */
export function useCreateModelMutation(baseOptions?: Apollo.MutationHookOptions<CreateModelMutation, CreateModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateModelMutation, CreateModelMutationVariables>(CreateModelDocument, options);
      }
export type CreateModelMutationHookResult = ReturnType<typeof useCreateModelMutation>;
export type CreateModelMutationResult = Apollo.MutationResult<CreateModelMutation>;
export type CreateModelMutationOptions = Apollo.BaseMutationOptions<CreateModelMutation, CreateModelMutationVariables>;
export const UpdateModelDocument = gql`
    mutation updateModel($type: UpdateModelTypeEnum!, $new_name: String, $model_name: String!) {
  updateModel(type: $type, new_name: $new_name, model_name: $model_name) {
    name
  }
}
    `;
export type UpdateModelMutationFn = Apollo.MutationFunction<UpdateModelMutation, UpdateModelMutationVariables>;

/**
 * __useUpdateModelMutation__
 *
 * To run a mutation, you first call `useUpdateModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateModelMutation, { data, loading, error }] = useUpdateModelMutation({
 *   variables: {
 *      type: // value for 'type'
 *      new_name: // value for 'new_name'
 *      model_name: // value for 'model_name'
 *   },
 * });
 */
export function useUpdateModelMutation(baseOptions?: Apollo.MutationHookOptions<UpdateModelMutation, UpdateModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateModelMutation, UpdateModelMutationVariables>(UpdateModelDocument, options);
      }
export type UpdateModelMutationHookResult = ReturnType<typeof useUpdateModelMutation>;
export type UpdateModelMutationResult = Apollo.MutationResult<UpdateModelMutation>;
export type UpdateModelMutationOptions = Apollo.BaseMutationOptions<UpdateModelMutation, UpdateModelMutationVariables>;
export const UpdateModelRelationDocument = gql`
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
    `;
export type UpdateModelRelationMutationFn = Apollo.MutationFunction<UpdateModelRelationMutation, UpdateModelRelationMutationVariables>;

/**
 * __useUpdateModelRelationMutation__
 *
 * To run a mutation, you first call `useUpdateModelRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateModelRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateModelRelationMutation, { data, loading, error }] = useUpdateModelRelationMutation({
 *   variables: {
 *      forward_connection_type: // value for 'forward_connection_type'
 *      from: // value for 'from'
 *      reverse_connection_type: // value for 'reverse_connection_type'
 *      to: // value for 'to'
 *      known_as: // value for 'known_as'
 *   },
 * });
 */
export function useUpdateModelRelationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateModelRelationMutation, UpdateModelRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateModelRelationMutation, UpdateModelRelationMutationVariables>(UpdateModelRelationDocument, options);
      }
export type UpdateModelRelationMutationHookResult = ReturnType<typeof useUpdateModelRelationMutation>;
export type UpdateModelRelationMutationResult = Apollo.MutationResult<UpdateModelRelationMutation>;
export type UpdateModelRelationMutationOptions = Apollo.BaseMutationOptions<UpdateModelRelationMutation, UpdateModelRelationMutationVariables>;
export const ModelFieldOperationDocument = gql`
    mutation modelFieldOperation($type: FIELD_OPERATION_TYPE_ENUM!, $model_name: String!, $field_name: String!, $new_name: String, $parent_field: String, $single_page_model: Boolean, $is_relation: Boolean, $known_as: String, $moved_to: String, $changed_type: String) {
  modelFieldOperation(
    type: $type
    model_name: $model_name
    new_name: $new_name
    field_name: $field_name
    parent_field: $parent_field
    single_page_model: $single_page_model
    is_relation: $is_relation
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
    `;
export type ModelFieldOperationMutationFn = Apollo.MutationFunction<ModelFieldOperationMutation, ModelFieldOperationMutationVariables>;

/**
 * __useModelFieldOperationMutation__
 *
 * To run a mutation, you first call `useModelFieldOperationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useModelFieldOperationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [modelFieldOperationMutation, { data, loading, error }] = useModelFieldOperationMutation({
 *   variables: {
 *      type: // value for 'type'
 *      model_name: // value for 'model_name'
 *      field_name: // value for 'field_name'
 *      new_name: // value for 'new_name'
 *      parent_field: // value for 'parent_field'
 *      single_page_model: // value for 'single_page_model'
 *      is_relation: // value for 'is_relation'
 *      known_as: // value for 'known_as'
 *      moved_to: // value for 'moved_to'
 *      changed_type: // value for 'changed_type'
 *   },
 * });
 */
export function useModelFieldOperationMutation(baseOptions?: Apollo.MutationHookOptions<ModelFieldOperationMutation, ModelFieldOperationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ModelFieldOperationMutation, ModelFieldOperationMutationVariables>(ModelFieldOperationDocument, options);
      }
export type ModelFieldOperationMutationHookResult = ReturnType<typeof useModelFieldOperationMutation>;
export type ModelFieldOperationMutationResult = Apollo.MutationResult<ModelFieldOperationMutation>;
export type ModelFieldOperationMutationOptions = Apollo.BaseMutationOptions<ModelFieldOperationMutation, ModelFieldOperationMutationVariables>;
export const RearrangeFieldSerialDocument = gql`
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
    `;
export type RearrangeFieldSerialMutationFn = Apollo.MutationFunction<RearrangeFieldSerialMutation, RearrangeFieldSerialMutationVariables>;

/**
 * __useRearrangeFieldSerialMutation__
 *
 * To run a mutation, you first call `useRearrangeFieldSerialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRearrangeFieldSerialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rearrangeFieldSerialMutation, { data, loading, error }] = useRearrangeFieldSerialMutation({
 *   variables: {
 *      model_name: // value for 'model_name'
 *      field_name: // value for 'field_name'
 *      new_position: // value for 'new_position'
 *      move_type: // value for 'move_type'
 *      parent_id: // value for 'parent_id'
 *   },
 * });
 */
export function useRearrangeFieldSerialMutation(baseOptions?: Apollo.MutationHookOptions<RearrangeFieldSerialMutation, RearrangeFieldSerialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RearrangeFieldSerialMutation, RearrangeFieldSerialMutationVariables>(RearrangeFieldSerialDocument, options);
      }
export type RearrangeFieldSerialMutationHookResult = ReturnType<typeof useRearrangeFieldSerialMutation>;
export type RearrangeFieldSerialMutationResult = Apollo.MutationResult<RearrangeFieldSerialMutation>;
export type RearrangeFieldSerialMutationOptions = Apollo.BaseMutationOptions<RearrangeFieldSerialMutation, RearrangeFieldSerialMutationVariables>;
export const UpsertPluginDetailsDocument = gql`
    mutation upsertPluginDetails($id: String!, $title: String, $icon: String, $version: String, $description: String, $type: PLUGIN_TYPE_ENUM, $role: String, $exported_variable: String, $env_vars: [PluginConfigEnvVarsPayload], $enable: Boolean, $repository_url: String, $branch: String, $author: String, $activate_status: PLUGIN_ACTIVATION_TYPE_ENUM) {
  upsertPlugin(
    id: $id
    title: $title
    icon: $icon
    version: $version
    description: $description
    type: $type
    role: $role
    exported_variable: $exported_variable
    env_vars: $env_vars
    enable: $enable
    repository_url: $repository_url
    branch: $branch
    author: $author
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
    type
    version
  }
}
    `;
export type UpsertPluginDetailsMutationFn = Apollo.MutationFunction<UpsertPluginDetailsMutation, UpsertPluginDetailsMutationVariables>;

/**
 * __useUpsertPluginDetailsMutation__
 *
 * To run a mutation, you first call `useUpsertPluginDetailsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertPluginDetailsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertPluginDetailsMutation, { data, loading, error }] = useUpsertPluginDetailsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      icon: // value for 'icon'
 *      version: // value for 'version'
 *      description: // value for 'description'
 *      type: // value for 'type'
 *      role: // value for 'role'
 *      exported_variable: // value for 'exported_variable'
 *      env_vars: // value for 'env_vars'
 *      enable: // value for 'enable'
 *      repository_url: // value for 'repository_url'
 *      branch: // value for 'branch'
 *      author: // value for 'author'
 *      activate_status: // value for 'activate_status'
 *   },
 * });
 */
export function useUpsertPluginDetailsMutation(baseOptions?: Apollo.MutationHookOptions<UpsertPluginDetailsMutation, UpsertPluginDetailsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertPluginDetailsMutation, UpsertPluginDetailsMutationVariables>(UpsertPluginDetailsDocument, options);
      }
export type UpsertPluginDetailsMutationHookResult = ReturnType<typeof useUpsertPluginDetailsMutation>;
export type UpsertPluginDetailsMutationResult = Apollo.MutationResult<UpsertPluginDetailsMutation>;
export type UpsertPluginDetailsMutationOptions = Apollo.BaseMutationOptions<UpsertPluginDetailsMutation, UpsertPluginDetailsMutationVariables>;
export const UpdateProjectDocument = gql`
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
      firebase_project_credential_json
      firebase_project_id
      password
      user
    }
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      access_key: // value for 'access_key'
 *      db: // value for 'db'
 *      host: // value for 'host'
 *      password: // value for 'password'
 *      port: // value for 'port'
 *      secret_key: // value for 'secret_key'
 *      user: // value for 'user'
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const UpsertRoleToProjectDocument = gql`
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
    `;
export type UpsertRoleToProjectMutationFn = Apollo.MutationFunction<UpsertRoleToProjectMutation, UpsertRoleToProjectMutationVariables>;

/**
 * __useUpsertRoleToProjectMutation__
 *
 * To run a mutation, you first call `useUpsertRoleToProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertRoleToProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertRoleToProjectMutation, { data, loading, error }] = useUpsertRoleToProjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *      is_admin: // value for 'is_admin'
 *      logic_executions: // value for 'logic_executions'
 *      api_permissions: // value for 'api_permissions'
 *   },
 * });
 */
export function useUpsertRoleToProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpsertRoleToProjectMutation, UpsertRoleToProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertRoleToProjectMutation, UpsertRoleToProjectMutationVariables>(UpsertRoleToProjectDocument, options);
      }
export type UpsertRoleToProjectMutationHookResult = ReturnType<typeof useUpsertRoleToProjectMutation>;
export type UpsertRoleToProjectMutationResult = Apollo.MutationResult<UpsertRoleToProjectMutation>;
export type UpsertRoleToProjectMutationOptions = Apollo.BaseMutationOptions<UpsertRoleToProjectMutation, UpsertRoleToProjectMutationVariables>;
export const UpdateSettingGeneralDocument = gql`
    mutation updateSettingGeneral($name: String, $description: String) {
  updateProject(name: $name, description: $description) {
    _key
    id
    name
    description
  }
}
    `;
export type UpdateSettingGeneralMutationFn = Apollo.MutationFunction<UpdateSettingGeneralMutation, UpdateSettingGeneralMutationVariables>;

/**
 * __useUpdateSettingGeneralMutation__
 *
 * To run a mutation, you first call `useUpdateSettingGeneralMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSettingGeneralMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSettingGeneralMutation, { data, loading, error }] = useUpdateSettingGeneralMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateSettingGeneralMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSettingGeneralMutation, UpdateSettingGeneralMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSettingGeneralMutation, UpdateSettingGeneralMutationVariables>(UpdateSettingGeneralDocument, options);
      }
export type UpdateSettingGeneralMutationHookResult = ReturnType<typeof useUpdateSettingGeneralMutation>;
export type UpdateSettingGeneralMutationResult = Apollo.MutationResult<UpdateSettingGeneralMutation>;
export type UpdateSettingGeneralMutationOptions = Apollo.BaseMutationOptions<UpdateSettingGeneralMutation, UpdateSettingGeneralMutationVariables>;
export const UpdateSettingTeamsDocument = gql`
    mutation updateSettingTeams($add_team_member: AddTeamMemberPayload, $remove_team_member: RemoveTeamMemberPayload) {
  updateProject(
    add_team_member: $add_team_member
    remove_team_member: $remove_team_member
  ) {
    _key
    id
  }
}
    `;
export type UpdateSettingTeamsMutationFn = Apollo.MutationFunction<UpdateSettingTeamsMutation, UpdateSettingTeamsMutationVariables>;

/**
 * __useUpdateSettingTeamsMutation__
 *
 * To run a mutation, you first call `useUpdateSettingTeamsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSettingTeamsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSettingTeamsMutation, { data, loading, error }] = useUpdateSettingTeamsMutation({
 *   variables: {
 *      add_team_member: // value for 'add_team_member'
 *      remove_team_member: // value for 'remove_team_member'
 *   },
 * });
 */
export function useUpdateSettingTeamsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSettingTeamsMutation, UpdateSettingTeamsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSettingTeamsMutation, UpdateSettingTeamsMutationVariables>(UpdateSettingTeamsDocument, options);
      }
export type UpdateSettingTeamsMutationHookResult = ReturnType<typeof useUpdateSettingTeamsMutation>;
export type UpdateSettingTeamsMutationResult = Apollo.MutationResult<UpdateSettingTeamsMutation>;
export type UpdateSettingTeamsMutationOptions = Apollo.BaseMutationOptions<UpdateSettingTeamsMutation, UpdateSettingTeamsMutationVariables>;
export const UpdateSettingsDocument = gql`
    mutation updateSettings($name: String, $description: String, $settings: UpdateSettingsPayload, $tenant_model_name: String) {
  updateProject(
    name: $name
    description: $description
    settings: $settings
    tenant_model_name: $tenant_model_name
  ) {
    _key
    id
    name
    description
    project_secret_key
    tenant_model_name
    settings {
      locals
      system_graphql_hooks
      enable_revision_history
      default_storage_plugin
      default_function_plugin
      default_locale
    }
  }
}
    `;
export type UpdateSettingsMutationFn = Apollo.MutationFunction<UpdateSettingsMutation, UpdateSettingsMutationVariables>;

/**
 * __useUpdateSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSettingsMutation, { data, loading, error }] = useUpdateSettingsMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      settings: // value for 'settings'
 *      tenant_model_name: // value for 'tenant_model_name'
 *   },
 * });
 */
export function useUpdateSettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSettingsMutation, UpdateSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSettingsMutation, UpdateSettingsMutationVariables>(UpdateSettingsDocument, options);
      }
export type UpdateSettingsMutationHookResult = ReturnType<typeof useUpdateSettingsMutation>;
export type UpdateSettingsMutationResult = Apollo.MutationResult<UpdateSettingsMutation>;
export type UpdateSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateSettingsMutation, UpdateSettingsMutationVariables>;
export const CreateSettingsWebhookDocument = gql`
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
    `;
export type CreateSettingsWebhookMutationFn = Apollo.MutationFunction<CreateSettingsWebhookMutation, CreateSettingsWebhookMutationVariables>;

/**
 * __useCreateSettingsWebhookMutation__
 *
 * To run a mutation, you first call `useCreateSettingsWebhookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSettingsWebhookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSettingsWebhookMutation, { data, loading, error }] = useCreateSettingsWebhookMutation({
 *   variables: {
 *      events: // value for 'events'
 *      model: // value for 'model'
 *      name: // value for 'name'
 *      url: // value for 'url'
 *      logic_executions: // value for 'logic_executions'
 *   },
 * });
 */
export function useCreateSettingsWebhookMutation(baseOptions?: Apollo.MutationHookOptions<CreateSettingsWebhookMutation, CreateSettingsWebhookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSettingsWebhookMutation, CreateSettingsWebhookMutationVariables>(CreateSettingsWebhookDocument, options);
      }
export type CreateSettingsWebhookMutationHookResult = ReturnType<typeof useCreateSettingsWebhookMutation>;
export type CreateSettingsWebhookMutationResult = Apollo.MutationResult<CreateSettingsWebhookMutation>;
export type CreateSettingsWebhookMutationOptions = Apollo.BaseMutationOptions<CreateSettingsWebhookMutation, CreateSettingsWebhookMutationVariables>;
export const DeleteSettingsWeekhookDocument = gql`
    mutation deleteSettingsWeekhook($id: String!) {
  deleteWebHook(id: $id) {
    msg
  }
}
    `;
export type DeleteSettingsWeekhookMutationFn = Apollo.MutationFunction<DeleteSettingsWeekhookMutation, DeleteSettingsWeekhookMutationVariables>;

/**
 * __useDeleteSettingsWeekhookMutation__
 *
 * To run a mutation, you first call `useDeleteSettingsWeekhookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSettingsWeekhookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSettingsWeekhookMutation, { data, loading, error }] = useDeleteSettingsWeekhookMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSettingsWeekhookMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSettingsWeekhookMutation, DeleteSettingsWeekhookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSettingsWeekhookMutation, DeleteSettingsWeekhookMutationVariables>(DeleteSettingsWeekhookDocument, options);
      }
export type DeleteSettingsWeekhookMutationHookResult = ReturnType<typeof useDeleteSettingsWeekhookMutation>;
export type DeleteSettingsWeekhookMutationResult = Apollo.MutationResult<DeleteSettingsWeekhookMutation>;
export type DeleteSettingsWeekhookMutationOptions = Apollo.BaseMutationOptions<DeleteSettingsWeekhookMutation, DeleteSettingsWeekhookMutationVariables>;
export const DeleteSettingsRoleFromProjectDocument = gql`
    mutation deleteSettingsRoleFromProject($role: String!) {
  deleteRoleFromProject(role: $role) {
    message
  }
}
    `;
export type DeleteSettingsRoleFromProjectMutationFn = Apollo.MutationFunction<DeleteSettingsRoleFromProjectMutation, DeleteSettingsRoleFromProjectMutationVariables>;

/**
 * __useDeleteSettingsRoleFromProjectMutation__
 *
 * To run a mutation, you first call `useDeleteSettingsRoleFromProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSettingsRoleFromProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSettingsRoleFromProjectMutation, { data, loading, error }] = useDeleteSettingsRoleFromProjectMutation({
 *   variables: {
 *      role: // value for 'role'
 *   },
 * });
 */
export function useDeleteSettingsRoleFromProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSettingsRoleFromProjectMutation, DeleteSettingsRoleFromProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSettingsRoleFromProjectMutation, DeleteSettingsRoleFromProjectMutationVariables>(DeleteSettingsRoleFromProjectDocument, options);
      }
export type DeleteSettingsRoleFromProjectMutationHookResult = ReturnType<typeof useDeleteSettingsRoleFromProjectMutation>;
export type DeleteSettingsRoleFromProjectMutationResult = Apollo.MutationResult<DeleteSettingsRoleFromProjectMutation>;
export type DeleteSettingsRoleFromProjectMutationOptions = Apollo.BaseMutationOptions<DeleteSettingsRoleFromProjectMutation, DeleteSettingsRoleFromProjectMutationVariables>;
export const UpdateUserProfileDocument = gql`
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
    `;
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      first_name: // value for 'first_name'
 *      last_name: // value for 'last_name'
 *      organization_id: // value for 'organization_id'
 *      role: // value for 'role'
 *      new_pass: // value for 'new_pass'
 *      old_pass: // value for 'old_pass'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const GetLoggedInUserDocument = gql`
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
    `;

/**
 * __useGetLoggedInUserQuery__
 *
 * To run a query within a React component, call `useGetLoggedInUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoggedInUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoggedInUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLoggedInUserQuery(baseOptions?: Apollo.QueryHookOptions<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>(GetLoggedInUserDocument, options);
      }
export function useGetLoggedInUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>(GetLoggedInUserDocument, options);
        }
export function useGetLoggedInUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>(GetLoggedInUserDocument, options);
        }
export type GetLoggedInUserQueryHookResult = ReturnType<typeof useGetLoggedInUserQuery>;
export type GetLoggedInUserLazyQueryHookResult = ReturnType<typeof useGetLoggedInUserLazyQuery>;
export type GetLoggedInUserSuspenseQueryHookResult = ReturnType<typeof useGetLoggedInUserSuspenseQuery>;
export type GetLoggedInUserQueryResult = Apollo.QueryResult<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>;
export const GetAuditLogsDocument = gql`
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
    `;

/**
 * __useGetAuditLogsQuery__
 *
 * To run a query within a React component, call `useGetAuditLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuditLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuditLogsQuery({
 *   variables: {
 *      project_id: // value for 'project_id'
 *      limit: // value for 'limit'
 *      page: // value for 'page'
 *      user_id: // value for 'user_id'
 *      response_code: // value for 'response_code'
 *      filter_by_project_id: // value for 'filter_by_project_id'
 *      internal_function: // value for 'internal_function'
 *      graphql_operation_name: // value for 'graphql_operation_name'
 *   },
 * });
 */
export function useGetAuditLogsQuery(baseOptions?: Apollo.QueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
      }
export function useGetAuditLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
        }
export function useGetAuditLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
        }
export type GetAuditLogsQueryHookResult = ReturnType<typeof useGetAuditLogsQuery>;
export type GetAuditLogsLazyQueryHookResult = ReturnType<typeof useGetAuditLogsLazyQuery>;
export type GetAuditLogsSuspenseQueryHookResult = ReturnType<typeof useGetAuditLogsSuspenseQuery>;
export type GetAuditLogsQueryResult = Apollo.QueryResult<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export const UpdateSingleDataDocument = gql`
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
    `;
export type UpdateSingleDataMutationFn = Apollo.MutationFunction<UpdateSingleDataMutation, UpdateSingleDataMutationVariables>;

/**
 * __useUpdateSingleDataMutation__
 *
 * To run a mutation, you first call `useUpdateSingleDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSingleDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSingleDataMutation, { data, loading, error }] = useUpdateSingleDataMutation({
 *   variables: {
 *      _id: // value for '_id'
 *      single_page_data: // value for 'single_page_data'
 *      model_name: // value for 'model_name'
 *      local: // value for 'local'
 *      payload: // value for 'payload'
 *      connect: // value for 'connect'
 *      disconnect: // value for 'disconnect'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdateSingleDataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSingleDataMutation, UpdateSingleDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSingleDataMutation, UpdateSingleDataMutationVariables>(UpdateSingleDataDocument, options);
      }
export type UpdateSingleDataMutationHookResult = ReturnType<typeof useUpdateSingleDataMutation>;
export type UpdateSingleDataMutationResult = Apollo.MutationResult<UpdateSingleDataMutation>;
export type UpdateSingleDataMutationOptions = Apollo.BaseMutationOptions<UpdateSingleDataMutation, UpdateSingleDataMutationVariables>;
export const GetMultipleDataDocument = gql`
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
    `;

/**
 * __useGetMultipleDataQuery__
 *
 * To run a query within a React component, call `useGetMultipleDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMultipleDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMultipleDataQuery({
 *   variables: {
 *      model: // value for 'model'
 *      limit: // value for 'limit'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *      where: // value for 'where'
 *      connection: // value for 'connection'
 *      intersect: // value for 'intersect'
 *   },
 * });
 */
export function useGetMultipleDataQuery(baseOptions: Apollo.QueryHookOptions<GetMultipleDataQuery, GetMultipleDataQueryVariables> & ({ variables: GetMultipleDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMultipleDataQuery, GetMultipleDataQueryVariables>(GetMultipleDataDocument, options);
      }
export function useGetMultipleDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMultipleDataQuery, GetMultipleDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMultipleDataQuery, GetMultipleDataQueryVariables>(GetMultipleDataDocument, options);
        }
export function useGetMultipleDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMultipleDataQuery, GetMultipleDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMultipleDataQuery, GetMultipleDataQueryVariables>(GetMultipleDataDocument, options);
        }
export type GetMultipleDataQueryHookResult = ReturnType<typeof useGetMultipleDataQuery>;
export type GetMultipleDataLazyQueryHookResult = ReturnType<typeof useGetMultipleDataLazyQuery>;
export type GetMultipleDataSuspenseQueryHookResult = ReturnType<typeof useGetMultipleDataSuspenseQuery>;
export type GetMultipleDataQueryResult = Apollo.QueryResult<GetMultipleDataQuery, GetMultipleDataQueryVariables>;
export const DeleteModelDataDocument = gql`
    mutation deleteModelData($model_name: String!, $_id: String) {
  deleteModelData(model_name: $model_name, _id: $_id) {
    id
  }
}
    `;
export type DeleteModelDataMutationFn = Apollo.MutationFunction<DeleteModelDataMutation, DeleteModelDataMutationVariables>;

/**
 * __useDeleteModelDataMutation__
 *
 * To run a mutation, you first call `useDeleteModelDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteModelDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteModelDataMutation, { data, loading, error }] = useDeleteModelDataMutation({
 *   variables: {
 *      model_name: // value for 'model_name'
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteModelDataMutation(baseOptions?: Apollo.MutationHookOptions<DeleteModelDataMutation, DeleteModelDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteModelDataMutation, DeleteModelDataMutationVariables>(DeleteModelDataDocument, options);
      }
export type DeleteModelDataMutationHookResult = ReturnType<typeof useDeleteModelDataMutation>;
export type DeleteModelDataMutationResult = Apollo.MutationResult<DeleteModelDataMutation>;
export type DeleteModelDataMutationOptions = Apollo.BaseMutationOptions<DeleteModelDataMutation, DeleteModelDataMutationVariables>;
export const DuplicateModelDataDocument = gql`
    mutation duplicateModelData($model_name: String!, $_id: String) {
  duplicateModelData(model_name: $model_name, _id: $_id) {
    id
  }
}
    `;
export type DuplicateModelDataMutationFn = Apollo.MutationFunction<DuplicateModelDataMutation, DuplicateModelDataMutationVariables>;

/**
 * __useDuplicateModelDataMutation__
 *
 * To run a mutation, you first call `useDuplicateModelDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDuplicateModelDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [duplicateModelDataMutation, { data, loading, error }] = useDuplicateModelDataMutation({
 *   variables: {
 *      model_name: // value for 'model_name'
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDuplicateModelDataMutation(baseOptions?: Apollo.MutationHookOptions<DuplicateModelDataMutation, DuplicateModelDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DuplicateModelDataMutation, DuplicateModelDataMutationVariables>(DuplicateModelDataDocument, options);
      }
export type DuplicateModelDataMutationHookResult = ReturnType<typeof useDuplicateModelDataMutation>;
export type DuplicateModelDataMutationResult = Apollo.MutationResult<DuplicateModelDataMutation>;
export type DuplicateModelDataMutationOptions = Apollo.BaseMutationOptions<DuplicateModelDataMutation, DuplicateModelDataMutationVariables>;
export const FormDataQueryRevisionDocument = gql`
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
    `;

/**
 * __useFormDataQueryRevisionQuery__
 *
 * To run a query within a React component, call `useFormDataQueryRevisionQuery` and pass it any options that fit your needs.
 * When your component renders, `useFormDataQueryRevisionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFormDataQueryRevisionQuery({
 *   variables: {
 *      _id: // value for '_id'
 *      single_page_data: // value for 'single_page_data'
 *      model: // value for 'model'
 *   },
 * });
 */
export function useFormDataQueryRevisionQuery(baseOptions: Apollo.QueryHookOptions<FormDataQueryRevisionQuery, FormDataQueryRevisionQueryVariables> & ({ variables: FormDataQueryRevisionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FormDataQueryRevisionQuery, FormDataQueryRevisionQueryVariables>(FormDataQueryRevisionDocument, options);
      }
export function useFormDataQueryRevisionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FormDataQueryRevisionQuery, FormDataQueryRevisionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FormDataQueryRevisionQuery, FormDataQueryRevisionQueryVariables>(FormDataQueryRevisionDocument, options);
        }
export function useFormDataQueryRevisionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FormDataQueryRevisionQuery, FormDataQueryRevisionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FormDataQueryRevisionQuery, FormDataQueryRevisionQueryVariables>(FormDataQueryRevisionDocument, options);
        }
export type FormDataQueryRevisionQueryHookResult = ReturnType<typeof useFormDataQueryRevisionQuery>;
export type FormDataQueryRevisionLazyQueryHookResult = ReturnType<typeof useFormDataQueryRevisionLazyQuery>;
export type FormDataQueryRevisionSuspenseQueryHookResult = ReturnType<typeof useFormDataQueryRevisionSuspenseQuery>;
export type FormDataQueryRevisionQueryResult = Apollo.QueryResult<FormDataQueryRevisionQuery, FormDataQueryRevisionQueryVariables>;
export const GetSingleDataDocument = gql`
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
    `;

/**
 * __useGetSingleDataQuery__
 *
 * To run a query within a React component, call `useGetSingleDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSingleDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSingleDataQuery({
 *   variables: {
 *      _id: // value for '_id'
 *      model: // value for 'model'
 *      local: // value for 'local'
 *      revision: // value for 'revision'
 *      single_page_data: // value for 'single_page_data'
 *   },
 * });
 */
export function useGetSingleDataQuery(baseOptions: Apollo.QueryHookOptions<GetSingleDataQuery, GetSingleDataQueryVariables> & ({ variables: GetSingleDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSingleDataQuery, GetSingleDataQueryVariables>(GetSingleDataDocument, options);
      }
export function useGetSingleDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSingleDataQuery, GetSingleDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSingleDataQuery, GetSingleDataQueryVariables>(GetSingleDataDocument, options);
        }
export function useGetSingleDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSingleDataQuery, GetSingleDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSingleDataQuery, GetSingleDataQueryVariables>(GetSingleDataDocument, options);
        }
export type GetSingleDataQueryHookResult = ReturnType<typeof useGetSingleDataQuery>;
export type GetSingleDataLazyQueryHookResult = ReturnType<typeof useGetSingleDataLazyQuery>;
export type GetSingleDataSuspenseQueryHookResult = ReturnType<typeof useGetSingleDataSuspenseQuery>;
export type GetSingleDataQueryResult = Apollo.QueryResult<GetSingleDataQuery, GetSingleDataQueryVariables>;
export const CreateModelDataDocument = gql`
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
    `;
export type CreateModelDataMutationFn = Apollo.MutationFunction<CreateModelDataMutation, CreateModelDataMutationVariables>;

/**
 * __useCreateModelDataMutation__
 *
 * To run a mutation, you first call `useCreateModelDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateModelDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createModelDataMutation, { data, loading, error }] = useCreateModelDataMutation({
 *   variables: {
 *      model_name: // value for 'model_name'
 *      local: // value for 'local'
 *      payload: // value for 'payload'
 *      connect: // value for 'connect'
 *      disconnect: // value for 'disconnect'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useCreateModelDataMutation(baseOptions?: Apollo.MutationHookOptions<CreateModelDataMutation, CreateModelDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateModelDataMutation, CreateModelDataMutationVariables>(CreateModelDataDocument, options);
      }
export type CreateModelDataMutationHookResult = ReturnType<typeof useCreateModelDataMutation>;
export type CreateModelDataMutationResult = Apollo.MutationResult<CreateModelDataMutation>;
export type CreateModelDataMutationOptions = Apollo.BaseMutationOptions<CreateModelDataMutation, CreateModelDataMutationVariables>;
export const ListAvailableFunctionsDocument = gql`
    query listAvailableFunctions($function_id: String!) {
  listAvailableFunctions(function_id: $function_id) {
    functions
  }
}
    `;

/**
 * __useListAvailableFunctionsQuery__
 *
 * To run a query within a React component, call `useListAvailableFunctionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListAvailableFunctionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListAvailableFunctionsQuery({
 *   variables: {
 *      function_id: // value for 'function_id'
 *   },
 * });
 */
export function useListAvailableFunctionsQuery(baseOptions: Apollo.QueryHookOptions<ListAvailableFunctionsQuery, ListAvailableFunctionsQueryVariables> & ({ variables: ListAvailableFunctionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListAvailableFunctionsQuery, ListAvailableFunctionsQueryVariables>(ListAvailableFunctionsDocument, options);
      }
export function useListAvailableFunctionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListAvailableFunctionsQuery, ListAvailableFunctionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListAvailableFunctionsQuery, ListAvailableFunctionsQueryVariables>(ListAvailableFunctionsDocument, options);
        }
export function useListAvailableFunctionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListAvailableFunctionsQuery, ListAvailableFunctionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListAvailableFunctionsQuery, ListAvailableFunctionsQueryVariables>(ListAvailableFunctionsDocument, options);
        }
export type ListAvailableFunctionsQueryHookResult = ReturnType<typeof useListAvailableFunctionsQuery>;
export type ListAvailableFunctionsLazyQueryHookResult = ReturnType<typeof useListAvailableFunctionsLazyQuery>;
export type ListAvailableFunctionsSuspenseQueryHookResult = ReturnType<typeof useListAvailableFunctionsSuspenseQuery>;
export type ListAvailableFunctionsQueryResult = Apollo.QueryResult<ListAvailableFunctionsQuery, ListAvailableFunctionsQueryVariables>;
export const GetAllFunctionInfoDocument = gql`
    query getAllFunctionInfo {
  projectFunctionsInfo {
    name
    description
    graphql_schema_type
    created_at
    updated_at
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
    `;

/**
 * __useGetAllFunctionInfoQuery__
 *
 * To run a query within a React component, call `useGetAllFunctionInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllFunctionInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllFunctionInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllFunctionInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetAllFunctionInfoQuery, GetAllFunctionInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllFunctionInfoQuery, GetAllFunctionInfoQueryVariables>(GetAllFunctionInfoDocument, options);
      }
export function useGetAllFunctionInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllFunctionInfoQuery, GetAllFunctionInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllFunctionInfoQuery, GetAllFunctionInfoQueryVariables>(GetAllFunctionInfoDocument, options);
        }
export function useGetAllFunctionInfoSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllFunctionInfoQuery, GetAllFunctionInfoQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllFunctionInfoQuery, GetAllFunctionInfoQueryVariables>(GetAllFunctionInfoDocument, options);
        }
export type GetAllFunctionInfoQueryHookResult = ReturnType<typeof useGetAllFunctionInfoQuery>;
export type GetAllFunctionInfoLazyQueryHookResult = ReturnType<typeof useGetAllFunctionInfoLazyQuery>;
export type GetAllFunctionInfoSuspenseQueryHookResult = ReturnType<typeof useGetAllFunctionInfoSuspenseQuery>;
export type GetAllFunctionInfoQueryResult = Apollo.QueryResult<GetAllFunctionInfoQuery, GetAllFunctionInfoQueryVariables>;
export const GetOnlyModelsInfoDocument = gql`
    query getOnlyModelsInfo {
  projectModelsInfo {
    name
    single_page
    single_page_uuid
    system_generated
    has_connections
    is_tenant_model
    enable_revision
    revision_filter {
      key
      value
    }
  }
}
    `;

/**
 * __useGetOnlyModelsInfoQuery__
 *
 * To run a query within a React component, call `useGetOnlyModelsInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOnlyModelsInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOnlyModelsInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOnlyModelsInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetOnlyModelsInfoQuery, GetOnlyModelsInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOnlyModelsInfoQuery, GetOnlyModelsInfoQueryVariables>(GetOnlyModelsInfoDocument, options);
      }
export function useGetOnlyModelsInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOnlyModelsInfoQuery, GetOnlyModelsInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOnlyModelsInfoQuery, GetOnlyModelsInfoQueryVariables>(GetOnlyModelsInfoDocument, options);
        }
export function useGetOnlyModelsInfoSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOnlyModelsInfoQuery, GetOnlyModelsInfoQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOnlyModelsInfoQuery, GetOnlyModelsInfoQueryVariables>(GetOnlyModelsInfoDocument, options);
        }
export type GetOnlyModelsInfoQueryHookResult = ReturnType<typeof useGetOnlyModelsInfoQuery>;
export type GetOnlyModelsInfoLazyQueryHookResult = ReturnType<typeof useGetOnlyModelsInfoLazyQuery>;
export type GetOnlyModelsInfoSuspenseQueryHookResult = ReturnType<typeof useGetOnlyModelsInfoSuspenseQuery>;
export type GetOnlyModelsInfoQueryResult = Apollo.QueryResult<GetOnlyModelsInfoQuery, GetOnlyModelsInfoQueryVariables>;
export const GetModelDetailsDocument = gql`
    query getModelDetails($model_name: String) {
  projectModelsInfo(model_name: $model_name) {
    name
    locals
    single_page
    single_page_uuid
    system_generated
    fields {
      serial
      identifier
      label
      input_type
      field_type
      field_sub_type
      description
      system_generated
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
    `;

/**
 * __useGetModelDetailsQuery__
 *
 * To run a query within a React component, call `useGetModelDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModelDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModelDetailsQuery({
 *   variables: {
 *      model_name: // value for 'model_name'
 *   },
 * });
 */
export function useGetModelDetailsQuery(baseOptions?: Apollo.QueryHookOptions<GetModelDetailsQuery, GetModelDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModelDetailsQuery, GetModelDetailsQueryVariables>(GetModelDetailsDocument, options);
      }
export function useGetModelDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModelDetailsQuery, GetModelDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModelDetailsQuery, GetModelDetailsQueryVariables>(GetModelDetailsDocument, options);
        }
export function useGetModelDetailsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetModelDetailsQuery, GetModelDetailsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModelDetailsQuery, GetModelDetailsQueryVariables>(GetModelDetailsDocument, options);
        }
export type GetModelDetailsQueryHookResult = ReturnType<typeof useGetModelDetailsQuery>;
export type GetModelDetailsLazyQueryHookResult = ReturnType<typeof useGetModelDetailsLazyQuery>;
export type GetModelDetailsSuspenseQueryHookResult = ReturnType<typeof useGetModelDetailsSuspenseQuery>;
export type GetModelDetailsQueryResult = Apollo.QueryResult<GetModelDetailsQuery, GetModelDetailsQueryVariables>;
export const GetPluginsDocument = gql`
    query GetPlugins($name: String, $limit: Int, $page: Int, $project_id: String) {
  getPlugins(
    _id: $project_id
    filter: {limit: $limit, page: $page}
    where: {name: {eq: $name}}
  ) {
    type
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
    env_vars {
      key
      value
    }
  }
}
    `;

/**
 * __useGetPluginsQuery__
 *
 * To run a query within a React component, call `useGetPluginsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPluginsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPluginsQuery({
 *   variables: {
 *      name: // value for 'name'
 *      limit: // value for 'limit'
 *      page: // value for 'page'
 *      project_id: // value for 'project_id'
 *   },
 * });
 */
export function useGetPluginsQuery(baseOptions?: Apollo.QueryHookOptions<GetPluginsQuery, GetPluginsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPluginsQuery, GetPluginsQueryVariables>(GetPluginsDocument, options);
      }
export function useGetPluginsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPluginsQuery, GetPluginsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPluginsQuery, GetPluginsQueryVariables>(GetPluginsDocument, options);
        }
export function useGetPluginsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPluginsQuery, GetPluginsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPluginsQuery, GetPluginsQueryVariables>(GetPluginsDocument, options);
        }
export type GetPluginsQueryHookResult = ReturnType<typeof useGetPluginsQuery>;
export type GetPluginsLazyQueryHookResult = ReturnType<typeof useGetPluginsLazyQuery>;
export type GetPluginsSuspenseQueryHookResult = ReturnType<typeof useGetPluginsSuspenseQuery>;
export type GetPluginsQueryResult = Apollo.QueryResult<GetPluginsQuery, GetPluginsQueryVariables>;
export const ListPluginIdsDocument = gql`
    query listPluginIds($type: PLUGIN_TYPE_ENUM!) {
  listPluginIds(type: $type) {
    type
    plugins
  }
}
    `;

/**
 * __useListPluginIdsQuery__
 *
 * To run a query within a React component, call `useListPluginIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPluginIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPluginIdsQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useListPluginIdsQuery(baseOptions: Apollo.QueryHookOptions<ListPluginIdsQuery, ListPluginIdsQueryVariables> & ({ variables: ListPluginIdsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListPluginIdsQuery, ListPluginIdsQueryVariables>(ListPluginIdsDocument, options);
      }
export function useListPluginIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListPluginIdsQuery, ListPluginIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListPluginIdsQuery, ListPluginIdsQueryVariables>(ListPluginIdsDocument, options);
        }
export function useListPluginIdsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListPluginIdsQuery, ListPluginIdsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListPluginIdsQuery, ListPluginIdsQueryVariables>(ListPluginIdsDocument, options);
        }
export type ListPluginIdsQueryHookResult = ReturnType<typeof useListPluginIdsQuery>;
export type ListPluginIdsLazyQueryHookResult = ReturnType<typeof useListPluginIdsLazyQuery>;
export type ListPluginIdsSuspenseQueryHookResult = ReturnType<typeof useListPluginIdsSuspenseQuery>;
export type ListPluginIdsQueryResult = Apollo.QueryResult<ListPluginIdsQuery, ListPluginIdsQueryVariables>;
export const GetTenantsDocument = gql`
    query getTenants {
  getTenants {
    name
    logo
    id
  }
}
    `;

/**
 * __useGetTenantsQuery__
 *
 * To run a query within a React component, call `useGetTenantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTenantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTenantsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTenantsQuery(baseOptions?: Apollo.QueryHookOptions<GetTenantsQuery, GetTenantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTenantsQuery, GetTenantsQueryVariables>(GetTenantsDocument, options);
      }
export function useGetTenantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTenantsQuery, GetTenantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTenantsQuery, GetTenantsQueryVariables>(GetTenantsDocument, options);
        }
export function useGetTenantsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTenantsQuery, GetTenantsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTenantsQuery, GetTenantsQueryVariables>(GetTenantsDocument, options);
        }
export type GetTenantsQueryHookResult = ReturnType<typeof useGetTenantsQuery>;
export type GetTenantsLazyQueryHookResult = ReturnType<typeof useGetTenantsLazyQuery>;
export type GetTenantsSuspenseQueryHookResult = ReturnType<typeof useGetTenantsSuspenseQuery>;
export type GetTenantsQueryResult = Apollo.QueryResult<GetTenantsQuery, GetTenantsQueryVariables>;
export const GetCurrentProjectDocument = gql`
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
    `;

/**
 * __useGetCurrentProjectQuery__
 *
 * To run a query within a React component, call `useGetCurrentProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentProjectQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentProjectQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentProjectQuery, GetCurrentProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentProjectQuery, GetCurrentProjectQueryVariables>(GetCurrentProjectDocument, options);
      }
export function useGetCurrentProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentProjectQuery, GetCurrentProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentProjectQuery, GetCurrentProjectQueryVariables>(GetCurrentProjectDocument, options);
        }
export function useGetCurrentProjectSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentProjectQuery, GetCurrentProjectQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentProjectQuery, GetCurrentProjectQueryVariables>(GetCurrentProjectDocument, options);
        }
export type GetCurrentProjectQueryHookResult = ReturnType<typeof useGetCurrentProjectQuery>;
export type GetCurrentProjectLazyQueryHookResult = ReturnType<typeof useGetCurrentProjectLazyQuery>;
export type GetCurrentProjectSuspenseQueryHookResult = ReturnType<typeof useGetCurrentProjectSuspenseQuery>;
export type GetCurrentProjectQueryResult = Apollo.QueryResult<GetCurrentProjectQuery, GetCurrentProjectQueryVariables>;
export const GetCurrentProjectTokensDocument = gql`
    query getCurrentProjectTokens {
  currentProject {
    id
    _key
    name
    project_secret_key
    tokens {
      name
      token
      role
      expire
    }
  }
}
    `;

/**
 * __useGetCurrentProjectTokensQuery__
 *
 * To run a query within a React component, call `useGetCurrentProjectTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentProjectTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentProjectTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentProjectTokensQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentProjectTokensQuery, GetCurrentProjectTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentProjectTokensQuery, GetCurrentProjectTokensQueryVariables>(GetCurrentProjectTokensDocument, options);
      }
export function useGetCurrentProjectTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentProjectTokensQuery, GetCurrentProjectTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentProjectTokensQuery, GetCurrentProjectTokensQueryVariables>(GetCurrentProjectTokensDocument, options);
        }
export function useGetCurrentProjectTokensSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentProjectTokensQuery, GetCurrentProjectTokensQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentProjectTokensQuery, GetCurrentProjectTokensQueryVariables>(GetCurrentProjectTokensDocument, options);
        }
export type GetCurrentProjectTokensQueryHookResult = ReturnType<typeof useGetCurrentProjectTokensQuery>;
export type GetCurrentProjectTokensLazyQueryHookResult = ReturnType<typeof useGetCurrentProjectTokensLazyQuery>;
export type GetCurrentProjectTokensSuspenseQueryHookResult = ReturnType<typeof useGetCurrentProjectTokensSuspenseQuery>;
export type GetCurrentProjectTokensQueryResult = Apollo.QueryResult<GetCurrentProjectTokensQuery, GetCurrentProjectTokensQueryVariables>;
export const GetProjectDriverInfoDocument = gql`
    query getProjectDriverInfo($id: String = "") {
  getProject(_id: $id) {
    driver {
      access_key
      database
      engine
      host
      password
      port
      project_id
      secret_key
      user
    }
  }
}
    `;

/**
 * __useGetProjectDriverInfoQuery__
 *
 * To run a query within a React component, call `useGetProjectDriverInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectDriverInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectDriverInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProjectDriverInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetProjectDriverInfoQuery, GetProjectDriverInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectDriverInfoQuery, GetProjectDriverInfoQueryVariables>(GetProjectDriverInfoDocument, options);
      }
export function useGetProjectDriverInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectDriverInfoQuery, GetProjectDriverInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectDriverInfoQuery, GetProjectDriverInfoQueryVariables>(GetProjectDriverInfoDocument, options);
        }
export function useGetProjectDriverInfoSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectDriverInfoQuery, GetProjectDriverInfoQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectDriverInfoQuery, GetProjectDriverInfoQueryVariables>(GetProjectDriverInfoDocument, options);
        }
export type GetProjectDriverInfoQueryHookResult = ReturnType<typeof useGetProjectDriverInfoQuery>;
export type GetProjectDriverInfoLazyQueryHookResult = ReturnType<typeof useGetProjectDriverInfoLazyQuery>;
export type GetProjectDriverInfoSuspenseQueryHookResult = ReturnType<typeof useGetProjectDriverInfoSuspenseQuery>;
export type GetProjectDriverInfoQueryResult = Apollo.QueryResult<GetProjectDriverInfoQuery, GetProjectDriverInfoQueryVariables>;
export const GetSettingsWebhooksDocument = gql`
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
    `;

/**
 * __useGetSettingsWebhooksQuery__
 *
 * To run a query within a React component, call `useGetSettingsWebhooksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingsWebhooksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSettingsWebhooksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSettingsWebhooksQuery(baseOptions?: Apollo.QueryHookOptions<GetSettingsWebhooksQuery, GetSettingsWebhooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSettingsWebhooksQuery, GetSettingsWebhooksQueryVariables>(GetSettingsWebhooksDocument, options);
      }
export function useGetSettingsWebhooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSettingsWebhooksQuery, GetSettingsWebhooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSettingsWebhooksQuery, GetSettingsWebhooksQueryVariables>(GetSettingsWebhooksDocument, options);
        }
export function useGetSettingsWebhooksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSettingsWebhooksQuery, GetSettingsWebhooksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSettingsWebhooksQuery, GetSettingsWebhooksQueryVariables>(GetSettingsWebhooksDocument, options);
        }
export type GetSettingsWebhooksQueryHookResult = ReturnType<typeof useGetSettingsWebhooksQuery>;
export type GetSettingsWebhooksLazyQueryHookResult = ReturnType<typeof useGetSettingsWebhooksLazyQuery>;
export type GetSettingsWebhooksSuspenseQueryHookResult = ReturnType<typeof useGetSettingsWebhooksSuspenseQuery>;
export type GetSettingsWebhooksQueryResult = Apollo.QueryResult<GetSettingsWebhooksQuery, GetSettingsWebhooksQueryVariables>;
export const GetSettingsWebhooksExecutableFunctionsByModelDocument = gql`
    query getSettingsWebhooksExecutableFunctionsByModel($project_id: String, $model: String) {
  listExecutableFunctions(_id: $project_id, model_name: $model) {
    functions
  }
}
    `;

/**
 * __useGetSettingsWebhooksExecutableFunctionsByModelQuery__
 *
 * To run a query within a React component, call `useGetSettingsWebhooksExecutableFunctionsByModelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingsWebhooksExecutableFunctionsByModelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSettingsWebhooksExecutableFunctionsByModelQuery({
 *   variables: {
 *      project_id: // value for 'project_id'
 *      model: // value for 'model'
 *   },
 * });
 */
export function useGetSettingsWebhooksExecutableFunctionsByModelQuery(baseOptions?: Apollo.QueryHookOptions<GetSettingsWebhooksExecutableFunctionsByModelQuery, GetSettingsWebhooksExecutableFunctionsByModelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSettingsWebhooksExecutableFunctionsByModelQuery, GetSettingsWebhooksExecutableFunctionsByModelQueryVariables>(GetSettingsWebhooksExecutableFunctionsByModelDocument, options);
      }
export function useGetSettingsWebhooksExecutableFunctionsByModelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSettingsWebhooksExecutableFunctionsByModelQuery, GetSettingsWebhooksExecutableFunctionsByModelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSettingsWebhooksExecutableFunctionsByModelQuery, GetSettingsWebhooksExecutableFunctionsByModelQueryVariables>(GetSettingsWebhooksExecutableFunctionsByModelDocument, options);
        }
export function useGetSettingsWebhooksExecutableFunctionsByModelSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSettingsWebhooksExecutableFunctionsByModelQuery, GetSettingsWebhooksExecutableFunctionsByModelQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSettingsWebhooksExecutableFunctionsByModelQuery, GetSettingsWebhooksExecutableFunctionsByModelQueryVariables>(GetSettingsWebhooksExecutableFunctionsByModelDocument, options);
        }
export type GetSettingsWebhooksExecutableFunctionsByModelQueryHookResult = ReturnType<typeof useGetSettingsWebhooksExecutableFunctionsByModelQuery>;
export type GetSettingsWebhooksExecutableFunctionsByModelLazyQueryHookResult = ReturnType<typeof useGetSettingsWebhooksExecutableFunctionsByModelLazyQuery>;
export type GetSettingsWebhooksExecutableFunctionsByModelSuspenseQueryHookResult = ReturnType<typeof useGetSettingsWebhooksExecutableFunctionsByModelSuspenseQuery>;
export type GetSettingsWebhooksExecutableFunctionsByModelQueryResult = Apollo.QueryResult<GetSettingsWebhooksExecutableFunctionsByModelQuery, GetSettingsWebhooksExecutableFunctionsByModelQueryVariables>;
export const GetProjectRolesDocument = gql`
    query getProjectRoles {
  currentProject {
    roles
  }
}
    `;

/**
 * __useGetProjectRolesQuery__
 *
 * To run a query within a React component, call `useGetProjectRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectRolesQuery(baseOptions?: Apollo.QueryHookOptions<GetProjectRolesQuery, GetProjectRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectRolesQuery, GetProjectRolesQueryVariables>(GetProjectRolesDocument, options);
      }
export function useGetProjectRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectRolesQuery, GetProjectRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectRolesQuery, GetProjectRolesQueryVariables>(GetProjectRolesDocument, options);
        }
export function useGetProjectRolesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectRolesQuery, GetProjectRolesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectRolesQuery, GetProjectRolesQueryVariables>(GetProjectRolesDocument, options);
        }
export type GetProjectRolesQueryHookResult = ReturnType<typeof useGetProjectRolesQuery>;
export type GetProjectRolesLazyQueryHookResult = ReturnType<typeof useGetProjectRolesLazyQuery>;
export type GetProjectRolesSuspenseQueryHookResult = ReturnType<typeof useGetProjectRolesSuspenseQuery>;
export type GetProjectRolesQueryResult = Apollo.QueryResult<GetProjectRolesQuery, GetProjectRolesQueryVariables>;
export const GetSettingsTeamsMembersDocument = gql`
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
    `;

/**
 * __useGetSettingsTeamsMembersQuery__
 *
 * To run a query within a React component, call `useGetSettingsTeamsMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingsTeamsMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSettingsTeamsMembersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSettingsTeamsMembersQuery(baseOptions?: Apollo.QueryHookOptions<GetSettingsTeamsMembersQuery, GetSettingsTeamsMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSettingsTeamsMembersQuery, GetSettingsTeamsMembersQueryVariables>(GetSettingsTeamsMembersDocument, options);
      }
export function useGetSettingsTeamsMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSettingsTeamsMembersQuery, GetSettingsTeamsMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSettingsTeamsMembersQuery, GetSettingsTeamsMembersQueryVariables>(GetSettingsTeamsMembersDocument, options);
        }
export function useGetSettingsTeamsMembersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSettingsTeamsMembersQuery, GetSettingsTeamsMembersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSettingsTeamsMembersQuery, GetSettingsTeamsMembersQueryVariables>(GetSettingsTeamsMembersDocument, options);
        }
export type GetSettingsTeamsMembersQueryHookResult = ReturnType<typeof useGetSettingsTeamsMembersQuery>;
export type GetSettingsTeamsMembersLazyQueryHookResult = ReturnType<typeof useGetSettingsTeamsMembersLazyQuery>;
export type GetSettingsTeamsMembersSuspenseQueryHookResult = ReturnType<typeof useGetSettingsTeamsMembersSuspenseQuery>;
export type GetSettingsTeamsMembersQueryResult = Apollo.QueryResult<GetSettingsTeamsMembersQuery, GetSettingsTeamsMembersQueryVariables>;
export const SearchUsersDocument = gql`
    query searchUsers($project_id: String, $limit: Int, $page: Int, $first_name: String, $last_name: String, $organization_id: String, $username: String, $email: String) {
  searchUsers(
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
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      project_id: // value for 'project_id'
 *      limit: // value for 'limit'
 *      page: // value for 'page'
 *      first_name: // value for 'first_name'
 *      last_name: // value for 'last_name'
 *      organization_id: // value for 'organization_id'
 *      username: // value for 'username'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions?: Apollo.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export function useSearchUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersSuspenseQueryHookResult = ReturnType<typeof useSearchUsersSuspenseQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;
export const GetPermissionsAndScopesDocument = gql`
    query getPermissionsAndScopes {
  listPermissionsAndScopes {
    permissions
    models
    functions
  }
}
    `;

/**
 * __useGetPermissionsAndScopesQuery__
 *
 * To run a query within a React component, call `useGetPermissionsAndScopesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPermissionsAndScopesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPermissionsAndScopesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPermissionsAndScopesQuery(baseOptions?: Apollo.QueryHookOptions<GetPermissionsAndScopesQuery, GetPermissionsAndScopesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPermissionsAndScopesQuery, GetPermissionsAndScopesQueryVariables>(GetPermissionsAndScopesDocument, options);
      }
export function useGetPermissionsAndScopesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPermissionsAndScopesQuery, GetPermissionsAndScopesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPermissionsAndScopesQuery, GetPermissionsAndScopesQueryVariables>(GetPermissionsAndScopesDocument, options);
        }
export function useGetPermissionsAndScopesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPermissionsAndScopesQuery, GetPermissionsAndScopesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPermissionsAndScopesQuery, GetPermissionsAndScopesQueryVariables>(GetPermissionsAndScopesDocument, options);
        }
export type GetPermissionsAndScopesQueryHookResult = ReturnType<typeof useGetPermissionsAndScopesQuery>;
export type GetPermissionsAndScopesLazyQueryHookResult = ReturnType<typeof useGetPermissionsAndScopesLazyQuery>;
export type GetPermissionsAndScopesSuspenseQueryHookResult = ReturnType<typeof useGetPermissionsAndScopesSuspenseQuery>;
export type GetPermissionsAndScopesQueryResult = Apollo.QueryResult<GetPermissionsAndScopesQuery, GetPermissionsAndScopesQueryVariables>;
export const GetSettingsDocument = gql`
    query getSettings {
  currentProject {
    id
    name
    description
    roles
    tenant_model_name
    project_secret_key
    settings {
      locals
      enable_revision_history
      system_graphql_hooks
      default_storage_plugin
      default_function_plugin
      default_locale
    }
    created_at
  }
}
    `;

/**
 * __useGetSettingsQuery__
 *
 * To run a query within a React component, call `useGetSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSettingsQuery(baseOptions?: Apollo.QueryHookOptions<GetSettingsQuery, GetSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, options);
      }
export function useGetSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSettingsQuery, GetSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, options);
        }
export function useGetSettingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSettingsQuery, GetSettingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, options);
        }
export type GetSettingsQueryHookResult = ReturnType<typeof useGetSettingsQuery>;
export type GetSettingsLazyQueryHookResult = ReturnType<typeof useGetSettingsLazyQuery>;
export type GetSettingsSuspenseQueryHookResult = ReturnType<typeof useGetSettingsSuspenseQuery>;
export type GetSettingsQueryResult = Apollo.QueryResult<GetSettingsQuery, GetSettingsQueryVariables>;