import { gql } from '@apollo/client';

export const UPSERT_PLUGIN = gql`
  mutation upsertPluginDetails(
    $id: String!
    $title: String
    $icon: String
    $version: String
    $description: String
    $type: PLUGIN_TYPE_ENUM
    $role: String
    $exported_variable: String
    $env_vars: [PluginConfigEnvVarsPayload]
    $enable: Boolean
    $repository_url: String
    $branch: String
    $author: String
    $activate_status: PLUGIN_ACTIVATION_TYPE_ENUM
  ) {
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