import { gql } from "apollo-boost";

const GET_CITY_CONTACTS = gql`
  query CityContacts(
    $page: Int
    $itemsPerPage: Int
    $isPublic: Boolean
    $cityName: String
    $type: String
    $fieldValue: String
  ) {
    cityContacts(
      itemsPerPage: $itemsPerPage
      page: $page
      isPublic: $isPublic
      city_name: $cityName
      type: $type
      cityContactFieldValues_value: $fieldValue
    ) {
      collection {
        id
        type
        isPublic
        city {
          id
          name
          disable
        }
        cityContactFieldValues {
          id
          cityContactField {
            id
            name
          }
          value
        }
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
      __typename
    }
  }
`;

const GET_PUBLIC_CITY_CONTACTS = gql`
  query {
    cityContacts(isPublic: true) {
      collection {
        id
        type
        isPublic
        city {
          id
          name
          transliteName
        }
        cityContactFieldValues {
          id
          cityContactField {
            id
            name
          }
          value
        }
      }
      __typename
    }
  }
`;

const GET_BANK_CITY_CONTACT = gql`
  query {
    cityContacts(exists: { city: false }) {
      collection {
        id
      }
      __typename
    }
  }
`;

const GET_CITY_CONTACT_BY_CITY_NAME = gql`
  query GetCityContact($cityExternalId: Int!) {
    getByCityExternalIdCityContact(cityExternalId: $cityExternalId) {
      id
      type
      isPublic
      cityContactFieldValues {
        id
        cityContactField {
          id
          name
        }
        value
      }
      __typename
    }
  }
`;

export {
  GET_PUBLIC_CITY_CONTACTS,
  GET_CITY_CONTACT_BY_CITY_NAME,
  GET_CITY_CONTACTS,
  GET_BANK_CITY_CONTACT,
};
