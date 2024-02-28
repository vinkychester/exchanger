import { gql } from "apollo-boost";

const GET_PUBLISHED_REVIEWS = gql`
  query getPublishedReviews($page: Int, $itemsPerPage: Int, $publish: Boolean) {
    reviews(page: $page, itemsPerPage: $itemsPerPage, publish: $publish) {
      collection {
        id
        message
        createdAt
        client {
          id
          firstname
          lastname
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

const GET_ALL_REVIEWS = gql`
  query getPublishedReviews($page: Int, $itemsPerPage: Int) {
    reviews(page: $page, itemsPerPage: $itemsPerPage) {
      collection {
        id
        message
        createdAt
        publish
        client {
          id
          firstname
          lastname
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

const GET_ALL_REVIEWS_FILTER = gql`
  query getAllReviewsFilter(
    $page: Int = 1
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $publish: Boolean
    $date_lte: String
    $date_gte: String
  ) {
    reviews(
      page: $page
      itemsPerPage: $itemsPerPage
      client_firstname: $firstname
      client_lastname: $lastname
      publish: $publish
      createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
    ) {
      collection {
        id
        message
        createdAt
        publish
        client {
          id
          firstname
          lastname
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

const GET_REVIEW_BY_ID = gql`
  query getReviewByID($id: ID!) {
    review(id: $id) {
      id
      message
      createdAt
      client {
        id
        firstname
        lastname
      }
    }
  }
`;

const GET_NEW_REVIEW = gql`
  query getNewReview {
    reviews(publish: false) {
      paginationInfo {
        totalCount
      }
    }
  }
`;

export {
  GET_PUBLISHED_REVIEWS,
  GET_ALL_REVIEWS,
  GET_REVIEW_BY_ID,
  GET_ALL_REVIEWS_FILTER,
  GET_NEW_REVIEW,
};
