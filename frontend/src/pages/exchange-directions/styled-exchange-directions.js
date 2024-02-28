import styled from "styled-components";
import rateImage from '../../assets/images/reserve.svg'
import card from "../../assets/images/exchange-directions/card.svg"
import monob from "../../assets/images/exchange-directions/monob.svg"
import p24 from "../../assets/images/exchange-directions/p24.svg"
import cash from "../../assets/images/exchange-directions/cash.svg"

export const StyledExchangeDirectionsWrapper = styled.div`
  padding-top: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
  grid-gap: 30px;
  .exchange-direction-item {
    padding: 30px;
    border-radius: 15px;
    background-color: ${({theme}) => theme.navBarBg};
    border: 1px solid ${({theme}) => theme.navBarBorder};
    transition: all .3s ease;
    &__title {
      padding: 20px 0 0;
      color: ${({theme}) => theme.defaultColor};
      font-size: 18px;
      font-weight: 700;
      text-align: center;
    }
    &__icon {
      width: 120px;
      height: 120px;
      margin: 0 auto;
      background-image: url(${card});
      background-repeat: no-repeat;
      background-size: 100px;
      background-position: center center;
      border: 1px solid ${({theme}) => theme.defaultColor};
      background-color: ${({theme}) => theme.hoverShadow};
      border-radius: 10px;
      @media screen and (max-width: 992px) {
        width: 75px;
        height: 75px;
        background-size: 50px;
      }
    }
    &_p24 {
      background-image: url(${p24});
    }
    &_monob {
      background-image: url(${monob});
    }
    &_cash {
      background-image: url(${cash});
    }
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

export const StyledExchangeDirectionsRates = styled.div`
  padding: 30px 0;
  .direction-title {
    margin-bottom: 20px;
  }
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