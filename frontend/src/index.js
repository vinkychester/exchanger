import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "react-apollo";

import "./index.css";

import client from "./client";
import App from "./App";

import { I18nProvider, locales } from "../src/i18n";

import * as serviceWorker from "./serviceWorker";

// Apollo Provider attached the client to our React app
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <I18nProvider locale={locales.RUSSIAN}>
        {/* <React.StrictMode> */}
          <App />
        {/* </React.StrictMode> */}
      </I18nProvider>
    </ApolloProvider>
  </BrowserRouter>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
