import React from "react";

import "../../assets/images/css-sprite/merchant-icons.css";
import { StyledMerchantsWrapper } from "./styled-footer";

const FooterMerchants = ({ theme }) => {

  return (
    <StyledMerchantsWrapper>
      <div className="merchant-item">
        <span className={`merchant-icon-visa${theme === "dark" ? "-alt" : ""}`} />
      </div>
      <div className="merchant-item">
        <span className={`merchant-icon-visa-secure${theme === "dark" ? "-alt" : ""}`} />
      </div>
      <div className="merchant-item">
        <span className={`merchant-icon-mastercard${theme === "dark" ? "-alt" : ""}`} />
      </div>
      <div className="merchant-item">
        <span className={`merchant-icon-mastercard-id-check${theme === "dark" ? "-alt" : ""}`} />
      </div>
    </StyledMerchantsWrapper>
  );
};

export default FooterMerchants;