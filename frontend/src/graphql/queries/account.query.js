import { gql } from "apollo-boost";

const GET_CLIENT_ACCOUNT_DETAILS = gql`
  query accountDetailsClient($id: ID!) {
    client(id: $id) {
      id
      firstname
      lastname
      email
      googleAuthenticatorSecret
      googleAuthQrCode
      isDeleted
      mediaObject {
        id
        base64
      }
      verificationInfo
    }
  }
`;

const GET_ADMIN_ACCOUNT_DETAILS = gql`
  query accountDetailsAdmin($id: ID!) {
    admin(id: $id) {
      id
      firstname
      lastname
      email
      isEnabled
      createdAt
      mediaObject {
        id
        base64
      }
    }
  }
`;

const GET_MANAGER_ACCOUNT_DETAILS = gql`
  query accountDetailsManager($id: ID!) {
    manager(id: $id) {
      id
      firstname
      lastname
      email
      mediaObject {
        id
        base64
      }
    }
  }
`;

const GET_SEO_ACCOUNT_DETAILS = gql`
  query accountDetailsSeo($id: ID!) {
    seo(id: $id) {
      id
      firstname
      lastname
      email
      mediaObject {
        id
        base64
      }
    }
  }
`;

const UPDATE_CLIENT_DETAILS = gql`
  mutation setUserDetailsMutationClient(
    $firstname: String!
    $lastname: String!
  ) {
    setUserDetailsMutationClient(
      input: { firstname: $firstname, lastname: $lastname }
    ) {
      client {
        id
      }
    }
  }
`;

export {
  GET_ADMIN_ACCOUNT_DETAILS,
  GET_MANAGER_ACCOUNT_DETAILS,
  GET_SEO_ACCOUNT_DETAILS,
  GET_CLIENT_ACCOUNT_DETAILS,
  UPDATE_CLIENT_DETAILS,
};
