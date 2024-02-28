import { gql } from "apollo-boost";

import {
  PAIR_UNIT_CURRENCY_FRAGMENT,
  PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT,
} from "./pair-unit.fragment";

const REQUISITION_CLIENT_FRAGMENT = gql`
  fragment RequisitionClient on Requisition {
    client {
      id
      firstname
      lastname
      email
      verificationInfo
    }
  }
`;

const REQUISITION_MANAGER_FRAGMENT = gql`
  fragment RequisitionManager on Requisition {
    manager {
      id
      firstname
      lastname
      email
    }
  }
`;

const REQUISITION_ITEM_DETAILS_FRAGMENT = gql`
  fragment RequisitionItemDetails on Requisition {
    paymentAmount
    payoutAmount
    recalculatedAmount
    createdAt
    status
    comment
    exchangePoint
    course
    systemProfit
    profit
    managerProfit
    pairPercent
    commission
    requisitionProfitHistories {
      id
      fieldName
      value
    }
    requisitionFeeHistories {
      id
      percent
      constant
      rate
      type
      pairPercent
      paymentSystemPrice
    }
    bankDetails {
      collection {
        id
        title
        attributes {
          id
          name
          value
          isHidden
          information
        }
      }
    }
    invoices {
      id
      isPaid
      status
      direction
      paidAmount
      amount
    }
    pair {
      id
      payoutRate
      payment {
        id
        isCardVerification
        fee {
          id
          constant
        }
        currency {
          id
          asset
          tag
        }
        paymentSystem {
          id
          subName
          name
          tag
        }
        service {
          id
          name
        }
      }
      payout {
        id
        fee {
          id
          constant
        }
        currency {
          id
          asset
          tag
        }
        paymentSystem {
          id
          subName
          name
          tag
        }
        service {
          id
          name
        }
      }
    }
  }
`;

const REQUISTION_DETAILS_FRAGMENT = gql`
  fragment RequisitionDetails on RequisitionCollection {
    createdAt
    paymentAmount
    payoutAmount
    status
    exchangePoint
    endDate
    pair {
      id
      payment {
        id
        ...Currency
        ...PaymentSystem
      }
      payout {
        id
        ...Currency
        ...PaymentSystem
      }
    }
  }
  ${PAIR_UNIT_CURRENCY_FRAGMENT}
  ${PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT}
`;

export {
  REQUISITION_CLIENT_FRAGMENT,
  REQUISITION_MANAGER_FRAGMENT,
  REQUISTION_DETAILS_FRAGMENT,
  REQUISITION_ITEM_DETAILS_FRAGMENT,
};
