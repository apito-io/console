import { gql } from '@apollo/client';

export const GET_TENANTS = gql`
  query getTenants {
    getTenants {
      name
      logo
      id
    }
  }
`;

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
        token
        role
        expire
      }
    }
  }
`;

export const GET_PROJECT_DRIVER_INFO = gql`
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