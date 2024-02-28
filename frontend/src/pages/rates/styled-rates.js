import styled from 'styled-components';
import rateImage from '../../assets/images/reserve.svg'

export const StyledRatesWrapper = styled.div`
  padding: 20px 0;
  [class^='rate-icon__'], [class*='rate-icon__'] {
    display: inline-block;
    background-image: url(${rateImage});
    background-repeat: no-repeat;
  }
  .rate-icon__bank {
    width: 36px;
    height: 36px;
    background-position: 0 0;
  }
  .rate-icon__min {
    width: 10px;
    height: 16px;
    background-position: -40px 0;
  }
  .rate-icon__max {
    width: 10px;
    height: 16px;
    background-position: -40px -20px;
  }
`;

export const StyledRatesHeader = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  grid-gap: 30px;
  //align-items: center;
  @media screen and (max-width: 992px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, auto);
    grid-gap: 15px;
  }
`;

export const StyledRatesInfo = styled.div`
  opacity: 0.75;
  ul {
    line-height: 18px;
  }
  @media screen and (max-width: 992px) {
    font-size: 12px;
    ul li {
      margin-bottom: 5px;
    }
  }
  @media screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

export const StyledRatesBody = styled.div`
  padding: 15px 0;
  .rates-table {
    &__header, &__row {
      grid-template-columns: repeat(3, 1fr) repeat(2, 200px);
    }
    &_green {
      color: #1FC173;
    }
    &_red {
      color: #FF5B5B;
    }
    &__name {
      display: grid;
      grid-template-columns: 25px 1fr;
      grid-gap: 10px;
      align-items: center;
    }
    &__mobile-button {
      display: none;
    }
    &__link {
      color: ${({theme}) => theme.text};
      text-align: left;
      border: none;
      outline: none;
      &:hover {
        color: ${({theme}) => theme.defaultColor};
        text-decoration: underline;
      }
    }
    .course-container {
      display: inline-grid;
      grid-template-columns: minmax(120px, 135px) repeat(2, max-content);
      grid-gap: 5px;
      @media screen and (max-width: 992px) {
        grid-template-columns: 1fr repeat(2, max-content);
      }
      &__amount {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &__currency {
        text-align: left;
      }
    }
    .not-available {
      opacity: 0.4;
      cursor: not-allowed;
    }
    @media screen and (max-width: 992px) {
      &__row {
        margin: 15px 0;
        background-color: ${({theme}) => theme.bgElements};
        border-radius: 10px;
        grid-template-rows: auto;
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: 'name tag'
                             'change change'
                             'selling purchase'
                             'active-btn active-btn';
      }
      &__name {
        grid-area: name;
      }
      &__tag {
        grid-area: tag;
      }
      &__change {
        grid-area: change;
      }
      /*&__percent {
        grid-area: percent;
      }*/
      &__selling {
        grid-area: selling;
      }
      &__purchase {
        grid-area: purchase;
      }
      &__mobile-button {
        padding: 10px 0 0;
        grid-area: active-btn;
        display: grid;
        grid-gap: 15px;
        grid-template-columns: repeat(2, 1fr);
        &:before {
          display: none;
        }
      }
    } 
  }
`;

