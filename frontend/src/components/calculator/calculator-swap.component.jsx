import React, { useContext } from "react";

import { StyledCalculatorSwap } from "./styled-calculator";

import { CalculatorContext } from "./calculator.component";
import { findPair } from "../../utils/calculator.utils";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const CalculatorSwap = ({ exchangeValue, collection, setHandleSwap }) => {
  const { handleChangeExchangeValue, setTab } = useContext(CalculatorContext);

  const { paymentCollection, payoutCollection } = collection;
  const { paymentExchangeValue, payoutExchangeValue } = exchangeValue;

  const handleSwap = () => {
    if (paymentExchangeValue && payoutExchangeValue) {
      if (paymentCollection.length === 0 || payoutCollection.length === 0) {
        return closableNotificationWithClick("Cвап не доступен", "error");
      }
      let paymentElement = paymentCollection.find(
        (item) =>
          // payoutExchangeValue.service.tag === item.service.tag &&
          payoutExchangeValue.currency.asset === item.currency.asset &&
          payoutExchangeValue.paymentSystem.subName ===
          item.paymentSystem.subName
      );
      let payoutElement = payoutCollection.find(
        (item) =>
          // paymentExchangeValue.service.tag === item.service.tag &&
          paymentExchangeValue.currency.asset === item.currency.asset &&
          paymentExchangeValue.paymentSystem.subName ===
          item.paymentSystem.subName
      );
      if (
        paymentElement &&
        payoutElement &&
        findPair(paymentElement, payoutElement)
      ) {
        setHandleSwap(true);
        setTab({
          paymentTab: paymentElement.pairUnitTabs.name,
          payoutTab: payoutElement.pairUnitTabs.name
        });
        handleChangeExchangeValue(paymentElement, "payment");
        handleChangeExchangeValue(payoutElement, "payout");
      } else {
        return closableNotificationWithClick("Для этих валют свап недоступен", "error");
      }
    } else {
      return closableNotificationWithClick("Cвап недоступен", "error");
    }
  };

  return (
    <StyledCalculatorSwap className="calculator__swap-btn">
      <button
        type="button"
        className="calculator-swap__btn"
        title="Изменить направление обмена"
        onClick={handleSwap}
      >
        <span className="icon-calculator-exchange" />
      </button>
    </StyledCalculatorSwap>
  );
};

export default React.memo(CalculatorSwap);
