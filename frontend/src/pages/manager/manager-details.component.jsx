import React from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";

import Can from "../../components/can/can.component";
import AlertMessage from "../../components/alert/alert.component";
import PageSpinner from "../../components/spinner/page-spinner.component";
import Title from "../../components/title/title.component";
import BreadcrumbItem from "../../components/breadcrumb/breadcrumb-item";
import ManagerDetailsContainer from "../../components/administration/manager-details/manager-details.container";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledBreadcrumb } from "../../components/styles/styled-breadcrumb";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_MANAGER_DETAILS } from "../../graphql/queries/manager.query";
import { rolePage } from "../../rbac-consts";
import {
  StyledAdministrationDetailsContent,
  StyledAdministrationDetailsWrapper,
} from "../../components/administration/styled-administration-details";

const ManagersDetailsPage = ({ match }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { data, loading, error } = useQuery(GET_MANAGER_DETAILS, {
    variables: { id: `/api/managers/${match.params.id}` },
    fetchPolicy: "network-only",
  });

  if (loading) return <PageSpinner />;
  if (error)
    return (
      <AlertMessage center type="error" message="Error" margin="30px auto" />
    );
  if (!data)
    return (
      <AlertMessage center type="warning" message="Not found" margin="30px 0" />
    );

  const { manager } = data;

  return (
    <Can
      role={userRole}
      perform={rolePage.ADMINS}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Детали менеджера - Coin24</title>
          </Helmet>
          <StyledAdministrationDetailsWrapper className="administration-details">
            <Title
              as="h1"
              title="Детали менеджера"
              className="administration-details__title"
            />
            <StyledBreadcrumb>
              <BreadcrumbItem as={NavLink} to="/" title="Главная" />
              <BreadcrumbItem
                as={NavLink}
                to="/panel/managers"
                title="Список менеджеров"
              />
              <BreadcrumbItem
                as="span"
                title={`${manager.firstname} ${manager.lastname}`}
              />
            </StyledBreadcrumb>
            <StyledAdministrationDetailsContent>
              <div className="manager-card-wrapper">
                <ManagerDetailsContainer manager={manager} />
              </div>
            </StyledAdministrationDetailsContent>
          </StyledAdministrationDetailsWrapper>
        </StyledContainer>
      )}
    />
  );
};

export default React.memo(ManagersDetailsPage);
