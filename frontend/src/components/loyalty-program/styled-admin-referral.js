import styled from "styled-components";

export const StyledAdminReferralWrapper = styled.div`
  .admin-referral-title {
    margin: 0;
    padding: 20px 0;
  }
  .hidden-create-referral-level-form,
  .hidden-create-cashback-level-form {
    margin: 0;
  }
  .create-referral-level-form,
  .create-cashback-level-form {
    padding: 20px;
    background-color: ${({ theme }) => theme.bgElements};
    border-color: ${({ theme }) => theme.borderElements};
  }
  .create-referral-level-form {
    &__content {
      display: grid;
      grid-gap: 15px;
      grid-template-columns: repeat(2, minmax(150px, 250px));
      grid-template-areas: 'title title'
                           'ref-level percent';
      @media screen and (max-width: 576px) {
        grid-template-columns: auto;
        grid-template-areas: 'title'
                           'ref-level'
                           'percent';
      }
    }
    &__title {
      grid-area: title;
    }
    &__level {
      grid-area: ref-level;
    }
    &__percent {
      grid-area: percent;
    }
  }
  
  .create-cashback-level-form {
    &__content {
      display: grid;
      grid-gap: 15px;
      grid-template-columns: repeat(2, minmax(150px, 300px));
      grid-template-areas: 'title title'
                           'cashback-level percent'
                           'range-from range-to';
      @media screen and (max-width: 768px) {
        grid-template-columns: auto;
        grid-template-areas: 'title'
                             'cashback-level'
                             'percent'
                             'range-from'
                             'range-to';
      }
    }
    &__title {
      grid-area: title;
    }
    &__level {
      grid-area: cashback-level;
    }
    &__percent {
      grid-area: percent;
    }
    &__range-from {
      grid-area: range-from;
    }
    &__range-to {
      grid-area: range-to;
    }
  }
  
  .admin-referral-table,
  .admin-cashback-table,
  .referral-payout-table {
    &__action {
      display: inline-grid;
      grid-gap: 15px;
      grid-template-columns: repeat(2, 1fr);
    }
    &__action-block {
      padding: 15px;
      display: grid;
      grid-gap: 15px;
      grid-template-columns: 350px max-content;
      align-items: center;
      background-color:${({theme}) => theme.hoverColor};
      border-top: 1px solid ${({theme}) => theme.hoverShadow};
      .change-status {
        position: relative;
        &__item {
          text-transform: inherit;
        }
        .default-spinner {
          margin: -25px 0 0;
          position: absolute;
          top: 50%;
          right: -30px;
        }
      }
    }
    .input-group {
      margin-bottom: 0;
    }
  }
  
  .admin-referral-table {
    &__head, &__row {
      grid-template-columns: minmax(200px, max-content) 1fr repeat(2, 175px) 225px;
    }
  }
  
  .admin-cashback-table {
    &__head, &__row {
      grid-template-columns: repeat(6, 1fr) 225px;
    }
  }
  
  .referral-payout-table {
    margin-top: 15px;
    &__head, &__row {
      grid-template-columns: 100px repeat(3, minmax(100px, 1fr)) minmax(200px, 1fr) 160px minmax(200px, 1fr) 145px 245px;
    }
    .icon-copy {
      padding-left: 5px;
      font-size: 12px;
      color: ${({theme}) => theme.defaultColor};
      cursor: pointer;
    }
    .client {
      &__name {
        font-weight: 700;
        text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        a:hover {
          color: ${({theme}) => theme.defaultColor};
        }
      }
      &__email {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 0.4;
      }
    }
    
    .requisition-wallet, .requisition-message {
      max-width: 200px;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
  }
`;