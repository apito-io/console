// import { gql } from '@apollo/client';

// // for second column's data
// export const GET_SELECTED_MODEL_LIST = gql`
//   query getSelectedModelList($name: String!, $search: String, $where: JSON) {
//     listModelData(model: $name, search: $search, where: $where) {
//       icon
//       status
//       title
//       id
//     }
//   }
// `;

// // for content-form connection query
// export const GET_SPECIFIC_MODEL_LIST = gql`
//   query getSpecificModelList($model: String!, $search: String, $limit: Int) {
//     listModelData(model: $model, search: $search, limit: $limit) {
//       id
//       icon
//       title
//     }
//   }
// `;

// export const FORM_DATA_QUERY = gql`
//   query FormDataQuery($_id: String!, $model: String, $local: LOCAL_TYPE_EMUN) {
//     listSingleModelData(_id: $_id, model: $model, local: $local) {
//       _key
//       data
//       id
//       type
//       meta {
//         status
//         updated_at
//         created_at
//         created_by {
//           avatar
//           id
//           name
//           role
//           email
//         }
//         last_modified_by {
//           avatar
//           id
//           name
//           role
//           email
//         }
//       }
//     }
//   }
// `;

// // local Cache Queries
// export const CONNECT_DISCONNECT_QUERY = gql`
//   query getConnectDisconnect($_id: String!) {
//     connect_ids @client
//     disconnect_ids @client
//   }
// `;

// export const CONTENT_MEDIA_QUERY = gql`
//   query getMediaData {
//     media_data @client
//   }
// `;

/*export const GET_ALL_THIRD_PARTY_FUNC = gql`
  query getAllThirPartyFunc($function_provider: FUNCTION_PROVIDER_ENUM, $region: String) {
    thirdPartyFunctionQuery(function_provider: $function_provider, region: $region) {
      env_vars {
        key
        value
      }
      region
      remote_function_name
      configs {
        handler
        memory
        runtime
        time_out
      }
    }
  }
`;*/

/*export const GET_INSTALLED_FUNCTION_EXTENSION_LIST = gql`
  query getInstalledFunctionExtensionList {
    installedFunctionExtensionList {
      providers
    }
  }
`;*/ 