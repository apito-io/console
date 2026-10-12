import { gql } from "graphql-tag";

export const PREVIEW_SCHEMA_RELATION_TRANSITION = gql`
  query PreviewSchemaRelationTransition(
    $from_model: String!
    $to_model: String!
    $known_as: String
    $from_relation: String
    $to_relation: String
    $target_from_relation: String!
    $target_to_relation: String!
  ) {
    previewSchemaRelationTransition(
      from_model: $from_model
      to_model: $to_model
      known_as: $known_as
      from_relation: $from_relation
      to_relation: $to_relation
      target_from_relation: $target_from_relation
      target_to_relation: $target_to_relation
    ) {
      plan_hash
      kind
      safety
      reversibility
      blocked
      backup_required
      source_storage
      target_storage
      required_acknowledgement
      preview_json
      disclaimers
      warnings
      blockers
    }
  }
`;
