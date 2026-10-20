import { gql } from 'graphql-tag';

export const GET_SETTINGS_WEBHOOKS = gql`
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

export const GET_WEBHOOKS_EXECUTABLE_FUNCTIONS = gql`
  query getSettingsWebhooksExecutableFunctionsByModel($project_id: String, $model: String) {
    listExecutableFunctions(_id: $project_id, model_name: $model) {
      functions
    }
  }
`;

export const GET_PROJECT_ROLES = gql`
  query getProjectRoles {
    currentProject {
      roles
    }
  }
`;

export const GET_TEAMS_MEMBERS = gql`
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

export const SEARCH_SYSTEM_USERS = gql`
  query searchSystemUsers(
    $project_id: String
    $limit: Int
    $page: Int
    $first_name: String
    $last_name: String
    $organization_id: String
    $username: String
    $email: String
  ) {
    searchSystemUsers(
      _id: $project_id
      filter: { limit: $limit, page: $page }
      where: {
        email: { eq: $email }
        first_name: { eq: $first_name }
        last_name: { eq: $last_name }
        organization_id: { eq: $organization_id }
        username: { eq: $username }
      }
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

export const GET_PERMISSIONS_AND_SCOPES = gql`
  query getPermissionsAndScopes {
    listPermissionsAndScopes {
      permissions
      models
      functions
    }
  }
`;

export const GET_SETTINGS = gql`
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
          android {
            min_version_name
            min_build_number
            force_update
            store_url
            message_en
            message_bn
            maintenance
            maintenance_hours
            extras
          }
          ios {
            min_version_name
            min_build_number
            force_update
            store_url
            message_en
            message_bn
            maintenance
            maintenance_hours
            extras
          }
          web {
            min_version_name
            min_build_number
            force_update
            store_url
            message_en
            message_bn
            maintenance
            maintenance_hours
            extras
          }
        }
      }
      created_at
    }
  }
`; 