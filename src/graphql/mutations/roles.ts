import { gql } from '@apollo/client';

export const UPSERT_ROLE_TO_PROJECT = gql`
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