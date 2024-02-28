import { gql } from "apollo-boost";

const USER_DETAILS = gql`
  fragment UserDetails on UserCollection {
    firstname
    lastname
    email
  }
`;

export { USER_DETAILS };
