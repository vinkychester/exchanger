import styled from "styled-components";

export const StyledMonitoringWrapper = styled.section`
  margin-top: 35px;
  padding: 15px 0;
  background-color: ${({theme}) =>theme.lightBg};
  @media screen and (max-width: 992px) {
    margin-top: 15px;
  }
`;

export const StyledMonitoringContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 88px);
  grid-gap: 15px;
  @media screen and (max-width: 320px) {
    grid-gap: 10px;
  }
`;