import { gql } from '@apollo/client';

export const UPSERT_FIELD_TO_MODEL = gql`
  mutation upsertFieldToModel(
    $model_name: String!
    $field_label: String!
    $field_type: FIELD_TYPE_ENUM
    $field_sub_type: FIELD_SUB_TYPE_ENUM
    $field_description: String
    $input_type: INPUT_TYPE_ENUM
    $serial: Int
    $validation: module_validation_payload
    $parent_field: String
    $is_update: Boolean
  ) {
    upsertFieldToModel(
      model_name: $model_name
      field_label: $field_label
      field_type: $field_type
      field_sub_type: $field_sub_type
      field_description: $field_description
      input_type: $input_type
      serial: $serial
      validation: $validation
      parent_field: $parent_field
      is_update: $is_update
    ) {
      serial
      identifier
      label
      input_type
      field_type
      field_sub_type
      description
      parent_field
      system_generated
      parent_field
      validation {
        required
        locals
        is_multi_choice
        int_range_limit
        hide
        fixed_list_elements
        fixed_list_element_type
        double_range_limit
        char_limit
        as_title
        is_email
        unique
        placeholder
        is_gallery
      }
    }
  }
`;

export const CREATE_MODEL = gql`
  mutation createModel($name: String!, $single_record: Boolean) {
    addModelToProject(name: $name, single_record: $single_record) {
      name
    }
  }
`;

export const UPDATE_MODEL = gql`
  mutation updateModel($type: UpdateModelTypeEnum!, $new_name: String, $model_name: String!, $is_common_model: Boolean) {
    updateModel(type: $type, new_name: $new_name, model_name: $model_name, is_common_model: $is_common_model) {
      name
    }
  }
`;

export const UPDATE_MODEL_RELATION = gql`
  mutation updateModelRelation(
    $forward_connection_type: RELATION_TYPE_ENUM!
    $from: String!
    $reverse_connection_type: RELATION_TYPE_ENUM!
    $to: String!
    $known_as: String
  ) {
    upsertConnectionToModel(
      forward_connection_type: $forward_connection_type
      from: $from
      reverse_connection_type: $reverse_connection_type
      to: $to
      known_as: $known_as
    ) {
      type
      relation
      model
      known_as
    }
  }
`;

export const MODEL_FIELD_OPERATION = gql`
  mutation modelFieldOperation(
    $type: FIELD_OPERATION_TYPE_ENUM!
    $model_name: String!
    $field_name: String!
    $new_name: String
    $parent_field: String
    $single_page_model: Boolean
    $is_relation: Boolean
    $known_as: String
    $moved_to: String
    $changed_type: String
  ) {
    modelFieldOperation(
      type: $type
      model_name: $model_name
      new_name: $new_name
      field_name: $field_name
      parent_field: $parent_field
      single_page_model: $single_page_model
      is_relation: $is_relation
      known_as: $known_as
      moved_to: $moved_to
      changed_type: $changed_type
    ) {
      serial
      identifier
      label
      input_type
      field_type
      description
      parent_field
      validation {
        required
        locals
        is_multi_choice
        int_range_limit
        hide
        fixed_list_elements
        fixed_list_element_type
        double_range_limit
        char_limit
        as_title
        is_email
        unique
        placeholder
        is_gallery
      }
    }
  }
`;

export const REARRANGE_FIELD_SERIAL = gql`
  mutation rearrangeFieldSerial(
    $model_name: String!
    $field_name: String!
    $new_position: Int!
    $move_type: String!
    $parent_id: String
  ) {
    rearrangeSerialOfField(
      model_name: $model_name
      field_name: $field_name
      new_position: $new_position
      move_type: $move_type
      parent_id: $parent_id
    ) {
      name
      fields {
        identifier
        serial
      }
    }
  }
`; 