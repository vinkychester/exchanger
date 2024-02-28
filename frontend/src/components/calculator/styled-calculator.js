import styled from "styled-components";

export const StyledCalculatorSection = styled.section``;

export const StyledCalculatorWrapper = styled.form`
  min-height: 560px;
  padding-bottom: 50px;
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  grid-gap: 30px;
  grid-template-areas: 'payment calc-swap payout'
                       'calc-footer calc-footer calc-footer';
  .calculator_payment {
    grid-area: payment;
  }
  .calculator_payout {
    grid-area: payout;
  }
  .calculator__swap {
    grid-area: calc-swap;
  }
  .calculator__footer {
    grid-area: calc-footer;
  }
  @media screen and (max-width: 992px) {
    grid-template-columns: 1fr;
    grid-gap: 15px;
    grid-template-areas: 'payment'
                         'calc-swap'
                         'payout'
                         'calc-footer';
  }
`;

export const StyledCalculatorSwap = styled.div`
  max-height: 330px;
  padding-top: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 992px) {
    padding: 0;
  }
  
  .calculator-swap__btn {
    height: 40px;
    width: 40px;
    color: ${({ theme }) => theme.defaultColor};
    font-size: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
    transition: all 0.3s ease;

    &:hover {
      transform: rotate(180deg);
    }

    &:active {
      transform: scale(0.95) rotate(180deg);
    }
  }
`;

export const StyledCalculatorTabWrapper = styled.div``;

export const StyledTabTitle = styled.div`
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: 700;
`;

export const StyledTabNavigation = styled.div`
  padding-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  .selected {
    padding: 11px 15px;
    color: #fff;
    background: linear-gradient(90deg, #ea5400 0%, #f28c3c 100%);
    border: none;
    box-shadow: 0 4px 10px rgba(255, 122, 0, 0.5);
  }
`;

export const StyledTabNavItem = styled.label`
  margin: 10px 10px 0 0;
  padding: 10px 14px;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  display: inline-flex;
  border-radius: 5px;
  background: transparent;
  border: 1px solid #ec6110;
  box-shadow: none;
  cursor: pointer;
  position: relative;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    transition: all .2s ease;
    box-shadow: 0 4px 10px rgba(255, 122, 0, 0.25);
  }
`;

export const StyledTabContent = styled.div`
  height: 240px;
  padding: 8px 5px 8px 8px;
  border: 1px solid ${({theme}) => theme.defaultColor};
  border-radius: 10px;
  .exchange-item_current {
    color: #fff;
    background-color: ${({theme}) => theme.defaultColor};
  }
  .exchange-item_no-exchange {
    opacity: 0.25;
  }
`;

export const StyledTabWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 9px;
    background-color: ${({theme}) => theme.hoverShadow};
    border-radius: 20px;
  }
  &::-webkit-scrollbar-track{
    background: ${({theme}) => theme.hoverShadow};
    border-radius: 20px;
  }
  &::-webkit-scrollbar-thumb {
    width: 15px;
    background-color: ${({theme}) => theme.defaultColor};
    border: 2px solid ${({theme}) => theme.hoverShadow};
    border-radius: 12px;
  }
`;

export const StyledTabContentItem = styled.label`
  margin-right: 3px;
  padding: 5px 15px;
  font-size: 16px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  .exchange-item-name {
    padding: 0 10px;
    font-weight: 700;
  }
  &:hover {
    color: #fff;
    background-color: #ef7b2b;
  }
`;

export const StyledTabInputWrapper = styled.div`
  .exchange-data__input {
    position: relative;

    input {
      font-size: 18px;
      font-weight: 700;
    }

    &:after {
      content: attr(data-currency);
      margin-top: -11px;
      font-size: 16px;
      position: absolute;
      top: 50%;
      right: 0;
      opacity: 0.5;
    }
  }

  .exchange-data__min-max {
    min-height: 45px;
    font-size: 12px;
    line-height: 14px;
    opacity: 0.5;
    span {
      color: ${({ theme }) => theme.defaultColor};
      text-decoration: underline;
      cursor: pointer;

    }
  }
`;

export const StyledRequisitesWrapper = styled.div`
  grid-column: span 3;
`;
export const StyledRequisitesField = styled.div`
  .requisite-label {
    color: ${({ theme }) => theme.defaultColor};
    font-size: 16px;
    font-weight: 700;
  }
  .save-requisite-select {
    margin-bottom: 10px;
    &__item {
      color: ${({theme}) => theme.text};
    }
  }
`;

export const StyledAgreeMessage = styled.div`
  margin: 20px 0;
  padding: 30px 15px;
  text-align: center;
  background-color: ${({ theme }) => theme.bgElements};
  p {
    padding-bottom: 25px;
    font-size: 12px;
  }
`;

export const StyledCalculatorFooter = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 100px;
`;

export const StyledCalculatorAlignBtn = styled.div`
  text-align: center;
  .exchange-btn {
    position: relative;
    &__tooltip {
      height: 44px;
      width: 120px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;
