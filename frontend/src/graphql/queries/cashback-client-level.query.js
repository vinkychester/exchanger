import { gql } from "apollo-boost";

const GET_CLIENT_CASHBACK_LEVELS_BY_USER_ID = gql`
  query getClientCashbackLevels($clientId: String!) {
    cashbackClientLevels(client_id: $clientId) {
      collection {
        id
        profit
        isCurrent
        cashbackLevel {
          id
          name
          percent
          level
        }
      }
    }
  }
`;

export { GET_CLIENT_CASHBACK_LEVELS_BY_USER_ID };
