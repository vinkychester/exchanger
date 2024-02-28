import { gql } from "apollo-boost";

const UPDATE_PAYMENT_SYSTEM_DETAILS = gql`
  mutation updatePaymentSystemDetails(
    $id: ID!
    $price: Float
  ) {
    updatePaymentSystem(
      input: { id: $id, price: $price }
    ) {
      paymentSystem {
        id
      }
    }
  }
`;

export { UPDATE_PAYMENT_SYSTEM_DETAILS };