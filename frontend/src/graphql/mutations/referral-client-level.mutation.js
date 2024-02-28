import { gql } from "apollo-boost";

const UPDATE_CLIENT_REFERRAL_LEVEL = gql`
  mutation UpdateReferralClientLevel($input: updateReferralClientLevelInput!) {
    updateReferralClientLevel(input: $input) {
      referralClientLevel {
        id
      }
    }
  }
`;

const UPDATE_CLIENT_REFERRAL_LEVEL_WITH_LOG = gql`
  mutation UpdateReferralClientLevelWithLog(
    $referralClientLevelID: Int!
    $referralLevelID: Int!
  ) {
    updateWithLogReferralClientLevel(
      input: {
        referralClientLevelID: $referralClientLevelID
        referralLevelID: $referralLevelID
      }
    ) {
      referralClientLevel {
        id
      }
    }
  }
`;

const CREATE_IF_NOT_EXIST_REFERRAL_CLIENT_LEVEL = gql`
  mutation createReferralClientLevel(
    $clientID: String!
    $referralLevelID: Int!
  ) {
    createIfNotExistReferralClientLevel(
      input: { clientID: $clientID, referralLevelID: $referralLevelID }
    ) {
      __typename
      referralClientLevel {
        __typename
        id
        profit
        referralLevel {
          __typename
          id
          name
          percent
          level
        }
      }
    }
  }
`;

export {
  UPDATE_CLIENT_REFERRAL_LEVEL,
  UPDATE_CLIENT_REFERRAL_LEVEL_WITH_LOG,
  CREATE_IF_NOT_EXIST_REFERRAL_CLIENT_LEVEL,
};
