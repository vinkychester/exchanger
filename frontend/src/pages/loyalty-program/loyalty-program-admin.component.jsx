import React, { useContext } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import Tabs, { TabPane } from "rc-tabs";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import Title from "../../components/title/title.component";
import ReferralLevelContainer from "../../components/referral-level/referral-level.container";
import CashbackLevelContainer from "../../components/cashback/cashback-level.container";
import ReferralPayoutRequisitionContainer from "../../components/loyalty-program/referral-payout-requisition/referral-payout-requisition-container.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledAdminReferralWrapper } from "../../components/loyalty-program/styled-admin-referral";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { loyalty } from "../../rbac-consts";

const LoyaltyProgramAdmin = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={loyalty.READ}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Программа лояльности - Coin24</title>
          </Helmet>
          <StyledAdminReferralWrapper>
            <Title
              as="h1"
              title="Программа лояльности"
              className="admin-referral-title"
            />
            <Tabs
              defaultActiveKey="referralProgram"
              tabPosition="top"
              className="default-tabs default-tabs-top"
            >
              <TabPane tab="Реферальная система" key="referral-system">
                <ReferralLevelContainer />
              </TabPane>
              <TabPane tab="Кешбэк система" key="cashback-system">
                <CashbackLevelContainer />
              </TabPane>

              <TabPane tab="Реферальные заявки" key="referral-requisition">
                <ReferralPayoutRequisitionContainer />
              </TabPane>
            </Tabs>
          </StyledAdminReferralWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(LoyaltyProgramAdmin);
