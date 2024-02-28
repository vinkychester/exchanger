import React from "react";
import NumCounterItem from "./num-counter-item";

import exchange from "../../../assets/images/num-exchange.svg";
import client from "../../../assets/images/num-clients.svg";
import finance from "../../../assets/images/num-finance.svg";
import coin from "../../../assets/images/num-coins.svg";

import { StyledContainer } from "../../styles/styled-container";
import { StyledCounterContent, StyledCounterWrapper } from "./styled-num-counter-section";

const NumCounterSectionComponent = () => {
  return (
    <StyledCounterWrapper>
      <StyledContainer wrapper="content">
        <StyledCounterContent>
          <NumCounterItem
            top="Более"
            endCount={100}
            bottom="обменов в сутки"
            img={exchange}
            alt="exchanges-per-day"
            animation="exchange"
          />
          <NumCounterItem
            top="Свыше"
            endCount={10}
            countSuffix="K"
            bottom="довольных клиентов"
            img={client}
            alt="satisfied-customers"
            animation="client"
          />
          <NumCounterItem
            top="Больше"
            endCount={10}
            bottom="лет на рынке финансов"
            img={finance}
            alt="ten-years-in-the-financial-market"
            animation="finance"
          />
          <NumCounterItem
            top="Топ"
            endCount={15}
            bottom="монет для обмена"
            img={coin}
            alt="many-selection-of-coins"
            animation="coin"
          />
        </StyledCounterContent>
      </StyledContainer>
    </StyledCounterWrapper>
  );
};

export default NumCounterSectionComponent;