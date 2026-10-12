import { gql } from 'graphql-tag';
/** Project end-user CRUD (open-core — no tenant_id on UserItem). */
export const CREATE_USER = gql `
  mutation createUser(
    $project_id: String!
    $password: String!
    $email: String
    $phone: String
    $role: String
  ) {
    createUser(
      project_id: $project_id
      password: $password
      email: $email
      phone: $phone
      role: $role
    ) {
      id
      email
      username
      phone
      role
      provider
      status
      created_at
      updated_at
    }
  }
`;
export const UPDATE_USER = gql `
  mutation updateUser($user_id: String!, $email: String, $phone: String, $role: String) {
    updateUser(user_id: $user_id, email: $email, phone: $phone, role: $role) {
      id
      email
      username
      phone
      role
      provider
      status
      created_at
      updated_at
    }
  }
`;
export const DELETE_USER = gql `
  mutation deleteUser($user_id: String!) {
    deleteUser(user_id: $user_id)
  }
`;
export const RESET_USER_PASSWORD = gql `
  mutation resetUserPassword($user_id: String!, $password: String!) {
    resetUserPassword(user_id: $user_id, password: $password)
  }
`;
