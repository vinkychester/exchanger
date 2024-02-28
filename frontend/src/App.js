import React, { Suspense } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { HelmetProvider } from "react-helmet-async";

import AutoLogoutMessage from "./components/modal/auto_logout_message";
import ScrollToTopProvider from "./components/scroll-top-top/scroll-top-top";
import LoadRouteComponent from "./components/load-router/load-route.component";
import TokenClickConversionNewFormat from "./components/traffic/traffic-click-conversion-new.component";
import Header from "./components/header/header.component";
import Footer from "./components/footer/footer.component";
import BackToTopButton from "./components/back-to-top/back-to-top.component";
import PageSpinner from "./components/spinner/page-spinner.component";

import { useDarkMode } from "./components/hooks/use-dark-mode.hooks";
import { GlobalStyle } from "./components/styles/global-style";
import { darkTheme, lightTheme } from "./components/styles/theme";
import routes from "./routes";

import "./assets/fonts/OpenSans/style.css";
import "./assets/fonts/theme-icons/style.css";
import "./assets/images/css-sprite/exchange-object-icons.css";
import "./assets/css/rc-select.css";
import "rc-tooltip/assets/bootstrap.css";
import "rc-dropdown/assets/index.css";
import "rc-checkbox/assets/index.css";
import "rc-switch/assets/index.css";
import "rc-tabs/assets/index.css";
import 'rc-notification/assets/index.css';
import "rc-drawer/assets/index.css";
import "rc-pagination/assets/index.css";

// import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';
import * as JivoSite from "react-jivosite";

import { GET_USER_RBAC_DETAILS } from "./graphql/queries/user.query";

const App = () => {
  // ReactGA.initialize('UA-1927935-10');
  // ReactGA.pageview(window.location.pathname + window.location.search);
  ReactPixel.init('900176440455195');

  const client = useApolloClient();

  const { userRole, userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [theme, themeToggler, mountedComponent] = useDarkMode();

  const themeMode = theme === "light" ? lightTheme : darkTheme;

  if (!mountedComponent) return <div />;

  return (
    <ThemeProvider theme={themeMode}>
      <AutoLogoutMessage
        title="Внимание!"
        userId={userId}
        userRole={userRole}
      />
      <TokenClickConversionNewFormat />
      <HelmetProvider>
        <Router>
          <ScrollToTopProvider>
            <Header theme={theme} toggleTheme={themeToggler} />
            <JivoSite.Widget id="pW1fGiZk2W" />
            <Suspense fallback={<PageSpinner/>}>
              <Switch>
                {routes.map((route, i) => (
                  <LoadRouteComponent key={i} {...route} />
                ))}
                <Redirect to="/404" />
              </Switch>
            </Suspense>
            <Footer theme={theme} />
            <BackToTopButton />
          </ScrollToTopProvider>
        </Router>
        <GlobalStyle />
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default React.memo(App);
