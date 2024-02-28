import styled from "styled-components";

const colorStatus = {
  status: String
};

const styleStatus = (status) => {
  switch (status) {
    case "ERROR" :
    case "DISABLED" :
    case "CANCELED":
      return `
        color: #FF5B5B;
    `;
    case "FINISHED":
      return `
        color: #1BA249;
    `;
    default:
      return `
        color: #FFA800;
    `;
  }
};

export const StyledRequisitionWrapper = styled.div`
  padding: 20px 0;
  .requisition-head {
    display: grid;
    grid-gap: 15px;
    grid-template-columns: ${({ role }) => role === "client" ? "max-content 1fr" : "1fr"};
    .requisition-filter {
      display: grid;
      grid-template-columns: repeat(2, max-content) 1fr;
    }
    button, a {
      padding: 9px 14px;
    }
    @media screen and (max-width: 576px) {
      grid-template-columns: 1fr;
      .requisition-filter {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
  .filter-requisition-by-status {
    grid-column-start: 1;
    grid-column-end: 6;
    @media screen and (max-width: 992px) {
      grid-column-end: 3;
    }
    @media screen and (max-width: 768px) {
      grid-column-end: 1;
    }
  }

  .requisition-table {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${({ theme }) => theme.defaultColor};
    position: relative;
    ${({ role }) => role === "client" ? "min-width: auto" : null};
    &__header, &__row {
      grid-template-columns: ${({ role }) => role !== "client" ? "100px 80px 95px minmax(200px, 1fr) 145px repeat(2, minmax(180px, 1fr)) minmax(150px, 0.75fr) 145px 110px" : "100px 100px repeat(4, 1fr) 110px"}
    }
    &__row {
      cursor: pointer;
      & > div {
        overflow-wrap: break-word;
        word-wrap: break-word;
      }
      @media screen and (max-width: 992px) {
        margin: 15px 0;
        background-color: ${({ theme }) => theme.bgElements};
        border-radius: 10px;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: ${({ role }) => role !== "client" ? `
                             'requisition-number requisition-number'
                             'date endDate'
                             'client client'
                             'payment-system status'
                             'in-count out-count'
                             'manager manager'
                             'active-btn active-btn'` 
                              : `
                             'requisition-number date'
                             'payment-system status'
                             'in-count out-count'
                             'active-btn active-btn'`};
        & > div {
          margin-bottom: 5px;
          padding-top: 20px;
          align-items: start;
          &:before {
            display: block;
          }
        }
      }
    }
    &_not-viewed {
      background-color: ${({theme}) => theme.hoverShadow};
      box-shadow: 0 -1px 0 0 rgb(0 0 0 / 25%);
      &:hover {
        background-color: ${({theme}) => theme.hoverColor};
      }
    }
    &__number {
      display: inline-flex;
    }
    &__end-date {
      span {
        max-width: 75px;
        opacity: 0.5;
      }
    }
    &__in, &__out {
      display: inline-flex;
      text-align: left;
    }
    &__status {
      display: inline-flex;
      align-items: center;
    }
    &__active {
      grid-gap: 10px;
      align-items: center;
      &:before {
        display: none !important;
      }
      @media screen and (max-width: 992px) {
        padding-top: 0 !important;
      }
    }
    .payment-system {
      align-content: center;
      &__name {
        font-weight: 700;
        //text-transform: uppercase;
      }
      &__city {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 0.4;
      }
      &__type {
        opacity: 0.75;
      }
    }
    .user {
      align-content: center;
      &__name {
        font-weight: 700;
        //text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        a:hover {
          color: ${({ theme }) => theme.defaultColor};
        }
      }
      &__email {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 0.4;
      }
      &__empty {
        opacity: 0.5;
      }
    }
    .fragment-spinner {
      padding-top: 40px;
      align-items: flex-start;
      @media screen and (max-width: 992px) {
        margin-top: 30px;
      }
    }
    .amount {
      display: inline-grid;
      grid-template-columns: 1fr auto;
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
    .icon-copy {
      padding-left: 5px;
      font-size: 12px;
      color: ${({ theme }) => theme.defaultColor};
      cursor: pointer;
    }
    @media screen and (max-width: 992px) {
      &__header {
        display: none;
      }
      min-width: auto;
      &__number {
        grid-area: requisition-number;
      }
      &__date {
        grid-area: date;
      }
      ${({ role }) => role !== "client" ? `
        &__end-date {
          grid-area: endDate;
          span {
            max-width: 100%
          }
        }
      ` : null};
      ${({ role }) => role !== "client" ? `
        &__client {
          grid-area: client;
        }
      ` : null};
      ${({ role }) => role !== "client" ? `
        &__manager {
          grid-area: manager;
        }
      ` : null};
      &__payment-system {
        grid-area: payment-system;
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
        grid-area: active-btn;
        grid-template-columns: 50%;
        justify-content: end;
      }
    }
    @media screen and (max-width: 576px) {
      &__active {
        grid-template-columns: 100%;
      }
    }
  }
`;

export const StyledRequisitionStatus = styled("div", colorStatus)`
  ${({ status }) => styleStatus(status)}
`;
