import { gql } from "apollo-boost";

const GET_CITIES_LIST = gql`
  query getCitiesList($pairUnit_id: Int!, $direction: String!) {
    collectionQueryCities(pairUnit_id: $pairUnit_id, direction: $direction) {
      id
      name
      externalId
    }
  }
`;

const GET_CITIES_WITH_NETWORKS = gql`
  query getCities {
    cities {
      id
      name
      transliteName
      externalId
    }
  }
`;

const GET_NETWORKS_WITH_CITIES = gql`
  query getNetworks {
    networks {
      id
      name
      externalId
      cities {
        id
        name
        transliteName
        externalId
      }
    }
  }
`;

const GET_ALL_CITIES = gql`
  query getCities($disable: Boolean!) {
    cities(disable: $disable) {
      id
      name
    }
  }
`;

const GET_ALL_CITIES_WITHOUT_CITY_CONTACTS = gql`
  {
    cities(exists: { cityContact: false }) {
      id
      name
    }
  }
`;

const GET_CITY_BY_EXTERNAL_ID = gql`
  query getCityByExternalId($externalId: Int!) {
    cities(externalId: $externalId) {
      id
      name
    }
  }
`;

export {
  GET_CITIES_LIST,
  GET_CITIES_WITH_NETWORKS,
  GET_NETWORKS_WITH_CITIES,
  GET_ALL_CITIES,
  GET_ALL_CITIES_WITHOUT_CITY_CONTACTS,
  GET_CITY_BY_EXTERNAL_ID,
};
