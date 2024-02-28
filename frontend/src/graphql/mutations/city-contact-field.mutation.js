import { gql } from "apollo-boost";

const UPDATE_CITY_CONTACT_FIELD = gql`
  mutation UpdateCityContactField($input: updateCityContactFieldInput!) {
    updateCityContactField(input: $input) {
      cityContactField {
        id
      }
    }
  }
`;

const DELETE_CITY_CONTACT_FIELD = gql`
  mutation DeleteCityContactField($id: ID!) {
    deleteCityContactField(input: { id: $id }) {
      cityContactField {
        id
      }
    }
  }
`;

const CREATE_CITY_CONTACT_FIELD = gql`
  mutation CreateCityContactField($input: createCityContactFieldInput!) {
    createCityContactField(input: $input) {
      cityContactField {
        id
        name
        __typename
      }
    }
  }
`;

export {
  CREATE_CITY_CONTACT_FIELD,
  UPDATE_CITY_CONTACT_FIELD,
  DELETE_CITY_CONTACT_FIELD,
};
