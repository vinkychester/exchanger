import { gql } from "apollo-boost";

const GET_CALCULATED_DETAILS = gql`
  mutation getCalculatedDetails(
    $pairID: Int!
    $direction: String
    $amount: String
  ) {
    calculatorDetailsMutationPair(
      input: { pairID: $pairID, direction: $direction, amount: $amount }
    ) {
      pair {
        payment {
          amount
          min
          max
          fee {
            constant
          }
          currency {
            asset
          }
        }
        payout {
          amount
          min
          max
          fee {
            constant
          }
          currency {
            asset
          }
        }
      }
    }
  }
`;

export const CREATE_PAIR = gql`
  mutation createPair($percent: Float!, $payment: String!, $payout: String!) {
    createPair(
      input: { percent: $percent, payment: $payment, payout: $payout }
    ) {
      pair {
        id
      }
    }
  }
`;

export const UPDATE_PAIR_PERCENT = gql`
  mutation updatePairInPercent($id: ID!, $percent: Float!) {
    updatePair(input: { id: $id, percent: $percent }) {
      pair {
        id
      }
    }
  }
`;

const UPDATE_PAIR_TOP = gql`
  mutation updatePairTop($id: ID!, $top: Int!) {
    updatePair(input: { id: $id, top: $top }) {
      pair {
        id
      }
    }
  }
`;

export const UPDATE_PAIR_ACTIVITY = gql`
  mutation updatePairActivity($id: ID!, $isActive: Boolean!) {
    updatePair(input: { id: $id, isActive: $isActive }) {
      pair {
        id
      }
    }
  }
`;

export const DELETE_PAIR_BY_ID = gql`
  mutation deletePairById($id: ID!) {
    deletePair(input: { id: $id }) {
      pair {
        id
      }
    }
  }
`;

export {
  GET_CALCULATED_DETAILS,
  UPDATE_PAIR_TOP,
};
