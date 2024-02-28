import { gql } from "apollo-boost";

const GET_CITIES_DESCRIPTION = gql`
  {
    cityDescriptions {
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
`;

const GET_CITIES_DESCRIPTION_NAME = gql`
  {
    cityDescriptions(isPublish: true) {
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
`;

const GET_CITY_DESCRIPTION_BY_ID = gql`
  query getCityDescription($id: ID!) {
    cityDescription(id: $id) {
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
`;

const GET_CITY_DESCRIPTION_BY_CITY_URL = gql`
  query findByCityUrlCityDescription($cityUrl: String!) {
    cityDescriptions(cityUrl: $cityUrl) {
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
`;

export {
  GET_CITIES_DESCRIPTION,
  GET_CITY_DESCRIPTION_BY_ID,
  GET_CITY_DESCRIPTION_BY_CITY_URL,
  GET_CITIES_DESCRIPTION_NAME,
};
