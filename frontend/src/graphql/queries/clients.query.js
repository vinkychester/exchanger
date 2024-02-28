import { gql } from "apollo-boost";

const GET_CLIENTS_BY_STATUS = gql`
  query getClientsByStatus(
    $discr: String!
    $page: Int
    $itemsPerPage: Int
    $isEnabled: Boolean
    $isBanned: Boolean
    $firstname: String
    $lastname: String
    $email: String
    $isVerified: Boolean
    $status: String
    $dateTo: String
    $dateFrom: String
  ) {
    clients(
      discr: $discr
      page: $page
      itemsPerPage: $itemsPerPage
      isEnabled: $isEnabled
      isBanned: $isBanned
      firstname: $firstname
      lastname: $lastname
      email: $email
      isVerified: $isVerified
      status: $status
      createdAt: [{ gt: $dateFrom }, { lt: $dateTo }]
    ) {
      collection {
        id
        firstname
        lastname
        email
        createdAt
        isEnabled
        isVerified
        isBanned
        status
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

const GET_CLIENTS = gql`
  query getClients(
    $page: Int!
    $itemsPerPage: Int!
    $isBanned: Boolean!
    $enabled: Boolean
    $firstname: String
    $lastname: String
    $email: String
    $status: String
    $date_gte: String
    $date_lte: String
    $referralName: String
    $isDeleted: Boolean
  ) {
    clients(
      page: $page
      itemsPerPage: $itemsPerPage
      isBanned: $isBanned
      isEnabled: $enabled
      firstname: $firstname
      lastname: $lastname
      email: $email
      status: $status
      referralClientLevels_referralLevel_name: $referralName
      createdAt: [{ gt: $date_gte }, { lt: $date_lte }]
      isDeleted: $isDeleted
    ) {
      collection {
        id
        firstname
        lastname
        email
        createdAt
        isEnabled
        isBanned
        status
        registrationType
        isDeleted
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

const GET_CLIENTS_TRAFFIC = gql`
  query getClientsTraffic(
    $trafficToken: String
    $tdate_gte: String
    $tdate_lte: String
    $status: String = "FINISHED"
  ) {
    clients(
      trafficToken: $trafficToken
      createdAt: [{ gte: $tdate_gte }, { lte: $tdate_lte }]
    ) {
      collection {
        requisitions(status: $status) {
          collection {
            id
            systemProfit
            profit
            pair {
              id
              payment {
                id
                currency {
                  id
                  tag
                }
              }
            }
            requisitionFeeHistories {
              id
              rate
              type
            }
          }
          paginationInfo {
            totalCount
          }
        }
      }
      paginationInfo {
        totalCount
      }
    }
  }
`;

const GET_CLIENT_REQUISITION_TOTAL_COUNT_BY_ID = gql`
  query getClientRequisitionTotalCountById(
    $id: ID!
    $status: String = "FINISHED"
  ) {
    client(id: $id) {
      id
      requisitions(status: $status) {
        collection {
          id
        }
        paginationInfo {
          totalCount
        }
      }
    }
  }
`;

const GET_CLIENT_DETAILS = gql`
  query getClientDetails($id: ID!) {
    client(id: $id) {
      id
      firstname
      lastname
      email
      createdAt
      registrationType
      isEnabled
      trafficLink {
        id
        siteName
      }
      mediaObject {
        id
        base64
      }
    }
  }
`;

const GET_STATISTIC_CLIENTS = gql`
  query getStatisticClients(
    $rpage: Int = 1
    $itemsPerPage: Int = 12
    $firstname: String
    $lastname: String
    $email: String
    $rdate_gte: String
    $rdate_lte: String
  ) {
    getStatisticClients(
      page: $rpage
      itemsPerPage: $itemsPerPage
      requisitions_createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
      firstname: $firstname
      lastname: $lastname
      email: $email # exists: { requisitions: true}
    ) {
      collection {
        id
        firstname
        lastname
        email
        isEnabled
        balance
        all: requisitions(
          createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
        ) {
          collection {
            profit
            pair {
              id
              payment {
                id
                currency {
                  id
                  tag
                }
              }
            }
            requisitionFeeHistories {
              id
              rate
              type
            }
          }
          paginationInfo {
            totalCount
          }
        }
        created: requisitions(
          status: "NEW"
          createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
        ) {
          paginationInfo {
            totalCount
          }
        }
        invoice: requisitions(
          status: "INVOICE"
          createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
        ) {
          paginationInfo {
            totalCount
          }
        }
        cardVerification: requisitions(
          status: "CARD_VERIFICATION"
          createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
        ) {
          paginationInfo {
            totalCount
          }
        }
        pending: requisitions(
          status: "PENDING"
          createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
        ) {
          paginationInfo {
            totalCount
          }
        }
        processed: requisitions(
          status: "PROCESSED"
          createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
        ) {
          paginationInfo {
            totalCount
          }
        }
        finished: requisitions(
          status: "FINISHED"
          createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
        ) {
          paginationInfo {
            totalCount
          }
        }
        canceled: requisitions(
          status: "CANCELED"
          createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
        ) {
          paginationInfo {
            totalCount
          }
        }
        disabled: requisitions(
          status: "DISABLED"
          createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
        ) {
          paginationInfo {
            totalCount
          }
        }
        error: requisitions(
          status: "ERROR"
          createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
        ) {
          paginationInfo {
            totalCount
          }
        }
      }
      paginationInfo {
        lastPage
        totalCount
        itemsPerPage
      }
    }
  }
`;

const GET_CLIENTS_LOYALTY_STATISTICS = gql`
  query getClients(
    $lpage: Int
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $email: String
  ) {
    clients(
      firstname: $firstname
      lastname: $lastname
      email: $email
      page: $lpage
      itemsPerPage: $itemsPerPage
    ) {
      collection {
        id
        email
        firstname
        lastname
        isEnabled
        balances {
          collection {
            id
            field
            value
          }
        }
        first:referralUserRelations(level: 1) {
          paginationInfo {
           totalCount
          }
        }
        second:referralUserRelations(level: 2) {
          paginationInfo {
            totalCount
          }
        }
      }
      paginationInfo {
        lastPage
        totalCount
        itemsPerPage
      }
    }
  }
`;

const GET_CLIENT_LOYALTY_STATISTICS_DETAILS = gql`
  query getClient($id: ID!) {
    client(id: $id) {
      id
      email
      firstname
      lastname
      isEnabled
      payoutRequisitions(status: "FINISHED") {
        collection {
          amount
        }
      }
      balances {
        collection {
          id
          field
          value
        }
      }
      first:referralUserRelations(level: 1) {
        paginationInfo {
          totalCount
        }
      }
      second:referralUserRelations(level: 2) {
        paginationInfo {
          totalCount
        }
      }
      mediaObject {
        id
        base64
      }
    }
  }
`;

const GET_CLIENT_BY_ID = gql`
  query getClientByID(
    $id: ID!
    $page: Int = 1
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $email: String
    $status: String
    $isEnabled: Boolean
    $isVerified: Boolean
    $referralLevel: Int
  ) {
    client(id: $id) {
      id
      firstname
      lastname
      referralUserRelations(
        page: $page
        itemsPerPage: $itemsPerPage
        invitedUser_firstname: $firstname
        invitedUser_lastname: $lastname
        invitedUser_email: $email
        invitedUser_status: $status
        invitedUser_isEnabled: $isEnabled
        invitedUser_isVerified: $isVerified
        level: $referralLevel
      ) {
        collection {
          id
          invitedUser {
            id
            firstname
            lastname
            email
            isEnabled
            createdAt
            status
            isEnabled
            isVerified
          }
        }
        paginationInfo {
          totalCount
        }
      }
    }
  }
`;

const GET_CLIENT_FULLNAME = gql`
  query getClientFullname($id: ID!) {
    client(id: $id) {
      id
      firstname
      lastname
    }
  }
`;

const GET_CLIENTS_BY_TRAFFIC_ID = gql`
  query getClientsByTrafficId(
    $trafficLink_id: Int!
    $page: Int!
    $itemsPerPage: Int!
    $firstname: String
    $lastname: String
    $email: String
  ) {
    clients(
      trafficLink_id: $trafficLink_id
      page: $page
      itemsPerPage: $itemsPerPage
      firstname: $firstname
      lastname: $lastname
      email: $email
    ) {
      collection {
        id
        firstname
        lastname
        email
        status
        createdAt
        isEnabled
        registrationType
      }
      paginationInfo {
        totalCount
      }
    }
  }
`;

export {
  GET_CLIENTS,
  GET_CLIENT_REQUISITION_TOTAL_COUNT_BY_ID,
  GET_CLIENTS_BY_STATUS,
  GET_CLIENTS_LOYALTY_STATISTICS,
  GET_CLIENTS_TRAFFIC,
  GET_CLIENT_BY_ID,
  GET_STATISTIC_CLIENTS,
  GET_CLIENT_LOYALTY_STATISTICS_DETAILS,
  GET_CLIENT_DETAILS,
  GET_CLIENT_FULLNAME,
  GET_CLIENTS_BY_TRAFFIC_ID,
};
