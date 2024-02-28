import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import Tabs, { TabPane } from "rc-tabs/es";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import Title from "../../components/title/title.component";
import ClientContainer from "../../components/client/client.container";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledClientsWrapper } from "../../components/client/styled-clients";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { clients } from "../../rbac-consts";

const ClientPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={clients.READ}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Список клиентов - Coin24</title>
          </Helmet>
          <StyledClientsWrapper>
            <Title as="h1" title="Клиенты" className="client-title" />
            <Tabs
              defaultActiveKey="activeClients"
              tabPosition="top"
              className="default-tabs default-tabs-top"
            >
              <TabPane tab="Активные" key="activeClients">
                <ClientContainer sign="a" />
              </TabPane>
              <TabPane tab="Заблокированые" key="blockClients">
                <ClientContainer sign="b" />
              </TabPane>
            </Tabs>
          </StyledClientsWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(ClientPage);
