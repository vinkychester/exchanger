import React from "react";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledChangePasswordWrapper } from "./styled-change-password";
import ChangePasswordContainer from "../../components/change-password/change-password.container";

const ChangePasswordPage = () => {
  return (
    <StyledContainer>
      <StyledChangePasswordWrapper>
        <ChangePasswordContainer />
      </StyledChangePasswordWrapper>
    </StyledContainer>
  );
};

export default React.memo(ChangePasswordPage);
