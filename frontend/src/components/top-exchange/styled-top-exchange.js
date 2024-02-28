import styled from "styled-components";

export const StyledTopExchangeWrapper = styled.div`
  .amount {
    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
  }
  .top-exchange-table {
    &__head, &__row {
      grid-template-columns: repeat(5, 1fr);
    }
    &__action {
      justify-content: end;
    }
    @media screen and (max-width: 992px) {
      &__row {
        grid-template-columns: repeat(2, 1fr);
        background-color: ${({theme}) => theme.bgElements};
        border-radius: 10px;
        margin-bottom: 15px;
        grid-template-areas: 'payment payment-amount'
                             'payout payout-amount'
                             'action action';
        
      }
      &__payment {
        grid-area: payment;
      }
      &__payment-amount {
        grid-area: payment-amount;
      }
      &__payout {
        grid-area: payout;
      }
      &__payout-amount {
        grid-area: payout-amount;
      }
      &__action {
        grid-area: action;
        padding-top: 10px;
        text-align: center;
        justify-content: center;
        &:before {
          display: none;
        }
      }
    }
    @media screen and (max-width: 576px) {
      &__row {
        & > div:before {
          max-width: 105px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      &__action {
        justify-content: inherit;
      }
    }
  }
`;

export const StyledExchangeUnit = styled.div`
  display: grid;
  grid-template-columns: 25px repeat(2, max-content);
  grid-gap: 10px;
  align-items: center;
  .pair-unit__name {
    font-weight: 700;
    text-transform: uppercase;
  }
  .pair-unit__asset {
    @media screen and (max-width: 576px) {
      max-width: 55px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
