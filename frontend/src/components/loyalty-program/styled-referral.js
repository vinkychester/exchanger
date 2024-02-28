import styled from "styled-components";

export const StyledReferralWrapper = styled.div`
  padding: 20px 0;
  .referral-list-table {
    &__head, &__row {
      grid-template-columns: 75px 150px 1fr;
      @media screen and (max-width: 576px) {
        grid-template-columns: 1fr;
      }
    }
  }
  .referral-payout-table {
    &__head, &__row {
      grid-template-columns: repeat(2, minmax(100px, 1fr)) 350px 125px;
      @media screen and (max-width: 768px) {
        grid-template-columns: 100%;
      }
    }
    &__message p{
      //max-width: 350px;
      //width: 100%;
      //overflow-wrap: break-word;
      //word-wrap: break-word;
      width: 100%;
      overflow-wrap: break-word;
    }
  }
`;

export const StyledReferralInfo = styled.div`
  .referral-statistics {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;
    &__label {
      font-weight: 400;
    }
    @media screen and (max-width: 576px) {
      padding: 15px;
      background-color: ${({ theme }) => theme.bgElements};
      border: 1px solid ${({ theme }) => theme.navBarBorder};
      border-radius: 10px;
    }
  }`;

export const StyledReferralStatisticsWrapper = styled.div`
  min-height: 225px;
  display: grid;
  grid-template-columns: 100%;
  align-items: center;
`;

export const StyledReferralStatistics = styled.div`
  padding: 15px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  border-bottom: 1px solid ${({theme}) => theme.borderElements};
  @media screen and (max-width: 576px) {
    padding: 15px 0;
    grid-template-columns: 1fr;
    grid-gap: 15px;
    border-bottom: none;
  }
`;

export const StyledCashbackBalance = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid ${({theme}) => theme.borderElements};
  .icon-star-solid, .icon-star-regular {
    color: ${({ theme }) => theme.defaultColor};
    &:not(:last-child) {
      margin-right: 3px;
    }
  }
`;

export const StyledReferralBalance = styled.div`
  padding-top: 30px;
  .referral-balance {
    &__icon {
      margin-right: 10px;
    }
    @media screen and (max-width: 576px) {
      padding: 15px;
      background-color: ${({ theme }) => theme.hoverColor};
      border: 1px solid ${({ theme }) => theme.defaultColor};
      border-radius: 10px;
    }
  }
  
  .referral-payout-form {
    margin-top: 30px;
    padding: 15px;
    &__title {
      padding-bottom: 20px;
      font-size: 22px;
    }
    &__content {
      display: grid;
      grid-gap: 15px;
      @media screen and (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }
    &__field {
      margin-bottom: 0;
    }
    &__action {
      text-align: center;
    }
    label {
      font-size: 14px;
      display: inline-flex;
    }
    @media screen and (max-width: 576px) {
      margin-top: 15px;
    }
  }
`;

export const StyledReferralBanners = styled.div`
  .banners-tab {
    margin-top: 15px;
    border: none;
    .rc-tabs-nav-list {
      display: grid;
      grid-template-columns: repeat(5, 70px);
      @media screen and (max-width: 576px) {
        grid-template-columns: repeat(5, 60px);
      }
      @media screen and (max-width: 320px) {
        grid-template-columns: repeat(5, 58px);
      }
    }
    .rc-tabs-tab-active {
      font-weight: 700 !important;
      background-color: ${({ theme }) => theme.bgElements} !important;
    }
    .rc-tabs-tab-btn {
      margin: 0 auto;
    }
    .rc-tabs-ink-bar {
      display: none;
    }
  }
  .image-container {
    min-height: 182px;
    padding: 15px 15px 0;
    display: flex;
    flex-wrap: wrap;
    background-color: ${({ theme }) => theme.bgElements};
    &__item {
      margin-right: 15px;
      margin-bottom: 15px;
      display: inline-flex;
      img {
        width: 100%;
        height: 100%;
        object-position: center;
        object-fit: contain;
        cursor: pointer;
      }
    }
    &_current {
      box-shadow: 0 0 0 3px ${({ theme }) => theme.defaultColor};
    }
  }
`;