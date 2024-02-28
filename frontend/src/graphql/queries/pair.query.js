import { gql } from "apollo-boost";

import { PAIR_UNIT_DETAILS_FRAGMENT } from "../fragments/pair-unit.fragment";
import {
  PAIR_DETAILS_FRAGMENT,
  PAIR_DETAILS_WITH_FEE_FRAGMENT,
} from "../fragments/pair.fragment";

const GET_PAIRS_TOTAL_COUNT = gql`
  query getPairsTotalCount {
    pairs(isActive: true) {
      paginationInfo {
        totalCount
      }
    }
  }
`;

const GET_ACTIVE_PAIR_UNITS = gql`
  query getActivePairUnits {
    pairUnits(isActive: true) {
      collection {
        id
        ...PairUnitDetails
      }
    }
  }
  ${PAIR_UNIT_DETAILS_FRAGMENT}
`;

const GET_ALL_PAIRS_WITH_IS_REQUISITION = gql`
  query getAllPairsWithIsRequisition(
    $page: Int = 1
    $itemsPerPage: Int
    $active: Boolean
    $payment_system_in: String
    $payment_system_out: String
    $currency_in: String
    $currency_out: String
    $percent_gte: String
    $percent_lte: String
    $service_in: String
    $service_out: String
  ) {
    pairs(
      page: $page
      itemsPerPage: $itemsPerPage
      isActive: $active
      payment_paymentSystem_name: $payment_system_in
      payout_paymentSystem_name: $payment_system_out
      payment_currency_asset: $currency_in
      payout_currency_asset: $currency_out
      percent: { gte: $percent_gte, lte: $percent_lte }
      payment_service_tag: $service_in
      payout_service_tag: $service_out
    ) {
      collection {
        id
        ...PairDetails
        requisitions {
          paginationInfo {
            totalCount
          }
        }
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${PAIR_DETAILS_FRAGMENT}
`;

const GET_TOP_PAIRS = gql`
  query getTopPairs {
    pairs(page: 1, itemsPerPage: 5, isActive: true, order: { top: "DESC" }) {
      collection {
        id
        paymentRate
        ...PairDetails
      }
    }
  }
  ${PAIR_DETAILS_FRAGMENT}
`;

export {
  GET_PAIRS_TOTAL_COUNT,
  GET_ACTIVE_PAIR_UNITS,
  GET_ALL_PAIRS_WITH_IS_REQUISITION,
  GET_TOP_PAIRS,
};
