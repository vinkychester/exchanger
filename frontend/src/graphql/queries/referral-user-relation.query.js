import { gql } from "apollo-boost";

const GET_REFERRAL_RELATION = gql`
  query ReferralUserRelations($invitedUserUUID: String!) {
    referralUserRelations(invitedUser_id: $invitedUserUUID) {
      collection {
        id
        client {
          id
          email
          
        }
      }
    }
  }
`;

const GET_INVITED_USERS = gql`
  query ReferralUserRelations(
    $clientId: String!
    $level: Int!
    $page: Int
    $itemsPerPage: Int
  ) {
    referralUserRelations(
      client_id: $clientId
      level: $level
      page: $page
      itemsPerPage: $itemsPerPage
    ) {
      collection {
        id
        date
        invitedUser {
          id
          email
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

export { GET_REFERRAL_RELATION, GET_INVITED_USERS };
