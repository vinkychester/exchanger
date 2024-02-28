import { gql } from "apollo-boost";

const GET_PAYOUT_REQUISITIONS = gql`
  query getAccountDetailsClient($clientID: String!) {
    payoutRequisitions(client_id: $clientID) {
      collection {
        id
        wallet
        status
        createdAt
        amount
        commentary
      }
    }
  }
`;

const GET_ALL_PAYOUT_REQUISITIONS = gql`
  query getAllPayoutRequisitions(
    $page: Int
    $itemsPerPage: Int
    $status: String
    $dateTo: String
    $dateFrom: String
    $amountFrom: String
    $amountTo: String
    $firstname: String
    $lastname: String
  ) {
    payoutRequisitions(
      page: $page
      itemsPerPage: $itemsPerPage
      status: $status
      client_firstname: $firstname
      client_lastname: $lastname
      amount: { gt: $amountFrom, lt: $amountTo }
      createdAt: [{ gt: $dateFrom }, { lt: $dateTo }]
    ) {
      collection {
        id
        usdtType
        wallet
        status
        createdAt
        amount
        commentary
        client {
          id
          firstname
          lastname
          email
        }
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

const GET_NEW_REQUISITIONS_COUNT = gql`
  query getNewRequisitionsCount {
    payoutRequisitions (status: "NEW") {
      paginationInfo {
        totalCount
      }
    }
  }
`;

export { GET_PAYOUT_REQUISITIONS, GET_ALL_PAYOUT_REQUISITIONS, GET_NEW_REQUISITIONS_COUNT };
