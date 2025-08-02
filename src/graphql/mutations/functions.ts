import { gql } from '@apollo/client';

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
`;

export const DELETE_FUNCTION_FROM_PROJECT = gql`
  mutation deleteFunctionFromProject($function: String!) {
    deleteFunctionFromProject(function: $function) {
      id
      name
    }
  }
`; 