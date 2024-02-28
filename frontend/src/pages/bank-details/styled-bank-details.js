import styled from "styled-components";

export const StyledBankDetailsWrapper = styled.div`
  padding: 20px 0;
  .hidden-bank-details-form {
    margin: 0;
    &__action {
      padding-bottom: 20px;
    }
  }
  .bank-details-form {
    margin-bottom: 20px;
    padding: 20px;
    background-color: ${({ theme }) => theme.bgElements};
    border-color: ${({ theme }) => theme.borderElements};
    .bank-details-form-select {
      margin-bottom: 15px;
    }
  }

  .bank-details-table {
    &__head,
    &__row {
      grid-template-columns: 1fr 225px 2fr 165px;
    }
    &__row {
      @media screen and (max-width: 992px) {
        margin: 15px 0;
        grid-template-columns: 100%;
        background-color: ${({ theme }) => theme.bgElements};
        border-radius: 10px;
      }
    }
    &__payment-system {
      align-items: center;
    }
    &__action {
      align-items: end;
      @media screen and (max-width: 992px) {
        &:before {
          display: none;
        }
      }
    }
    &_remove {
      grid-template-columns: 1fr;
      & > div {
        display: inline-grid;
        justify-content: end;
        @media screen and (max-width: 768px) {
          justify-content: center;
        }
        @media screen and (max-width: 480px) {
          grid-template-columns: 1fr;
          justify-content: center;
        }
      }
    }
    .payment-system {
      display: inline-grid;
      grid-template-columns: 25px max-content;
      grid-gap: 10px;
      &__name b {
        text-transform: uppercase;
      }
    }
    .deleted-item {
      display: inline-grid;
      grid-template-columns: 100%;
      grid-template-rows: repeat(2, max-content);
      &__label {
        font-size: 12px;
        font-weight: 700;
        opacity: 0.4;
      }
      &__data {
        padding: 10px 0;
        letter-spacing: 1px;
        word-break: break-word;
        border-bottom: 1px solid ${({ theme }) => theme.defaultColor};
      }
    }
    .input-group {
      margin-bottom: 0;
      label {
        margin-bottom: 0;
        font-size: 12px;
        opacity: 0.4;
      }
    }
  }
`;
