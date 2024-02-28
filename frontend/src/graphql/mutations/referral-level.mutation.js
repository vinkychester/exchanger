import { gql } from "apollo-boost";

const UPDATE_REFERRAL_LEVEL = gql`
  mutation UpdateReferralLevel($input: updateReferralLevelInput!) {
    updateReferralLevel(input: $input) {
      referralLevel {
        id
      }
    }
  }
`;

const SET_REFERRAL_LEVEL_FOR_ALL_EXCEPT_INDIVIDUAL_CLIENTS = gql`
  mutation UpdateForAllExceptVipClientsReferralLevel($referralLevelID: Int!) {
    updateForAllExceptVipClientsReferralLevel(
      input: { referralLevelID: $referralLevelID }
    ) {
      referralLevel {
        id
        level
        isDefault
      }
    }
  }
`;

const SET_REFERRAL_LEVEL_FOR_INDIVIDUAL_CLIENTS = gql`
  mutation UpdateForAllVipClientsReferralLevel($referralLevelID: Int!) {
    updateForAllVipClientsReferralLevel(
      input: { referralLevelID: $referralLevelID }
    ) {
      referralLevel {
        id
        level
        isDefault
      }
    }
  }
`;

const SET_REFERRAL_LEVEL_FOR_NEW_CLIENTS = gql`
  mutation SetReferralLevelDefault($referralLevelID: Int!) {
    updateForNewClientsReferralLevel(
      input: { referralLevelID: $referralLevelID }
    ) {
      referralLevel {
        id
        level
        isDefault
      }
    }
  }
`;

const SET_REFERRAL_LEVEL_FOR_ALL_CLIENTS = gql`
  mutation SetReferralLevelDefault($referralLevelID: Int!) {
    updateForAllClientsReferralLevel(
      input: { referralLevelID: $referralLevelID }
    ) {
      referralLevel {
        id
        level
        isDefault
      }
    }
  }
`;

const CREATE_REFERRAL_LEVEL = gql`
  mutation CreateReferralLevel($name: String!, $percent: Float!, $level: Int!) {
    createReferralLevel(
      input: { name: $name, percent: $percent, level: $level, isDefault: false }
    ) {
      referralLevel {
        id
      }
    }
  }
`;

const DELETE_REFERRAL_LEVEL = gql`
  mutation DeleteReferralLevel($id: ID!) {
    deleteReferralLevel(input: { id: $id }) {
      referralLevel {
        id
      }
    }
  }
`;

export {
  CREATE_REFERRAL_LEVEL,
  DELETE_REFERRAL_LEVEL,
  SET_REFERRAL_LEVEL_FOR_ALL_CLIENTS,
  SET_REFERRAL_LEVEL_FOR_ALL_EXCEPT_INDIVIDUAL_CLIENTS,
  SET_REFERRAL_LEVEL_FOR_INDIVIDUAL_CLIENTS,
  SET_REFERRAL_LEVEL_FOR_NEW_CLIENTS,
  UPDATE_REFERRAL_LEVEL,
};
