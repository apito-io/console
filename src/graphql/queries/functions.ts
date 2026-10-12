import { gql } from 'graphql-tag';

export const LIST_AVAILABLE_FUNCTIONS = gql`
  query listAvailableFunctions($function_id: String!) {
    listAvailableFunctions(function_id: $function_id) {
      functions
    }
  }
`;

export const GET_ALL_FUNCTION_INFO = gql`
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
`;

export const LIST_FUNCTION_REVISIONS = gql`
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
`;

export const LIST_FUNCTION_DEPLOYMENTS = gql`
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
`;
