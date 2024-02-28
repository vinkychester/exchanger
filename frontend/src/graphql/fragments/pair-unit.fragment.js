import { gql } from "apollo-boost";

import { CURRENCY_ASSET_FRAGMENT } from "./currency.fragment";
import { FEE_FRAGMENT } from "./fee.fragment";

const PAIR_UNIT_DIRECTION_FRAGMENT = gql`
  fragment Direction on PairUnitCollection {
    direction
  }
`;

const PAIR_UNIT_CURRENCY_FRAGMENT = gql`
  fragment Currency on PairUnitCollection {
    currency {
      id
      ...CurrencyAsset
    }
  }
  ${CURRENCY_ASSET_FRAGMENT}
`;

const PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT = gql`
  fragment PaymentSystem on PairUnitCollection {
    paymentSystem {
      id
      name
      tag
      subName
    }
  }
`;

const PAIR_UNIT_SERVICE_FRAGMENT = gql`
  fragment Service on PairUnitCollection {
    service {
      id
      name
      tag
    }
  }
`;

const PAIR_UNIT_TABS_FRAGMENT = gql`
  fragment Tabs on PairUnitCollection {
    pairUnitTabs {
      id
      name
    }
  }
`;

const PAIR_UNIT_FEE_FRAGMENT = gql`
  fragment PairUnitFee on PairUnitCollection {
    fee {
      id
      ...Fee
    }
  }
  ${FEE_FRAGMENT}
`;

const PAIR_UNIT_FEE_FRAGMENT_ON_PAIR_UNIT = gql`
  fragment PairUnitFee on PairUnit {
    fee {
      id
      percent
      constant
      max
      min
    }
  }
`;

const PAIR_UNIT_DETAILS_FRAGMENT = gql`
  fragment PairUnitDetails on PairUnitCollection {
    ...Direction
    ...Currency
    ...PaymentSystem
    ...Service
  }
  ${PAIR_UNIT_DIRECTION_FRAGMENT}
  ${PAIR_UNIT_CURRENCY_FRAGMENT}
  ${PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT}
  ${PAIR_UNIT_SERVICE_FRAGMENT}
`;

export {
  PAIR_UNIT_DIRECTION_FRAGMENT,
  PAIR_UNIT_CURRENCY_FRAGMENT,
  PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT,
  PAIR_UNIT_SERVICE_FRAGMENT,
  PAIR_UNIT_TABS_FRAGMENT,
  PAIR_UNIT_FEE_FRAGMENT,
  PAIR_UNIT_DETAILS_FRAGMENT,
  PAIR_UNIT_FEE_FRAGMENT_ON_PAIR_UNIT,
};
