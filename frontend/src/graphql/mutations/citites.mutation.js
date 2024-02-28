import { gql } from "apollo-boost";

const DISABLE_CITY = gql`
  mutation disabledCity($id: ID!, $disable: Boolean!) {
    updateCity(input: { id: $id, disable: $disable }) {
      city {
        id
      }
    }
  }
`;

export { DISABLE_CITY };
