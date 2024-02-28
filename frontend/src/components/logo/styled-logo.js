import styled from "styled-components";
import christmasHat from "../../assets/images/christmas-hat.svg";

const christmasLogo = () => {
  return `
    .logo-icon {
      position: relative;
      &:before {
        content: '';
        width: 36px;
        height: 31px;
        background-image: url('${christmasHat}');
        background-position: center center;
        background-size: cover;
        position: absolute;
        top: -5px;
        left: -8px;
        @keyframes christmas-anim {
          0% {
            top: -3px;
            left: -15px
          }
          50% {
            top: -100px;
            left: -15px;
            opacity: 0;
          }
          75% {
            top: 100px;
            left: 22px;
            opacity: 0;
            transform: rotate(180deg);
          }
          90% {
            top: 27px;
            left: 22px;
            opacity: 1;
            transform: rotate(180deg);
          }
          100% {
            top: 28px;
            left: 22px;
            opacity: 1;
            transform: rotate(180deg);
          }
        }
      }
    }
    &:hover {
      .logo-icon {
        &:before {
          animation: christmas-anim 1s ease forwards;
        }
      }
    }`;
};


export const StyledLogo = styled.div`
  display: inline-flex;
  &:hover {
    .logo-icon img {
      transform: rotate(180deg);
    }
    .site-title {
      transform: scale(1.02);
    }
  }
  ${({christmas}) => christmas && christmasLogo};
  ${({fixed}) => fixed && `
    .logo-icon {
      img {
        width: 35px;
        @media screen and (max-width: 992px) {
          width: 100%;
        }
      }
    }
    .logo-shadow:after {
      width: 20px;
      height: 20px;
      @media screen and (max-width: 992px) {
        width: 35px;
        height: 35px;
      }
    }
    .site-title {
      visibility: hidden;
      opacity: 0;
      display: none;
    }
  `};
`;

export const StyledLogoShadow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .3s ease;
  position: relative;
  &:after {
    content: '';
    width: 35px;
    height: 35px;
    border-radius: 20px;
    box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.25);
    position: absolute;
    left: 8px;
    transition: all .3s ease;
  }
`;

export const StyledLogoIcon = styled.div`
  width: 50px;
  height: 55px;
  z-index: 1;
  img {
    transition: all .3s ease;
  }
`;

export const SiteTitle = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
  @media screen and (max-width: 576px) {
    display: none;
  }
`;

export const SiteName = styled.h3`
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 3px;
  line-height: 35px;
  text-transform: uppercase;
`;
export const SiteDescription = styled.p`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2px;
`;