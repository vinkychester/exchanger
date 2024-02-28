import React from "react";
import { NavLink } from "react-router-dom";
import { StaticInfoNavigation, StaticInfoNavItem } from "./styled-static-info";

const StaticInfoNav = () => {
  return (
    <StaticInfoNavigation>
      <StaticInfoNavItem>
        <NavLink to="/useterms">
          Пользовательское соглашение
        </NavLink>
      </StaticInfoNavItem>
      <StaticInfoNavItem>
        <NavLink to="/privacy/ru">
          Политика конфиденциальности
        </NavLink>
      </StaticInfoNavItem>
      {/*<StaticInfoNavItem>
        <NavLink to="/document-verification-manual">
          Верификация документов
        </NavLink>
      </StaticInfoNavItem>*/}
      <StaticInfoNavItem>
        <NavLink to="/card-verification-manual">
          Верификация карт
        </NavLink>
      </StaticInfoNavItem>
      <StaticInfoNavItem>
        <NavLink to="/exchange-regulations">
          Регламент обмена
        </NavLink>
      </StaticInfoNavItem>
      {/*<StaticInfoNavItem>
        <NavLink to="/client-manual">
          Руководство пользователя
        </NavLink>
      </StaticInfoNavItem>*/}
    </StaticInfoNavigation>
  );
};

export default StaticInfoNav;