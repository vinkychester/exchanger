import { gql } from "apollo-boost";

const UPDATE_TRAFFIC_CONVERSION = gql`
  mutation updateConversionTrafficLink($token: String!) {
    updateConversionTrafficLink(input: { token: $token }) {
      trafficLink {
        id
      }
    }
  }
`;

const DELETE_LINK_BY_ID = gql`
  mutation deleteLinkById( $id: ID!) {
    deleteTrafficLink(input:{ id: $id}) {
      trafficLink {
        id
      }
    }
  }
`;
export { UPDATE_TRAFFIC_CONVERSION, DELETE_LINK_BY_ID };
