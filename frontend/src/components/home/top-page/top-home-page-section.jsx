import React from "react";

import { StyledContainer } from "../../styles/styled-container";
import { StyledHomeTitleWrapper } from "../../../pages/home/styled-home";

const TopPageSectionComponent = () => {
  return (
    <StyledHomeTitleWrapper>
      <StyledContainer wrapper="content">
        <h1 className="home-title">
          Автоматический обмен криптовалют по лучшему курсу в Украине: купить и
          продать <span>биткоин (btc)</span>, <span>эфириум (eth)</span>, <span>лайткоин (ltc)</span> и другую криптовалюту.
        </h1>
        <p className="home-subtitle">
          Coin24 -  это надежный, конфиденциальный, выгодный и максимально быстрый сервис по обмену электронных валют.
        </p>
      </StyledContainer>
    </StyledHomeTitleWrapper>
  );
};

export default TopPageSectionComponent;