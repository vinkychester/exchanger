import React from "react";
import Spinner from "./spinner.component";

import { StyledPageSpinner } from "./styled-spinner";
import { StyledContainer } from "../styles/styled-container";

const PageSpinner = () => {
  return (
    <StyledContainer>
      <StyledPageSpinner>
        <Spinner
          color="#EC6110"
          type="moonLoader"
          size="50px"
        />
      </StyledPageSpinner>
    </StyledContainer>
  );
};

export default PageSpinner;