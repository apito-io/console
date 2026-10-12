import { gql } from 'graphql-tag';

export const GET_CURRENT_PROJECT = gql`
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

export const GET_CURRENT_PROJECT_SECRETS = gql`
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
`;

export const GET_PROJECT_DRIVER_INFO = gql`
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
`; 