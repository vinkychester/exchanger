import { gql } from "apollo-boost";

const UPDATE_CASHBACK_LEVEL = gql`
  mutation UpdateCashbackLevel($input: updateCashbackLevelInput!) {
    updateCashbackLevel(input: $input) {
      cashbackLevel {
        id
      }
    }
  }
`;

const SET_CASHBACK_LEVEL_FOR_ALL_EXCEPT_INDIVIDUAL_CLIENTS = gql`
  mutation UpdateForAllExceptVipClientsCashbackLevel($cashbackLevelID: Int!) {
    updateForAllExceptVipClientsCashbackLevel(
      input: { cashbackLevelID: $cashbackLevelID }
    ) {
      cashbackLevel {
        id
        level
        isDefault
      }
    }
  }
`;

const SET_CASHBACK_LEVEL_FOR_INDIVIDUAL_CLIENTS = gql`
  mutation UpdateForAllVipClientsCashbackLevel($cashbackLevelID: Int!) {
    updateForAllVipClientsCashbackLevel(
      input: { cashbackLevelID: $cashbackLevelID }
    ) {
      cashbackLevel {
        id
        level
        isDefault
      }
    }
  }
`;

const SET_CASHBACK_LEVEL_FOR_NEW_CLIENTS = gql`
  mutation SetCashbackLevelDefault($cashbackLevelID: Int!) {
    updateForNewClientsCashbackLevel(
      input: { cashbackLevelID: $cashbackLevelID }
    ) {
      cashbackLevel {
        id
        level
        isDefault
      }
    }
  }
`;

const SET_CASHBACK_LEVEL_FOR_ALL_CLIENTS = gql`
  mutation SetCashbackLevelDefault($cashbackLevelID: Int!) {
    updateForAllClientsCashbackLevel(
      input: { cashbackLevelID: $cashbackLevelID }
    ) {
      cashbackLevel {
        id
        level
        isDefault
      }
    }
  }
`;

const CREATE_CASHBACK_LEVEL = gql`
  mutation CreateCashbackLevel(
    $name: String!
    $level: Int!
    $percent: Float!
    $profitRangeFrom: Float!
    $profitRangeTo: Float!
  ) {
    createCashbackLevel(
      input: {
        name: $name
        profitRangeFrom: $profitRangeFrom
        profitRangeTo: $profitRangeTo
        level: $level
        percent: $percent
        isDefault: false
      }
    ) {
      cashbackLevel {
        id
      }
    }
  }
`;

const DELETE_CASHBACK_LEVEL = gql`
  mutation DeleteCashbackLevel($id: ID!) {
    deleteCashbackLevel(input: { id: $id }) {
      cashbackLevel {
        id
      }
    }
  }
`;

export {
  CREATE_CASHBACK_LEVEL,
  DELETE_CASHBACK_LEVEL,
  SET_CASHBACK_LEVEL_FOR_ALL_CLIENTS,
  SET_CASHBACK_LEVEL_FOR_ALL_EXCEPT_INDIVIDUAL_CLIENTS,
  SET_CASHBACK_LEVEL_FOR_INDIVIDUAL_CLIENTS,
  SET_CASHBACK_LEVEL_FOR_NEW_CLIENTS,
  UPDATE_CASHBACK_LEVEL,
};
