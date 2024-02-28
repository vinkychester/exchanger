import { gql } from "apollo-boost";

export const GET_VERIFICATION_SCHEMAS = gql`
  query getVerificationSchemas {
    verificationSchemas {
      collection {
        id
        clientVerificationSchema {
          collection {
            id
            client {
              id
            }
            verificationInfo
          }
        }
        pairUnit {
          collection {
            id
            currency {
              id
              asset
            }
            paymentSystem {
              id
              name
              tag
            }
          }
        }
      }
    }
  }
`;
