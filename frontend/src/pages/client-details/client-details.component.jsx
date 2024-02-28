import React from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import Tabs, { TabPane } from "rc-tabs";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import AlertMessage from "../../components/alert/alert.component";
import Title from "../../components/title/title.component";
import PageSpinner from "../../components/spinner/page-spinner.component";
import BreadcrumbItem from "../../components/breadcrumb/breadcrumb-item";
import ClientDetails from "../../components/client-details/client-details.component";
import ClientDetailsRequisitionList from "../../components/client-details/requisition/client-details-requisition-list.component";
import ClientDetailsReferralLevel from "../../components/client-details/referral-level/client-details-referral-levels.component";
import ClientDetailsLogs from "../../components/client-details/logs/client-details-logs.component";
import ClientDetailsCredit from "../../components/client-details/credit/client-details-credit.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledBreadcrumb } from "../../components/styles/styled-breadcrumb";
import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_CLIENT_DETAILS } from "../../graphql/queries/clients.query";
import { clients } from "../../rbac-consts";
import ClientDetailsCashbackLevels from "../../components/client-details/cashback-level/client-cashback-levels.component";
import {
  StyledClientDetailsContent,
  StyledClientDetailsWrapper,
} from "../../components/client-details/styled-client-details";

const ClientDetailsPage = ({ match }) => {
  const clientApollo = useApolloClient();
  const { id } = match.params;

  const { userRole } = clientApollo.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { data, loading, error } = useQuery(GET_CLIENT_DETAILS, {
    fetchPolicy: "network-only",
    variables: {
      id: `/api/clients/${id}`,
    },
  });

  if (loading) return <PageSpinner />;
  if (error)
    return (
      <StyledContainer size="xl">
        <AlertMessage type="error" message={error.message} />
      </StyledContainer>
    );
  if (!data)
    return (
      <StyledContainer size="xl">
        <AlertMessage type="warning" message="Not found." />
      </StyledContainer>
    );

  const { client } = data;

  return (
    <Can
      role={userRole}
      perform={clients.READ_DETAILS}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Детали клиента - Coin24</title>
          </Helmet>
          <StyledClientDetailsWrapper className="client-details">
            <Title
              as="h1"
              title="Детали клиента"
              className="client-details__title"
            />
            <StyledBreadcrumb>
              <BreadcrumbItem as={NavLink} to="/" title="Главная" />
              <BreadcrumbItem
                as={NavLink}
                to="/panel/clients"
                title="Список клиентов"
              />
              <BreadcrumbItem
                as="span"
                title={`${client.firstname} ${client.lastname}`}
              />
            </StyledBreadcrumb>
            <StyledClientDetailsContent>
              <div className="client-card-wrapper">
                <ClientDetails client={client} userRole={userRole} />
              </div>
              <Tabs
                moreIcon={<span className="icon-sub-menu" />}
                defaultActiveKey="client-requisitions"
                tabPosition="top"
                className="default-tabs default-tabs-top client-tab"
              >
                <TabPane tab="Заявки" key="client-requisitions">
                  <ClientDetailsRequisitionList id={client.id} />
                </TabPane>
                <TabPane tab="Реферальные уровни" key="referral-levels">
                  <ClientDetailsReferralLevel id={client.id} />
                </TabPane>
                <TabPane tab="Кешбэк уровни" key="cashback-levels">
                  <ClientDetailsCashbackLevels id={client.id} />
                </TabPane>
                <TabPane tab="Банковские карты" key="credit">
                  <ClientDetailsCredit id={client.id} />
                </TabPane>
                <TabPane tab="Логи" key="logs">
                  <ClientDetailsLogs email={client.email} />
                </TabPane>
              </Tabs>
            </StyledClientDetailsContent>
          </StyledClientDetailsWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(ClientDetailsPage);
