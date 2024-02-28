import React, { useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import Tabs, { TabPane } from "rc-tabs";
import queryString from "query-string";

import Can, { check } from "../../components/can/can.component";
import Title from "../../components/title/title.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import SystemReportContainer from "../../components/reports/system-reports/system-report.container";
import ManagersReportsContainer from "../../components/reports/manager-reports/managers-reports.container";
import TrafficReportsContainer from "../../components/reports/traffic-reports/traffic-reports-container.component";
import ReferralReportsContainer from "../../components/reports/referral-reports/referral-reports.container";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledReportsWrapper } from "../../components/reports/styled-reports";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { reports } from "../../rbac-consts";
import rules from "../../rbac-rules";

const ReportsPage = () => {
  const client = useApolloClient();
  let history = useHistory();

  const { userRole, userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  if (userRole === "manager") {
    history.push("/panel/reports-manager-details/" + userId);
  }

  let searchParams = queryString.parse(history.location.search);
  const [currentTab, setCurrentTab] = useState(searchParams.currentTab);
  const onChangeTabs = (key) => {
    setCurrentTab(key);
  };

  return (
    <Can
      role={userRole}
      perform={reports.PANEL_READ}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Отчеты - Coin24</title>
          </Helmet>
          <StyledReportsWrapper>
            <Title as="h1" title="Отчеты" className="reports-title" />
            <Tabs
              defaultActiveKey={userRole === "seo" ? "traffic" : "reports"}
              tabPosition="top"
              className="default-tabs default-tabs-top"
              activeKey={currentTab}
              onChange={onChangeTabs}
            >
              {check(rules, userRole, reports.REQUISITIONS) && (
                <TabPane tab="Отчеты" key="reports">
                  <SystemReportContainer />
                </TabPane>
              )}
              {check(rules, userRole, reports.LOYALTY) && (
                <TabPane tab="Партнерка" key="loyaltyProgram">
                  <ReferralReportsContainer />
                </TabPane>
              )}
              {check(rules, userRole, reports.TRAFFIC) && (
                <TabPane tab="Трафик" key="traffic">
                  <TrafficReportsContainer />
                </TabPane>
              )}
              {check(rules, userRole, reports.MANAGERS) && (
                <TabPane tab="Менеджеры" key="manager">
                  <ManagersReportsContainer />
                </TabPane>
              )}
            </Tabs>
          </StyledReportsWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(ReportsPage);
