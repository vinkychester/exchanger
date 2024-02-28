import { gql } from "apollo-boost";

export const CREATE_USER_RELATION = gql`
  mutation createUserRelation($inviterEmail: String!, $invitedUserID: String!) {
      onCreateReferralUserRelation(input: {
        inviterEmail: $inviterEmail,
        invitedUserID: $invitedUserID
      }) {
        referralUserRelation {
          id
        }
      }
 }
`;
