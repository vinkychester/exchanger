import styled from "styled-components";

export const StyledReviewsWrapper = styled.div`
  padding: 20px 0;
  .reviews-title {
    span {
      text-transform: none;
      @media screen and (max-width: 350px) {
        display: none;
      }
    }
  }
  .hidden-send-reviews-form {
    margin: 0 0 30px;
  }
  .send-reviews-form {
    margin-top: 20px;
    padding: 20px;
    &__title {
      padding-bottom: 15px;
    }
    &__footer {
      display: grid;
      justify-content: end;
    }
  }
`;

export const StyledReviewsBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  grid-gap: 30px;
/*  .reviews-site__content {
    padding-top: 30px;
  }*/
  @media screen and (max-width: 992px) {
    grid-template-columns: 100%;
    grid-template-areas: "internet"
                         "site";
    .reviews-site {
      grid-area: site;
    }
    .reviews-internet {
      grid-area: internet;
    }
  }
`;

export const StyledReviewsSite = styled.div`

`;
export const StyledReviewsInternet = styled.div`
  .reviews-internet-content {
    margin-top: 20px;
    padding: 15px;
    background: ${({ theme }) => theme.bgElements};
    border: 1px solid ${({ theme }) => theme.borderElements};
    border-radius: 10px;
    ul.alice-carousel__stage {
      display: flex;
      flex-direction: column;
      li.alice-carousel__stage-item {
        width: 100% !important;
        border-bottom: 1px solid ${({ theme }) => theme.borderElements};
        .reviews-internet-content__item {
          padding: 15px 0;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        &:last-child {
          border: none;
        }
      }
      @media screen and (min-width: 992px) {
        transform: translate3d(0px, 0px, 0px) !important;
      }
      @media screen and (max-width: 992px) {
        display: inherit;
        li.alice-carousel__stage-item {
          border: none;
          width: 50% !important;
          display: inline-block;
          text-align: center;
        }
      }
      @media screen and (max-width: 768px) {
        display: inherit;
        li.alice-carousel__stage-item {
          width: 100% !important;
          text-align: center;
        }
      }
    }
    
    ul.alice-carousel__dots {
      margin: 0;
      display: none;
      li.alice-carousel__dots-item {
        background-color: ${({ theme }) => theme.defaultColor};
        opacity: 0.4;
      }
      li.__active {
        background-color: ${({ theme }) => theme.defaultColor};
        opacity: 1;
      }
      @media screen and (max-width: 992px) {
        display: block;
      }
    }
    .alice-carousel__prev-btn, .alice-carousel__next-btn {
      width: 30px;
      height: 30px;
      margin-top: -15px;
      padding: 0;
      color: ${({theme}) => theme.defaultColor};
      display: none;
      justify-content: center;
      align-items: center;
      background-color: ${({theme}) => theme.hoverColor};
      border: 1px solid ${({theme}) => theme.hoverShadow};
      border-radius: 3px;
      position: absolute;
      top: 50%;
      @media screen and (max-width: 992px) {
        display: flex;
      }
      @media screen and (max-width: 576px) {
        display: none;
      }
    }
    .alice-carousel__prev-btn {
      left: 0;
    }
    .alice-carousel__next-btn {
      right: 0;
    }
  }
`;

export const StyledReviewsPost = styled.div`
  margin-bottom: 30px;
  padding: 30px 40px;
  border: 1px solid ${({ theme }) => theme.defaultColor};
  border-radius: 10px;
  &:last-child {
    margin-bottom: 0;
  }
  @media screen and (max-width: 992px) {
    margin-bottom: 15px;
  }
`;

export const StyledReviewsPostContent = styled.div`
  padding: 45px 0 15px;
  position: relative;
  white-space: pre-wrap;
  &:before {
    content: '\\e935';
    font-size: 30px;
    font-family: 'theme-icon', serif;
    opacity: 0.1;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export const StyledReviewsPostAuthor = styled.div`
  display: flex;
  justify-content: space-between;
  p {
    opacity: 0.4;
  }
`;