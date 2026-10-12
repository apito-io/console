import { gql } from 'graphql-tag';
/** Project end-user list (open-core — no tenant_id on UserItem). */
export const SEARCH_USERS = gql `
  query searchUsers($project_id: String!, $limit: Int, $offset: Int) {
    searchUsers(project_id: $project_id, limit: $limit, offset: $offset) {
      count
      users {
        id
        email
        username
        phone
        role
        provider
        status
        created_at
        updated_at
      }
    }
  }
`;
