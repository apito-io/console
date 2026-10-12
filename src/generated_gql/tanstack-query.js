import { TypedDocumentString } from '../lib/typedDocumentString';
import { useMutation, useQuery } from '@tanstack/react-query';
import { graphqlFetcher } from '../lib/graphqlFetcher';
export var Field_Operation_Type_Enum;
(function (Field_Operation_Type_Enum) {
    /** Change the Type of a Field */
    Field_Operation_Type_Enum["ChangeType"] = "change_type";
    /** Delete a Field */
    Field_Operation_Type_Enum["Delete"] = "delete";
    /** Duplicate a Field */
    Field_Operation_Type_Enum["Duplicate"] = "duplicate";
    /** Move a Field */
    Field_Operation_Type_Enum["Move"] = "move";
    /** Rename a Field */
    Field_Operation_Type_Enum["Rename"] = "rename";
})(Field_Operation_Type_Enum || (Field_Operation_Type_Enum = {}));
export var Field_Sub_Type_Enum;
(function (Field_Sub_Type_Enum) {
    /** Dropdown Field */
    Field_Sub_Type_Enum["Dropdown"] = "dropdown";
    /** Incremental Dynamic List of Item */
    Field_Sub_Type_Enum["DynamicList"] = "dynamicList";
    /** Multiple Select */
    Field_Sub_Type_Enum["MultiSelect"] = "multiSelect";
})(Field_Sub_Type_Enum || (Field_Sub_Type_Enum = {}));
export var Field_Type_Enum;
(function (Field_Type_Enum) {
    /** Module Type */
    Field_Type_Enum["Boolean"] = "boolean";
    /** Floating Point Number */
    Field_Type_Enum["Date"] = "date";
    /** Module Type */
    Field_Type_Enum["Geo"] = "geo";
    /** Module Type */
    Field_Type_Enum["List"] = "list";
    /** Media Module Type */
    Field_Type_Enum["Media"] = "media";
    /** Multi Line Text */
    Field_Type_Enum["Multiline"] = "multiline";
    /** Number Field */
    Field_Type_Enum["Number"] = "number";
    /** Single Object Field Type */
    Field_Type_Enum["Object"] = "object";
    /** Array of Object Field Type */
    Field_Type_Enum["Repeated"] = "repeated";
    /** Text Field */
    Field_Type_Enum["Text"] = "text";
})(Field_Type_Enum || (Field_Type_Enum = {}));
export var Filter_Status_Type_Enum;
(function (Filter_Status_Type_Enum) {
    /** Filter All Status Document */
    Filter_Status_Type_Enum["All"] = "all";
    /** When Document is in Draft */
    Filter_Status_Type_Enum["Draft"] = "draft";
    /** When Document is published */
    Filter_Status_Type_Enum["Published"] = "published";
})(Filter_Status_Type_Enum || (Filter_Status_Type_Enum = {}));
export var Input_Type_Enum;
(function (Input_Type_Enum) {
    /** True/ False Value */
    Input_Type_Enum["Bool"] = "bool";
    /** Floating Point Number */
    Input_Type_Enum["Double"] = "double";
    /** GEO Location Type */
    Input_Type_Enum["Geo"] = "geo";
    /** Integer/Number Type */
    Input_Type_Enum["Int"] = "int";
    /** Object Input Type */
    Input_Type_Enum["Object"] = "object";
    /** Array Input Type */
    Input_Type_Enum["Repeated"] = "repeated";
    /** String Type */
    Input_Type_Enum["String"] = "string";
})(Input_Type_Enum || (Input_Type_Enum = {}));
export var Plugin_Activation_Type_Enum;
(function (Plugin_Activation_Type_Enum) {
    /** Third Party Plugin Gets Installed by Github */
    Plugin_Activation_Type_Enum["Activated"] = "activated";
    /** Local Plugin Gets Build and Installed at Run Time */
    Plugin_Activation_Type_Enum["Deactivated"] = "deactivated";
})(Plugin_Activation_Type_Enum || (Plugin_Activation_Type_Enum = {}));
export var Plugin_Load_Type_Enum;
(function (Plugin_Load_Type_Enum) {
    /** Plugin is is Building */
    Plugin_Load_Type_Enum["Installed"] = "installed";
    /** Plugin load failed */
    Plugin_Load_Type_Enum["LoadFailed"] = "load_failed";
    /** Plugin is Loaded */
    Plugin_Load_Type_Enum["Loaded"] = "loaded";
    /** Plugin is Loading */
    Plugin_Load_Type_Enum["Loading"] = "loading";
    /** Plugin is not Installed */
    Plugin_Load_Type_Enum["NotInstalled"] = "not_installed";
    /** Plugin is Built */
    Plugin_Load_Type_Enum["ReInstall"] = "re_install";
})(Plugin_Load_Type_Enum || (Plugin_Load_Type_Enum = {}));
export var Plugin_Type_Enum;
(function (Plugin_Type_Enum) {
    /** Function Type Plugin */
    Plugin_Type_Enum["Project"] = "project";
    /** Extension Type Plugin */
    Plugin_Type_Enum["System"] = "system";
})(Plugin_Type_Enum || (Plugin_Type_Enum = {}));
export var Relation_Type_Enum;
(function (Relation_Type_Enum) {
    /** Has Many Relations */
    Relation_Type_Enum["HasMany"] = "has_many";
    /** One to One Relation */
    Relation_Type_Enum["HasOne"] = "has_one";
})(Relation_Type_Enum || (Relation_Type_Enum = {}));
export var UpdateModelTypeEnum;
(function (UpdateModelTypeEnum) {
    UpdateModelTypeEnum["Convert"] = "convert";
    UpdateModelTypeEnum["Delete"] = "delete";
    UpdateModelTypeEnum["Duplicate"] = "duplicate";
    UpdateModelTypeEnum["Rename"] = "rename";
    UpdateModelTypeEnum["Update"] = "update";
})(UpdateModelTypeEnum || (UpdateModelTypeEnum = {}));
export const UpsertFunctionToProjectDocument = new TypedDocumentString(`
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
    `);
export const useUpsertFunctionToProjectMutation = (options) => {
    return useMutation({
        mutationKey: ['upsertFunctionToProject'],
        mutationFn: (variables) => graphqlFetcher(UpsertFunctionToProjectDocument, variables)(),
        ...options
    });
};
useUpsertFunctionToProjectMutation.fetcher = (variables, options) => graphqlFetcher(UpsertFunctionToProjectDocument, variables, options);
export const DeleteFunctionFromProjectDocument = new TypedDocumentString(`
    mutation deleteFunctionFromProject($function: String!) {
  deleteFunctionFromProject(function: $function) {
    id
    name
  }
}
    `);
export const useDeleteFunctionFromProjectMutation = (options) => {
    return useMutation({
        mutationKey: ['deleteFunctionFromProject'],
        mutationFn: (variables) => graphqlFetcher(DeleteFunctionFromProjectDocument, variables)(),
        ...options
    });
};
useDeleteFunctionFromProjectMutation.fetcher = (variables, options) => graphqlFetcher(DeleteFunctionFromProjectDocument, variables, options);
export const UpsertFieldToModelDocument = new TypedDocumentString(`
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
    `);
export const useUpsertFieldToModelMutation = (options) => {
    return useMutation({
        mutationKey: ['upsertFieldToModel'],
        mutationFn: (variables) => graphqlFetcher(UpsertFieldToModelDocument, variables)(),
        ...options
    });
};
useUpsertFieldToModelMutation.fetcher = (variables, options) => graphqlFetcher(UpsertFieldToModelDocument, variables, options);
export const CreateModelDocument = new TypedDocumentString(`
    mutation createModel($name: String!, $single_record: Boolean) {
  addModelToProject(name: $name, single_record: $single_record) {
    name
  }
}
    `);
export const useCreateModelMutation = (options) => {
    return useMutation({
        mutationKey: ['createModel'],
        mutationFn: (variables) => graphqlFetcher(CreateModelDocument, variables)(),
        ...options
    });
};
useCreateModelMutation.fetcher = (variables, options) => graphqlFetcher(CreateModelDocument, variables, options);
export const UpdateModelDocument = new TypedDocumentString(`
    mutation updateModel($type: UpdateModelTypeEnum!, $new_name: String, $model_name: String!) {
  updateModel(type: $type, new_name: $new_name, model_name: $model_name) {
    name
  }
}
    `);
export const useUpdateModelMutation = (options) => {
    return useMutation({
        mutationKey: ['updateModel'],
        mutationFn: (variables) => graphqlFetcher(UpdateModelDocument, variables)(),
        ...options
    });
};
useUpdateModelMutation.fetcher = (variables, options) => graphqlFetcher(UpdateModelDocument, variables, options);
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
export const useUpdateModelRelationMutation = (options) => {
    return useMutation({
        mutationKey: ['updateModelRelation'],
        mutationFn: (variables) => graphqlFetcher(UpdateModelRelationDocument, variables)(),
        ...options
    });
};
useUpdateModelRelationMutation.fetcher = (variables, options) => graphqlFetcher(UpdateModelRelationDocument, variables, options);
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
export const useDeleteConnectionFromModelMutation = (options) => {
    return useMutation({
        mutationKey: ['deleteConnectionFromModel'],
        mutationFn: (variables) => graphqlFetcher(DeleteConnectionFromModelDocument, variables)(),
        ...options
    });
};
useDeleteConnectionFromModelMutation.fetcher = (variables, options) => graphqlFetcher(DeleteConnectionFromModelDocument, variables, options);
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
export const useModelFieldOperationMutation = (options) => {
    return useMutation({
        mutationKey: ['modelFieldOperation'],
        mutationFn: (variables) => graphqlFetcher(ModelFieldOperationDocument, variables)(),
        ...options
    });
};
useModelFieldOperationMutation.fetcher = (variables, options) => graphqlFetcher(ModelFieldOperationDocument, variables, options);
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
export const useRearrangeFieldSerialMutation = (options) => {
    return useMutation({
        mutationKey: ['rearrangeFieldSerial'],
        mutationFn: (variables) => graphqlFetcher(RearrangeFieldSerialDocument, variables)(),
        ...options
    });
};
useRearrangeFieldSerialMutation.fetcher = (variables, options) => graphqlFetcher(RearrangeFieldSerialDocument, variables, options);
export const RemoveProjectSpecificPluginDocument = new TypedDocumentString(`
    mutation RemoveProjectSpecificPlugin($id: String!) {
  removeProjectSpecificPlugin(id: $id) {
    message
  }
}
    `);
export const useRemoveProjectSpecificPluginMutation = (options) => {
    return useMutation({
        mutationKey: ['RemoveProjectSpecificPlugin'],
        mutationFn: (variables) => graphqlFetcher(RemoveProjectSpecificPluginDocument, variables)(),
        ...options
    });
};
useRemoveProjectSpecificPluginMutation.fetcher = (variables, options) => graphqlFetcher(RemoveProjectSpecificPluginDocument, variables, options);
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
    type
    version
  }
}
    `);
export const useUpsertPluginDetailsMutation = (options) => {
    return useMutation({
        mutationKey: ['upsertPluginDetails'],
        mutationFn: (variables) => graphqlFetcher(UpsertPluginDetailsDocument, variables)(),
        ...options
    });
};
useUpsertPluginDetailsMutation.fetcher = (variables, options) => graphqlFetcher(UpsertPluginDetailsDocument, variables, options);
export const UpdateProjectAuthenticationSettingsDocument = new TypedDocumentString(`
    mutation updateProjectAuthenticationSettings($input: UpdateProjectAuthenticationInput!) {
  updateProjectAuthenticationSettings(input: $input) {
    authentication_settings {
      enable_general_auth
      enable_google_auth
      general_authentication_method
      google_client_id
      google_oauth_redirect_uri
      has_google_client_secret
    }
  }
}
    `);
export const useUpdateProjectAuthenticationSettingsMutation = (options) => {
    return useMutation({
        mutationKey: ['updateProjectAuthenticationSettings'],
        mutationFn: (variables) => graphqlFetcher(UpdateProjectAuthenticationSettingsDocument, variables)(),
        ...options
    });
};
useUpdateProjectAuthenticationSettingsMutation.fetcher = (variables, options) => graphqlFetcher(UpdateProjectAuthenticationSettingsDocument, variables, options);
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
export const useUpdateProjectStorageSettingsMutation = (options) => {
    return useMutation({
        mutationKey: ['updateProjectStorageSettings'],
        mutationFn: (variables) => graphqlFetcher(UpdateProjectStorageSettingsDocument, variables)(),
        ...options
    });
};
useUpdateProjectStorageSettingsMutation.fetcher = (variables, options) => graphqlFetcher(UpdateProjectStorageSettingsDocument, variables, options);
export const GenerateProjectTokenDocument = new TypedDocumentString(`
    mutation generateProjectToken($name: String!, $duration: String!, $role: String!) {
  generateProjectToken(name: $name, duration: $duration, role: $role) {
    token
  }
}
    `);
export const useGenerateProjectTokenMutation = (options) => {
    return useMutation({
        mutationKey: ['generateProjectToken'],
        mutationFn: (variables) => graphqlFetcher(GenerateProjectTokenDocument, variables)(),
        ...options
    });
};
useGenerateProjectTokenMutation.fetcher = (variables, options) => graphqlFetcher(GenerateProjectTokenDocument, variables, options);
export const DeleteProjectTokenDocument = new TypedDocumentString(`
    mutation deleteProjectToken($duration: String!, $token: String!) {
  deleteProjectToken(duration: $duration, token: $token) {
    msg
  }
}
    `);
export const useDeleteProjectTokenMutation = (options) => {
    return useMutation({
        mutationKey: ['deleteProjectToken'],
        mutationFn: (variables) => graphqlFetcher(DeleteProjectTokenDocument, variables)(),
        ...options
    });
};
useDeleteProjectTokenMutation.fetcher = (variables, options) => graphqlFetcher(DeleteProjectTokenDocument, variables, options);
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
export const useUpdateProjectMutation = (options) => {
    return useMutation({
        mutationKey: ['updateProject'],
        mutationFn: (variables) => graphqlFetcher(UpdateProjectDocument, variables)(),
        ...options
    });
};
useUpdateProjectMutation.fetcher = (variables, options) => graphqlFetcher(UpdateProjectDocument, variables, options);
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
export const useUpsertRoleToProjectMutation = (options) => {
    return useMutation({
        mutationKey: ['upsertRoleToProject'],
        mutationFn: (variables) => graphqlFetcher(UpsertRoleToProjectDocument, variables)(),
        ...options
    });
};
useUpsertRoleToProjectMutation.fetcher = (variables, options) => graphqlFetcher(UpsertRoleToProjectDocument, variables, options);
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
export const useDuplicateRoleInProjectMutation = (options) => {
    return useMutation({
        mutationKey: ['duplicateRoleInProject'],
        mutationFn: (variables) => graphqlFetcher(DuplicateRoleInProjectDocument, variables)(),
        ...options
    });
};
useDuplicateRoleInProjectMutation.fetcher = (variables, options) => graphqlFetcher(DuplicateRoleInProjectDocument, variables, options);
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
export const useUpdateSettingGeneralMutation = (options) => {
    return useMutation({
        mutationKey: ['updateSettingGeneral'],
        mutationFn: (variables) => graphqlFetcher(UpdateSettingGeneralDocument, variables)(),
        ...options
    });
};
useUpdateSettingGeneralMutation.fetcher = (variables, options) => graphqlFetcher(UpdateSettingGeneralDocument, variables, options);
export const UpdateSettingTeamsDocument = new TypedDocumentString(`
    mutation updateSettingTeams($add_team_member: AddTeamMemberPayload, $remove_team_member: RemoveTeamMemberPayload) {
  updateProject(
    add_team_member: $add_team_member
    remove_team_member: $remove_team_member
  ) {
    _key
    id
  }
}
    `);
export const useUpdateSettingTeamsMutation = (options) => {
    return useMutation({
        mutationKey: ['updateSettingTeams'],
        mutationFn: (variables) => graphqlFetcher(UpdateSettingTeamsDocument, variables)(),
        ...options
    });
};
useUpdateSettingTeamsMutation.fetcher = (variables, options) => graphqlFetcher(UpdateSettingTeamsDocument, variables, options);
export const UpdateSettingsDocument = new TypedDocumentString(`
    mutation updateSettings($name: String, $description: String, $settings: UpdateSettingsPayload) {
  updateProject(name: $name, description: $description, settings: $settings) {
    _key
    id
    name
    description
    project_secret_key
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
    `);
export const useUpdateSettingsMutation = (options) => {
    return useMutation({
        mutationKey: ['updateSettings'],
        mutationFn: (variables) => graphqlFetcher(UpdateSettingsDocument, variables)(),
        ...options
    });
};
useUpdateSettingsMutation.fetcher = (variables, options) => graphqlFetcher(UpdateSettingsDocument, variables, options);
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
export const useCreateSettingsWebhookMutation = (options) => {
    return useMutation({
        mutationKey: ['createSettingsWebhook'],
        mutationFn: (variables) => graphqlFetcher(CreateSettingsWebhookDocument, variables)(),
        ...options
    });
};
useCreateSettingsWebhookMutation.fetcher = (variables, options) => graphqlFetcher(CreateSettingsWebhookDocument, variables, options);
export const DeleteSettingsWeekhookDocument = new TypedDocumentString(`
    mutation deleteSettingsWeekhook($id: String!) {
  deleteWebHook(id: $id) {
    msg
  }
}
    `);
export const useDeleteSettingsWeekhookMutation = (options) => {
    return useMutation({
        mutationKey: ['deleteSettingsWeekhook'],
        mutationFn: (variables) => graphqlFetcher(DeleteSettingsWeekhookDocument, variables)(),
        ...options
    });
};
useDeleteSettingsWeekhookMutation.fetcher = (variables, options) => graphqlFetcher(DeleteSettingsWeekhookDocument, variables, options);
export const DeleteSettingsRoleFromProjectDocument = new TypedDocumentString(`
    mutation deleteSettingsRoleFromProject($role: String!) {
  deleteRoleFromProject(role: $role) {
    message
  }
}
    `);
export const useDeleteSettingsRoleFromProjectMutation = (options) => {
    return useMutation({
        mutationKey: ['deleteSettingsRoleFromProject'],
        mutationFn: (variables) => graphqlFetcher(DeleteSettingsRoleFromProjectDocument, variables)(),
        ...options
    });
};
useDeleteSettingsRoleFromProjectMutation.fetcher = (variables, options) => graphqlFetcher(DeleteSettingsRoleFromProjectDocument, variables, options);
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
export const useUpdateUserProfileMutation = (options) => {
    return useMutation({
        mutationKey: ['updateUserProfile'],
        mutationFn: (variables) => graphqlFetcher(UpdateUserProfileDocument, variables)(),
        ...options
    });
};
useUpdateUserProfileMutation.fetcher = (variables, options) => graphqlFetcher(UpdateUserProfileDocument, variables, options);
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
export const useCreateUserMutation = (options) => {
    return useMutation({
        mutationKey: ['createUser'],
        mutationFn: (variables) => graphqlFetcher(CreateUserDocument, variables)(),
        ...options
    });
};
useCreateUserMutation.fetcher = (variables, options) => graphqlFetcher(CreateUserDocument, variables, options);
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
export const useUpdateUserMutation = (options) => {
    return useMutation({
        mutationKey: ['updateUser'],
        mutationFn: (variables) => graphqlFetcher(UpdateUserDocument, variables)(),
        ...options
    });
};
useUpdateUserMutation.fetcher = (variables, options) => graphqlFetcher(UpdateUserDocument, variables, options);
export const DeleteUserDocument = new TypedDocumentString(`
    mutation deleteUser($user_id: String!) {
  deleteUser(user_id: $user_id)
}
    `);
export const useDeleteUserMutation = (options) => {
    return useMutation({
        mutationKey: ['deleteUser'],
        mutationFn: (variables) => graphqlFetcher(DeleteUserDocument, variables)(),
        ...options
    });
};
useDeleteUserMutation.fetcher = (variables, options) => graphqlFetcher(DeleteUserDocument, variables, options);
export const ResetUserPasswordDocument = new TypedDocumentString(`
    mutation resetUserPassword($user_id: String!, $password: String!) {
  resetUserPassword(user_id: $user_id, password: $password)
}
    `);
export const useResetUserPasswordMutation = (options) => {
    return useMutation({
        mutationKey: ['resetUserPassword'],
        mutationFn: (variables) => graphqlFetcher(ResetUserPasswordDocument, variables)(),
        ...options
    });
};
useResetUserPasswordMutation.fetcher = (variables, options) => graphqlFetcher(ResetUserPasswordDocument, variables, options);
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
export const useGetLoggedInUserQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getLoggedInUser'] : ['getLoggedInUser', variables],
        queryFn: graphqlFetcher(GetLoggedInUserDocument, variables),
        ...options
    });
};
useGetLoggedInUserQuery.getKey = (variables) => variables === undefined ? ['getLoggedInUser'] : ['getLoggedInUser', variables];
useGetLoggedInUserQuery.fetcher = (variables, options) => graphqlFetcher(GetLoggedInUserDocument, variables, options);
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
export const useGetAuditLogsQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getAuditLogs'] : ['getAuditLogs', variables],
        queryFn: graphqlFetcher(GetAuditLogsDocument, variables),
        ...options
    });
};
useGetAuditLogsQuery.getKey = (variables) => variables === undefined ? ['getAuditLogs'] : ['getAuditLogs', variables];
useGetAuditLogsQuery.fetcher = (variables, options) => graphqlFetcher(GetAuditLogsDocument, variables, options);
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
export const useUpdateSingleDataMutation = (options) => {
    return useMutation({
        mutationKey: ['updateSingleData'],
        mutationFn: (variables) => graphqlFetcher(UpdateSingleDataDocument, variables)(),
        ...options
    });
};
useUpdateSingleDataMutation.fetcher = (variables, options) => graphqlFetcher(UpdateSingleDataDocument, variables, options);
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
export const useGetMultipleDataQuery = (variables, options) => {
    return useQuery({
        queryKey: ['GetMultipleData', variables],
        queryFn: graphqlFetcher(GetMultipleDataDocument, variables),
        ...options
    });
};
useGetMultipleDataQuery.getKey = (variables) => ['GetMultipleData', variables];
useGetMultipleDataQuery.fetcher = (variables, options) => graphqlFetcher(GetMultipleDataDocument, variables, options);
export const DeleteModelDataDocument = new TypedDocumentString(`
    mutation deleteModelData($model_name: String!, $_id: String) {
  deleteModelData(model_name: $model_name, _id: $_id) {
    id
  }
}
    `);
export const useDeleteModelDataMutation = (options) => {
    return useMutation({
        mutationKey: ['deleteModelData'],
        mutationFn: (variables) => graphqlFetcher(DeleteModelDataDocument, variables)(),
        ...options
    });
};
useDeleteModelDataMutation.fetcher = (variables, options) => graphqlFetcher(DeleteModelDataDocument, variables, options);
export const DuplicateModelDataDocument = new TypedDocumentString(`
    mutation duplicateModelData($model_name: String!, $_id: String) {
  duplicateModelData(model_name: $model_name, _id: $_id) {
    id
  }
}
    `);
export const useDuplicateModelDataMutation = (options) => {
    return useMutation({
        mutationKey: ['duplicateModelData'],
        mutationFn: (variables) => graphqlFetcher(DuplicateModelDataDocument, variables)(),
        ...options
    });
};
useDuplicateModelDataMutation.fetcher = (variables, options) => graphqlFetcher(DuplicateModelDataDocument, variables, options);
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
export const useFormDataQueryRevisionQuery = (variables, options) => {
    return useQuery({
        queryKey: ['FormDataQueryRevision', variables],
        queryFn: graphqlFetcher(FormDataQueryRevisionDocument, variables),
        ...options
    });
};
useFormDataQueryRevisionQuery.getKey = (variables) => ['FormDataQueryRevision', variables];
useFormDataQueryRevisionQuery.fetcher = (variables, options) => graphqlFetcher(FormDataQueryRevisionDocument, variables, options);
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
export const useGetSingleDataQuery = (variables, options) => {
    return useQuery({
        queryKey: ['GetSingleData', variables],
        queryFn: graphqlFetcher(GetSingleDataDocument, variables),
        ...options
    });
};
useGetSingleDataQuery.getKey = (variables) => ['GetSingleData', variables];
useGetSingleDataQuery.fetcher = (variables, options) => graphqlFetcher(GetSingleDataDocument, variables, options);
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
export const useCreateModelDataMutation = (options) => {
    return useMutation({
        mutationKey: ['createModelData'],
        mutationFn: (variables) => graphqlFetcher(CreateModelDataDocument, variables)(),
        ...options
    });
};
useCreateModelDataMutation.fetcher = (variables, options) => graphqlFetcher(CreateModelDataDocument, variables, options);
export const ListAvailableFunctionsDocument = new TypedDocumentString(`
    query listAvailableFunctions($function_id: String!) {
  listAvailableFunctions(function_id: $function_id) {
    functions
  }
}
    `);
export const useListAvailableFunctionsQuery = (variables, options) => {
    return useQuery({
        queryKey: ['listAvailableFunctions', variables],
        queryFn: graphqlFetcher(ListAvailableFunctionsDocument, variables),
        ...options
    });
};
useListAvailableFunctionsQuery.getKey = (variables) => ['listAvailableFunctions', variables];
useListAvailableFunctionsQuery.fetcher = (variables, options) => graphqlFetcher(ListAvailableFunctionsDocument, variables, options);
export const GetAllFunctionInfoDocument = new TypedDocumentString(`
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
    `);
export const useGetAllFunctionInfoQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getAllFunctionInfo'] : ['getAllFunctionInfo', variables],
        queryFn: graphqlFetcher(GetAllFunctionInfoDocument, variables),
        ...options
    });
};
useGetAllFunctionInfoQuery.getKey = (variables) => variables === undefined ? ['getAllFunctionInfo'] : ['getAllFunctionInfo', variables];
useGetAllFunctionInfoQuery.fetcher = (variables, options) => graphqlFetcher(GetAllFunctionInfoDocument, variables, options);
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
export const useGetOnlyModelsInfoQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getOnlyModelsInfo'] : ['getOnlyModelsInfo', variables],
        queryFn: graphqlFetcher(GetOnlyModelsInfoDocument, variables),
        ...options
    });
};
useGetOnlyModelsInfoQuery.getKey = (variables) => variables === undefined ? ['getOnlyModelsInfo'] : ['getOnlyModelsInfo', variables];
useGetOnlyModelsInfoQuery.fetcher = (variables, options) => graphqlFetcher(GetOnlyModelsInfoDocument, variables, options);
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
export const useGetModelDetailsQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getModelDetails'] : ['getModelDetails', variables],
        queryFn: graphqlFetcher(GetModelDetailsDocument, variables),
        ...options
    });
};
useGetModelDetailsQuery.getKey = (variables) => variables === undefined ? ['getModelDetails'] : ['getModelDetails', variables];
useGetModelDetailsQuery.fetcher = (variables, options) => graphqlFetcher(GetModelDetailsDocument, variables, options);
export const GetSystemPluginsDocument = new TypedDocumentString(`
    query GetSystemPlugins($name: String, $limit: Int, $page: Int, $project_id: String) {
  getSystemPlugins(
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
    `);
export const useGetSystemPluginsQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['GetSystemPlugins'] : ['GetSystemPlugins', variables],
        queryFn: graphqlFetcher(GetSystemPluginsDocument, variables),
        ...options
    });
};
useGetSystemPluginsQuery.getKey = (variables) => variables === undefined ? ['GetSystemPlugins'] : ['GetSystemPlugins', variables];
useGetSystemPluginsQuery.fetcher = (variables, options) => graphqlFetcher(GetSystemPluginsDocument, variables, options);
export const GetProjectPluginsDocument = new TypedDocumentString(`
    query GetProjectPlugins($name: String, $limit: Int, $page: Int) {
  getProjectPlugins(
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
    `);
export const useGetProjectPluginsQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['GetProjectPlugins'] : ['GetProjectPlugins', variables],
        queryFn: graphqlFetcher(GetProjectPluginsDocument, variables),
        ...options
    });
};
useGetProjectPluginsQuery.getKey = (variables) => variables === undefined ? ['GetProjectPlugins'] : ['GetProjectPlugins', variables];
useGetProjectPluginsQuery.fetcher = (variables, options) => graphqlFetcher(GetProjectPluginsDocument, variables, options);
export const ListPluginIdsDocument = new TypedDocumentString(`
    query listPluginIds($type: PLUGIN_TYPE_ENUM!) {
  listPluginIds(type: $type) {
    type
    plugins
  }
}
    `);
export const useListPluginIdsQuery = (variables, options) => {
    return useQuery({
        queryKey: ['listPluginIds', variables],
        queryFn: graphqlFetcher(ListPluginIdsDocument, variables),
        ...options
    });
};
useListPluginIdsQuery.getKey = (variables) => ['listPluginIds', variables];
useListPluginIdsQuery.fetcher = (variables, options) => graphqlFetcher(ListPluginIdsDocument, variables, options);
export const GetProjectAuthenticationDocument = new TypedDocumentString(`
    query getProjectAuthentication($_id: String = "") {
  getProject(_id: $_id) {
    authentication_settings {
      enable_general_auth
      enable_google_auth
      general_authentication_method
      google_client_id
      google_oauth_redirect_uri
      has_google_client_secret
    }
  }
}
    `);
export const useGetProjectAuthenticationQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getProjectAuthentication'] : ['getProjectAuthentication', variables],
        queryFn: graphqlFetcher(GetProjectAuthenticationDocument, variables),
        ...options
    });
};
useGetProjectAuthenticationQuery.getKey = (variables) => variables === undefined ? ['getProjectAuthentication'] : ['getProjectAuthentication', variables];
useGetProjectAuthenticationQuery.fetcher = (variables, options) => graphqlFetcher(GetProjectAuthenticationDocument, variables, options);
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
export const useGetProjectStorageQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getProjectStorage'] : ['getProjectStorage', variables],
        queryFn: graphqlFetcher(GetProjectStorageDocument, variables),
        ...options
    });
};
useGetProjectStorageQuery.getKey = (variables) => variables === undefined ? ['getProjectStorage'] : ['getProjectStorage', variables];
useGetProjectStorageQuery.fetcher = (variables, options) => graphqlFetcher(GetProjectStorageDocument, variables, options);
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
export const useGetCurrentProjectQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getCurrentProject'] : ['getCurrentProject', variables],
        queryFn: graphqlFetcher(GetCurrentProjectDocument, variables),
        ...options
    });
};
useGetCurrentProjectQuery.getKey = (variables) => variables === undefined ? ['getCurrentProject'] : ['getCurrentProject', variables];
useGetCurrentProjectQuery.fetcher = (variables, options) => graphqlFetcher(GetCurrentProjectDocument, variables, options);
export const GetCurrentProjectTokensDocument = new TypedDocumentString(`
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
    `);
export const useGetCurrentProjectTokensQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getCurrentProjectTokens'] : ['getCurrentProjectTokens', variables],
        queryFn: graphqlFetcher(GetCurrentProjectTokensDocument, variables),
        ...options
    });
};
useGetCurrentProjectTokensQuery.getKey = (variables) => variables === undefined ? ['getCurrentProjectTokens'] : ['getCurrentProjectTokens', variables];
useGetCurrentProjectTokensQuery.fetcher = (variables, options) => graphqlFetcher(GetCurrentProjectTokensDocument, variables, options);
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
export const useGetProjectDriverInfoQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getProjectDriverInfo'] : ['getProjectDriverInfo', variables],
        queryFn: graphqlFetcher(GetProjectDriverInfoDocument, variables),
        ...options
    });
};
useGetProjectDriverInfoQuery.getKey = (variables) => variables === undefined ? ['getProjectDriverInfo'] : ['getProjectDriverInfo', variables];
useGetProjectDriverInfoQuery.fetcher = (variables, options) => graphqlFetcher(GetProjectDriverInfoDocument, variables, options);
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
export const useGetSettingsWebhooksQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getSettingsWebhooks'] : ['getSettingsWebhooks', variables],
        queryFn: graphqlFetcher(GetSettingsWebhooksDocument, variables),
        ...options
    });
};
useGetSettingsWebhooksQuery.getKey = (variables) => variables === undefined ? ['getSettingsWebhooks'] : ['getSettingsWebhooks', variables];
useGetSettingsWebhooksQuery.fetcher = (variables, options) => graphqlFetcher(GetSettingsWebhooksDocument, variables, options);
export const GetSettingsWebhooksExecutableFunctionsByModelDocument = new TypedDocumentString(`
    query getSettingsWebhooksExecutableFunctionsByModel($project_id: String, $model: String) {
  listExecutableFunctions(_id: $project_id, model_name: $model) {
    functions
  }
}
    `);
export const useGetSettingsWebhooksExecutableFunctionsByModelQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getSettingsWebhooksExecutableFunctionsByModel'] : ['getSettingsWebhooksExecutableFunctionsByModel', variables],
        queryFn: graphqlFetcher(GetSettingsWebhooksExecutableFunctionsByModelDocument, variables),
        ...options
    });
};
useGetSettingsWebhooksExecutableFunctionsByModelQuery.getKey = (variables) => variables === undefined ? ['getSettingsWebhooksExecutableFunctionsByModel'] : ['getSettingsWebhooksExecutableFunctionsByModel', variables];
useGetSettingsWebhooksExecutableFunctionsByModelQuery.fetcher = (variables, options) => graphqlFetcher(GetSettingsWebhooksExecutableFunctionsByModelDocument, variables, options);
export const GetProjectRolesDocument = new TypedDocumentString(`
    query getProjectRoles {
  currentProject {
    roles
  }
}
    `);
export const useGetProjectRolesQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getProjectRoles'] : ['getProjectRoles', variables],
        queryFn: graphqlFetcher(GetProjectRolesDocument, variables),
        ...options
    });
};
useGetProjectRolesQuery.getKey = (variables) => variables === undefined ? ['getProjectRoles'] : ['getProjectRoles', variables];
useGetProjectRolesQuery.fetcher = (variables, options) => graphqlFetcher(GetProjectRolesDocument, variables, options);
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
export const useGetSettingsTeamsMembersQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getSettingsTeamsMembers'] : ['getSettingsTeamsMembers', variables],
        queryFn: graphqlFetcher(GetSettingsTeamsMembersDocument, variables),
        ...options
    });
};
useGetSettingsTeamsMembersQuery.getKey = (variables) => variables === undefined ? ['getSettingsTeamsMembers'] : ['getSettingsTeamsMembers', variables];
useGetSettingsTeamsMembersQuery.fetcher = (variables, options) => graphqlFetcher(GetSettingsTeamsMembersDocument, variables, options);
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
export const useSearchSystemUsersQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['searchSystemUsers'] : ['searchSystemUsers', variables],
        queryFn: graphqlFetcher(SearchSystemUsersDocument, variables),
        ...options
    });
};
useSearchSystemUsersQuery.getKey = (variables) => variables === undefined ? ['searchSystemUsers'] : ['searchSystemUsers', variables];
useSearchSystemUsersQuery.fetcher = (variables, options) => graphqlFetcher(SearchSystemUsersDocument, variables, options);
export const GetPermissionsAndScopesDocument = new TypedDocumentString(`
    query getPermissionsAndScopes {
  listPermissionsAndScopes {
    permissions
    models
    functions
  }
}
    `);
export const useGetPermissionsAndScopesQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getPermissionsAndScopes'] : ['getPermissionsAndScopes', variables],
        queryFn: graphqlFetcher(GetPermissionsAndScopesDocument, variables),
        ...options
    });
};
useGetPermissionsAndScopesQuery.getKey = (variables) => variables === undefined ? ['getPermissionsAndScopes'] : ['getPermissionsAndScopes', variables];
useGetPermissionsAndScopesQuery.fetcher = (variables, options) => graphqlFetcher(GetPermissionsAndScopesDocument, variables, options);
export const GetSettingsDocument = new TypedDocumentString(`
    query getSettings {
  currentProject {
    id
    name
    description
    roles
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
    `);
export const useGetSettingsQuery = (variables, options) => {
    return useQuery({
        queryKey: variables === undefined ? ['getSettings'] : ['getSettings', variables],
        queryFn: graphqlFetcher(GetSettingsDocument, variables),
        ...options
    });
};
useGetSettingsQuery.getKey = (variables) => variables === undefined ? ['getSettings'] : ['getSettings', variables];
useGetSettingsQuery.fetcher = (variables, options) => graphqlFetcher(GetSettingsDocument, variables, options);
export const SearchUsersDocument = new TypedDocumentString(`
    query searchUsers($project_id: String!, $limit: Int, $offset: Int) {
  searchUsers(project_id: $project_id, limit: $limit, offset: $offset) {
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
export const useSearchUsersQuery = (variables, options) => {
    return useQuery({
        queryKey: ['searchUsers', variables],
        queryFn: graphqlFetcher(SearchUsersDocument, variables),
        ...options
    });
};
useSearchUsersQuery.getKey = (variables) => ['searchUsers', variables];
useSearchUsersQuery.fetcher = (variables, options) => graphqlFetcher(SearchUsersDocument, variables, options);
