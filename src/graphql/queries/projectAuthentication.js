import { gql } from 'graphql-tag';
/** Project sign-in settings on system `getProject`. */
export const GET_PROJECT_AUTHENTICATION = gql `
  query getProjectAuthentication($_id: String = "") {
    getProject(_id: $_id) {
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
