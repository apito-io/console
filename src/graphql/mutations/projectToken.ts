import { gql } from 'graphql-tag';

export const GENERATE_PROJECT_TOKEN = gql`
  mutation generateProjectToken($name: String!, $duration: String!, $role: String!) {
    generateProjectToken(name: $name, duration: $duration, role: $role) {
      token
    }
  }
`;

export const DELETE_PROJECT_TOKEN = gql`
  mutation deleteProjectToken($duration: String!, $token: String, $token_id: String) {
    deleteProjectToken(duration: $duration, token: $token, token_id: $token_id) {
      msg
    }
  }
`;
