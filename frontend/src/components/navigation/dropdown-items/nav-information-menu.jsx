import React from "react";
import DocumentMenu from "./nav-document-menu";
import CryptoMenu from "./nav-crypto-menu";
import AboutMenu from "./nav-about-menu";

import { StyledDropdownMenu } from "./styled-dropdown-nav";

const InformationMenu = () => {
  return (
    <StyledDropdownMenu>
      <AboutMenu/>
      <CryptoMenu/>
    </StyledDropdownMenu>
  );
};

export default InformationMenu;