import styled from "styled-components";

export const StyledInvoiceWrapper = styled.div`
  margin-top: 30px;
  padding: 15px;
  background-color: ${({ theme }) => theme.hoverColor};
  border: 1px solid ${({ theme }) => theme.hoverShadow};
  border-radius: 10px;
  @media screen and (max-width: 992px) {
    margin-top: 15px;
  }
  
  .bank-title {
    margin-bottom: 15px;
    padding-left: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid ${({ theme }) => theme.hoverShadow};
    position: relative;
    &:before {
      content: '\\e92b';
      width: 15px;
      height: 20px;
      color: ${({theme}) => theme.defaultColor};
      font-size: 20px;
      font-family: 'theme-icon', serif;
      display: flex;
      justify-content: center;
      position: absolute;
      left: 0;
      top: 0;
    }
    h2 {
      color: ${({theme}) => theme.defaultColor};
      font-size: 16px;
      font-weight: 700;
    }
  }
  
  .flow-data {
    display: flex;
    flex-direction: column;
    &__label {
      color: ${({theme}) => theme.defaultColor};
      opacity: 0.65;
    }
    &__value {
      display: inline-flex;
    }
    &__qrcode {
      padding: 10px;
      border: 1px solid ${({theme}) => theme.defaultColor};
      background-color: ${({ theme }) => theme.hoverShadow};
      border-radius: 5px;
    }
    &__secret-code {
      width: auto !important;
      padding: 10px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      border: 1px solid ${({theme}) => theme.defaultColor};
      background-color: ${({ theme }) => theme.hoverShadow};
      border-radius: 5px;
    }
    &__info {
      width: 100%;
    }
    .icon-copy {
      margin-left: 5px;
      color: ${({theme}) => theme.defaultColor};
      opacity: 0.85;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }
`;

