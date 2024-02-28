import { gql } from "apollo-boost";
import { BANK_ITEM_DETAIL_FRAGMENT } from "../fragments/bank-detail.fragment";

const CREATE_BANK_DETAILS = gql`
  mutation createBankDetail(
    $attributes: Iterable!
    $title: String!
    $pairUnit: String!
    $direction: String!
    $client: String!
  ) {
    createBankDetail(
      input: {
        attributes: $attributes
        title: $title
        pairUnit: $pairUnit
        direction: $direction
        client: $client
      }
    ) {
      bankDetail {
        ...BankDetailItem
      }
    }
  }
  ${BANK_ITEM_DETAIL_FRAGMENT}
`;

const UPDATE_BANK_DETAILS = gql`
  mutation updateBankDetail($id: ID!, $title: String, $isDeleted: Boolean) {
    updateBankDetail(input: { id: $id, title: $title, isDeleted: $isDeleted }) {
      bankDetail {
        id
      }
    }
  }
`;

const DELETE_BANK_DETAILS = gql`
  mutation deleteBankDetails($id: ID!) {
    deleteBankDetail(input: { id: $id }) {
      bankDetail {
        id
      }
    }
  }
`;

export { CREATE_BANK_DETAILS, UPDATE_BANK_DETAILS, DELETE_BANK_DETAILS };
