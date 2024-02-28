import styled from 'styled-components';

export const StyledUserCard = styled.div`
  padding: 0 15px;
  background-color: ${({theme}) => theme.bgElements};
  border: 1px solid ${({theme}) => theme.borderElements};
  border-radius: 10px;
`;

export const StyledCardHeader = styled.div`
  padding: 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;  
  border-bottom: 1px solid ${({theme}) => theme.defaultColor};
  h4 {
    font-size: 16px;
    text-transform: capitalize;
    ${({isDeleted}) => isDeleted && `
      a { text-decoration: line-through }
    `};
    a:hover {
      color: ${({theme}) => theme.defaultColor};
    }
  }
  .icon-ban {
    padding-left: 5px;
    font-size: 18px;
    color: #FF5B5B;
  }
`;

export const StyledCardBody = styled.div`
  padding: 15px 0;
  ${({isDeleted}) => isDeleted && 'opacity: 0.3'};
`;

export const StyledDropdownButton = styled.button`
  padding: 2px 8px;
  color: ${({theme}) => theme.text};
  font-size: 22px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 5px;
  outline: none;
  &:hover {
    color: ${({theme}) => theme.defaultColor};
    background-color: ${({theme}) => theme.hoverColor};
    border-color: ${({theme}) => theme.hoverShadow};
  }
  &:active {
    transform: scale(0.98);
  }
`;

export const StyledMenuLink = styled.button`
  width: 100%;
  padding: 5px 10px;
  color: ${({theme}) => theme.text};
  font-size: 14px;
  display: flex;
  background-color: transparent;
  border: none;
  outline: none;
`;