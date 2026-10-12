import { gql } from 'graphql-tag';

export const UPDATE_PROJECT_STORAGE_SETTINGS = gql`
  mutation updateProjectStorageSettings($input: UpdateProjectStorageInput!) {
    updateProjectStorageSettings(input: $input) {
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
