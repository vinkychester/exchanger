import styled from "styled-components";

export const StyledAboutSection = styled.section`
  padding: 75px 0 0;
  background-color: ${({theme}) => theme.bgElements};
  .home-about-section__title {
    margin-bottom: 25px;
  }
  @media screen and (max-width: 992px) {
    padding: 50px 0;
  }
`;

export const StyledAboutContent = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  .home-about-preview__text {
    margin-bottom: 25px;
    text-align: justify;
    line-height: 22px;
    letter-spacing: 0.1px;
    opacity: 0.9;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  .home-about-preview__footer {
    padding-top: 40px;
    text-align: center;
  }
`;