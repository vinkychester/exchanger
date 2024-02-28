import { gql } from "apollo-boost";
import { USER_DETAILS } from "../fragments/user.fragment";

const CREATE_CLIENT = gql`
  mutation createClient(
    $firstname: String!
    $lastname: String!
    $email: String!
  ) {
    createClient(
      input: { firstname: $firstname, lastname: $lastname, email: $email }
    ) {
      client {
        ...UserDetails
      }
    }
  }
  ${USER_DETAILS}
`;

const UPDATE_CLIENT_BANNED = gql`
  mutation updateClient($id: ID!, $isBanned: Boolean!) {
    updateClient(input: { id: $id, isBanned: $isBanned }) {
      client {
        id
      }
    }
  }
`;

const UPDATE_CLIENT_DETAILS = gql`
  mutation updateClient($id: ID!, $isBanned: Boolean, $isDeleted: Boolean) {
    updateClient(input: { id: $id, isBanned: $isBanned, isDeleted: $isDeleted }) {
      client {
        id
      }
    }
  }
`;

const UPDATE_MANAGER_BANNED = gql`
  mutation updateManager($id: ID!, $isBanned: Boolean!) {
    updateManager(input: { id: $id, isBanned: $isBanned }) {
      manager {
        id
      }
    }
  }
`;

const UPDATE_MANAGER_CITIES = gql`
  mutation updateManager($id: ID!, $cities: [String]!) {
    updateManager(input: { id: $id, cities: $cities }) {
      manager {
        id
        cities {
          id
          name
          transliteName
        }
      }
    }
  }
`;

const GET_EXCHANGE_POINTS = gql`
  mutation getExchangePointsMutation(
    $id: ID!
    $networkId: String!
    $cityId: String!
  ) {
    getExchangePointsCity(
      input: { id: $id, cityId: $cityId, networkId: $networkId }
    ) {
      city {
        id
        exchangePoints
      }
    }
  }
`;

export {
  CREATE_CLIENT,
  UPDATE_CLIENT_DETAILS,
  UPDATE_CLIENT_BANNED,
  UPDATE_MANAGER_BANNED,
  UPDATE_MANAGER_CITIES,
  GET_EXCHANGE_POINTS,
};
