import { gql } from "apollo-boost";

const CREATE_UPDATE_CITY_CONTACT_FIELD_VALUE = gql`
  mutation CreateUpdateCityContactFieldValue(
    $cityID: String!
    $fieldID: Int!
    $fieldValue: String!
  ) {
    createUpdateCityContactFieldValue(
      input: { cityID: $cityID, fieldID: $fieldID, fieldValue: $fieldValue }
    ) {
      cityContactFieldValue {
        id
        cityContact {
          id
          isPublic
          type
          cityContactFieldValues {
            id
            cityContactField {
              id
              name
            }
            value
          }
        }
      }
    }
  }
`;

const CREATE_VALUES_CITY_CONTACT_FIELD_VALUE = gql`
  mutation CreateUpdateCityContactFieldValue(
    $cityID: String!
    $contactNames: [String]!
    $contactValues: [String]!
    $isPublic: Boolean!
  ) {
    createValuesCityContactFieldValue(
      input: {
        cityID: $cityID
        contactNames: $contactNames
        contactValues: $contactValues
        isPublic: $isPublic
      }
    ) {
      cityContactFieldValue {
        id
        cityContact {
          id
          isPublic
          type
          cityContactFieldValues {
            id
            cityContactField {
              id
              name
            }
            value
          }
        }
      }
    }
  }
`;

export {
  CREATE_UPDATE_CITY_CONTACT_FIELD_VALUE,
  CREATE_VALUES_CITY_CONTACT_FIELD_VALUE,
};
