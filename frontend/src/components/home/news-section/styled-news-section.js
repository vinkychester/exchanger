import styled from "styled-components";

export const StyledNewsSection = styled.section`
  padding: 50px 0;
  .home-news-section__title {
    margin-bottom: 25px;
  }
  .home-news-section__content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 350px));
    grid-gap: 30px;
    .actual-news {
      margin-bottom: 0;
      &__body p {
        height: 66px;
      }
    }
    @media screen and (max-width: 992px) {
      grid-template-columns: 100%;
      grid-gap: 15px;
    }
  }
`;