import { gql } from "graphql-tag";

export const SCHEMA_CHANGE_EXECUTION_RECORDS = gql`
  query schemaChangeExecutionRecords(
    $changeset_id: String
    $version: Int
    $limit: Int
    $offset: Int
  ) {
    schemaChangeExecutionRecords(
      changeset_id: $changeset_id
      version: $version
      limit: $limit
      offset: $offset
    ) {
      id
      operation_id
      sequence
      scope_kind
      target_name
      action_key
      impact
      requires_ddl
      retryable
      system_message
      project_message
      local_status
      remote_status
      status
      error
      attempt_count
      created_at
    }
  }
`;
