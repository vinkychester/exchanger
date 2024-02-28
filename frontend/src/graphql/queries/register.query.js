import { gql } from "@apollo/client";

const CREATE_CLIENT = gql`
  mutation createUser(
    $firstname: String!
    $lastname: String!
    $email: String!
  ) {
    createClient(
      input: { firstname: $firstname, lastname: $lastname, email: $email }
    ) {
      client {
        id
        firstname
        lastname
        email
      }
    }
  }
`;

export default CREATE_CLIENT;
