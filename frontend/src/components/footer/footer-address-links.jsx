import React from "react";

import { StyledFooterBlock, StyledFooterContentItem } from "./styled-footer";

const FooterAddressLinks = () => {
  return (
    <StyledFooterBlock className="footer-address-links">
      {/*<StyledFooterContentItem className="footer-item">
        <div className="footer-item__title">
          Наш адрес
        </div>
        <ul className="footer-item__list">
          <li>
            ул. Пунане, 16/1, Ласнамяэская управа,
          </li>
          <li>
            Таллин, Харьюмаа, 13619
          </li>
          <li>
            Регистрационный номер: 14574124
          </li>
        </ul>
      </StyledFooterContentItem>*/}
      <StyledFooterContentItem className="footer-item">
        <div className="footer-item__title">
          Время работы
        </div>
        <ul className="footer-item__list">
          <li>
            Сервис работает 24/7
          </li>
          <li>
            Техподдержка c 08:00 до 24:00
          </li>
        </ul>
      </StyledFooterContentItem>
    </StyledFooterBlock>
  );
};

export default FooterAddressLinks;