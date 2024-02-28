import { gql } from "apollo-boost";

import { GET_USER_RBAC_DETAILS } from "./queries/user.query";

export const typeDefs = gql`
  type Query {
    isLoggedIn: Boolean!
    userId: String!
    userRole: String!
    managerCity: String!
  }

  type PairUnitQ {
    id: String!
    currencyAsset: String!
    tab: String!
    direction: String!
    paymentPairs: Array
    payoutPairs: Array
    paymentSystem: Iterable!
    service: Iterable! 
  }

  input PairUnitInput {
    id: String!
    currencyAsset: String!
    tab: String!
    direction: String!
    paymentPairs: Array
    payoutPairs: Array
    paymentSystem: Iterable!
    service: Iterable! 
  }
  
  input ClientUuidInput {
    uuid: String! 
  }
  
  type ClientUuidQ {
    uuid: String! 
  }

  type Query {
    paymentCollection: [PairUnitQ]!,
    payoutCollection: [PairUnitQ]!,
    paymentExchangeValue: [PairUnitQ],
    payoutExchangeValue: [PairUnitQ]
  }

  type Mutation {
    addPaymentCollection(input: PairUnitInput!): [PairUnitQ]!,
    addPayoutCollection(input: PairUnitInput!): [PairUnitQ]!,
    addPaymentExchangeValue(input: ClientUuidInput!): [PairUnitQ]!
    addManagerClientRequisition(input: ClientUuidInput!): [ClientUuidQ]!
    clearManagerClientRequisition: [ClientUuidQ]!
  }
`;

export const resolvers = {
  Mutation: {
    addManagerClientRequisition: (_, { input }, { cache }) => {
      const rbacAttributes = cache.readQuery({
        query: GET_USER_RBAC_DETAILS
      });

      cache.writeData({
        data: {...rbacAttributes, managerClientRequisition: input.uuid},
      });

    },
    clearManagerClientRequisition: (_, { input }, { cache }) => {
      const rbacAttributes = cache.readQuery({
        query: GET_USER_RBAC_DETAILS
      });

      cache.writeData({
        data: {...rbacAttributes, managerClientRequisition: null},
      });

      return null;
    }
  },
};
