import { gql } from "apollo-boost";

const GET_USER_RBAC_DETAILS = gql`
  query getUserRBACDetails {
    userId @client
    userRole @client
    managerCity @client
    managerClientRequisition @client
    username @client
  }
`;

const GET_USER_BY_ID = gql`
  query getUserDetails($userId: ID!) {
    client(id: $userId) {
      id
      firstname
      lastname
      email
    }
  }
`;

const SET_AUTHENTICATOR_SECRET = gql`
  mutation updateClient($id: ID!, $secret: String!, $QR: String!) {
    updateClient(
      input: {
        id: $id
        googleAuthenticatorSecret: $secret
        googleAuthQrCode: $QR
      }
    ) {
      client {
        id
      }
    }
  }
`;

export const GET_AUTHENTICATOR_SECRET = gql`
  query getAuthenticatorSecret($id: ID!) {
    getAuthenticatorSecretClient(id: $id) {
      id
      tempQRCode
      tempSecret
    }
  }
`;

const GET_CONCRETE_USER_BY_DISCR = gql`
  query getConcreteUserByDiscr($discr: String!, $id: String!) {
    users(discr: $discr, id: $id) {
      collection {
        id
        firstname
        lastname
        email
        isEnabled
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

const GET_USER_BY_DISCR = gql`
  query getUserByDiscr(
    $discr: String!
    $isBanned: Boolean
    $page: Int
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $email: String
    $dateTo: String
    $dateFrom: String
  ) {
    users(
      discr: $discr
      isBanned: $isBanned
      page: $page
      itemsPerPage: $itemsPerPage
      firstname: $firstname
      lastname: $lastname
      email: $email
      createdAt: [{ gt: $dateFrom }, { lt: $dateTo }]
    ) {
      collection {
        id
        firstname
        lastname
        email
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

const GET_USER_LOYALTY_PROGRAM_DETAILS = gql`
  query getUserDetails($userUUID: String!) {
    programLoyaltyClient(userID: $userUUID) {
      balances {
        collection {
          id
          field
          value
        }
      }
      referralToken
      nextCashbackLevel {
        id
        percent
        level
        profitRangeFrom
        profitRangeTo
      }
      clientBalance {
        field
        value
      }
      referralClientLevels(isCurrent: true) {
        collection {
          id
          profit
          referralLevel {
            id
            percent
            level
          }
        }
      }
      cashbackClientLevels(isCurrent: true) {
        collection {
          id
          profit
          cashbackLevel {
            id
            percent
            level
            profitRangeFrom
            profitRangeTo
          }
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
  }
`;

export const GET_USER_INVITED_USERS = gql`
  query clientInvitedClients($userID: String!) {
    userWithAllGenerationsClient(userID: $userID) {
      id
      referralUserRelations {
        collection {
          level
          invitedUser {
            id
            email
            createdAt
          }
        }
      }
    }
  }
`;

export {
  GET_USER_RBAC_DETAILS,
  GET_USER_BY_DISCR,
  SET_AUTHENTICATOR_SECRET,
  GET_USER_LOYALTY_PROGRAM_DETAILS,
  GET_CONCRETE_USER_BY_DISCR,
  GET_USER_BY_ID,
};
