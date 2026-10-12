import { gql } from 'graphql-tag';
export const UPSERT_ROLE_TO_PROJECT = gql `
  mutation upsertRoleToProject(
    $name: String!
    $is_admin: Boolean
    $logic_executions: [String]
    $api_permissions: JSON
  ) {
    upsertRoleToProject(
      name: $name
      is_admin: $is_admin
      logic_executions: $logic_executions
      api_permissions: $api_permissions
    ) {
      administrative_permissions
      api_permissions
      is_admin
      logic_executions
      system_generated
    }
  }
`;
export const DUPLICATE_ROLE_IN_PROJECT = gql `
  mutation duplicateRoleInProject($source_role: String!, $new_name: String!) {
    duplicateRoleInProject(source_role: $source_role, new_name: $new_name) {
      administrative_permissions
      api_permissions
      is_admin
      logic_executions
      system_generated
    }
  }
`;
