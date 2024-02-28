import { gql } from "apollo-boost";

const CREATE_MAILING = gql`
  mutation createMailing($title: String!, $file: Iterable, $message: String!) {
    createMailing(input: { title: $title, file: $file, message: $message }) {
      mailing {
        id
      }
    }
  }
`;

const UPDATE_MAILING_STATUS = gql`
  mutation updateMailingStatus($id: ID!, $status: Boolean) {
    updateMailing(input: { id: $id, status: $status }) {
      mailing {
        id
      }
    }
  }
`;

const UPDATE_MAILING_DATA = gql`
  mutation updateMailingData(
    $id: ID!
    $title: String
    $message: String
    $file: Iterable
  ) {
    updateMailing(
      input: { id: $id, title: $title, file: $file, message: $message }
    ) {
      mailing {
        id
      }
    }
  }
`;

const DELETE_MAILING = gql`
  mutation deleteMailing($id: ID!) {
    deleteMailing(input: { id: $id }) {
      mailing {
        id
      }
    }
  }
`;

export {
  CREATE_MAILING,
  UPDATE_MAILING_STATUS,
  UPDATE_MAILING_DATA,
  DELETE_MAILING,
};
