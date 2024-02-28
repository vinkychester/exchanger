import React from "react";
import AlertMessage from "../../components/alert/alert.component";

import { StyledContainer } from "../../components/styles/styled-container";

const ForbiddenPage = () => {
  return (
    <StyledContainer>
      <AlertMessage type="error" message="Недостаточно прав" margin="15px 0"/>
    </StyledContainer>
  );
};

export default React.memo(ForbiddenPage);