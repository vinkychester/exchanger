import styled from 'styled-components';

export const StyledHeader = styled.header`
  width: 100%;
  height: 95px;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;
  transition: all .3s ease;
  ${({fixed, theme}) => fixed && `
    .header__content {
      height: 55px;
      transition: all .2s ease;
      @media screen and (max-width: 992px) {
        height: 95px;
      }
    }
    .header__wrapper {
      background-color: ${theme.body};
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 15%);
    }
  `};
  @media screen and (max-width: 992px) {
    position: static;
  }
`;

export const StyledHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledHeaderContent = styled.div`
  max-width: 1140px;
  width: 100%;
  height: 95px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: all .3s ease;

`;