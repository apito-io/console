import { gql } from '@apollo/client';

export const GENERATE_API_KEY = gql`
  mutation generateApiKey($name: String!, $duration: String!, $role: String!) {
    generateApiToken(name: $name, duration: $duration, role: $role) {
      token
    }
  }
`;

export const DELETE_API_CREDENTIAL = gql`
  mutation deleteApiCredential($duration: String!, $token: String!) {
    deleteApiToken(duration: $duration, token: $token) {
      msg
    }
  }
`; 