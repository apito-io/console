import { gql } from "graphql-tag";

export const STAGE_RELATION_TRANSITION = gql`
  mutation StageRelationTransition(
    $from_model: String!
    $to_model: String!
    $known_as: String
    $from_relation: String
    $to_relation: String
    $target_from_relation: String!
    $target_to_relation: String!
    $plan_hash: String!
    $acknowledgement: String
  ) {
    stageRelationTransition(
      from_model: $from_model
      to_model: $to_model
      known_as: $known_as
      from_relation: $from_relation
      to_relation: $to_relation
      target_from_relation: $target_from_relation
      target_to_relation: $target_to_relation
      plan_hash: $plan_hash
      acknowledgement: $acknowledgement
    ) {
      staged
      message
      plan_hash
    }
  }
`;
