import React, { useContext } from "react";

import {
  StyledBlockSubText,
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../styles/styled-info-block";

import { RequisitionDetailsProfitContext } from "./requisition-details.component";

const RequisitionDetailsProfitTab = ({ label, profit }) => {
  const { rate, currency } = useContext(RequisitionDetailsProfitContext);
  const { tag, asset } = currency;
  
  return (
    <StyledInfoBlock className="requisition-info__item">
      <StyledBlockTitle>{label}:</StyledBlockTitle>
      <StyledBlockText className="requisition-info__title">
        <div>
          {profit} <b>{asset}</b>
        </div>
      </StyledBlockText>
      <StyledBlockSubText>
        <div>
          {tag === "CRYPTO" ? Math.round((profit * rate) * 100) / 100 : Math.round((profit / rate) * 100) / 100}{" "}
          <b>{tag === "CRYPTO" ? "USDT" : "USD"}</b>
        </div>
      </StyledBlockSubText>
    </StyledInfoBlock>
  );
};

export default RequisitionDetailsProfitTab;
