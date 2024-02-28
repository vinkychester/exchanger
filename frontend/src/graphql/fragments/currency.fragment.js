import { gql } from "apollo-boost";

const CURRENCY_ASSET_FRAGMENT = gql`
  fragment CurrencyAsset on CurrencyCollection {
    tag
    asset
  }
`;

const CURRENCY_RATES_FRAGMENT = gql`
  fragment CurrencyRates on CurrencyCollection {
    rate
    paymentRate
    payoutRate
  }
`;

export { CURRENCY_ASSET_FRAGMENT, CURRENCY_RATES_FRAGMENT };
