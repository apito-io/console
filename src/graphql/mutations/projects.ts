import { gql } from '@apollo/client';

export const UPDATE_PROJECT = gql`
  mutation updateProject(
    $access_key: [String] = ""
    $db: [String] = ""
    $host: String = ""
    $password: [String] = ""
    $port: String = ""
    $secret_key: [String] = ""
    $user: [String] = ""
    $_id: String = ""
  ) {
    updateProject(
      _id: $_id
      driver: {
        secret_key: $secret_key
        host: $host
        port: $port
        db: $db
        user: $user
        password: $password
        access_key: $access_key
      }
    ) {
      driver {
        engine
        database
        host
        port
        firebase_project_credential_json
        firebase_project_id
        password
        user
      }
    }
  }
`; 