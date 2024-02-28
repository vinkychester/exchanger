import { gql } from "apollo-boost";

const UPDATE_CITY_DESCRIPTION = gql`
  mutation UpdateCityDescription($input: updateCityDescriptionInput!) {
    updateCityDescription(input: $input) {
      cityDescription {
        id
        cityName
        isPublish
        metaTitle
        metaDescription
        cityUrl
        description
        __typename
      }
    }
  }
`;

const DELETE_CITY_DESCRIPTION = gql`
  mutation DeleteCityDescription($id: ID!) {
    deleteCityDescription(input: { id: $id }) {
      cityDescription {
        id
      }
    }
  }
`;

const CREATE_CITY_DESCRIPTION = gql`
  mutation CreateCityDescription($input: createCityDescriptionInput!) {
    createCityDescription(input: $input) {
      cityDescription {
        id
        cityName
        isPublish
        metaTitle
        metaDescription
        cityUrl
        description
        __typename
      }
    }
  }
`;

export {
  CREATE_CITY_DESCRIPTION,
  UPDATE_CITY_DESCRIPTION,
  DELETE_CITY_DESCRIPTION,
};
