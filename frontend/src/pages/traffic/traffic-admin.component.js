import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";

import Can from "../../components/can/can.component";
import Title from "../../components/title/title.component";
import TrafficLinksContainer from "../../components/reports/traffic-reports/traffic-links-container.component";

import { StyledContainer } from "../../components/styles/styled-container";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { traffic } from "../../rbac-consts";

const TrafficAdmin = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={traffic.PANEL_READ}
      yes={() => (
        <StyledContainer>
          <Helmet>
            <title>Трафиковые ссылки - Coin24</title>
            <meta name="description" content="" />
          </Helmet>
          <Title as="h1" title="Трафиковые ссылки" description="Трафик" />
          <TrafficLinksContainer />
        </StyledContainer>
      )}
    />
  );
};

export default TrafficAdmin;
