import { gql } from "apollo-boost";

const CREATE_REVIEW = gql`
  mutation createReview($message: String!, $client: String!) {
    createReview(input: { message: $message, client: $client }) {
      review {
        id
      }
    }
  }
`;

const SET_PUBLISHED_REVIEW = gql`
  mutation setPublishedReview($id: ID!, $publish: Boolean!) {
    updateReview(input: { id: $id, publish: $publish }) {
      review {
        id
      }
    }
  }
`;

const DELETE_REVIEW_BY_ID = gql`
  mutation deleteReviewById($id: ID!) {
    deleteReview(input: { id: $id }) {
      review {
        id
      }
    }
  }
`;

const UPDATE_REVIEW_MESSAGE_BY_ID = gql`
  mutation updateReviewMessageById($id: ID!, $message: String!) {
    updateReview(input: { id: $id, message: $message }) {
      review {
        id
      }
    }
  }
`;

export {
  CREATE_REVIEW,
  SET_PUBLISHED_REVIEW,
  DELETE_REVIEW_BY_ID,
  UPDATE_REVIEW_MESSAGE_BY_ID,
};
