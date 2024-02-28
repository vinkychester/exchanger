import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";

import Can from "../can/can.component";

import {
  StyledPageNavbar,
  StyledPageNavbarItem,
  StyledPageNavbarLink,
} from "../styles/styled-page-navbar";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { rolePage } from "../../rbac-consts";

const AdministrationNavigation = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <div className="administration-nav">
      <StyledPageNavbar>
        <Can
          role={userRole}
          perform={rolePage.ADMINS}
          yes={() => (
            <StyledPageNavbarItem>
              <StyledPageNavbarLink
                as={NavLink}
                to="/panel/admins"
                className="page-navbar-link"
                activeClassName="page-navbar-link_current"
              >
                Администраторы
              </StyledPageNavbarLink>
            </StyledPageNavbarItem>
          )}
        />
        <Can
          role={userRole}
          perform={rolePage.MANAGERS}
          yes={() => (
            <StyledPageNavbarItem>
              <StyledPageNavbarLink
                as={NavLink}
                to="/panel/managers"
                className="page-navbar-link"
                activeClassName="page-navbar-link_current"
              >
                Менеджеры
              </StyledPageNavbarLink>
            </StyledPageNavbarItem>
          )}
        />
        <Can
          role={userRole}
          perform={rolePage.SEOS}
          yes={() => (
            <StyledPageNavbarItem>
              <StyledPageNavbarLink
                as={NavLink}
                to="/panel/seos"
                className="page-navbar-link"
                activeClassName="page-navbar-link_current"
              >
                СЕО-менеджеры
              </StyledPageNavbarLink>
            </StyledPageNavbarItem>
          )}
        />
      </StyledPageNavbar>
    </div>
  );
};

export default AdministrationNavigation;
