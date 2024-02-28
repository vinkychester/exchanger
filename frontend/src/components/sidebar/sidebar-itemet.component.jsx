import React from "react";

import { SidebarLink, StyledSidebarItem } from "./styled-sidebar";

const SidebarItem = ({ as, to, icon, linkTitle, handleChange }) => {
  return (
    <StyledSidebarItem>
      <SidebarLink
        as={as}
        to={to}
        onClick={handleChange}
        className="sidebar-link"
        activeClassName="sidebar-link_current"
      >
        <div className="sidebar-link__icon">
          <span className={`icon-${icon}`} />
        </div>
        <div className="sidebar-link__title">
          {linkTitle}
        </div>
      </SidebarLink>
    </StyledSidebarItem>
  );
};

export default SidebarItem;