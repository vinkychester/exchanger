import React from "react";

import {
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../../styles/styled-info-block";

const Confirms = ({ value }) => {
  return (
    <StyledInfoBlock className="flow-data">
      <StyledBlockTitle className="flow-data__label">
        Кол-во подтверждений сети:
      </StyledBlockTitle>
      <StyledBlockText className="requisite__item flow-data__value">
        <p>{value}</p>
      </StyledBlockText>
    </StyledInfoBlock>
  );
};

export default Confirms;
