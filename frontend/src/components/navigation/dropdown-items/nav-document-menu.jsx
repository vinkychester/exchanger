import React from "react";
import NavInfoMenuItem from "./nav-information-menu-item";

import { StyledInfoMenuList, StyledInfoMenuWrapper } from "./styled-dropdown-nav";

const DocumentMenu = () => {
  return (
    <StyledInfoMenuWrapper className="document-menu">
      <div className="info-menu__title">
        Документы
      </div>
      <StyledInfoMenuList>
        <NavInfoMenuItem
          to="/useterms"
          icon="menu-user-agreement"
          linkTitle="Пользовательское соглашение"
        />
        <NavInfoMenuItem
          to="/privacy/ru"
          icon="menu-privacy"
          linkTitle="Политика конфиденциальности"
        />
        <NavInfoMenuItem
          to="/exchange-regulations"
          icon="menu-exchange"
          linkTitle="Регламент обмена"
        />
        <NavInfoMenuItem
          to="/client-manual"
          icon="menu-manual"
          linkTitle="Руководство пользователя"
        />
      </StyledInfoMenuList>
    </StyledInfoMenuWrapper>
  );
};

export default DocumentMenu;