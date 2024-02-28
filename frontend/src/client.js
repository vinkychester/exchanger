import { ApolloClient } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "@apollo/client/link/context";
import { resolvers, typeDefs } from "./graphql/resolvers";
import jwt_decode from "jwt-decode";

const cache = new InMemoryCache();

const token = localStorage.getItem("token");

const httpLink = createHttpLink({
  uri: "/api/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  if (token) {
    const { exp } = jwt_decode(token);
    const expirationTime = (exp * 1000) - 60000;
    if (Date.now() >= expirationTime) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Connecting our site to the GraphQl API
const client = new ApolloClient({
  onError: ({ graphQLErrors, networkError, operation, forward }) => {
    
  },
  cache,
  link: authLink.concat(httpLink),
  typeDefs,
  resolvers,
});

// const token = localStorage.getItem("token");

client.writeData({
  data: {
    isLoggedIn: !!token,
    userId: !token ? "" : jwt_decode(token).id,
    userRole: !token ? "anonymous" : jwt_decode(token).role,
    managerCity: !token ? "" : jwt_decode(token).managerCity,
    username: !token ? "" : jwt_decode(token).username,
    managerClientRequisition: null
  },
});

export default client;
