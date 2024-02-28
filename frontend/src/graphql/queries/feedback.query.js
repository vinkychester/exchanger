import { gql } from "apollo-boost";

const GET_ALL_FEEDBACK_MESSAGE = gql`
  query getAllFeedbackMessage(
    $page: Int
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $email: String
    $type: [String]
    $status: String
    $deleted: Boolean
    $date_lte: String
    $date_gte: String
    $orderDate: String
    $orderStatus: String
    $citySearch: [String]
  ) {
    feedbackMessages(
      page: $page
      itemsPerPage: $itemsPerPage
      firstname: $firstname
      lastname: $lastname
      email: $email
      status: $status
      deleted: $deleted
      type_list: $type
      createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
      order: [{ status: $orderStatus }, { createdAt: $orderDate }]
      citySearch_list: $citySearch
    ) {
      collection {
        id
        firstname
        lastname
        email
        status
        type
        createdAt
        city {
          id
          name
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

const GET_FEEDBACK_MESSAGE_BY_ID = gql`
  query getFeedbackMessageById($id: ID!) {
    feedbackMessage(id: $id) {
      id
      firstname
      lastname
      message
      email
      createdAt
      status
      feedbackDetail {
        id
        message
        createdAt
        author
      }
    }
  }
`;

const GET_NEW_FEEDBACK_MESSAGE = gql`
  query getNewFeedbackMessage($citySearch: [String]) {
    feedbackMessages(status: "not_viewed", citySearch_list: $citySearch) {
      paginationInfo {
        totalCount
      }
    }
  }
`;

export {
  GET_ALL_FEEDBACK_MESSAGE,
  GET_FEEDBACK_MESSAGE_BY_ID,
  GET_NEW_FEEDBACK_MESSAGE,
};
