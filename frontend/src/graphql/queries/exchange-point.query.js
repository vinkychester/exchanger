import { gql } from "apollo-boost";

const GET_EXCHANGE_POINTS = gql`
  query getExchangePoints(
    $pairUnit_id: Int!
    $network_id: Int!
    $city_id: Int!
  ) {
    collectionQueryExchangePoints(
      pairUnit_id: $pairUnit_id
      network_id: $network_id
      city_id: $city_id
    ) {
      id
      name
      description
      address
      externalId
    }
  }
`;

export { GET_EXCHANGE_POINTS };
