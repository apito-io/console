import { gql } from '@apollo/client';

export const UPDATE_SINGLE_DATA = gql`
  mutation updateSingleData(
    $_id: String!
    $single_page_data: Boolean
    $model_name: String!
    $local: String
    $payload: JSON
    $connect: JSON
    $disconnect: JSON
    $status: String
  ) {
    upsertModelData(
      _id: $_id
      single_page_data: $single_page_data
      model_name: $model_name
      local: $local
      payload: $payload
      connect: $connect
      disconnect: $disconnect
      status: $status
    ) {
      _key
      data
      type
      id
      meta {
        created_at
        status
        updated_at
        last_modified_by {
          id
          first_name
        }
      }
    }
  }
`;

export const GET_MULTIPLE_DATA = gql`
  query GetMultipleData(
    $model: String!
    $limit: Int
    $page: Int
    $search: String
    $where: JSON
    $connection: ListAllDataDetailedOfAModelConnectionPayload
    $intersect: Boolean
  ) {
    getModelData(
      model: $model
      limit: $limit
      page: $page
      search: $search
      where: $where
      connection: $connection
      intersect: $intersect
      status: all
    ) {
      results {
        relation_doc_id
        id
        data
        meta {
          created_at
          updated_at
          status
        }
      }
      count
    }
  }
`;

export const DELETE_MODEL_DATA = gql`
  mutation deleteModelData($model_name: String!, $_id: String) {
    deleteModelData(model_name: $model_name, _id: $_id) {
      id
    }
  }
`;

export const DUPLICATE_MODEL_DATA = gql`
  mutation duplicateModelData($model_name: String!, $_id: String) {
    duplicateModelData(model_name: $model_name, _id: $_id) {
      id
    }
  }
`;

export const FORM_DATA_QUERY_REVISION = gql`
  query FormDataQueryRevision($_id: String!, $single_page_data: Boolean, $model: String) {
    listSingleModelRevisionData(_id: $_id, single_page_data: $single_page_data, model: $model) {
      status
      revision_at
      id
    }
  }
`;

export const GET_SINGLE_DATA = gql`
  query GetSingleData(
    $_id: String!
    $model: String
    $local: String
    $revision: Boolean
    $single_page_data: Boolean
  ) {
    getSingleData(
      _id: $_id
      model: $model
      local: $local
      revision: $revision
      single_page_data: $single_page_data
    ) {
      _key
      data
      id
      type
      meta {
        status
        updated_at
        created_at
        created_by {
          avatar
          id
          first_name
          role
          email
        }
        last_modified_by {
          id
          first_name
          role
          email
          avatar
        }
      }
    }
  }
`;

export const CREATE_MODEL_DATA = gql`
  mutation createModelData(
    $model_name: String!
    $local: String
    $payload: JSON
    $connect: JSON
    $disconnect: JSON
    $status: String
  ) {
    upsertModelData(
      model_name: $model_name
      local: $local
      payload: $payload
      connect: $connect
      disconnect: $disconnect
      status: $status
    ) {
      _key
      data
      type
      id
      meta {
        created_at
        status
        updated_at
        last_modified_by {
          id
          first_name
        }
      }
    }
  }
`; 