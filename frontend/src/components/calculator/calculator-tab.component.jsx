import React, { useContext, createContext, useState, useCallback } from "react";

import CalculatorNavigation from "./calculator-navigation.component";
import CalculatorContent from "./calculator-content.component";
import CalculatorFooter from "./calculator-footer.component";

import {
  StyledCalculatorTabWrapper,
  StyledTabTitle,
} from "./styled-calculator";

import { CalculatorContext, CalculatorTabContext } from "./calculator.component";

export const CalculatorContentContext = createContext();

const CalculatorTab = ({ label }) => {
  const { pair, setTab } = useContext(CalculatorContext);
  const { direction } = useContext(CalculatorTabContext);
  const [exchangeItem, setExchangeItem] = useState(null);

  const field = `${direction}Tab`;
  const handleChangeTab = useCallback((value) => {
    setExchangeItem(null);
    setTab((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  });

  return (
    <StyledCalculatorTabWrapper
      className={`calculator__tab calculator_${direction}`}
    >
      <StyledTabTitle>{label}:</StyledTabTitle>
      <CalculatorContentContext.Provider
        value={{ exchangeItem, setExchangeItem, handleChangeTab }}
      >
        <CalculatorNavigation />
        <CalculatorContent />
      </CalculatorContentContext.Provider>
      {pair && <CalculatorFooter />}
    </StyledCalculatorTabWrapper>
  );
};

export default React.memo(CalculatorTab);
