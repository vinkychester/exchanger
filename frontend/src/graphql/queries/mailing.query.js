import { gql } from "apollo-boost";

const GET_ALL_MAILING_MESSAGE = gql`
  query getAllMailingMessage(
    $title: String
    $message: String
    $status: Boolean
  ) {
    mailings(title: $title, message: $message, status: $status) {
      id
      title
      message
      status
      createdAt
    }
  }
`;

const GET_MAILING_DETAILS = gql`
  query getMailingDetails($id: ID!) {
    mailing(id: $id) {
      id
      title
      message
      base64
      status
    }
  }
`;

export { GET_ALL_MAILING_MESSAGE, GET_MAILING_DETAILS };
