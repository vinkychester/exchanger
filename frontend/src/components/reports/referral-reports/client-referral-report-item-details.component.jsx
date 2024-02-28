import React from "react";
import { TimestampToDate } from "../../../utils/timestampToDate.utils";

import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";

const ClientReferralReportItemDetails = ({ invitedUser }) => {
  const { createdAt, status, isVerified } = invitedUser;
  return (
    <React.Fragment>
      <StyledInfoBlock>
        <StyledBlockTitle>
          Дата регистрации:
        </StyledBlockTitle>
        <StyledBlockText>
          {TimestampToDate(createdAt)}
        </StyledBlockText>
      </StyledInfoBlock>
      <StyledInfoBlock>
        <StyledBlockTitle>
          Статус:
        </StyledBlockTitle>
        <StyledBlockText>
          {status === "trusted" ? "доверенный" : status === "suspicious"
            ? "подозрительный"
            : "стабильный"}
        </StyledBlockText>
      </StyledInfoBlock>
      <StyledInfoBlock>
        <StyledBlockTitle>
          Документы:
        </StyledBlockTitle>
        <StyledBlockText>
          {isVerified ? "верифицированы" : "не верифицированы"}
        </StyledBlockText>
      </StyledInfoBlock>
    </React.Fragment>
  );
};

export default ClientReferralReportItemDetails;
