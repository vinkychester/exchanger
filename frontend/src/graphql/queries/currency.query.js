import { gql } from "apollo-boost";

import {
  CURRENCY_ASSET_FRAGMENT,
  CURRENCY_RATES_FRAGMENT,
} from "../fragments/currency.fragment";

const GET_CURRENCIES = gql`
  query getCurrencies($page: Int, $itemsPerPage: Int, $tag: String) {
    currencies(page: $page, itemsPerPage: $itemsPerPage, tag: $tag) {
      collection {
        id
        ...CurrencyAsset
        ...CurrencyRates
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${CURRENCY_ASSET_FRAGMENT}
  ${CURRENCY_RATES_FRAGMENT}
`;

const GET_USDT_COMMISSION = gql`
  query getUSDTCommission {
    pairUnits(
      currency_asset: "USDT"
      service_name: "WhiteBit"
      direction: "payout"
      isActive: true
      exists: { pairUnitTabs: true }
    ) {
      collection {
        id
        currency {
          id
          asset
        }
        fee {
          id
          constant
        }
      }
    }
  }
`;

const GET_FIAT_CURRENCY = gql`
  query getFiatCurrency($tag: String = "CURRENCY") {
    currencies(tag: $tag) {
      collection {
        id
        asset
      }
    }
  }
`;

export { GET_CURRENCIES, GET_USDT_COMMISSION, GET_FIAT_CURRENCY };
