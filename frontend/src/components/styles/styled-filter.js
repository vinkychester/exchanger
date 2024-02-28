import styled from "styled-components";

export const StyledHiddenFilter = styled.div`
  display: grid;
  grid-template-columns: 100%;
  position: relative;
`;

export const StyledHiddenFilterAction = styled.div`
  display: inline-grid;
  justify-content: start;
  align-content: end;
  ${({col, counter}) => ( col && !counter  ? `
    grid-template-columns: repeat(${col}, max-content);
    grid-gap: 15px;
    ` : col && counter && `
    grid-template-columns: repeat(${col - 1}, max-content) 1fr;
    grid-gap: 15px;
    `)
  };
  .filter-btn button {
    padding: 9px 14px;
  }
  .perpage-select .custom-select {
    width: 85px;
  }
  @media screen and (max-width: 576px) {
    ${({col, counter}) => ( col && !counter  ? `
    
    ` : col && counter && `
        display: flex;
        flex-wrap: wrap;
    `)
    };
  }
`;

export const StyledFilterWrapper = styled.div`
  ${({hide}) => hide && 'height: 0'};
  ${({hide}) => hide && 'display: none'};
  ${({hide}) => hide === false ? 'animation: loadContent .15s ease' : 'animation: none'};
  margin-top: 20px;
  padding: 20px;
  border: 1px solid ${({theme}) => theme.borderElements};
  background-color: ${({theme}) => theme.bgElements};
  border-radius: 10px;
  @media screen and (max-width: 992px) {
    padding: 20px 15px;
  }
`;

export const StyledFilterTitle = styled.div`
  color: ${({theme}) => theme.defaultColor};
  font-size: 16px;
  font-weight: 700;
  opacity: 0.9;
`;

export const StyledFilterBlock = styled.div`
  margin: 5px 0 15px;
  padding: 15px;
  display: grid;
   grid-template-columns: ${({actions}) => actions ? 'max-content' : 'repeat(5, 1fr)'};
  grid-gap: 30px;
  background-color: ${({theme}) => theme.lightBg};
  border-bottom: 1px solid ${({theme}) => theme.borderElements};
  border-radius: 5px;
  .clear-filter {
    .icon-trash {
      margin-right: 10px;
    }
  }
  .input-group {
    margin-bottom: 0;
    .skeleton-label, label {
      margin-bottom: 5px;
      display: flex;
      font-size: 12px;
      font-weight: 400;
      opacity: 0.5;
    }
  }
  &:last-child {
    margin-bottom: 0;
    border: none;
  }
  @media screen and (max-width: 992px) {
    grid-gap: 15px;
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 100%;
  }
`;

export const StyledFilterIdent= styled.div`
  @media screen and (max-width: 992px) {
    display: none;
  }
`;