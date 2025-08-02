// first colum's function list
import { gql } from '@apollo/client';

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