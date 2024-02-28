import { gql } from "apollo-boost";

import {
  REQUISITION_CLIENT_FRAGMENT,
  REQUISITION_ITEM_DETAILS_FRAGMENT,
  REQUISITION_MANAGER_FRAGMENT,
  REQUISTION_DETAILS_FRAGMENT,
} from "../fragments/requisition.fragment";

const GET_REQUISITION_DETAILS = gql`
  query detailsQueryRequisition($id: ID!, $isManager: Boolean!) {
    detailsQueryRequisition(id: $id) {
      id
      ...RequisitionItemDetails
      ...RequisitionClient
      ...RequisitionManager @include(if: $isManager)
    }
  }
  ${REQUISITION_ITEM_DETAILS_FRAGMENT}
  ${REQUISITION_CLIENT_FRAGMENT}
  ${REQUISITION_MANAGER_FRAGMENT}
`;

const GET_REQUISITIONS = gql`
  query getRequisitions(
    $id: String
    $client_id: String
    $exchangePoint_list: [String]
    $page: Int
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $email: String
    $status: [String]
    $payment_system: String
    $currency: String
    $date_gte: String
    $date_lte: String
    $end_date_gte: String
    $end_date_lte: String
    $payment_amount_gte: String
    $payment_amount_lte: String
    $payout_amount_gte: String
    $payout_amount_lte: String
    $wallet: String
    $exchangeType: String
    $isPaid: Boolean
  ) {
    requisitions(
      id: $id
      client_id: $client_id
      exchangePoint_list: $exchangePoint_list
      itemsPerPage: $itemsPerPage
      page: $page
      createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
      endDate: [{ gte: $end_date_gte }, { lte: $end_date_lte }]
      status_list: $status
      pair_payment_paymentSystem_name: $payment_system
      currency: $currency
      client_firstname: $firstname
      client_lastname: $lastname
      client_email: $email
      paymentAmount: { gte: $payment_amount_gte, lte: $payment_amount_lte }
      payoutAmount: { gte: $payout_amount_gte, lte: $payout_amount_lte }
      bankDetails_attributes_value: $wallet
      exchangeType: $exchangeType
      isPaid: $isPaid
    ) {
      collection {
        id
        isSeen
        client {
          id
          firstname
          lastname
          email
        }
        manager {
          id
          firstname
          lastname
          email
        }
        ...RequisitionDetails
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${REQUISTION_DETAILS_FRAGMENT}
`;

const GET_REQUISITION_BY_TRAFFIC_ID = gql`
  query getRequisitionsByTrafficId(
    $id: String
    $page: Int
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $email: String
    $payment_system: String
    $currency: String
    $client_trafficLink_id: Int
  ) {
    requisitions(
      id: $id
      page: $page
      itemsPerPage: $itemsPerPage
      pair_payment_paymentSystem_name: $payment_system
      currency: $currency
      client_firstname: $firstname
      client_lastname: $lastname
      client_email: $email
      client_trafficLink_id: $client_trafficLink_id
      status: "FINISHED"
    ) {
      collection {
        id
        isSeen
        client {
          id
          firstname
          lastname
          email
        }
        manager {
          id
          firstname
          lastname
          email
        }
        ...RequisitionDetails
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${REQUISTION_DETAILS_FRAGMENT}
`;

const GET_NEW_CLIENT_REQUISITIONS = gql`
  query getNewClientRequisitions(
    $client_id: String!
    $exchangePoint_list: [String]
  ) {
    requisitions(
      client_id: $client_id
      exchangePoint_list: $exchangePoint_list
      page: 1
      itemsPerPage: 10
    ) {
      collection {
        id
        ...RequisitionDetails
        client {
          id
          firstname
          lastname
          email
        }
      }
    }
  }
  ${REQUISTION_DETAILS_FRAGMENT}
`;

const GET_REQUISITIONS_BY_STATUS = gql`
  query getRequisitionsByStatus(
    $status: String
    $rdate_gte: String
    $rdate_lte: String
  ) {
    requisitions(
      createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]
      status: $status
    ) {
      paginationInfo {
        totalCount
      }
    }
  }
`;

const GET_REQUISITIONS_FOR_PERIOD = gql`
  query getRequisitionsForPeriod($rdate_gte: String, $rdate_lte: String) {
    requisitions(createdAt: [{ gte: $rdate_gte }, { lte: $rdate_lte }]) {
      collection {
        id
        systemProfit
        profit
        pair {
          id
          payment {
            id
            currency {
              id
              tag
            }
          }
        }
        requisitionFeeHistories {
          id
          rate
          type
        }
      }
    }
  }
`;

const GET_ALL_REQUISITIONS = gql`
  query getAllRequisitions(
    $dateFrom: String
    $dateTo: String
    $status: String
  ) {
    requisitions(
      createdAt: [{ gte: $dateFrom }, { lte: $dateTo }]
      status: $status
    ) {
      collection {
        id
        createdAt
        status
        systemProfit
        cleanSystemProfit
      }
      paginationInfo {
        totalCount
      }
    }
  }
`;

const GET_MANAGERS_REQUISITIONS_REPORT = gql`
  query Requisitions(
    $id: String
    $page: Int
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $paymentSystem: Int
    $dateTo: String
    $dateFrom: String
    $paymentAmountFrom: String
    $paymentAmountTo: String
    $payoutAmountFrom: String
    $payoutAmountTo: String
  ) {
    requisitions(
      id: $id
      itemsPerPage: $itemsPerPage
      page: $page
      createdAt: [{ gte: $dateFrom }, { lte: $dateTo }]
      status: "FINISHED"
      pair_payment_paymentSystem_id: $paymentSystem
      client_firstname: $firstname
      client_lastname: $lastname
      paymentAmount: { gte: $paymentAmountFrom, lte: $paymentAmountTo }
      payoutAmount: { gte: $payoutAmountFrom, lte: $payoutAmountTo }
      manager_requisitions_createdAt: [{ gte: $dateFrom }, { lte: $dateTo }]
      exists: { manager: true }
    ) {
      collection {
        id
        createdAt
        paymentAmount
        payoutAmount
        status
        systemProfit
        manager {
          id
          firstname
          lastname
          email
          percentBank
          percentCash
        }
        managerProfit
        referralProfit: requisitionProfitHistories(
          fieldName: "referralProfit"
        ) {
          id
          value
        }
        pair {
          id
          payment {
            id
            currency {
              id
              tag
            }
          }
        }
        requisitionFeeHistories {
          id
          rate
          type
        }
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
    bankRequisitions: requisitions(
      id: $id
      itemsPerPage: $itemsPerPage
      page: $page
      createdAt: [{ gte: $dateFrom }, { lte: $dateTo }]
      status: "FINISHED"
      pair_payment_paymentSystem_id: $paymentSystem
      client_firstname: $firstname
      client_lastname: $lastname
      paymentAmount: { gte: $paymentAmountFrom, lte: $paymentAmountTo }
      payoutAmount: { gte: $payoutAmountFrom, lte: $payoutAmountTo }
      exchangePoint: "bank"
    ) {
      collection {
        id
        managerProfit
        pair {
          id
          payment {
            id
            currency {
              id
              tag
            }
          }
        }
        requisitionFeeHistories {
          id
          rate
          type
        }
      }
    }
  }
`;

const GET_MANAGER_REQUISITIONS_REPORT = gql`
  query Requisitions(
    $page: Int
    $itemsPerPage: Int
    $manager_id: String
    $date_gte: String
    $date_lte: String
  ) {
    requisitions(
      itemsPerPage: $itemsPerPage
      page: $page
      manager_id: $manager_id
      createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
      status: "FINISHED"
    ) {
      collection {
        id
        client {
          id
          firstname
          lastname
          email
        }
        ...RequisitionDetails
      }
      paginationInfo {
        totalCount
      }
    }
  }
  ${REQUISTION_DETAILS_FRAGMENT}
`;

const GET_NOT_SEEN_REQUISITIONS_COUNT = gql`
  query getNotSeenRequisitionsCount($exchangePoint_list: [String], $status_list: [String]!) {
    requisitions(status_list: $status_list, exchangePoint_list: $exchangePoint_list) {
      paginationInfo {
        totalCount
      }
    }
  }
`;

export {
  GET_REQUISITIONS,
  GET_REQUISITION_DETAILS,
  GET_ALL_REQUISITIONS,
  GET_REQUISITIONS_BY_STATUS,
  GET_MANAGERS_REQUISITIONS_REPORT,
  GET_NEW_CLIENT_REQUISITIONS,
  GET_MANAGER_REQUISITIONS_REPORT,
  GET_REQUISITIONS_FOR_PERIOD,
  GET_NOT_SEEN_REQUISITIONS_COUNT,
  GET_REQUISITION_BY_TRAFFIC_ID
};
