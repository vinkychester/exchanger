import styled from 'styled-components';

export const StyledScrollTable = styled.div`
  overflow: auto;
  overflow-scrolling: touch;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    height: 9px;
    background-color: ${({theme}) => theme.bgElements};
    border-radius: 20px;
  }
  &::-webkit-scrollbar-track{
    background: ${({theme}) => theme.hoverShadow};
    border-radius: 20px;
  }
  &::-webkit-scrollbar-thumb {
    height: 15px;
    background-color: ${({theme}) => theme.defaultColor};
    border: 2px solid ${({theme}) => theme.hoverShadow};
    border-radius: 12px;
  }
`;

export const StyledTable = styled.div`
  padding-bottom: 15px;
  ${({width}) => width && `min-width: ${width}px`}; 
  ${({width}) => width && 'width: 100%'}; 
  ${({width}) => width && 'overflow-x: hidden;'}; 
`;

export const StyledTableHeader = styled.div`
  padding: 12px 10px;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(${({col}) => col}, 150px);
  grid-gap: 15px;
  @media screen and (max-width: 992px) {
    display: ${({scroll}) => scroll === 'auto' ? 'grid' : 'none'};
  }
`;

export const StyledColHead = styled.div`
  font-weight: 700;
`;

export const StyledTableBody = styled.div``;

export const StyledRow = styled.div`
  padding: 12px 10px;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(${({col}) => col}, 150px);
  grid-column-gap: 15px;
  &:nth-child(2n) {
    background-color: ${({theme}) => theme.bgElements};
  }
  &:hover {
    background-color: ${({theme}) => theme.hoverColor};
  }
  @media screen and (max-width: 992px) {
    grid-template-rows: ${({scroll}) => scroll === 'auto' ? '1fr' : `repeat(${({col}) => col}, minmax(50px, auto))`};
    grid-template-columns: ${({scroll}) => scroll === 'auto' ? `repeat(${({col}) => col}, 150px)` : '1fr'};
    grid-row-gap: 10px;
    ${({scroll}) => scroll && `
       & > div {
        margin-bottom: inherit;
        padding-top: inherit;
         &:before {display: none}; 
        }
    `}; 
  }
`;

export const StyledCol = styled.div`
  align-items: center;
  position: relative;
  display: ${({ inline }) => inline ? "inline-flex" : "grid"};
  &:before {
    content: attr(data-title)':';
    font-size: 11px;
    letter-spacing: 0.4px;
    opacity: .5;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    @media screen and (max-width: 992px) {
      display: block;
    }
  }
  @media screen and (max-width: 992px) {
      margin-bottom: 5px;
      padding-top: 20px;
      align-items: start;
    }
`;