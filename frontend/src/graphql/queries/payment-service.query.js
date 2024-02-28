import { gql } from "apollo-boost";

const GET_SERVICES = gql`
  query getServices {
    services {
      id
      name
      tag
    }
  }
`;

export { GET_SERVICES };
