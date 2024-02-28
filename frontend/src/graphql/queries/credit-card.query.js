import { gql } from "apollo-boost";

const GET_CREDIT_CARDS = gql`
  query getCreditCards(
    $page: Int!
    $itemsPerPage: Int!
    $cardMask: String
    $status: String
    $date_gte: String
    $date_lte: String
    $firstname: String
    $lastname: String
    $client_id: String
  ) {
    creditCards(
      page: $page
      itemsPerPage: $itemsPerPage
      cardMask: $cardMask
      status: $status
      createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
      client_firstname: $firstname
      client_lastname: $lastname
      client_id: $client_id
    ) {
      collection {
        id
        cardNumber
        cardMask
        expiryDate
        status
        createdAt
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

const GET_CLIENT_CREDIT_CARDS = gql`
  query getClientCreditCards(
    $page: Int!
    $itemsPerPage: Int!
    $client_id: String!
    $cardMask: String
    $date_gte: String
    $date_lte: String
  ) {
    creditCards(
      page: $page
      itemsPerPage: $itemsPerPage
      cardMask: $cardMask
      createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
      client_id: $client_id
      status: "VERIFIED"
    ) {
      collection {
        id
        cardNumber
        cardMask
        expiryDate
        status
        createdAt
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

const GET_CREDIT_CARD_DETAILS = gql`
  query getCreditCardDetails($id: ID!) {
    creditCard(id: $id) {
      id
      expiryDate
      cardNumber
      cardMask
      status
      comment
      createdAt
      manager
      verificationTime
      mediaObjects {
        id
        base64
      }
      client {
        id
        firstname
        lastname
        email
      }
    }
  }
`;

const GET_NOT_VERIFIED_CREDIT_CARD = gql`
  query getNotVerifiedCreditCard {
    creditCards(status: "NOT_VERIFIED") {
      paginationInfo {
        totalCount
      }
    }
  }
`;

export {
  GET_CREDIT_CARDS,
  GET_CLIENT_CREDIT_CARDS,
  GET_CREDIT_CARD_DETAILS,
  GET_NOT_VERIFIED_CREDIT_CARD,
};
