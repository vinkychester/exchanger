import React from "react";
import { useHistory } from "react-router-dom";

import TopExchangeItem from "./top-exchange-item.component";

import {
  StyledRow,
  StyledCol,
} from "../styles/styled-table";
import { StyledButton } from "../styles/styled-button";

import { generateUrl } from "../../utils/calculator.utils";

const TopExchangeList = ({ payment, payout, paymentRate }) => {
  let history = useHistory();

  const handleRedirect = () => {
    const cryptoUrl = generateUrl(payment, "payment");
    const fiatUrl = generateUrl(payout, "payout");
    const url = `${cryptoUrl}-${fiatUrl}`;

    history.push({
      pathname: "/" + url,
      state: {
        amount: 1,
        direction: "CURRENCY" === payment.currency.tag ? "payout" : "payment",
        cryptoCurrency:
          "payment" +
          payment.paymentSystem.name +
          payment.currency.asset.replace(/\s+/g, ""),
        fiatCurrency:
          "payout" +
          payout.paymentSystem.name +
          payout.currency.asset.replace(/\s+/g, ""),
      },
    });
  };

  return (
    <StyledRow col="5" className="top-exchange-table__row">
      <TopExchangeItem label="Вы отадете" exchange={payment} amount={1} direction="payment" />
      <TopExchangeItem
        label="Вы получаете"
        exchange={payout}
        amount={paymentRate}
        direction="payout"
      />
      <StyledCol
        data-title="Действие"
        className="top-exchange-table__action"
        onClick={handleRedirect}
      >
        <StyledButton color="main">Обменять</StyledButton>
      </StyledCol>
    </StyledRow>
  );
};

export default TopExchangeList;
