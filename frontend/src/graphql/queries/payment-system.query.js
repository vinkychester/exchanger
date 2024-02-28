import { gql } from "apollo-boost";

const GET_PAYMENT_SYSTEMS = gql`
  query getPaymentSystems {
    paymentSystems {
      collection {
        id
        name
        subName
        tag
        price
      }
    }
  }
`;

const GET_ALL_PAYMENT_SYSTEMS = gql`
  query getPaymentSystems(
    $tag: String
    $page: Int!
    $itemsPerPage: Int
    $name: String
    $price_gte: String
    $price_lte: String
  ) {
    paymentSystems(
      tag: $tag
      page: $page
      itemsPerPage: $itemsPerPage
      name: $name
      price: { gte: $price_gte, lte: $price_lte }
    ) {
      collection {
        id
        name
        price
        tag
        subName
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

export { GET_PAYMENT_SYSTEMS, GET_ALL_PAYMENT_SYSTEMS };
