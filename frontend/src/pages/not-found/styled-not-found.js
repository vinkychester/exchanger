import styled from "styled-components";
import emptyPage from "../../assets/images/empty-page.svg";

export const StyledNotFoundWrapper = styled.div`
  max-width: 1140px;
  width: 100%;
  min-height: calc(100vh - 95px - 275px);
  margin: 0 auto;
  padding: 5% 15px 2.5%;
  @media screen and (max-width: 576px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const StyledNotFoundContent = styled.div`
  margin: 0 auto;
  max-width: 590px;
  width: 100%;
  min-height: 350px;
  background: url(${emptyPage}) 100% 5px no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  p {
    opacity: 0.85;
  }
  b {
    font-size: 44px;
    color: ${({theme}) => theme.defaultColor}
  }
  @media screen and (max-width: 576px) {
    min-height: auto;
    text-align: center;
    background: none;
  }
`;