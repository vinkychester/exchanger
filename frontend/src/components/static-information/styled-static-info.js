import styled from "styled-components";

export const StaticInfoWrapper = styled.div`
  padding: 20px 0;
  hr {
    margin: 20px 0;
  }
`;

export const StaticInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 256px auto;
  grid-gap: 30px;
  grid-template-areas: 'navigation document';
  @media screen and (max-width: 992px) {
    grid-template-columns: 100%;
    grid-template-areas: 'navigation'
                         'document';
  }
`;

export const StaticInfoNavigation = styled.div`
  height: 100vh;
  grid-area: navigation;
  position: sticky;
  top: 75px;
  left: 0;
  @media screen and (max-width: 992px) {
    height: 100%;
    position: relative;
    top: 0;
  }
`;

export const StaticInfoNavItem = styled.div`
  a {
    padding: 7px 0;
    display: block;
    position: relative;
    opacity: 0.4;
    &:hover {
      opacity: 1;
    }
  }
  a.active {
    opacity: 1;
    &:after {
      content: '';
      width: 3px;
      height: 100%;
      background-color: ${({theme}) => theme.defaultColor};
      position: absolute;
      top: 0;
      right: 0;
    }
  }
`;

export const StaticInfoContent = styled.div`
  ${({width}) => width && `
    width: ${width}px;
    margin: 0 auto;
  `};
  max-width: 100%;
  grid-area: document;
  ul, p {
    text-align: justify;
  }
  p {
    text-indent: 22px;
  }
`;