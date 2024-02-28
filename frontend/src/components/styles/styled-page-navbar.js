import styled from 'styled-components';

export const StyledPageNavbar = styled.div`
   ${({mt}) => mt && `margin-top: ${mt}px`};
   width: 100%;
   padding: 15px 0;
   display: grid;
   grid-template-rows: repeat(auto-fill, 40px);
   background-color: ${({theme}) => theme.bgElements};
   border: 1px solid ${({theme}) => theme.borderElements};
   border-radius: 12px;
   @media screen and (max-width: 992px) {
    margin-top: 0;
  }
`;

export const StyledPageNavbarItem = styled.div`
  padding: 0 15px;
  .page-navbar-link {
    color: ${({theme}) => theme.text};
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
export const StyledPageNavbarLink = styled.button`
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 8px;
  outline: none;
  opacity: 0.75;
`;