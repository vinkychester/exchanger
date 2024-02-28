import React, { useState } from "react";
import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Drawer from "rc-drawer";

// import "rc-drawer/assets/index.css";

import {
  StyledAccount,
  StyledShowSidebar,
  StyledSidebar,
} from "./styled-sidebar";
import SidebarItem from "./sidebar-itemet.component";
import SidebarLinks from "./sidebar-links.component";
import SidebarButtonSkeleton from "./skeleton/sidebar-button-skeleton";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_CONCRETE_USER_BY_DISCR } from "../../graphql/queries/user.query";

const Sidebar = () => {
  let history = useHistory();
  const client = useApolloClient();
  
  const { userId, userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { data, loading, error  } = useQuery(GET_CONCRETE_USER_BY_DISCR, {
    variables: { id: userId, discr: userRole },
    fetchPolicy: "network-only",
  });

  const [visible, setVisible] = useState(false);

  if (loading) return <SidebarButtonSkeleton text="профиль" />;
  if (error) return <SidebarButtonSkeleton text="профиль" />;
  if (!data) return <SidebarButtonSkeleton text="профиль" />;

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const logOut = () => {
    // client.resetStore();
    client.writeData({
      data: { isLoggedIn: false, userId: "", userRole: "anonymous" },
    });
    if (userRole === 'manager') {
      localStorage.removeItem("refresh_token");
    }
    localStorage.removeItem("token");
    history.push("/");
  };

  const { collection } = data.users;

  if (!collection.length)
    return <SidebarButtonSkeleton type="error" text="User not found" />;

  const { firstname, lastname, email } = collection[0];

  return (
    <>
      <StyledShowSidebar className="sidebar-btn" onClick={showDrawer}>
        <div className="sidebar-btn__icon">
          <span className="icon-bar" />
        </div>
        <div className="sidebar-btn__title">Профиль</div>
      </StyledShowSidebar>
      <Drawer
        width="256"
        placement="right"
        handler={false}
        open={visible}
        onClose={onClose}
      >
        <StyledSidebar>
          <StyledAccount className="sidebar-account">
            <div className="sidebar-account__info user">
              <div className="user__name">
                {firstname} {lastname}
              </div>
              <div className="user__email">{email}</div>
            </div>
            <div className="sidebar-account__settings">
              <NavLink
                to="/panel/account"
                className="settings-link"
                onClick={onClose}
              >
                <span className="icon-settings-cog" />
              </NavLink>
            </div>
          </StyledAccount>
          <SidebarLinks handleChange={onClose} />
          <SidebarItem
            icon="door-open"
            linkTitle="Выход"
            handleChange={() => {
              onClose();
              logOut();
            }}
          />
        </StyledSidebar>
      </Drawer>
    </>
  );
};

export default React.memo(Sidebar);
