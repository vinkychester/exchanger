import { gql } from "apollo-boost";

import {
  PAIR_UNIT_DETAILS_FRAGMENT,
} from "./pair-unit.fragment";

const PAIR_DETAILS_FRAGMENT = gql`
  fragment PairDetails on PairCollection {
    isActive
    percent
    top
    payment {
      id
      ...PairUnitDetails      
    }
    payout {
      id
      ...PairUnitDetails
    }
  }
  ${PAIR_UNIT_DETAILS_FRAGMENT}
`;

const PAIR_DETAILS_WITH_FEE_FRAGMENT = gql`
  fragment PairDetailsWithFee on Pair {
    isActive
    percent
    paymentRate
    payoutRate
    payment {
        id
        lastFee
        currency {
          id
          asset
          tag
          __typename
        }
        service{
          id
          tag
          name          
        }
        paymentSystem {
          id
          tag
          name
          subName
        }
        fee {
            id
            constant
        }
    }
    payout {
        id
        lastFee
        currency {
          id
          asset
          __typename
        }
        service{
          id
          tag
          name          
        }
        paymentSystem {
          id
          tag
          name
          subName
        }
    }
  }
`;

export {
  PAIR_DETAILS_FRAGMENT,
  PAIR_DETAILS_WITH_FEE_FRAGMENT
};
