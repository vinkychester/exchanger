import React from "react";

import { StyledCol, StyledRow } from "../styles/styled-table";

const CurrencyItem = ({asset, rate, paymentRate, payoutRate}) => {
  return (
    <StyledRow col="4" className="currency-table__row">
      <StyledCol data-title="Аббревиатура">
        {asset}
      </StyledCol>
      <StyledCol data-title="Курс">
        {rate}
      </StyledCol>
      <StyledCol data-title="Курс покупки">
        {paymentRate}
      </StyledCol>
      <StyledCol data-title="Курс продажи">
        {payoutRate}
      </StyledCol>
    </StyledRow>
  );
};

export default CurrencyItem;
