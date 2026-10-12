import { gql } from 'graphql-tag';
export const REMOVE_PROJECT_SPECIFIC_PLUGIN = gql `
  mutation RemoveProjectSpecificPlugin($id: String!) {
    removeProjectSpecificPlugin(id: $id) {
      message
    }
  }
`;
export const UPSERT_PLUGIN = gql `
  mutation upsertPluginDetails(
    $id: String!
    $env_vars: [PluginConfigEnvVarsPayload]
    $enable: Boolean
    $activate_status: PLUGIN_ACTIVATION_TYPE_ENUM
  ) {
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
`;
/*
export const PLUGIN_BUILD_TRIGGER = gql`
  mutation pluginBuildTrigger(
    $id: String!
    $type: PLUGIN_SYSTEM_TYPE_ENUM!
    $repository_url: String
    $current_status: PLUGIN_LOAD_TYPE_ENUM
    $build_command: PLUGIN_LOAD_TYPE_ENUM
    $branch: String
  ) {
    pluginBuildTrigger(
      id: $id
      type: $type
      repository_url: $repository_url
      current_status: $current_status
      build_command: $build_command
      branch: $branch
    ) {
      type
      version
      title
      role
      repository_url
      load_status
      icon
      exported_variable
      id
      env_vars {
        key
        value
      }
      enable
      description
      branch
      author
    }
  }
`;
*/ 
