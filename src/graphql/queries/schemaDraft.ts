import { gql } from "graphql-tag";

export const SCHEMA_VERSIONING_STATUS = gql`
  query schemaVersioningStatus {
    schemaVersioningStatus {
      enabled
      active_version
      has_draft
      changeset_id
      changeset_status
      pending_operations
      publish_total
      publish_done
      error
    }
  }
`;

export const SCHEMA_DIFF = gql`
  query schemaDiff($changeset_id: String) {
    schemaDiff(changeset_id: $changeset_id)
  }
`;

export const SCHEMA_PREVIEW = gql`
  query schemaPreview($source: String, $version: Int) {
    schemaPreview(source: $source, version: $version)
  }
`;

export const SCHEMA_CHANGE_EVENTS = gql`
  query schemaChangeEvents($changeset_id: String) {
    schemaChangeEvents(changeset_id: $changeset_id) {
      event_type
      actor_id
      created_at
      payload_json
    }
  }
`;
