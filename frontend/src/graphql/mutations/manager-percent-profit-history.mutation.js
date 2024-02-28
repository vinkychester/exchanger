import { gql } from "apollo-boost";

const CREATE_MANAGER_PERCENT_PROFIT_HISTORY = gql`
  mutation CreateManagerPercentProfitHistory(
    $input: createManagerPercentProfitHistoryInput!
  ) {
    createManagerPercentProfitHistory(input: $input) {
      managerPercentProfitHistory {
        id
      }
    }
  }
`;

const CREATE_MANAGERS_CASH_PERCENT_PROFIT_HISTORY = gql`
  mutation CreateManagersBankManagerPercentProfitHistory($percent: Float!) {
    createManagersBankManagerPercentProfitHistory(
      input: { percent: $percent }
    ) {
      managerPercentProfitHistory {
        id
        percent
      }
    }
  }
`;

export {
  CREATE_MANAGER_PERCENT_PROFIT_HISTORY,
  CREATE_MANAGERS_CASH_PERCENT_PROFIT_HISTORY,
};
