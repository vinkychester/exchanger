import React from "react";
import { NavLink } from "react-router-dom";

import { StyledInfoMenuList, StyledInfoMenuWrapper } from "./styled-dropdown-nav";

const CryptoMenu = () => {
  return (
    <StyledInfoMenuWrapper className="crypto-menu">
      <div className="info-menu__title">
        О криптовалюте
      </div>
      <StyledInfoMenuList className="crypto-list">
        <li className="info-menu-item">
          <NavLink
            to="/crypto-dictionary"
            className="info-menu-link"
            activeClassName="info-menu-link_current"
          >
            <div className="info-menu-link__title crypto-list__title">
              Криптословарь
            </div>
          </NavLink>
        </li>
        <li className="info-menu-item">
          <NavLink
            to="/all-exchange-pairs"
            className="info-menu-link"
            activeClassName="info-menu-link_current"
          >
            <div className="info-menu-link__title crypto-list__title">
              Направления обменов
            </div>
          </NavLink>
        </li>
        <li className="info-menu-item">
          <NavLink
            to="/kurs-bitcoina"
            className="info-menu-link"
            activeClassName="info-menu-link_current"
          >
            <div className="info-menu-link__title crypto-list__title">
              Курсы криптовалют
            </div>
          </NavLink>
        </li>
        <li className="info-menu-item">
          <NavLink
            to="/obmenyat-kupit-kriptovalyutu"
            className="info-menu-link"
            activeClassName="info-menu-link_current"
          >
            <div className="info-menu-link__title crypto-list__title">
              Купить криптовалюту
            </div>
          </NavLink>
        </li>
        <li className="info-menu-item">
          <NavLink
            to="/obmen-kriptovalut"
            className="info-menu-link"
            activeClassName="info-menu-link_current"
          >
            <div className="info-menu-link__title crypto-list__title">
              Обменник криптовалют
            </div>
          </NavLink>
        </li>
        <li className="info-menu-item">
          <NavLink
            to="/bitcoin-koshelek"
            className="info-menu-link"
            activeClassName="info-menu-link_current"
          >
            <div className="info-menu-link__title crypto-list__title">
              Биткоин кошелек
            </div>
          </NavLink>
        </li>
      </StyledInfoMenuList>
    </StyledInfoMenuWrapper>
  );
};

export default CryptoMenu;