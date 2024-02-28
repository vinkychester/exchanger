import React from "react";

import { StyledCol } from "../styles/styled-table";
import { StyledExchangeUnit } from "./styled-top-exchange";

const TopExchangeItem = ({ label, exchange, amount, direction }) => {
  const { currency, paymentSystem } = exchange;
  const { asset, tag: currencyTag } = currency;
  const { name, tag: paymentSystemTag, subName } = paymentSystem;

  return (
    <>
      <StyledCol data-title={label} className={`top-exchange-table__${direction}`}>
        <StyledExchangeUnit className="pair-unit">
          <div className={`pair-unit__icon exchange-icon-${paymentSystemTag === "CRYPTO" ? asset : paymentSystemTag}`} />
          <div className="pair-unit__name">{paymentSystem.name}</div>
          <div className="pair-unit__asset" title={asset}>({asset})</div>
        </StyledExchangeUnit>
      </StyledCol>
      <StyledCol
        data-title={`Сумма ${asset}`}
        className={`top-exchange-table__${direction}-amount amount`}
      >
        <span>
          {amount}
        </span>
      </StyledCol>
    </>
  );
};

export default TopExchangeItem;
