import { gql } from '@apollo/client';

export const GET_PLUGINS = gql`
  query GetPlugins(
    $name: String
    $limit: Int
    $page: Int
    $project_id: String
  ) {
    getPlugins(
      _id: $project_id
      filter: { limit: $limit, page: $page }
      where: { name: { eq: $name } }
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

export const GET_PLUGIN_LIST = gql`
  query listPluginIds($type: PLUGIN_TYPE_ENUM!) {
    listPluginIds(type: $type) {
      type
      plugins
    }
  }
`; 