import { gql } from "apollo-boost";

const CREATE_CREDIT_CARD = gql`
  mutation createCreditCard(
    $cardNumber: String!
    $cardMask: String!
    $expiryDate: String!
    $client: String!
    $files: Iterable!
  ) {
    createCreditCard(
      input: {
        cardNumber: $cardNumber
        cardMask: $cardMask
        expiryDate: $expiryDate
        client: $client
        files: $files
      }
    ) {
      creditCard {
        id
      }
    }
  }
`;

const UPDATE_CREDIT_CARD_DATA = gql`
  mutation updateCreditCardData($id: ID!, $status: String, $comment: String) {
    updateCreditCard(input: { id: $id, status: $status, comment: $comment }) {
      creditCard {
        id
      }
    }
  }
`;

const UPDATE_APPROVE_CREDIT_CARD = gql`
  mutation updateApproveCreditCard($id: ID!, $status: String!) {
    updateApproveMutationCreditCard(input: { id: $id, status: $status }) {
      creditCard {
        id
      }
    }
  }
`;

const DELETE_CREDIT_CARD = gql`
  mutation deleteCreditCard($id: ID!) {
    deleteCreditCard(input: { id: $id }) {
      creditCard {
        id
      }
    }
  }
`;

export {
  CREATE_CREDIT_CARD,
  UPDATE_CREDIT_CARD_DATA,
  UPDATE_APPROVE_CREDIT_CARD,
  DELETE_CREDIT_CARD,
};
