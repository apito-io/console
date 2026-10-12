import { gql } from 'graphql-tag';
/** Project upload storage backend on system `getProject`. */
export const GET_PROJECT_STORAGE = gql `
  query getProjectStorage($_id: String = "") {
    getProject(_id: $_id) {
      storage_settings {
        use_free_cloud_storage
        endpoint
        region
        bucket
        access_key_id
        has_secret_access_key
        public_base_url
        force_path_style
      }
    }
  }
`;
