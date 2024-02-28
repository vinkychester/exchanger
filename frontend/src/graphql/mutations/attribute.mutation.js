import { gql } from "apollo-boost";

const UPDATE_ATTRIBUTE_DETAILS = gql`
  mutation updateAttributeDetail($id: ID!, $value: String) {
    updateAttribute(input: { id: $id, value: $value }) {
      attribute {
        id
        value
      }
    }
  }
`;

const UPDATE_ITTERABLE_ATTRIBUTE_DETAILS = gql`
  mutation updateItterableAttributeDetails(
    $bank_details: Iterable!
    $requisition_id: String!
    $pairPercent: Float!
    $amount: Float!
  ) {
    updateMutationAttribute(
      input: {
        bank_details: $bank_details
        requisition_id: $requisition_id
        pairPercent: $pairPercent
        amount: $amount
      }
    ) {
      attribute {
        id
      }
    }
  }
`;

export { UPDATE_ATTRIBUTE_DETAILS, UPDATE_ITTERABLE_ATTRIBUTE_DETAILS };
