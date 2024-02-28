import { gql } from "apollo-boost";

const GET_NETWORKS = gql`
  query getNetworks($external_id: Int!, $pairUnit_id: Int!) {
    collectionQueryNetworks(
      external_id: $external_id
      pairUnit_id: $pairUnit_id
    ) {
      id
      name
      type
      attributes
      externalId
    }
  }
`;

export { GET_NETWORKS };
