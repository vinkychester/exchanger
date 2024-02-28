import styled from "styled-components";

export const StyledTooltip = styled.span`
  padding-left: 3px;
  color: ${({ theme }) => theme.defaultColor};
  cursor: help;
  ${({ size }) => size &&  `font-size: ${size}px`};
  ${({ opacity }) => opacity &&  `opacity: ${opacity}`};
`;