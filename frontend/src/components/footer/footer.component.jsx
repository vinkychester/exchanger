import React, { useState } from "react";
import FooterInfoLinks from "./footer-info-links";
import FooterDocumentLinks from "./footer-document-links";
import FooterAddressLinks from "./footer-address-links";
import FooterSocialLinks from "./footer-social-links";
import FooterMerchants from "./footer-merchants";
import CookieMessage from "../cookie-message/cookie-message.component";
import Cookies from "js-cookie";

import { StyledContainer } from "../styles/styled-container";
import { StyledFooter, StyledFooterContent } from "./styled-footer";

const Footer = ({ theme }) => {

  const [cookie, setCookie] = useState(false);

  const currentYear = (new Date().getFullYear());

  return (
    <StyledFooter>
      {!Cookies.get("useterms") && !cookie && <CookieMessage setCookie={setCookie} />}
      <StyledContainer wrapper="content">
        <StyledFooterContent>
          <FooterInfoLinks />
          <FooterDocumentLinks />
          <FooterAddressLinks />
          <FooterSocialLinks />
        </StyledFooterContent>
        <FooterMerchants theme={theme} />
        <div className="footer-author">
          © Сoin24.com.ua, 2018—{currentYear}. Все права защищены
        </div>
      </StyledContainer>
    </StyledFooter>
  );
};

export default Footer;