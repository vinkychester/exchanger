import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {  useApolloClient } from "@apollo/react-hooks";
import Tabs, { TabPane } from "rc-tabs";

import Can from "../../components/can/can.component";
import Title from "../../components/title/title.component";
import ReferralInfo from "../../components/loyalty-program/loyalty-program-info.component";
import ReferralPayoutHistory from "../../components/loyalty-program/referral-payout-history.component";
import ReferralBanners from "../../components/loyalty-program/referral-system/referral-banners.component";
import ClientReferrals from "../../components/loyalty-program/referral-system/referral-level.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledReferralWrapper } from "../../components/loyalty-program/styled-referral";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { loyalty } from "../../rbac-consts";

const LoyaltyProgramClient = () => {
  const client = useApolloClient();
  const url = window.location.href.split("/panel/")[0];

  const { userRole, userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [isUpdatePayoutHistory, setIsUpdatePayoutHistory] = useState(false);

  return (
    <Can
      role={userRole}
      perform={loyalty.CLIENT_READ}
      yes={() => (
        <StyledContainer>
          <Helmet>
            <title>Программа лояльности - Coin24</title>
          </Helmet>
          <StyledReferralWrapper>
            <Title
              as="h1"
              title="Реферальная программа"
              description="Партнеры"
              className="referral-title"
            />
            <Tabs
              defaultActiveKey="referralProgram"
              tabPosition="left"
              className="default-tabs default-tabs-left"
            >
              <TabPane tab="Реферальная программа" key="referralProgram">
                <ReferralInfo
                  url={url}
                  setIsUpdatePayoutHistory={setIsUpdatePayoutHistory}
                />
              </TabPane>
              <TabPane
                tab="Рефералы 1 уровня"
                key="1LevelReferrals"
              >
                <ClientReferrals level={1} />
              </TabPane>
              <TabPane
                tab="Рефералы 2 уровня"
                key="2LevelReferrals"
              >
                <ClientReferrals level={2} />
              </TabPane>

              <TabPane tab="История выводов" key="history">
                <ReferralPayoutHistory
                  isUpdatePayoutHistory={isUpdatePayoutHistory}
                  setIsUpdatePayoutHistory={setIsUpdatePayoutHistory}
                  userUUID={userId}
                />
              </TabPane>
              <TabPane tab="Баннеры" key="banners">
                <ReferralBanners userUUID={userId} url={url} />
              </TabPane>
            </Tabs>
          </StyledReferralWrapper>
        </StyledContainer>
      )}
    />
  );
};

export default React.memo(LoyaltyProgramClient);
