import React from "react";

import "../../assets/images/css-sprite/social-icons.css"
import { StyledFooterBlock, StyledFooterContentItem } from "./styled-footer";

const FooterSocialLinks = () => {
  return (
    <StyledFooterBlock className="footer-social-links">
      <StyledFooterContentItem className="footer-item footer-social-links__email">
        <div className="footer-item__title">
          Наш e-mail
        </div>
        <ul className="footer-item__list">
          <li>
            <a href="mailto:info@coin24.com.ua">
              info@coin24.com.ua
            </a>
          </li>
        </ul>
      </StyledFooterContentItem>
      <StyledFooterContentItem className="footer-item footer-social-links__social-list">
        <div className="footer-item__title">
          Мы в соц. сетях
        </div>
        <ul className="footer-item__list social-wrapper">

          <li>
            <a
              href="https://www.facebook.com/coin24comua"
              target="_blank"
              rel="noreferrer"
            >
              <span className="social-icon-facebook"/>
            </a>
          </li>
          <li>
            <a
              href="https://vk.com/coin24comua"
              target="_blank"
              rel="noreferrer"
            >
              <span className="social-icon-vk"/>
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/Coin24U"
              target="_blank"
              rel="noreferrer"
            >
              <span className="social-icon-twitter"/>
            </a>
          </li>
          <li>
            <a
              href="https://t.me/coin24comua"
              target="_blank"
              rel="noreferrer"
            >
              <span className="social-icon-telegram"/>
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/coin24.com.ua/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="social-icon-instagram"/>
            </a>
          </li>

          <li>
            <a
              href="https://ok.ru/group/58962270224628"
              target="_blank"
              rel="noreferrer"
            >
              <span className="social-icon-ok"/>
            </a>
          </li>
        </ul>
      </StyledFooterContentItem>
    </StyledFooterBlock>
  );
};

export default FooterSocialLinks;