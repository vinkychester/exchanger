import { gql } from "apollo-boost";

const UPDATE_CITY_CONTACT = gql`
  mutation UpdateCityContact($input: updateCityContactInput!) {
    updateCityContact(input: $input) {
      cityContact {
        id
      }
    }
  }
`;

export { UPDATE_CITY_CONTACT };
