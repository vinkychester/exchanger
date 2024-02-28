import styled from "styled-components";

export const StyledCheckboxWrapper = styled.div`
  ${({margin}) => margin && `margin: ${margin}`};
  display: inline-flex;
  align-items: center;
`;

export const StyledCheckboxLabel = styled.label`
  ${({position}) => position === 'right' ? 'padding-left: 10px' : position === 'left' ? 'padding-right: 10px' : null};
  padding-bottom: 1px;
  font-weight: 700;
  cursor: pointer;
`;