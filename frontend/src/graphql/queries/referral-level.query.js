import { gql } from "apollo-boost";

const GET_ALL_REFERRAL_LEVELS = gql`
  query GetReferralLevels($page: Int!, $itemsPerPage: Int!) {
    referralLevels(page: $page, itemsPerPage: $itemsPerPage) {
      paginationInfo {
        lastPage
        totalCount
        itemsPerPage
      }
      collection {
        id
        name
        level
        percent
        isDefault
        isActive
      }
    }
  }
`;

const GET_REFERRAL_LEVELS_BY_DEFAULT = gql`
  query GetReferralLevels($isDefault: Boolean!, $level: Int!) {
    referralLevels(isDefault: $isDefault, level: $level) {
      collection {
        id
        isDefault
        level
      }
    }
  }
`;

const GET_REFERRAL_LEVELS = gql`
  {
    referralLevels {
      collection {
        id
        name
        percent
        isDefault
        level
      }
    }
  }
`;

export {
  GET_ALL_REFERRAL_LEVELS,
  GET_REFERRAL_LEVELS_BY_DEFAULT,
  GET_REFERRAL_LEVELS,
};
