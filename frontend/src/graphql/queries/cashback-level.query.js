import { gql } from "apollo-boost";

const GET_ALL_CASHBACK_LEVELS = gql`
  query GetReferralLevels($page: Int!, $itemsPerPage: Int!) {
    cashbackLevels(page: $page, itemsPerPage: $itemsPerPage) {
      paginationInfo {
        lastPage
        totalCount
        itemsPerPage
      }
      collection {
        id
        name
        level
        minPayoutSum
        profitRangeFrom
        profitRangeTo
        percent
        isDefault
        isActive
        updatedAt
        createdAt
      }
    }
  }
`;

const GET_COLLECTION_CASHBACK_LEVELS = gql`
  query GetCollectionCashbacklLevels {
    cashbackLevels {
      collection {
        id
        level
      }
    }
  }
`;

const GET_CASHBACK_LEVELS_BY_DEFAULT = gql`
  query GetReferralLevels($isDefault: Boolean!, $level: Int!) {
    cashbackLevels(isDefault: $isDefault, level: $level) {
      collection {
        id
        name
        level
        minPayoutSum
        profitRangeFrom
        profitRangeTo
        percent
        isDefault
        isActive
        updatedAt
        createdAt
      }
    }
  }
`;

const GET_CASHBACK_LEVELS = gql`
  {
    cashbackLevels {
      collection {
        id
        name
        level
        profitRangeFrom
        profitRangeTo
        percent
        isDefault
        isActive
      }
    }
  }
`;

export {
  GET_ALL_CASHBACK_LEVELS,
  GET_CASHBACK_LEVELS_BY_DEFAULT,
  GET_CASHBACK_LEVELS,
  GET_COLLECTION_CASHBACK_LEVELS
};
