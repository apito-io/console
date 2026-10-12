import { gql } from "graphql-tag";

export const GET_WORKSPACE_MEMBERS = gql`
  query getWorkspaceMembers {
    workspaceMembers {
      id
      email
      first_name
      last_name
      avatar
      grants {
        project_id
        project_name
        role
        permissions
        invite_status
        invite_expires_at
      }
    }
  }
`;

export const INVITE_WORKSPACE_MEMBER = gql`
  mutation inviteWorkspaceMember(
    $email: String!
    $project_ids: [String!]!
    $administrative_permissions: [String]
    $make_admin: Boolean
  ) {
    inviteWorkspaceMember(
      email: $email
      project_ids: $project_ids
      administrative_permissions: $administrative_permissions
      make_admin: $make_admin
    )
  }
`;

export const UPDATE_WORKSPACE_MEMBER = gql`
  mutation updateWorkspaceMember(
    $user_id: String!
    $project_ids: [String!]!
    $administrative_permissions: [String]
    $make_admin: Boolean
  ) {
    updateWorkspaceMember(
      user_id: $user_id
      project_ids: $project_ids
      administrative_permissions: $administrative_permissions
      make_admin: $make_admin
    )
  }
`;

export const REMOVE_WORKSPACE_MEMBER = gql`
  mutation removeWorkspaceMember($user_id: String!, $project_id: String) {
    removeWorkspaceMember(user_id: $user_id, project_id: $project_id)
  }
`;
