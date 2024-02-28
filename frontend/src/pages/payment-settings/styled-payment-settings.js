import styled from "styled-components";

export const StyledPaymentSettingsWrapper = styled.div`
  .payment-settings-title {
    margin: 0;
    padding: 20px 0;
  }

  .payment-settings-actions {
    margin-bottom: 20px;
    &__top {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(225px, max-content));
      grid-gap: 20px;
    }
  }

  .payment-settings-form {
    margin-top: 20px;
    padding: 20px;
    background-color: ${({ theme }) => theme.bgElements};
    border-color: ${({ theme }) => theme.borderElements};
  }

  .change-multiply {
    &__content {
      display: grid;
      grid-template-columns: repeat(auto-fill, 200px);
      grid-gap: 15px;
    }
    &__item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .input-group {
        margin-bottom: 15px;
      }
    }
    &__checkbox {
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      .default-checkbox {
        height: 40px;
      }
      label {
        font-size: 16px;
        margin-bottom: 16px;
      }
    }
  }

  .payment-system-price-table {
    padding-top: 15px;
    &__head, &__row {
      grid-template-columns: 110px repeat(3, 255px) 150px;
    }
    &__name {
      display: grid;
      grid-template-columns: 25px 1fr;
      grid-gap: 10px;
      align-items: center;
    }
    &__price{
      display: grid;
      grid-template-columns: 1fr 17px;
      grid-gap: 15px;
    }
    @media screen and (max-width: 992px) {
      &__row {
        margin: 15px 0;
        background-color: ${({ theme }) => theme.bgElements};
        border-radius: 10px;
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: "name name"
                             "applyTo tag"
                             "subName subName"
                             "price price";
      }
      &__apply-to {
        grid-area: applyTo;
      }
      &__name {
        grid-area: name;
      }
      &__tag {
        grid-area: tag;
      }
      &__sub-name {
        grid-area: subName;
      }
      &__price {
        grid-area: price;
        .input-group {
          margin-bottom: 0;
        }
      }
    }
  }

  .pair-unit-table {
    padding-top: 15px;
    &__header, &__row {
      grid-template-columns: 110px 110px 215px 110px repeat(2, 150px) repeat(5, 100px) repeat(2, 140px) 160px 170px;
    }
    &__card-verification {
      text-align: center;
    }
    &__apply-to {
      justify-content: center;
    }
    .payment-system {
      grid-template-columns: 25px 1fr;
      grid-gap: 5px;
    }
    .input-group {
      margin-bottom: 0;
    }
  }
`;

export const StyledPaymentSystemPrice = styled.div``;

export const StyledPairWrapper = styled.div`
  .create-pair-form {
    &__content {
      display: grid;
      grid-gap: 15px;
      grid-template-columns: repeat(2, minmax(150px, 320px));
      grid-template-areas:
        "payment payout"
        "percent percent";
      @media screen and (max-width: 576px) {
        grid-template-columns: auto;
        grid-template-areas:
          "payment"
          "payout"
          "percent";
      }
    }
    &__payment {
      grid-area: payment;
    }
    &__payout {
      grid-area: payout;
    }
    &__percent {
      grid-area: percent;
    }
  }
  
  .pairs-table {
    padding-top: 15px;
    &__head, &__row {
      grid-template-columns: repeat(2, 1fr) repeat(2, 2fr) 200px 200px 110px;
    }
    &__apply-to {
      justify-content: center;
    }
    &__active {
      justify-content: center;
    }
    .input-group {
      margin-bottom: 0;
    }
    .payment-system {
      &__main {
        display: grid;
        grid-template-columns: 25px repeat(2, max-content);
        align-items: center;
        grid-gap: 5px;
      }
      &__name {
        font-weight: 700;
        text-transform: uppercase;
      }
      &__service {
        padding-left: 30px;
        font-size: 12px;
        opacity: 0.4
      }
    }
  }
`;

export const StyledPairUnitTab = styled.div`
  position: relative;
  .default-spinner {
    margin: -25px 0 0;
    position: absolute;
    top: 50%;
    right: -30px;
  }
`;
