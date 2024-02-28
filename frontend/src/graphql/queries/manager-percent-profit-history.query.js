import { gql } from "apollo-boost";

const GET_MANAGERS_CASH_PERCENT = gql`
  {
    getLastBankManagerPercentProfitHistory {
      id
      percent
    }
  }
`;

export { GET_MANAGERS_CASH_PERCENT };
