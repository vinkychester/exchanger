import styled from "styled-components";

export const StyledWhoAreWeSection = styled.section`
  padding: 75px 0;
  background-color: ${({theme}) => theme.bgElements};
  .home-who-are-we-section__title {
    margin-bottom: 25px;
  }
  @media screen and (max-width: 992px) {
    padding: 50px 0;
  }
`;

export const StyledWhoAreWeContent = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  .home-who-are-we-section__text {
    margin-bottom: 25px;
    text-align: justify;
    line-height: 22px;
    letter-spacing: 0.1px;
    opacity: 0.9;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  .home-who-are-we-section_strong {
    color: ${({theme}) => theme.defaultColor};
    font-size: 16px;
    font-weight: 700;
    text-align: center;
  }
`;