import React from "react";
import { NavLink } from "react-router-dom";

import { StyledFooterBlock, StyledFooterContentItem } from "./styled-footer";

const FooterDocumentLinks = () => {
  return (
    <StyledFooterBlock className="footer-document-links">
      <StyledFooterContentItem className="footer-item">
        <div className="footer-item__title">
          Документы
        </div>
        <ul className="footer-item__list">
          <li>
            <NavLink to="/useterms">
              Пользовательское соглашение
            </NavLink>
          </li>
          <li>
            <NavLink to="/privacy/ru">
              Политика конфиденциальности
            </NavLink>
          </li>
          {/*<li>
            <NavLink to="/document-verification-manual">
              Верификация документов
            </NavLink>
          </li>*/}
          <li>
            <NavLink to="/card-verification-manual">
              Верификация карт
            </NavLink>
          </li>
          <li>
            <NavLink to="/exchange-regulations">
              Регламент обмена
            </NavLink>
          </li>
        </ul>
      </StyledFooterContentItem>
    </StyledFooterBlock>
  );
};

export default FooterDocumentLinks;