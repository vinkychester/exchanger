import { gql } from "@apollo/client";

const GET_LOGS = gql`
  query getLogs(
    $page: Int! = 1
    $itemsPerPage: Int = 10
    $role: String
    $email: String
    $action: String
    $event: String
    $ip: String
    $date_gte: String
    $date_lte: String
  ) {
    logs(
      page: $page
      itemsPerPage: $itemsPerPage
      entityClass: $role
      userEmail: $email
      action: $action
      text: $event
      ip: $ip
      date: { after: $date_gte, before: $date_lte }
    ) {
      collection {
        id
        entityClass
        userEmail
        action
        text
        ip
        date
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

const GET_CLIENT_LOGS = gql`
  query getClientLogs(
    $page: Int! = 1
    $email: String!
    $itemsPerPage: Int = 10
    $action: String
    $event: String
    $ip: String
    $date_gte: String
    $date_lte: String
  ) {
    logs(
      page: $page
      itemsPerPage: $itemsPerPage
      userEmail: $email
      action: $action
      text: $event
      ip: $ip
      date: { after: $date_gte, before: $date_lte }
    ) {
      collection {
        id
        entityClass
        userEmail
        action
        text
        ip
        date
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

export { GET_LOGS, GET_CLIENT_LOGS };
