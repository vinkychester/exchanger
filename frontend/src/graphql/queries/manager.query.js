import { gql } from "apollo-boost";

const GET_ALL_MANAGERS_FOR_STATISTICS = gql`
  query getManagers(
    $date_gte: String
    $date_lte: String
    $firstname: String
    $lastname: String
    $email: String
    $isBank: Boolean
    $city: String
    $percent_gte: String
    $percent_lte: String
  ) {
    managers(
      firstname: $firstname
      lastname: $lastname
      email: $email
      isBank: $isBank
      cities_id: $city
      managerPercentProfitHistories_percent: [
        { gte: $percent_gte }
        { lte: $percent_lte }
      ]
    ) {
      collection {
        id
        firstname
        lastname
        email
        isBank
        isEnabled
        percentBank
        percentCash
        cities {
          id
          name
        }
        bank: managerPercentProfitHistories(
          createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
          percentName: "bank"
        ) {
          id
          percent
          createdAt
        }
        cash: managerPercentProfitHistories(
          createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
          percentName: "cash"
        ) {
          id
          percent
          createdAt
        }
      }
    }
  }
`;

const GET_MANAGER_DETAILS = gql`
  query getManagerDetails($id: ID!) {
    manager(id: $id) {
      id
      mediaObject {
        id
        base64
      }
      firstname
      lastname
      email
      createdAt
      isEnabled
      isBanned
      isBank
      percentBank
      percentCash
      cities {
        id
        name
        transliteName
        externalId
      }
    }
  }
`;

const ADD_MANAGER_CLIENT_REQUISITION = gql`
  mutation AddManagerClientRequisition($input: ClientUuidInput!) {
    addManagerClientRequisition(input: $input) @client
  }
`;

const CLEAN_MANAGER_CLIENT_REQUISITION = gql`
  mutation CleanManagerClientRequisition {
    CleanManagerClientRequisition @client
  }
`;

const GET_MANAGER_NAME = gql`
  query getManagerName($manager_id: ID!) {
    manager(id: $manager_id) {
      firstname
      lastname
    }
  }
`;

const GET_MANAGERS_LIST = gql`
  query getManagersList($cities_externalId: Int!) {
    managers(cities_externalId: $cities_externalId) {
      collection {
        id
        firstname
        lastname
        email
      }
    }
  }
`;

const GET_MANAGER_LIST_SELECT = gql`
  query getManagersListSelect {
    managers {
      collection {
        id
        email  
      }
    }
  }
`;

export {
  GET_ALL_MANAGERS_FOR_STATISTICS,
  GET_MANAGER_DETAILS,
  ADD_MANAGER_CLIENT_REQUISITION,
  CLEAN_MANAGER_CLIENT_REQUISITION,
  GET_MANAGER_NAME,
  GET_MANAGERS_LIST,
  GET_MANAGER_LIST_SELECT
};
