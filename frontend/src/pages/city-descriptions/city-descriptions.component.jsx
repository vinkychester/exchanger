import React from "react";
import { Helmet } from "react-helmet-async";
import { useApolloClient } from "@apollo/react-hooks";

import Can from "../../components/can/can.component";
import Title from "../../components/title/title.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import CityDetailsContainer from "../../components/city-details/city-details.container";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledAdminCitiesWrapper } from "../../components/city-details/styled-admin-city";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { cityDetails } from "../../rbac-consts";

const CityDetailsPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <>
      <Can
        role={userRole}
        perform={cityDetails.PANEL_READ}
        yes={() => (
          <StyledContainer size="xl">
            <Helmet>
              <title>Список городов - Coin24</title>
            </Helmet>
            <StyledAdminCitiesWrapper>
              <Title as="h1" title="Города" className="admin-cities-title" />
              <CityDetailsContainer />
            </StyledAdminCitiesWrapper>
          </StyledContainer>
        )}
        no={() => <ForbiddenPage />}
      />
    </>
  );
};

export default React.memo(CityDetailsPage);
