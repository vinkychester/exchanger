import styled from "styled-components";

export const StyledShowSidebar = styled.div`
  padding-left: 12px;
  cursor: pointer;
  &:hover {
    color: ${({theme}) => theme.defaultColor};
  }
  .sidebar-btn__icon {
    font-size: 21px;
    display: none;
    @media screen and (max-width: 992px) {
      display: inline-flex;
    }
  }
  .sidebar-btn__title {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    @media screen and (max-width: 992px) {
      display: none;
    }
  }
`;

export const StyledSidebar = styled.div`
  height: 100%;
`;

export const StyledAccount = styled.div`
  margin-bottom: 20px;
  padding: 35px 15px 25px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(32, 32, 32, .2);
  background-color: ${({theme}) => theme.bgElements};
  .user {
    width: 100%;
    &__name {
      font-size: 16px;
      font-weight: 700;
      text-transform: capitalize;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    } 
    &__email {
      font-size: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      opacity: 0.5;
    }
  }
  .sidebar-account__settings {
    padding: 5px 0;
    .settings-link {
      font-size: 16px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      opacity: 0.75;
      &:hover {
       color: ${({theme}) => theme.defaultColor};
       transition: all .3s ease;
       transform: rotate(180deg);
      }
    }
  }
`;

export const StyledSidebarItem = styled.div`
  padding: 0 15px;
  .sidebar-link {
    color: ${({theme}) => theme.text};
    &__icon {
      width: 25px;
      font-size: 16px;
      text-align: center;
    }
    &__title {
      padding-left: 10px;
    }
    &:hover {
      color: ${({theme}) => theme.defaultColor};
      opacity: 1;
    }
    &_current {
      color: ${({theme}) => theme.defaultColor};
      background-color: ${({theme}) => theme.body};
      opacity: 1;
    }
  }
`;

export const SidebarLink = styled.button`
  width: 100%;
  padding: 10px 5px;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 8px;
  outline: none;
  opacity: 0.75;
`;

export const StyledLoadingSidebar = styled.div`
  .loading-sidebar {
    position: relative;
    ${({type}) => type === 'error' ? `
        color: #FF5B5B;
        text-decoration: line-through` : null};
    &:hover {
      opacity: 0.55;
      cursor: wait;
    }
  }
  .loading-sidebar__icon {
    width: 21px;
    height: 24px;
    padding-top: 2px;
    display: inline-flex;
    position: absolute;
    right: -25px;
    & > div {
      margin: 0;
    }
    @media screen and (max-width: 992px) {
      position: static;
    }
  }
`;

export const StyledItemWithBadge = styled.div`
  position: relative;
`;