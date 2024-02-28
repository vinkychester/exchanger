import { gql } from "apollo-boost";

const GET_POSTS_ADMIN_PANEL = gql`
  query getPosts(
    $page: Int = 1
    $itemsPerPage: Int
    $publish: Boolean
    $title: String
    $description: String
    $date_gte: String
    $date_lte: String
  ) {
    posts(
      page: $page
      itemsPerPage: $itemsPerPage
      publish: $publish
      title: $title
      description: $description
      createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
    ) {
      collection {
        id
        title
        createdAt
        lang
        description
        publish
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

const GET_POSTS_USER = gql`
  query getPosts($page: Int, $itemsPerPage: Int, $newsText: String) {
    posts(
      page: $page
      itemsPerPage: $itemsPerPage
      publish: true
      newsText: $newsText
    ) {
      collection {
        id
        title
        createdAt
        description
        content
        metaUrl
        mediaObjects {
          id
          storage
          contentUrl
        }
        imageDescription
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

const GET_POSTS_USER_ACTUAL = gql`
  query getPosts($page: Int, $itemsPerPage: Int) {
    posts(page: $page, itemsPerPage: $itemsPerPage, publish: true) {
      collection {
        metaUrl
        title
        createdAt
        description
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

const GET_POSTS_TITLE = gql`
  query getPosts($lang: String) {
    posts(lang: $lang) {
      collection {
        id
        title
      }
    }
  }
`;

const GET_POST = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author
      description
      metaDescription
      metaTitle
      metaUrl
      publish
      imageDescription
      createdAt
      pairUnits {
        collection {
          id
        }
      }
      mediaObjects {
        id
        storage
        contentUrl
      }
    }
  }
`;

const DELETE_POST_BY_ID = gql`
  mutation deletePostById($id: ID!) {
    deletePost(input: { id: $id }) {
      post {
        id
      }
    }
  }
`;

const GET_POST_DETAILS = gql`
  query getPosts($metaUrl: String!) {
    collectionQueryPosts(metaUrl: $metaUrl) {
      collection {
        id
        title
        createdAt
        content
        metaTitle
        metaDescription
        imageDescription
        prevElement
        nextElement
        pairUnits {
          collection {
            id
            currency {
              id
              asset
              tag
            }
            paymentSystem {
              id
              name
              subName
              tag
            }
            service {
              id
              tag
            }
            paymentPairs(
              isActive: true
              payout_isActive: true
              order: { top: "ASC" }
              page: 1
              itemsPerPage: 5
            ) {
              collection {
                id
                paymentRate
                payoutRate
                paymentRatePost
                payoutRatePost
                payout {
                  id
                  paymentRate
                  payoutRate
                  currency {
                    id
                    asset
                  }
                  paymentSystem {
                    id
                    name
                    subName
                    tag
                  }
                  service {
                    id
                    tag
                  }
                }
              }
            }
          }
        }
        mediaObjects {
          id
          storage
          contentUrl
        }
      }
    }
  }
`;

export {
  GET_POSTS_ADMIN_PANEL,
  GET_POSTS_TITLE,
  GET_POST,
  GET_POST_DETAILS,
  GET_POSTS_USER_ACTUAL,
  GET_POSTS_USER,
  DELETE_POST_BY_ID,
};
