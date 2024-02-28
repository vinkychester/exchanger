import React from "react";
import { NavLink } from "react-router-dom";

import { StyledInfoMenuItem } from "./styled-dropdown-nav";

const NavInfoMenuItem = ({ to, rel, icon, linkTitle, className }) => {
  return (
    <StyledInfoMenuItem className={`info-menu-item ${className}`}>
      <NavLink to={to} rel={rel} className="info-menu-link" activeClassName="info-menu-link_current">
        <div className="info-menu-link__icon">
          <span className={`icon-${icon}`}/>
        </div>
        <div className="info-menu-link__title">
          {linkTitle}
        </div>
      </NavLink>
    </StyledInfoMenuItem>
  );
};

export default NavInfoMenuItem;