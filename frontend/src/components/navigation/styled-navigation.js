import styled from 'styled-components';

export const StyledNavigation = styled.nav`
    display: flex;
    z-index: 99;
`;

export const StyledMenuList = styled.ul`
    margin-left: 15px;
    display: flex;
    @media screen and (max-width: 992px) {
      width: 100%;
      margin: 0;
      padding: 10px 0;
      background-color: ${({theme}) => theme.navBarBg };
      border-top: 1px solid ${({theme}) => theme.navBarBorder};
      justify-content: space-around;
      position: fixed;
      left: 0;
      bottom: 0;
    }
    .menu-item {
      padding: 0 12px;
      @media screen and (max-width: 576px) {
        padding: 0;
      }
    }
    .menu-item:first-child {
      display: none;
      @media screen and (max-width: 992px) {
        display: flex;
      }
    }
    .login-link {
      padding-right: 0;
    }
    .account-link {
      display: none;
      @media screen and (max-width: 992px) {
        display: flex;
      }
    }
    .information-link {
      display: none;
      @media screen and (max-width: 992px) {
        display: flex;
      }
    }
`;

export const StyledMenuItem = styled.li`
    .menu-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      &__icon {
        padding: 10px 0;
        font-size: 32px;
        text-align: center;
        display: none;
        @media screen and (max-width: 992px) {
          display: flex;
          opacity: 0.75;
        }
        @media screen and (max-width: 768px) {
          font-size: 28px;
        }
        @media screen and (max-width: 576px) {
          padding: 5px 0;
        }
      }
      &__title {
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        @media screen and (max-width: 992px) {
          opacity: 0.75;
        }
        @media screen and (max-width: 768px) {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0;
          text-transform: inherit;
        }
        @media screen and (max-width: 576px) {
          font-size: 12px;
        }
      }
      &_current {
        .menu-link__icon, .menu-link__title {
          color: ${({theme}) => theme.defaultColor};
          opacity: 1;
        }
      }
      &:hover {
        color: ${({theme}) => theme.defaultColor};
        .menu-link__icon, .menu-link__title {
          opacity: 1;
        }
      }
    }
`;

export const StyledDropdownMenuItem = styled.li`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  .button-down {
    padding: 1px;
    color: ${({theme}) => theme.defaultColor};
    font-size: 12px;
    background-color: ${({theme}) => theme.hoverColor};
    border: 1px solid ${({theme}) => theme.hoverShadow};
    border-radius: 3px;
  }
  &:hover {
    color: ${({theme}) => theme.defaultColor};
  }
  @media screen and (max-width: 992px) {
    display: none;
  }
`;