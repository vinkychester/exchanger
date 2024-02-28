import React from "react";
import NavInfoMenuItem from "./nav-information-menu-item";

import { StyledInfoMenuList, StyledInfoMenuWrapper } from "./styled-dropdown-nav";

const AboutMenu = () => {
  return (
    <StyledInfoMenuWrapper className="info-menu">
      <div className="info-menu__title">
        Для каждого
      </div>
      <StyledInfoMenuList>
        <NavInfoMenuItem
          to="/about-us"
          icon="logo-coin24"
          linkTitle="О Нас"
        />
        <NavInfoMenuItem
          to="/news"
          icon="menu-news"
          linkTitle="Полезные статьи"
          rel="canonical"
        />
        <NavInfoMenuItem
          to="/cities"
          icon="menu-city"
          linkTitle="Города"
          rel="canonical"
        />
        <NavInfoMenuItem
          to="/reviews"
          icon="menu-reviews"
          linkTitle="Отзывы"
        />
        <NavInfoMenuItem
          to="/partners"
          icon="menu-partners"
          linkTitle="Партнерская программа"
        />
      </StyledInfoMenuList>
    </StyledInfoMenuWrapper>
  );
};

export default AboutMenu;