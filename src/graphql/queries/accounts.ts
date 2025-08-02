import { gql } from '@apollo/client';

export const GET_LOGGED_IN_USER = gql`
  query getLoggedInUser {
    getUser {
      id
      email
      first_name
      last_name
      avatar
      current_project_id
      is_admin
      project_limit
      user_subscription_type
      username
    }
  }
`; 