import styled from "styled-components";

export const StyledClientDetailsWrapper = styled.div`
  .client-details__title {
    margin: 0;
    padding: 20px 0;
  }

  .requisition-table {
    &__header, &__row {
      grid-template-columns: repeat(5, 1fr) 110px;
    }

    &__end-date, &__client, &__payment-system, &__manager {
      display: none;
    }
    &__in, &__out {
      display: inline-flex;
      text-align: left;
    }
    .icon-copy {
      margin-left: 5px;
      color: ${({ theme }) => theme.defaultColor};
      opacity: 0.85;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
    .amount {
      display: inline-grid;
      grid-template-columns: 1fr minmax(60px, 95px);

      &__num {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &__currency {
        padding-left: 5px;
        text-align: left;
      }
    }
    @media screen and (max-width: 992px) {
      &__row {
        margin: 15px 0;
        background-color: ${({ theme }) => theme.bgElements};
        border-radius: 10px;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: 'requisition-number date'
                           'in-count out-count'
                           'status status'
                           'active-btn active-btn';
        & > div {
          margin-bottom: 5px;
          padding-top: 20px;
          align-items: start;

          &:before {
            display: block;
          }
        }
      }
      &__number {
        grid-area: requisition-number;
      }
      &__date {
        grid-area: date;
      }
      &__in {
        grid-area: in-count;
      }
      &__out {
        grid-area: out-count;
      }
      &__status {
        grid-area: status;
      }
      &__active {
        padding-top: 0 !important;
        grid-area: active-btn;
        grid-template-columns: 50%;
        justify-content: end;

        &:before {
          display: none !important;
        }
      }
    }
    @media screen and (max-width: 576px) {
      &__active {
        grid-template-columns: 100%;
      }
    }
  }

  .client-verification-card {
    padding: 0;
  }
  .verification-card-table {
    &__client {
      display: none;
    }
    &__head, &__row {
      grid-template-columns: repeat(4, 1fr) 110px !important;
    }
    @media screen and (max-width: 992px) {
      &__row {
        grid-template-columns: repeat(2, 1fr) !important;
        grid-template-areas: 'num num'
                             'date expirydate'
                             'status status'
                             'action action';
      }
      &__createdAt {
        grid-area: date;
      }
      &__number {
        grid-area: num;
      }
      &__expirydate {
        grid-area: expirydate;
      }
      &__status {
        grid-area: status;
      }
      &__action {
        grid-area: action;
      }
    }
    @media screen and (max-width: 576px) {
      &__active {
        grid-template-columns: 100%;
      }
    }
  }

  .admin-logs-table {
    &__head, &__row {
      grid-template-columns: 100px minmax(150px, 1fr) 140px 125px !important;
    }
    &__role, &__email {
      display: none !important;
    }
    &__level {
      justify-content: start;
    }
    &__message p {
      opacity: 0.55;
      word-break: break-word;
    }

    &__row {
      @media screen and (max-width: 992px) {
        margin: 15px 0;
        background-color: ${({theme}) => theme.bgElements};
        border-radius: 10px;
        grid-template-columns: repeat(2, 1fr) !important;
        grid-template-areas: 'levelAction levelAction'
                             'message message'
                             'ip date' !important;
      }
    }
    @media screen and (max-width: 992px) {
      margin-top: 15px;
      padding-top: 0;
      &__level {
        grid-area: levelAction;
      }
      &__message {
        grid-area: message;
      }
      &__ip {
        grid-area: ip;
      }
      &__date{
        grid-area: date;
      }
    }
  }
`;

export const StyledClientDetailsContent = styled.div`
  padding-top: 20px;
  display: grid;
  grid-gap: 30px;
  grid-template-columns: minmax(0, 500px) 1fr;
  
  @media screen and (max-width: 1200px) {
    grid-template-columns: 100%;
  }
  @media screen and (max-width: 768px) {
    .client-tab {
      grid-template-rows: minmax(40px, auto) auto;
      .rc-tabs-nav-list {
        display: grid;
        grid-template-rows: auto;
        .rc-tabs-tab {
          margin: 0;
          padding: 5px 15px;
        }
        .rc-tabs-tab-active {
          background-color: ${({theme}) => theme.hoverColor};
          border: 1px solid ${({theme}) => theme.hoverShadow};
          border-radius: 5px;
        }
        .rc-tabs-ink-bar {
          display: none;
        }
      }
    }
  }
`;

export const StyledClientCard = styled.div`
  padding: 20px;
  border: 1px solid ${({theme}) => theme.defaultColor};
  border-radius: 10px;
  @media screen and (max-width: 480px) {
    padding: 15px;
  }
`;

export const StyledClientCardHead = styled.div`
  margin-bottom: 15px;
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: 140px 1fr;
  grid-gap: 30px;
  align-items: center;
  border-bottom: 1px solid ${({theme}) => theme.borderElements};
  @media screen and (max-width: 576px) {
    grid-template-columns: 100px 1fr;
    grid-gap: 15px;
  }
  @media screen and (max-width: 480px) {
    padding-bottom: 15px;
    grid-template-columns: 100%;
    grid-gap: 15px;
  }
`;

export const StyledClientCardBody = styled.div`
  .add-referral {
    margin-bottom: 15px;
    &__btn {
      margin-top: 5px;
    }
    .input-group {
      margin-bottom: 0;
    }
  }
`;

export const StyledClientName = styled.div`
  padding-bottom: 15px;
  color: ${({theme}) => theme.defaultColor};
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  @media screen and (max-width: 576px) {
    font-size: 18px;
  }
  @media screen and (max-width: 480px) {
    display: inline-flex;
  }
`;

export const StyledClientPhoto = styled.div`
  width: 140px;
  height: 140px;
  border: 2px solid ${({theme}) => theme.defaultColor};
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 576px) {
    width: 100px;
    height: 100px;
  }
  img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: cover;
  }
`;

export const StyledClientChangeForm = styled.div`
  max-width: 450px;
  margin-top: 15px;
  padding: 10px;
  background-color: ${({theme}) => theme.lightBg};
  border-bottom: 1px solid ${({theme}) => theme.borderElements};
  border-radius: 5px;
  .input-group {
    margin-bottom: 15px;
    label {
      display: flex;
      font-size: 12px;
      font-weight: 400;
      opacity: 0.5;
    }
  }
`;

export const StyledClientChangeWrapper = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  background-color: ${({theme}) => theme.bgElements};
  border: 1px solid ${({theme}) => theme.borderElements};
  border-radius: 5px;
  .client-change-info__title {
    color: ${({theme}) => theme.defaultColor};
    font-size: 16px;
    font-weight: 700;
    opacity: 0.9;
  }
  .client-change-info__action {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-gap: 15px;
  }
`;