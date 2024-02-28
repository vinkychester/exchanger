import styled from "styled-components";

export const StyledUsefulSection = styled.section`
  padding: 50px 0;
  .home-useful-section__title {
    margin-bottom: 25px;
  }
`;

export const StyledUsefulContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  grid-template-areas: 'content0 content0'
                       'content1 content2'
                       'content3 content4'
                       'content5 content6'
                       'content7 content7';
  .home-useful-content-0 {
    grid-area: content0;
  }
  .home-useful-content-1 {
    grid-area: content1;
  }
  .home-useful-content-2 {
    grid-area: content2;
  }
  .home-useful-content-3 {
    grid-area: content3;
  }
  .home-useful-content-4 {
    grid-area: content4;
  }
  .home-useful-content-5 {
    grid-area: content5;
  }
  .home-useful-content-6 {
    grid-area: content6;
  }
  .home-useful-content-7 {
    grid-area: content7;
    &__list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      @media screen and (max-width: 576px) {
        grid-template-columns: 100%;
      }
    }
  }
  @media screen and (max-width: 992px) {
    grid-gap: 15px;
  }
  @media screen and (max-width: 576px) {
    grid-template-columns: 100%;
    grid-template-areas: 'content0'
                         'content1'
                         'content2'
                         'content3'
                         'content4'
                         'content5'
                         'content6'
                         'content7';
  }
`;

export const StyledUsefulContentBlock = styled.div`
  h3 {
    padding-bottom: 20px;
    color: ${({theme}) => theme.defaultColor};
    font-size: 16px;
    @media screen and (max-width: 576px) {
      font-size: 14px;
    }
  }
  ul, ol, p {
    margin-bottom: 15px;
    line-height: 22px;
    opacity: 0.9;
    &:last-child {
      margin-bottom: 0;
    }
  }
  strong {
    font-weight: 400;
  }
  @media screen and (max-width: 576px) {
    p {
      text-align: justify;
    }
  }
`;