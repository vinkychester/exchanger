import React from "react";

import { StyledButton } from "../styles/styled-button";
import { StyledLoadButton } from "./styled-spinner";
import Spinner from "./spinner.component";

const LoadButton = ({color, weight, text, mb, mt, className}) => {
  return (
    <StyledLoadButton>
      <StyledButton color={color} weight={weight} mb={mb} mt={mt} className={`loading-button ${className}`} disabled>
        {text}
        <div className="loading-button__spinner">
          <Spinner color="#FFFFFF" type="moonLoader" size="22px"/>
        </div>
      </StyledButton>
    </StyledLoadButton>
  );
};

export default LoadButton;