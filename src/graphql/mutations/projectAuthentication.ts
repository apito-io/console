import { gql } from 'graphql-tag';

export const UPDATE_PROJECT_AUTHENTICATION_SETTINGS = gql`
  mutation updateProjectAuthenticationSettings(
    $input: UpdateProjectAuthenticationInput!
  ) {
    updateProjectAuthenticationSettings(input: $input) {
      authentication_settings {
        enable_general_auth
        enable_google_auth
        enable_facebook_auth
        enable_github_auth
        enable_x_auth
        enable_linkedin_auth
        general_authentication_method
        google_client_id
        google_oauth_redirect_uri
        has_google_client_secret
        facebook_client_id
        facebook_oauth_redirect_uri
        has_facebook_client_secret
        github_client_id
        github_oauth_redirect_uri
        has_github_client_secret
        x_client_id
        x_oauth_redirect_uri
        has_x_client_secret
        linkedin_client_id
        linkedin_oauth_redirect_uri
        has_linkedin_client_secret
        default_registration_role
      }
    }
  }
`;
