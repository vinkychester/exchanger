import React from "react";

import "../../../assets/images/css-sprite/profit-icons.css"
import { StyledProfitItem } from "./styled-profit-section";

const ProfitItem = ({ title, text, img }) => {
  return (
    <StyledProfitItem>
      <div className="profit-item__icon">
        <span className={`profit-icon-${img}`}/>
      </div>
      <h4 className="profit-item__title">
        {title}
      </h4>
      <p className="profit-item__text">
        {text}
      </p>
    </StyledProfitItem>
  );
};

export default ProfitItem;