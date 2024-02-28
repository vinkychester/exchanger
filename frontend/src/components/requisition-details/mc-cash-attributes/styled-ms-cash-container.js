import styled from "styled-components";

export const StyledMSCashWrapper = styled.div`
  margin-top: 15px;
  padding: 15px;
  background-color: ${({theme}) => theme.hoverColor};
  border: 1px solid ${({theme}) => theme.hoverShadow};
  border-radius: 10px;
  
  .mscash-field {
    margin-bottom: 5px;
    label, .skeleton-label {
      margin-bottom: 3px;
      color: ${({theme}) => theme.defaultColor};
      font-size: 12px;
      display: flex;
    }
  }
  
  .mscash-action {
    padding-top: 10px;
    display: inline-grid;
    grid-template-columns: repeat(2, max-content);
    grid-gap: 15px;
    @media screen and (max-width: 576px) {
      grid-template-columns: repeat(2, 1fr);
      justify-content: center;
    }
    @media screen and (max-width: 375px) {
      display: grid;
      grid-template-columns: 100%;
    }
  }
`;