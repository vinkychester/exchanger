import { gql } from "apollo-boost";

const GET_PAIR_UNIT_TABS = gql`
  query getPairUnitTabs {
    pairUnitTabs {
      id
      name
    }
  }
`;

export { GET_PAIR_UNIT_TABS };
