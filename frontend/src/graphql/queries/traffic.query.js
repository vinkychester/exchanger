import { gql } from "apollo-boost";

const GET_TRAFFIC_LINKS_ADMIN_PANEL = gql`
  query getTrafficLinks(
    $tpage: Int
    $itemsPerPage: Int
    $siteName: String
    $tdate_gte: String
    $tdate_lte: String
  ) {
    trafficLinks(
      page: $tpage
      itemsPerPage: $itemsPerPage
      siteName: $siteName
    ) {
      collection {
        id
        siteName
        siteUrl
        token
        countOfClicks
        countOfRegisterClients
        countOfRequisition
        systemProfit
        cleanSystemProfit
        siteUrl
        token
        trafficDetails(createdAt: [{ gte: $tdate_gte }, { lte: $tdate_lte }]) {
          collection {
            id
            createdAt
          }
          paginationInfo {
            totalCount
          }
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

const GET_TRAFFIC_DETAIL = gql`
  query getTrafficDetails($trafficLinkId: Int, $page: Int, $itemsPerPage: Int) {
    trafficDetails(
      trafficLink_id: $trafficLinkId
      page: $page
      itemsPerPage: $itemsPerPage
    ) {
      collection {
        id
        ip
        createdAt
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

const GET_TRAFFIC_LINK_BY_ID = gql`
  query getTrafficLink($id: ID!) {
    trafficLink(id: $id) {
      siteName
    }
  }
`;

const CREATE_TRAFFIC_LINK = gql`
  mutation createTrafficLink($siteName: String!, $siteUrl: String! = "") {
    createTrafficLink(input: { siteName: $siteName, siteUrl: $siteUrl }) {
      trafficLink {
        id
      }
    }
  }
`;

export {
  GET_TRAFFIC_LINKS_ADMIN_PANEL,
  CREATE_TRAFFIC_LINK,
  GET_TRAFFIC_DETAIL,
  GET_TRAFFIC_LINK_BY_ID,
};
