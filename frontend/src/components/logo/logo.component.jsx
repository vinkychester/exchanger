import React from "react";
import { NavLink } from "react-router-dom";

import Coin24Logo from "../../assets/images/logo.svg";

import { SiteDescription, SiteName, SiteTitle, StyledLogo, StyledLogoIcon, StyledLogoShadow } from "./styled-logo";

const Logo = ({ fixed }) => {
  return (
    <NavLink to="/" className="logo">
      {/*
        To add a Christmas logo, add the "christmas" attribute.
        For example
        <StyledLogo christmas>
          <img />
        </StyledLogo>
      */}
      <StyledLogo fixed={fixed}>
        <StyledLogoShadow className="logo-shadow">
          <StyledLogoIcon className="logo-icon">
            <img alt="coin24-logo" src={Coin24Logo} width="50" height="55" />
          </StyledLogoIcon>
        </StyledLogoShadow>
        <SiteTitle className="site-title">
          <SiteName>
            Coin24
          </SiteName>
          <SiteDescription>
            Обмен криптовалют
          </SiteDescription>
        </SiteTitle>
      </StyledLogo>
    </NavLink>
  );
};

export default Logo;