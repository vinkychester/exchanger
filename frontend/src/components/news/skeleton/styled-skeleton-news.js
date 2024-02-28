import styled from "styled-components";

export const StyledSkeletonActualItem = styled.div`
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.defaultColor};
  border-radius: 10px;
  .skeleton__body {
    margin: 19px 0;
    display: grid;
    grid-template-columns: 100%;
    grid-gap: 5px;
  }
  .skeleton__footer {
    height: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

export const StyledSkeletonNewsList = styled.div`
  .skeleton-news__search label {
    margin-bottom: 0;
  }
  .skeleton-news__title h3 {
    min-height: 55px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media screen and (max-width: 992px) {
      min-height: 35px;
      span {
        height: 16px;
        &:last-child {
          display: none;
        }
      }
    }
  }
  .skeleton-news__description {
    min-height: 72px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .news-item:first-child {
    .skeleton-news__title h3 {
      height: 90px;
      span {
        height: 36px;
      }

      @media screen and (max-width: 992px) {
        height: 60px;
        span {
          height: 22px;
        }
      }
    }
  }
`;