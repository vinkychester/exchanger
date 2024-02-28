import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import Tabs, { TabPane } from "rc-tabs";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import Title from "../../components/title/title.component";
import PairUnitContainer from "../../components/payment-settings/pair-unit/pair-unit.container";
import PairContainer from "../../components/payment-settings/pair/pair.container";
import PaymentSystemContainer from "../../components/payment-settings/payment-system/payment-system.container";

import { StyledContainer } from "../../components/styles/styled-container";
import {
  StyledPairWrapper,
  StyledPaymentSettingsWrapper,
} from "./styled-payment-settings";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { paymentSettings } from "../../rbac-consts";

const PaymentSettingsPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={paymentSettings.READ}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Платежные системы - Coin24</title>
          </Helmet>
          <StyledPaymentSettingsWrapper>
            <Title
              as="h1"
              title="Список платежей валют/криптовалют"
              className="payment-settings-title"
            />
            <Tabs
              defaultActiveKey="pair"
              tabPosition="top"
              className="default-tabs default-tabs-top"
            >
              {/* <TabPane tab="Себестоимость" key="paymentSystem">
                <PaymentSystemContainer />
              </TabPane> */}
              <TabPane tab="Платежные системы" key="pairUnit">
                <PairUnitContainer />
              </TabPane>
              <TabPane tab="Платежные пары" key="pair">
                <StyledPairWrapper>
                  <PairContainer />
                </StyledPairWrapper>
              </TabPane>
            </Tabs>
          </StyledPaymentSettingsWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(PaymentSettingsPage);
