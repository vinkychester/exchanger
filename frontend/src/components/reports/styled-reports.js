import styled from "styled-components";

export const StyledReportsWrapper = styled.div`
  .reports-title {
    margin: 0;
    padding: 20px 0;
  }
  .reports-breadcrumb {
    padding-bottom: 20px;
  }
  .requisition-table_manager {
    margin-top: 0;
    padding: 0;
    border: none;
    &__header, &__row {
     grid-template-columns: 100px 100px repeat(5, 1fr) 110px
    }
    @media screen and (max-width: 992px) {
      &__row {
        grid-template-areas: "requisition-number date"
                             "client client"
                             "payment-system status"
                             "in-count out-count"
                             "active-btn active-btn";
      }
    }
  }
`;

export const StyledReportStatistics = styled.div`
  padding-top: 20px;
  .report-statistic__top {
    border-bottom: 1px solid ${({theme}) => theme.defaultColor};;
    padding-bottom: 15px;
    margin-bottom: 15px;
    .report-statistic__data {
      padding-bottom: 5px;
      span {
        color: ${({theme}) => theme.defaultColor};
        font-weight: 700;
      }
      &:last-child {
        padding-bottom: 0;
      }
    }
  }
  .report-statistic__content {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 1fr;
    grid-gap: 15px;
    .stat-item_skeleton-content {
      display: flex;
      & > div {
        margin-right: 5px;
      }
    }
    @media screen and (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media screen and (max-width: 576px) {
      grid-template-columns: 100%;
    }
  }
`;

export const StyledReportStatItem = styled.div`
  padding: 15px;
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-gap: 15px;
  background-color: ${({theme}) => theme.hoverColor};
  border: 1px solid ${({theme}) => theme.hoverShadow};
  border-radius: 10px;
  .stat-item__icon {
    width: 40px;
    height: 40px;
    color: ${({theme}) => theme.defaultColor};
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid ${({theme}) => theme.defaultColor};
    border-radius: 50%;
  }
  .stat-item__content {
    span {
      color: ${({theme}) => theme.defaultColor};
      font-weight: 700;
    }
  }
`;

export const StyledReportClientsWrapper = styled.div`
  padding-top: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;
  .is-verified {
    padding-left: 5px;
    color: #FF5B5B;
  }
  .manager-card {
    &__cities span {
      margin: 0 5px 5px 0;
      padding: 0 5px;
      display: inline-flex;
      background-color: ${({theme}) => theme.hoverColor};
      border: 1px solid ${({theme}) => theme.hoverShadow};
      border-radius: 3px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  
  @media screen and (max-width: 1366px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledTrafficWrapper = styled.div`
  .hidden-create-traffic-form {
    margin: 0 0 15px;
    &__action {
      display: grid;
      grid-template-columns: repeat(2, max-content);
      grid-gap: 15px;
      @media screen and (max-width: 480px) {
        grid-template-columns: 100%;
      }
    }
  }
  
  .create-traffic-form {
    margin: 20px 0 0;
    padding: 20px;
    background-color: ${({theme}) => theme.bgElements};
    border-color: ${({theme}) => theme.borderElements};
    &__content {
      display: grid;
      grid-gap: 15px;
      grid-template-columns: 30%;
      @media screen and (max-width: 992px) {
        grid-template-columns: 100%;
      }
    }
  }

  .traffic-list-table {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${({theme}) => theme.defaultColor};
    &__head, &__row {
      grid-template-columns: minmax(75px, 1.25fr) repeat(5, 1fr) minmax(100px, 360px) 100px;
      @media screen and (max-width: 1200px) {
        grid-template-columns: minmax(75px, 1.25fr) repeat(5, 1fr) minmax(100px, 290px) 100px;
      }
    }
    &__action {
      padding: 0;
      grid-gap: 10px;
      align-items: center;
      &:before {
        display: none;
      }
    }
    @media screen and (max-width: 992px) {
      &__row {
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: 'website website'
                             'count-clicks count-register'
                             'count-requisitions count-requisitions'
                             'system-profit clean-profit'
                             'link link'
                             'action action';
      }
      &__website {
        grid-area: website;
      }
      &__count-clicks {
        grid-area: count-clicks;
      }
      &__count-register {
        grid-area: count-register;
      }
      &__count-requisitions {
        grid-area: count-requisitions;
      }
      &__system-profit {
        grid-area: system-profit;
      }
      &__clean-profit {
        grid-area: clean-profit;
      }
      &__link {
        grid-area: link;
      }
      &__action {
        grid-area: action;
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media screen and (max-width: 480px) {
      &__row {
        grid-template-columns: 100%;
        grid-template-areas: 'website'
                           'count-clicks'
                           'count-register'
                           'count-requisitions'
                           'count-requisitions'
                           'system-profit'
                           'clean-profit'
                           'link'
                           'action';
      }
    }
  }
  .traffic-link {
    display: grid;
    grid-template-columns: 45px 1fr;
    grid-gap: 15px;
    align-items: start;
    &__url {
      max-width: 300px;
      width: 100%;
      color: ${({theme}) => theme.defaultColor};
      overflow-wrap: break-word;
      word-wrap: break-word;
      cursor: pointer;
      @media screen and (max-width: 1200px) {
        max-width: 210px;
      }
      @media screen and (max-width: 992px) {
        max-width: 882px;
      }
      @media screen and (max-width: 576px) {
        max-width: 466px;
      }
      @media screen and (max-width: 480px) {
        max-width: 270px;
      }
    }
  }
`;

export const StyledTrafficDetailsWrapper = styled.div`
  .traffic-details__title {
    margin: 0;
    padding: 20px 0;
  }
  .traffic-details-table {
    padding-top: 15px;
  }
  .traffic-details__breadcrumb {
    padding: 15px 0;
  }
  .traffic-details__requisitions {
    padding: 0;
  }
`;

export const StyledTrafficClientsWrapper = styled.div`
  .client-title {
    margin: 0;
    padding: 20px 0;
  }
  .clients-breadcrumb {
    padding: 15px 0;
  }
`;