import { gql } from "apollo-boost";

const UPDATE_CLIENT_CASHBACK_LEVEL = gql`
  mutation UpdateCashbackClientLevel($input: updateCashbackClientLevelInput!) {
    updateCashbackClientLevel(input: $input) {
      cashbackClientLevel {
        id
      }
    }
  }
`;

const UPDATE_CLIENT_CASHBACK_LEVEL_WITH_LOG = gql`
  mutation UpdateCashbackClientLevelWithLog(
    $cashbackClientLevelID: Int!
    $cashbackLevelID: Int!
  ) {
    updateWithLogCashbackClientLevel(
      input: {
        cashbackClientLevelID: $cashbackClientLevelID
        cashbackLevelID: $cashbackLevelID
      }
    ) {
      cashbackClientLevel {
        id
      }
    }
  }
`;

const SET_CURRENT_CASHBACK_CLIENT_LEVEL = gql`
  mutation SetCurrentCashbackClientLevel($cashbackClientLevelID: Int!) {
    setCurrentCashbackClientLevel(
      input: { cashbackClientLevelID: $cashbackClientLevelID }
    ) {
      cashbackClientLevel {
        id
      }
    }
  }
`;

const CREATE_IF_NOT_EXIST_CASHBACK_CLIENT_LEVEL = gql`
  mutation createCashbackClientLevel(
    $clientID: String!
    $cashbackLevelID: Int!
  ) {
    createIfNotExistCashbackClientLevel(
      input: { clientID: $clientID, cashbackLevelID: $cashbackLevelID }
    ) {
      cashbackClientLevel {
        id
      }
    }
  }
`;

export {
  UPDATE_CLIENT_CASHBACK_LEVEL,
  UPDATE_CLIENT_CASHBACK_LEVEL_WITH_LOG,
  SET_CURRENT_CASHBACK_CLIENT_LEVEL,
  CREATE_IF_NOT_EXIST_CASHBACK_CLIENT_LEVEL,
};
