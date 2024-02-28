import { gql } from "apollo-boost";

const BANK_DETAIL_FRAGMENT = gql`
  fragment BankDetail on BankDetailCollection {
    id
    title
    attributes(isHidden: false) {
      id
      name
      value
      regex
    }
    pairUnit {
      direction
      currency {
        asset
      }
      paymentSystem {
        name
        tag
      }
    }
  }
`;

const BANK_ITEM_DETAIL_FRAGMENT = gql`
  fragment BankDetailItem on BankDetailItem {
    id
    title
    attributes(isHidden: false) {
      id
      name
      value
      regex
    }
    pairUnit {
      direction
      currency {
        asset
      }
      paymentSystem {
        name
        tag
      }
    }
  }
`;

export { BANK_DETAIL_FRAGMENT, BANK_ITEM_DETAIL_FRAGMENT };
