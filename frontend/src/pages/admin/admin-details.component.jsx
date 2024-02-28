import React from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";

import Can from "../../components/can/can.component";
import AlertMessage from "../../components/alert/alert.component";
import PageSpinner from "../../components/spinner/page-spinner.component";
import Title from "../../components/title/title.component";
import BreadcrumbItem from "../../components/breadcrumb/breadcrumb-item";
import AdminDetailsContainer from "../../components/administration/admin-details/admin-details.container";

import { StyledBreadcrumb } from "../../components/styles/styled-breadcrumb";
import { StyledContainer } from "../../components/styles/styled-container";
import {
  StyledAdministrationDetailsContent,
  StyledAdministrationDetailsWrapper,
} from "../../components/administration/styled-administration-details";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_ADMIN_ACCOUNT_DETAILS } from "../../graphql/queries/account.query";
import { rolePage } from "../../rbac-consts";

const AdminDetailsPage = ({ match }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { data, error, loading } = useQuery(GET_ADMIN_ACCOUNT_DETAILS, {
    variables: { id: `/api/admins/${match.params.id}` },
  });

  if (loading) return <PageSpinner />;
  if (error) return <AlertMessage type="warning" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found" />;

  const { admin } = data;

  return (
    <Can
      role={userRole}
      perform={rolePage.ADMINS}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Детали администратора - Coin24</title>
          </Helmet>
          <StyledAdministrationDetailsWrapper className="administration-details">
            <Title
              as="h1"
              title="Детали администратора"
              className="administration-details__title"
            />
            <StyledBreadcrumb>
              <BreadcrumbItem as={NavLink} to="/" title="Главная" />
              <BreadcrumbItem
                as={NavLink}
                to="/panel/admins"
                title="Список администраторов"
              />
              <BreadcrumbItem
                as="span"
                title={`${admin.firstname} ${admin.lastname}`}
              />
            </StyledBreadcrumb>
            <StyledAdministrationDetailsContent>
              <div className="admin-card-wrapper">
                <AdminDetailsContainer user={admin} />
              </div>
            </StyledAdministrationDetailsContent>
          </StyledAdministrationDetailsWrapper>
        </StyledContainer>
      )}
    />
  );
};

export default React.memo(AdminDetailsPage);
