import styled from "styled-components";
import ufo from "../../assets/images/ufo.svg";
import arrowTop from "../../assets/images/arrow-top.svg";

export const StyledBackToTop = styled.div`
  width: 70px;
  height: 70px;
  position: fixed;
  bottom: 70px;
  right: 35px;
  transition: all .3s ease;
  ${({show}) => show ? 'opacity: 1; visibility: visible;' : 'opacity: 0; visibility: hidden;'};
  @media screen and (max-width: 992px) {
    width: 50px;
    height: 50px;
    bottom: 96px;
    right: 50%;
    transform: translateX(25px);
  }
`;

export const StyledUfoImage = styled.button`
  width: 70px;
  height: 70px;
  background-image: url(${ufo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50%;
  border: none;
  outline: none;
  position: relative;
  transition: all .3s ease;
  animation: fly 3s ease infinite;
  @media screen and (max-width: 992px) {
    width: 50px;
    height: 50px;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
  &:before {
    content: '';
    width: 26px;
    height: 30px;
    background-image: url(${arrowTop});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50%;
    position: absolute;
    top: -32px;
    left: 50%;
    transform: translateX(-13px);
    transition: all .3s ease;
    opacity: 0;
    visibility: hidden;
    @media screen and (max-width: 992px) {
      width: 20px;
      height: 24px;
      top: -26px;
    }
  }
  &:hover {
    &:before {
      opacity: 1;
      visibility: visible;
      transform: translateX(-10px) translateY(-10px);
    }
  }
  &:focus {
    transition: all .3s ease;
    animation: activeFly 2s ease;
  }

  @keyframes fly {
    0% {
      transform: scale(1) rotate(2deg);
    }
    50% {
      transform: scale(1.03) rotate(-2deg);
    }
    100% {
      transform: scale(1) rotate(2deg);
    }
  }

  @keyframes activeFly {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-600px);
      opacity: 0;
    }
  }
`;