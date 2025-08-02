import { gql } from '@apollo/client';

export const GET_AUDIT_LOGS = gql`
  query getAuditLogs(
    $project_id: String
    $limit: Int
    $page: Int
    $user_id: String
    $response_code: Int
    $filter_by_project_id: String
    $internal_function: String
    $graphql_operation_name: String
  ) {
    auditLogs(
      _id: $project_id
      filter: { limit: $limit, page: $page }
      where: {
        user_id: { eq: $user_id }
        project_id: { eq: $filter_by_project_id }
        response_code: { eq: $response_code }
        internal_function: { eq: $internal_function }
        graphql_operation_name: { eq: $graphql_operation_name }
      }
    ) {
      id
      activity
      created_at
      graphql_operation_name
      graphql_payload
      graphql_variable
      internal_error
      internal_function
      request_path
      request_payload
      response_code
      response_payload
      user {
        first_name
        id
      }
      project {
        id
        name
      }
    }
  }
`; 