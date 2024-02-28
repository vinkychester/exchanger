import { gql } from "apollo-boost";

const UPDATE_PAIR_UNIT_ACTIVITY = gql`
  mutation updatePairUnitActivity($id: ID!, $isActive: Boolean!) {
    updatePairUnit(input: { id: $id, isActive: $isActive }) {
      pairUnit {
        id
      }
    }
  }
`;

const UDATE_PAIR_UNIT_TAB = gql`
  mutation updatePairUnitTab($id: ID!, $pairUnitTabs: String) {
    updatePairUnit(input: { id: $id, pairUnitTabs: $pairUnitTabs }) {
      pairUnit {
        id
      }
    }
  }
`;

const UPDATE_PAIR_UNIT_PRIORITY = gql`
  mutation updatePairUnitPriority($id: ID!, $priority: Int!) {
    updatePairUnit(input: { id: $id, priority: $priority }) {
      pairUnit {
        id
      }
    }
  }
`;

const UPDATE_PAIR_UNIT_PRICE = gql`
  mutation updatePairUnitPrice($id: ID!, $priority: Int!) {
    updatePairUnit(input: { id: $id, priority: $priority }) {
      pairUnit {
        id
      }
    }
  }
`;

const UPDATE_PAIR_UNIT_DETAILS = gql`
  mutation updatePairUnitDetails(
    $id: ID!
    $pairUnitTabs: String
    $isActive: Boolean
    $isCardVerification: Boolean
    $priority: Int
    $price: Float
  ) {
    updatePairUnit(
      input: {
        id: $id
        pairUnitTabs: $pairUnitTabs
        isActive: $isActive
        isCardVerification: $isCardVerification
        priority: $priority
        price: $price
      }
    ) {
      pairUnit {
        id
        priority
        price
      }
    }
  }
`;

export {
  UPDATE_PAIR_UNIT_ACTIVITY,
  UDATE_PAIR_UNIT_TAB,
  UPDATE_PAIR_UNIT_DETAILS,
  UPDATE_PAIR_UNIT_PRIORITY,
};
