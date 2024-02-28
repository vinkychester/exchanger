import { gql } from "apollo-boost";

const UPDATE_DETAILS_MANAGER = gql`
  mutation updateManagerDetails($id: ID!, $firstname: String!, $lastname: String!) {
    updateManager(input: {id: $id,firstname: $firstname, lastname: $lastname}) {
      manager {
        id
      }
    }
  }
`;

const UPDATE_DETAILS_SEO = gql`
  mutation updateSeoDetails($id: ID!, $firstname: String!, $lastname: String!) {
    updateSeo(input: {id: $id,firstname: $firstname, lastname: $lastname}) {
      seo {
        id
      }
    }
  }
`;

const UPDATE_DETAILS_ADMIN = gql`
  mutation updateAdminDetails($id: ID!, $firstname: String!, $lastname: String!) {
    updateAdmin(input: {id: $id,firstname: $firstname, lastname: $lastname}) {
      admin {
        id
      }
    }
  }
`;

const UPDATE_DETAILS_CLIENT = gql`
  mutation updateClientDetails($id: ID!, $firstname: String!, $lastname: String!) {
    updateClient(input: {id: $id,firstname: $firstname, lastname: $lastname}) {
      client {
        id
      }
    }
  }
`;

export {
  UPDATE_DETAILS_ADMIN,
  UPDATE_DETAILS_CLIENT,
  UPDATE_DETAILS_MANAGER,
  UPDATE_DETAILS_SEO
}