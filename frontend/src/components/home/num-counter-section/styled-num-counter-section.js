import styled from "styled-components";

export const StyledCounterWrapper = styled.section`
  padding: 50px 0;
  color: #fff;
  background: linear-gradient(90deg, #EA5400 0%, #F28C3C 100%);
`;

export const StyledCounterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 30px;
  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledCounterItem = styled.div`
  display: grid;
  grid-template-columns: 100%;
  justify-content: center;
  grid-gap: 15px;
  text-align: center;
  font-size: 16px;
  &:hover {
    .counter-item__num img {
      animation: ${({animation}) => animation && animation} 0.75s ease;
    }
  }
  .counter-item__center {
    font-size: 48px;
    line-height: 40px;
  }
  .counter-item__num {
    min-width: 85px;
    display: inline-grid;
    position: relative;
    .counter-item__img {
      width: 40px;
      height: 40px;
      position: absolute;
      left: -55px;
      transition: all .3s ease;
    }
  }

  @keyframes exchange {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.1);
    }
    50% {
      transform: scale(1);
    }
    75% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes client {
    0% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(35deg);
    }
    50% {
      transform: rotate(-35deg);
    }
    75% {
      transform: rotate(35deg);
    }
    100% {
      transform: rotate(0);
    }
  }

  @keyframes finance {
    0% {
      transform: skew(0deg, 0deg) translateY(0);
    }
    15% {
      transform: skew(-10deg, 0deg) translateY(-1px);
    }
    30% {
      transform: skew(-10deg, 0deg) translateY(1px);
    }
    45% {
      transform: skew(-10deg, 0deg) translateY(-1px);
    }
    60% {
      transform: skew(-10deg, 0deg) translateY(1px);
    }
    75% {
      transform: skew(-10deg, 0deg) translateY(-1px);
    }
    100% {
      transform: skew(0deg, 0deg) translateY(0);
    }
  }

  @keyframes coin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;