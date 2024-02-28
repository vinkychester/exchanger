import { gql } from "apollo-boost";

const GET_ATTRIBUTES = gql`
  query getAttributes(
    $pairUnit_id: Int!
    $direction: String!
    $locale: String!
  ) {
    collectionQueryAttributes(
      pairUnit_id: $pairUnit_id
      direction: $direction
      locale: $locale
    ) {
      id
      name
      direction
      fieldType
      regex
      title
    }
  }
`;

const GET_ATTRIBUTES_BY_ASSET = gql`
  query getAttributesByAsset($clientId: String, $asset: String) {
    attributes(
      bankDetail_client_id: $clientId
      bankDetail_pairUnit_currency_asset: $asset
    ) {
      id
      name
      value
    }
  }
`;

export { GET_ATTRIBUTES, GET_ATTRIBUTES_BY_ASSET };
