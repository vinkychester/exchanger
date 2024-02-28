import { gql } from "apollo-boost";

const CREATE_CLIENT = gql`
  mutation createClient(
    $firstname: String!
    $lastname: String!
    $email: String!
  ) {
    createClient(
      input: { firstname: $firstname, lastname: $lastname, email: $email }
    ) {
      client {
        id
      }
    }
  }
`;

const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPasswordMutationClient(input: { email: $email }) {
      client {
        id
      }
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $token: String!
    $newPassword: String!
    $newRetypedPassword: String!
  ) {
    changePasswordMutationClient(
      input: {
        token: $token
        newPassword: $newPassword
        newRetypedPassword: $newRetypedPassword
      }
    ) {
      client {
        id
      }
    }
  }
`;

const ACCOUNT_CHANGE_PASSWORD = gql`
  mutation accountChangePassword(
    $id: ID!
    $oldPassword: String!
    $newPassword: String!
    $newRetypedPassword: String!
  ) {
    accountChangePasswordMutationClient(
      input: {
        id: $id
        oldPassword: $oldPassword
        newPassword: $newPassword
        newRetypedPassword: $newRetypedPassword
      }
    ) {
      client {
        id
      }
    }
  }
`;

const CONFIRM_EMAIL = gql`
  mutation confirmEmail($token: String!) {
    confirmationMutationClient(input: { token: $token }) {
      client {
        id
      }
    }
  }
`;

const CHANGE_ONLINE = gql`
  mutation updateManager($id: ID!, $isOnline: Boolean!) {
    updateManager(input: { id: $id, isOnline: $isOnline }) {
      manager {
        id
      }
    }
  }
`;

const UPDATE_MANAGER = gql`
  mutation UpdateManager($input: updateManagerInput!) {
    updateManager(input: $input) {
      manager {
        id
      }
    }
  }
`;

export {
  UPDATE_MANAGER,
  CREATE_CLIENT,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD,
  ACCOUNT_CHANGE_PASSWORD,
  CONFIRM_EMAIL,
  CHANGE_ONLINE,
};
