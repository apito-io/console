import { gql } from '@apollo/client';

export const GET_ALL_PHOTOS = gql`
  query getAllPhotos($limit: Int, $page: Int, $search: String, $models: [String]) {
    getPhotos(limit: $limit, page: $page, search: $search, models: $models) {
      results {
        id
        url
        file_name
        created_at
        size
        content_type
        file_extension
        type
        upload_param {
          model_name
          field_name
          doc_id
          provider
        }
      }
      count
    }
  }
`;

export const UPLOAD_IMAGE_FROM_URL = gql`
  mutation uploadImageFromUrl($url: String!) {
    uploadImageFromUrl(url: $url) {
      url
      type
      size
      s3_key
      id
      file_name
      created_at
      content_type
      buffer
      _key
      file_extension
      upload_param {
        allow_multi
        doc_id
        field_name
        model_name
        project_id
      }
    }
  }
`;

export const DELETE_MEDIA_FILE = gql`
  mutation deleteMediaFile($ids: [String]!) {
    deleteMediaFile(ids: $ids) {
      message
    }
  }
`; 