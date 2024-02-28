import React, { useContext } from "react";

import AlertMessage from "../alert/alert.component";

import { CalculatorContext, CalculatorExchangeContext } from "./calculator.component";

const CalculatorNoExchange = () => {
  const { pair } = useContext(CalculatorContext);
  const { isCollectionLoading } = useContext(CalculatorExchangeContext);
  
  return (
    null === pair && !isCollectionLoading && (
      <div className="calculator__footer">
        <AlertMessage
          type="warning"
          message="В данном направлении нет обмена"
        />
      </div>
    )
  )
};

export default React.memo(CalculatorNoExchange);