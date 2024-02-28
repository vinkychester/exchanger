import React from "react";
import { NavLink } from "react-router-dom";

import { StyledFooterBlock, StyledFooterContentItem } from "./styled-footer";

const FooterInfoLinks = () => {
  return (
    <StyledFooterBlock className="footer-info-links">
      <StyledFooterContentItem className="footer-item">
        <div className="footer-item__title">
          Информация
        </div>
        <ul className="footer-item__list">
          <li>
            <NavLink to="/about-us">
              О Нас
            </NavLink>
          </li>
          <li>
            <NavLink to="/rates">
              Курсы
            </NavLink>
          </li>
          <li>
            <NavLink to="/reviews">
              Отзывы
            </NavLink>
          </li>
          <li>
            <NavLink to="/partners">
              Партнерская программа
            </NavLink>
          </li>
          {/*<li>
            <NavLink to="/client-manual">
              Руководство пользователя
            </NavLink>
          </li>*/}
          <li>
            <NavLink to="/faq">
              FAQ
            </NavLink>
          </li>
        </ul>
      </StyledFooterContentItem>
    </StyledFooterBlock>
  );
};

export default FooterInfoLinks;