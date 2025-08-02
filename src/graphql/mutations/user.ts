import { gql } from '@apollo/client';

export const UPDATE_USER_PROFILE = gql`
  mutation updateUserProfile(
    $first_name: String
    $last_name: String
    $organization_id: String
    $role: String
    $new_pass: String
    $old_pass: String
    $username: String
  ) {
    updateProfile(
      first_name: $first_name
      last_name: $last_name
      organization_id: $organization_id
      role: $role
      new_pass: $new_pass
      old_pass: $old_pass
      username: $username
    ) {
      id
      first_name
      last_name
      role
      is_admin
      avatar
      username
    }
  }
`; 