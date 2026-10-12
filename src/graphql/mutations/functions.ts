import { gql } from 'graphql-tag';

export const UPSERT_FUNCTION_TO_PROJECT = gql`
  mutation upsertFunctionToProject(
    $name: String!
    $description: String
    $function_connected: Boolean
    $function_provider_id: String
    $provider_exported_variable: String
    $function_exported_variable: String
    $graphql_schema_type: String
    $function_path: String
    $runtime_config: Function_Provider_Config_Payload
    $env_vars: [Function_Provider_Env_Vars_Payload]
    $request: String
    $request_payload_is_optional: Boolean
    $response: String
    $response_is_array: Boolean
    $update: Boolean
    $source: String
    $trigger_type: String
    $language: String
    $capabilities: [String]
  ) {
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
      source: $source
      trigger_type: $trigger_type
      language: $language
      capabilities: $capabilities
    ) {
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
      rest_api_secret_url_key
    }
  }
`;

export const DELETE_FUNCTION_FROM_PROJECT = gql`
  mutation deleteFunctionFromProject($function: String!) {
    deleteFunctionFromProject(function: $function) {
      id
      name
    }
  }
`;

export const DEPLOY_FUNCTION_TO_PROJECT = gql`
  mutation deployFunctionToProject($name: String!, $source: String) {
    deployFunctionToProject(name: $name, source: $source) {
      function {
        name
        source
        active_revision_id
        rest_api_secret_url_key
        updated_at
      }
      revision {
        id
        revision
        artifact_key
        artifact_hash
        created_at
      }
      deployment {
        id
        revision_id
        status
        created_at
      }
    }
  }
`;

export const ROLLBACK_FUNCTION_DEPLOYMENT = gql`
  mutation rollbackFunctionDeployment($name: String!, $revision_id: String!) {
    rollbackFunctionDeployment(name: $name, revision_id: $revision_id) {
      function {
        name
        source
        active_revision_id
        updated_at
      }
      revision {
        id
        artifact_key
        created_at
      }
      deployment {
        id
        revision_id
        status
        rollback_of
        created_at
      }
    }
  }
`;

export const TEST_FUNCTION_DRAFT = gql`
  mutation testFunctionDraft(
    $name: String!
    $source: String
    $payload: JSON
    $tenant_id: String
  ) {
    testFunctionDraft(
      name: $name
      source: $source
      payload: $payload
      tenant_id: $tenant_id
    ) {
      ok
      response
      error
      error_class
      duration_ms
      invocation_id
      logs {
        level
        message
      }
    }
  }
`;
