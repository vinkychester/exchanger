import { gql } from "apollo-boost";

const GET_PROFIT_BY_PERIOD = gql`
  query getProfitByPeriod($date_gte: String, $date_lte: String) {
    collectionQueryProfits(
        date_gte: $date_gte,
        date_lte: $date_lte,
    ) {
        id
        fieldName
        value
        tempName
        tempValue
        profits
    }
  }
`;

const GET_MANAGERS_PROFIT_BY_PERIOD = gql`
  query getManagersProfitByPeriod($date_gte: String, $date_lte: String,  $manager: String, $fieldName: String) {
    managersQueryProfits(
      date_gte: $date_gte,
      date_lte: $date_lte,
      fieldName: $fieldName,
      manager: $manager
    ) {
        id
        profits
    }
  }
`;

export { GET_PROFIT_BY_PERIOD, GET_MANAGERS_PROFIT_BY_PERIOD };