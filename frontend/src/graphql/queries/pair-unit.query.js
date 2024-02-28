import { gql } from "apollo-boost";

import {
  PAIR_UNIT_DETAILS_FRAGMENT,
  PAIR_UNIT_FEE_FRAGMENT,
  PAIR_UNIT_FEE_FRAGMENT_ON_PAIR_UNIT,
  PAIR_UNIT_TABS_FRAGMENT,
} from "../fragments/pair-unit.fragment";

const GET_PAIR_UNITS_LIST = gql`
  query getPairUnitsList {
    pairUnits {
      collection {
        id
        ...PairUnitDetails
      }
    }
  }
  ${PAIR_UNIT_DETAILS_FRAGMENT}
`;

const GET_ACTIVE_PAIR_UNITS = gql`
  query getActivePairUnits {
    pairUnits(
      isActive: true
      exists: { pairUnitTabs: true }
      itemsPerPage: 150
    ) {
      collection {
        id
        ...PairUnitDetails
      }
    }
  }
  ${PAIR_UNIT_DETAILS_FRAGMENT}
`;

const GET_ACTIVE_PAIR_UNITS_FOR_TARIFF = gql`
  query getActivePairUnits($direction: String) {
    pairUnits(
      isActive: true
      exists: { pairUnitTabs: true }
      currency_tag: "CRYPTO"
      direction: $direction
    ) {
      collection {
        id
        ...PairUnitDetails
        fee {
          id
          min
          max
          percent
          constant
        }
      }
    }
  }
  ${PAIR_UNIT_DETAILS_FRAGMENT}
`;

const GET_FIAT_RATES_PAIR_UNIT = gql`
  query getFiatRatesPairUnit {
    currencyCollectionPairUnits(
      currency_tag: "CURRENCY"
      exists: { pairUnitTabs: true }
      isActive: true
      direction: "payout"
    ) {
      collection {
        id
        direction
        minPayout
        maxPayout
        minPayment
        maxPayment
        currency {
          id
          tag
          asset
        }
        paymentSystem {
          id
          tag
          name
          subName
        }
        service {
          id
          tag
          name
        }
        balance
      }
    }
  }
`;

const GET_CRYPTO_RATES_PAIR_UNIT = gql`
  query getCryptoRatesPairUnit(
    $paymentSystemName: String
    $currencyName: String
  ) {
    cryptoCollectionPairUnits(
      currency_tag: "CRYPTO"
      exists: { pairUnitTabs: true }
      isActive: true
      service_name: "WhiteBit"
      paymentSystemName: $paymentSystemName
      currencyName: $currencyName
    ) {
      collection {
        dayChange
        paymentExchange
        payoutExchange
        id
        direction
        paymentRate
        payoutRate
        paymentConstant
        payoutConstant
        paymentPrice
        payoutPrice
        paymentSurcharge
        payoutSurcharge
        currency {
          id
          tag
          asset
        }
        paymentSystem {
          id
          tag
          name
          subName
        }
        service {
          id
          tag
          name
        }
        balance
        fee {
          id
          constant
        }
      }
    }
  }
`;

const GET_PAIR_UNITS_LIST_WITH_FEE = gql`
  query getPairUnitsListWithFee(
    $page: Int = 1
    $itemsPerPage: Int
    $active: Boolean
    $currency: String
    $direction: String
    $payment_system: String
    $service: String
    $percent_gte: String
    $percent_lte: String
    $constant_gte: String
    $constant_lte: String
    $min_gte: String
    $min_lte: String
    $max_gte: String
    $max_lte: String
    $priority_gte: String
    $priority_lte: String
    $payment_tab: Int
  ) {
    pairUnits(
      page: $page
      itemsPerPage: $itemsPerPage
      isActive: $active
      currency_asset: $currency
      direction: $direction
      paymentSystem_name: $payment_system
      service_tag: $service
      fee_percent: { gte: $percent_gte, lte: $percent_lte }
      fee_constant: { gte: $constant_gte, lte: $constant_lte }
      fee_min: { gte: $min_gte, lte: $min_lte }
      fee_max: { gte: $max_gte, lte: $max_lte }
      priority: { gte: $priority_gte, lte: $priority_lte }
      pairUnitTabs_id: $payment_tab
    ) {
      collection {
        id
        isActive
        isCardVerification
        balance
        priority
        price
        ...PairUnitDetails
        ...Tabs
        ...PairUnitFee
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${PAIR_UNIT_DETAILS_FRAGMENT}
  ${PAIR_UNIT_TABS_FRAGMENT}
  ${PAIR_UNIT_FEE_FRAGMENT}
`;

const GET_ACTIVE_PAIR_UNITS_BY_DIRECTION = gql`
  query getActivePairUnitsByDirection(
    $direction: String!
    $includePayment: Boolean!
    $includePayout: Boolean!
  ) {
    calculatorCollectionQueryPairUnits(
      exists: { pairUnitTabs: true }
      direction: $direction
      isActive: true
    ) {
      collection {
        id
        direction
        balance
        currency {
          id
          asset
          tag
        }
        paymentSystem {
          id
          name
          tag
          subName
        }
        service {
          id
          name
          tag
        }
        pairUnitTabs {
          id
          name
        }
        paymentPairs(isActive: true) @include(if: $includePayment) {
          collection {
            id
          }
        }
        payoutPairs(isActive: true) @include(if: $includePayout) {
          collection {
            id
          }
        }
      }
    }
  }
`;

const GET_PAYMENT_PAIR_UNITS = gql`
  query getPaymentPairUnits {
    pairUnits(direction: "payment", service_name: "WhiteBit") {
      collection {
        id
        currency {
          id
          asset
        }
        paymentSystem {
          id
          name
        }
      }
    }
  }
`;

const GET_PAIR_UNIT_BY_CURRENCY = gql`
  query getPairUnitByCurrency (
      $paymentSystemName: String
      $currencyName: String) {
      currencyPairUnits(direction: "payout", isActive: true, paymentSystem_name: $paymentSystemName, currency_asset: $currencyName) {
          collection {
              id
              direction
              minPayout
              maxPayout
              minPayment
              maxPayment
              currency {
                  id
                  tag
                  asset
              }
              paymentSystem {
                  id
                  tag
                  name
                  subName
              }
              service {
                  id
                  tag
                  name
              }
              balance
          }
      }
  }
`;

export {
  GET_PAIR_UNITS_LIST,
  GET_ACTIVE_PAIR_UNITS,
  GET_PAIR_UNITS_LIST_WITH_FEE,
  GET_ACTIVE_PAIR_UNITS_BY_DIRECTION,
  GET_ACTIVE_PAIR_UNITS_FOR_TARIFF,
  GET_FIAT_RATES_PAIR_UNIT,
  GET_CRYPTO_RATES_PAIR_UNIT,
  GET_PAYMENT_PAIR_UNITS,
  GET_PAIR_UNIT_BY_CURRENCY
};
