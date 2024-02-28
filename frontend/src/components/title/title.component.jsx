import React from "react";

import { StyledTitle, StyledTitleDescription, StyledTitleWrapper } from "./styled-title";

const Title = ({ as, className, title, description }) => {
  return (
    <StyledTitleWrapper className={className}>
      <StyledTitle as={as}>
        {title}
      </StyledTitle>
      {description &&
      <StyledTitleDescription>
        {description}
      </StyledTitleDescription>}
    </StyledTitleWrapper>
  );
};
export default Title;