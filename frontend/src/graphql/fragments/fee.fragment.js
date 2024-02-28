import { gql } from "apollo-boost";

const FEE_FRAGMENT = gql`
  fragment Fee on FeeCollection {
    percent
    constant
    max
    min
  }
`;

export { FEE_FRAGMENT };
