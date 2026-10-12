import { gql } from 'graphql-tag';
export const UPDATE_SETTING_GENERAL = gql `
  mutation updateSettingGeneral($name: String, $description: String) {
    updateProject(name: $name, description: $description) {
      _key
      id
      name
      description
    }
  }
`;
export const UPDATE_SETTINGS = gql `
  mutation updateSettings(
    $name: String
    $description: String
    $settings: UpdateSettingsPayload
  ) {
    updateProject(
      name: $name
      description: $description
      settings: $settings
    ) {
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
`;
export const CREATE_SETTINGS_WEBHOOK = gql `
  mutation createSettingsWebhook(
    $events: [String]!
    $model: String!
    $name: String!
    $url: String!
    $logic_executions: [String]
  ) {
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
export const DELETE_SETTINGS_WEBHOOK = gql `
  mutation deleteSettingsWeekhook($id: String!) {
    deleteWebHook(id: $id) {
      msg
    }
  }
`;
export const DELETE_SETTINGS_ROLE_FROM_PROJECT = gql `
  mutation deleteSettingsRoleFromProject($role: String!) {
    deleteRoleFromProject(role: $role) {
      message
    }
  }
`;
