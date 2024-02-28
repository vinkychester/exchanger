import { gql } from "apollo-boost";

const GET_CITY_CONTACT_FIELDS_LIST = gql`
  query {
    cityContactFields {
      __typename
      id
      name
    }
  }
`;

export { GET_CITY_CONTACT_FIELDS_LIST };
