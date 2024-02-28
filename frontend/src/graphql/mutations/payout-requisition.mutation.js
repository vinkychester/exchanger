import { gql } from "apollo-boost";

const CREATE_PAYOUT_REQUISITION = gql`
  mutation createPayoutRequisition(
    $amount: Float!
    $client: String!
    $wallet: String!
    $usdtType: String!
  ) {
    createPayoutRequisition(
      input: {
        amount: $amount
        client: $client
        wallet: $wallet
        usdtType: $usdtType
      }
    ) {
      payoutRequisition {
        id
      }
    }
  }
`;

const UPDATE_PAYOUT_REQUISITION = gql`
  mutation updatePayoutRequisition(
    $id: ID!
    $status: String!
    $commentary: String
  ) {
    checkAndUpdatePayoutRequisition(
      input: { id: $id, status: $status, commentary: $commentary }
    ) {
      payoutRequisition {
        id
      }
    }
  }
`;

export { CREATE_PAYOUT_REQUISITION, UPDATE_PAYOUT_REQUISITION };
