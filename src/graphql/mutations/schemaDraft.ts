import { gql } from "graphql-tag";

export const APPROVE_SCHEMA_CHANGES = gql`
  mutation approveSchemaChanges($changeset_id: String!, $message: String) {
    approveSchemaChanges(changeset_id: $changeset_id, message: $message) {
      version
      changeset_id
      message
      status
      total
      done
    }
  }
`;

export const DISCARD_SCHEMA_DRAFT = gql`
  mutation discardSchemaDraft($changeset_id: String!) {
    discardSchemaDraft(changeset_id: $changeset_id)
  }
`;
