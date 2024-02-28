import React from "react";

import {
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../../styles/styled-info-block";

const CardMask = ({ value, userRole }) => {
  return (
    userRole !== "client" && (
      <StyledInfoBlock className="flow-data">
        <StyledBlockTitle className="flow-data__label">
          Реквизиты:
        </StyledBlockTitle>
        <StyledBlockText className="requisite__item flow-data__value">
          <p>{value}</p>
        </StyledBlockText>
      </StyledInfoBlock>
    )
  );
};

export default CardMask;
