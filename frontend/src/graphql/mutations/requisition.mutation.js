import { gql } from "apollo-boost";

const UPDATE_REQUISITION_STATUS = gql`
  mutation updateRequisitionStatus($id: ID!, $status: String!) {
    updateRequisition(input: { id: $id, status: $status }) {
      requisition {
        id
        status
      }
    }
  }
`;

const UPDATE_REQUISITION_MANAGER = gql`
  mutation updateRequisitionManager($id: ID!, $manager: String!) {
    updateRequisition(input: { id: $id, manager: $manager }) {
      requisition {
        id
      }
    }
  }
`;

const UPDATE_REQUISITION_DETAILS = gql`
  mutation updateRequisitionDetails(
    $id: ID!
    $manager: String
    $status: String
    $comment: String
  ) {
    updateRequisition(
      input: { id: $id, manager: $manager, status: $status, comment: $comment }
    ) {
      requisition {
        id
      }
    }
  }
`;

const CREATE_REQUISITION = gql`
  mutation createRequisition(
    $pair: String!
    $paymentAmount: Float!
    $payoutAmount: Float!
    $client_id: String!
    $paymentAttributes: Iterable!
    $payoutAttributes: Iterable!
    $savePaymentBankDetails: Boolean!
    $savePayoutBankDetails: Boolean!
    $exchangePoint: String!
  ) {
    createRequisition(
      input: {
        pair: $pair
        paymentAmount: $paymentAmount
        payoutAmount: $payoutAmount
        client_id: $client_id
        paymentAttributes: $paymentAttributes
        payoutAttributes: $payoutAttributes
        savePaymentBankDetails: $savePaymentBankDetails
        savePayoutBankDetails: $savePayoutBankDetails
        exchangePoint: $exchangePoint
      }
    ) {
      requisition {
        id
      }
    }
  }
`;

const CALCULATE_REQUISITION_AMOUNT = gql`
  mutation calculateRequisitionAmount($id: ID!, $tmpPercent: Float!) {
    calculateAmountRequisition(input: { id: $id, tmpPercent: $tmpPercent }) {
      requisition {
        recalculatedAmount
        amount
        tmpCommission
      }
    }
  }
`;

const SET_SEEN_REQUISITION = gql`
  mutation setSeenRequisition($id: ID!, $seen: Boolean!) {
    updateRequisition(input: { id: $id, isSeen: $seen }) {
      requisition {
        id
      }
    }
  }
`;

export {
  CREATE_REQUISITION,
  UPDATE_REQUISITION_STATUS,
  UPDATE_REQUISITION_MANAGER,
  UPDATE_REQUISITION_DETAILS,
  CALCULATE_REQUISITION_AMOUNT,
  SET_SEEN_REQUISITION,
};
