import styled from 'styled-components'

export const StyledDropdownMenu = styled.div`
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-gap: 15px;
  grid-template-areas: 'info crypto'
                       'document crypto';
  background-color: ${({theme}) => theme.bgElements};
  border: 1px solid ${({theme}) => theme.borderElements};
  .info-menu {
    grid-area: info;
  }
  .document-menu {
    grid-area: document;
  }
  .crypto-menu {
    grid-area: crypto;
  }
  @media screen and (max-width: 992px) {
    display: none;
  }
`;

export const StyledInfoMenuWrapper = styled.div`
  .info-menu__title {
    padding-bottom: 10px;
    color: ${({theme}) => theme.defaultColor};
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    opacity: 0.35;
    
  }
  .info-menu-link {
    padding: 5px 0;
    font-family: 'Open Sans',serif;
    display: inline-flex;
    line-height: 35px;
    &__title {
      font-size: 16px;
      font-weight: 600;
      opacity: 0.85;
    }
    &:hover {
      .info-menu-link__title {
        color: ${({theme}) => theme.defaultColor};
      }
    }
  }
  .crypto-list {
    &__title {
      padding-left: 15px;
      position: relative;
      &:before {
        content: '';
        width: 8px;
        height: 8px;
        margin-top: -4px;
        background-color: ${({theme}) => theme.defaultColor};
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 0;
      }
    }
  }
  .info-menu-link_current {
    .info-menu-link__title {
      color: ${({theme}) => theme.defaultColor};
      opacity: 1;
    }
  }
`;

export const StyledInfoMenuList = styled.ul``;

export const StyledInfoMenuItem= styled.li`
  .info-menu-link {
    display: inline-grid;
    grid-template-columns: 35px 1fr;
    grid-gap: 10px;
    align-items: center;
    &__icon {
      height: 35px;
      width: 35px;
      color: ${({theme}) => theme.defaultColor};
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${({theme}) => theme.hoverColor};
      border: 1px solid ${({theme}) => theme.hoverShadow};
      border-radius: 5px;
    }
  }
`;