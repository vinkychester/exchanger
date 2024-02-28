import { gql } from "apollo-boost";

const GET_CLIENT_REFERRAL_LEVELS = gql`
  query getClientReferralLevels($clientId: String!) {
    referralClientLevels(client_id: $clientId, status: true) {
      collection {
        id
        profit
        referralLevel {
          id
          percent
          level
        }
      }
    }
  }
`;

const GET_CLIENT_REFERRAL_LEVELS_BY_USER_ID = gql`
  query getClientReferralLevels($clientId: String!) {
    referralClientLevels(client_id: $clientId, isCurrent: true) {
      __typename
      collection {
        __typename
        id
        profit
        referralLevel {
          id
          name
          percent
          level
        }
      }
    }
  }
`;

export { GET_CLIENT_REFERRAL_LEVELS, GET_CLIENT_REFERRAL_LEVELS_BY_USER_ID };
