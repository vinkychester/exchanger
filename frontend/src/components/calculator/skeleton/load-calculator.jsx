import React from "react";

import { StyledContainer } from "../../styles/styled-container";
import {
  StyledCalculatorAlignBtn,
  StyledCalculatorSection,
  StyledCalculatorSwap,
  StyledCalculatorTabWrapper,
  StyledCalculatorWrapper,
  StyledTabTitle
} from "../styled-calculator";

import CalculatorSkeletonNavigation from "./calculator-skeleton-navigation";
import CalculatorSkeletonPairContent from "./calculator-skeleton-pair-content";
import LoadButton from "../../spinner/button-spinner.component";

const LoadCalculator = () => {
  return (
    <StyledCalculatorSection>
      <StyledContainer wrapper="content">
        <StyledCalculatorWrapper>

          <StyledCalculatorTabWrapper className="calculator__tab">
            <StyledTabTitle> Отдаете: </StyledTabTitle>
            <CalculatorSkeletonNavigation />
            <CalculatorSkeletonPairContent />
          </StyledCalculatorTabWrapper>

          <StyledCalculatorSwap className="calculator__swap-btn">
            <button
              type="button"
              className="calculator-swap__btn"
              title="Изменить направление обмена"
            >
              <span className="icon-calculator-exchange" />
            </button>
          </StyledCalculatorSwap>

          <StyledCalculatorTabWrapper className="calculator__tab">
            <StyledTabTitle> Получаете: </StyledTabTitle>
            <CalculatorSkeletonNavigation />
            <CalculatorSkeletonPairContent />
          </StyledCalculatorTabWrapper>

          <StyledCalculatorAlignBtn className="calculator__footer">
            <LoadButton color="main" text="Обменять" />
          </StyledCalculatorAlignBtn>

        </StyledCalculatorWrapper>
      </StyledContainer>
    </StyledCalculatorSection>
  );
};

export default LoadCalculator;