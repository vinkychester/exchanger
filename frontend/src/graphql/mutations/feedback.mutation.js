import { gql } from "apollo-boost";

const DELETE_FEEDBACK_MESSAGE_BY_ID = gql`
  mutation deleteFeedbackMessageById($id: ID!) {
    deleteFeedbackMessage(input: { id: $id }) {
      feedbackMessage {
        id
      }
    }
  }
`;

const UPDATE_DELETE_FEEDBACK_MESSAGE_BY_ID = gql`
  mutation updateFeedbackMessageById(
    $id: ID!
    $deleted: Boolean!
    $status: String!
  ) {
    updateFeedbackMessage(
      input: { id: $id, deleted: $deleted, status: $status }
    ) {
      feedbackMessage {
        id
      }
    }
  }
`;

const CREATE_FEEDBACK_MESSAGE = gql`
  mutation createFeedbackMessage(
    $checkedType: String!
    $checkedCity: String
    $firstName: String!
    $lastName: String!
    $email: String!
    $message: String!
    $captchaToken: String!
  ) {
    createFeedbackMessage(
      input: {
        type: $checkedType
        city: $checkedCity
        firstname: $firstName
        lastname: $lastName
        email: $email
        message: $message
        captchaToken: $captchaToken
      }
    ) {
      feedbackMessage {
        id
      }
    }
  }
`;

const UPDATE_MESSAGE = gql`
  mutation updateFeedbackMessage($id: ID!, $status: String!) {
    updateFeedbackMessage(input: { id: $id, status: $status }) {
      feedbackMessage {
        id
      }
    }
  }
`;

const CREATE_FEEDBACK_DETAIL = gql`
  mutation createFeedbackDetail(
    $feedbackMessageId: String!
    $message: String!
    $author: String!
  ) {
    createFeedbackDetail(
      input: {
        feedbackMessage: $feedbackMessageId
        message: $message
        author: $author
      }
    ) {
      feedbackDetail {
        id
      }
    }
  }
`;

export {
  DELETE_FEEDBACK_MESSAGE_BY_ID,
  CREATE_FEEDBACK_MESSAGE,
  UPDATE_MESSAGE,
  CREATE_FEEDBACK_DETAIL,
  UPDATE_DELETE_FEEDBACK_MESSAGE_BY_ID,
};
