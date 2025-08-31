import { gql } from '@apollo/client';

// first column's model list
export const GET_ONLY_MODELS_INFO = gql`
  query getOnlyModelsInfo {
    projectModelsInfo {
      name
      single_page
      single_page_uuid
      system_generated
      has_connections
      is_tenant_model
      is_common_model
      enable_revision
      revision_filter {
        key
        value
      }
    }
  }
`;

export const GET_MODEL_DETAILS = gql`
  query getModelDetails($model_name: String) {
    projectModelsInfo(model_name: $model_name) {
      name
      locals
      single_page
      single_page_uuid
      system_generated
      has_connections
      is_tenant_model
      is_common_model
      enable_revision
      revision_filter {
        key
        value
      }
      fields {
        serial
        identifier
        label
        input_type
        field_type
        field_sub_type
        description
        system_generated
        sub_field_info {
          description
          field_type
          field_sub_type
          identifier
          input_type
          label
          serial
          system_generated
          parent_field
          validation {
            as_title
            char_limit
            double_range_limit
            fixed_list_elements
            fixed_list_element_type
            hide
            is_email
            is_gallery
            is_multi_choice
            int_range_limit            
            locals
            placeholder
            required
            unique
          }
          sub_field_info {
            description
            field_type
            field_sub_type
            identifier
            input_type
            label
            serial
            system_generated
            parent_field
            validation {
              as_title
              char_limit
              double_range_limit
              fixed_list_elements
              fixed_list_element_type
              hide
              is_email
              is_gallery
              is_multi_choice
              int_range_limit
              locals
              placeholder
              required
              unique
            }
          }
        }
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
          is_password
        }
      }
      connections {
        model
        relation
        type
        known_as
      }
    }
  }
`;

