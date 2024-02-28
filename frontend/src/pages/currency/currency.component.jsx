import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import Tabs, { TabPane } from "rc-tabs";

import Can from "../../components/can/can.component";
import Title from "../../components/title/title.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import CurrencyContainer from "../../components/currency/currency.container";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledCurrencyWrapper } from "./styled-currency";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { currency } from "../../rbac-consts";

const CurrencyPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={currency.READ}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Список валют - Coin24</title>
          </Helmet>
          <StyledCurrencyWrapper>
            <Title
              as="h1"
              title="Валюта и криптовалюта"
              className="currency-title"
            />
            <Tabs
              defaultActiveKey="currency"
              tabPosition="top"
              className="default-tabs default-tabs-top"
            >
              <TabPane tab="Валюта" key="currency">
                <CurrencyContainer tag="CURRENCY" />
              </TabPane>
              <TabPane tab="Криптовалюта" key="crypto">
                <CurrencyContainer tag="CRYPTO" />
              </TabPane>
            </Tabs>
          </StyledCurrencyWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(CurrencyPage);
