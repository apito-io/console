import { gql } from 'graphql-tag';
export const UPDATE_PROJECT_AUTHENTICATION_SETTINGS = gql `
  mutation updateProjectAuthenticationSettings(
    $input: UpdateProjectAuthenticationInput!
  ) {
    updateProjectAuthenticationSettings(input: $input) {
      authentication_settings {
        enable_general_auth
        enable_google_auth
        general_authentication_method
        google_client_id
        google_oauth_redirect_uri
        has_google_client_secret
      }
    }
  }
`;
