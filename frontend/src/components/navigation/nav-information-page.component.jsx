import React from "react";
import { Helmet } from "react-helmet-async";
import Title from "../title/title.component";
import AboutMenu from "./dropdown-items/nav-about-menu";
import CryptoMenu from "./dropdown-items/nav-crypto-menu";
import DocumentMenu from "./dropdown-items/nav-document-menu";

import { StyledContainer } from "../styles/styled-container";
import { StyledNavInformationPageWrapper } from "./styled-info-page";

const NavInformationPage = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>Полезные ссылки - Coin24</title>
      </Helmet>
      <StyledNavInformationPageWrapper>
        <Title
          as="h2"
          title="Полезные ссылки"
          description="Инфо"
          className="info-page__title"
        />
        <div className="info-page__link-wrapper">
          <AboutMenu />
          <CryptoMenu />
        </div>
      </StyledNavInformationPageWrapper>
    </StyledContainer>
  );
};

export default NavInformationPage;