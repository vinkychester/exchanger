import styled from "styled-components";

export const StyledNewsWrapper = styled.div`
  padding: 20px 0;
`;

export const StyledNewsContainer = styled.div``;

export const StyledNewsItem = styled.div`
  height: 300px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 440px;
  grid-template-areas: 'info img';
  border: 1px solid ${({ theme }) => theme.defaultColor};
  border-radius: 10px;
  overflow: hidden;

  .news-item__info {
    margin: 30px 40px;
    grid-area: info;
  }
  
  .news-item__image {
    grid-area: img;
    a {
      display: flex;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
  }

  .article {
    display: grid;
    grid-template-rows: 30px 1fr 45px;
    &__content {
      overflow: hidden;
    }
    &__date {
      padding-bottom: 5px;
      opacity: 0.5;
    }
    &__title h3 {
      margin-bottom: 15px;
      font-size: 22px;
      line-height: 28px;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      &:hover {
        color: ${({ theme }) => theme.defaultColor};
      }
    }
    &__description {
      * {
        font-size: 14px;
        font-weight: 400;
      }
      p {
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        strong {
          font-weight: 400;
        }
        &:not(:first-child) {
          display: none;
        }
      }
    }
    &__action {
      .article__details-btn {
        padding: 11px 30px;
      }
    }
  }

  &:first-child {
    height: 460px;
    display: block;
    border: none;
    position: relative;

    .news-item__info {
      margin: 0;
      padding: 40px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      position: relative;
      z-index: 10;
    }

    .news-item__image {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 5;
      transition: all .3s ease-in-out;
      &:before {
        content: '';
        width: 100%;
        height: 100%;
        background: linear-gradient(-180deg,transparent 0,rgba(0,0,0,.55) 100%);
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    .article {
      &__date {
        margin-bottom: 25px;
        //padding: 0 0 0 80px;
        color: #fff;
        font-weight: 700;
        opacity: 1;
        position: relative;
        //&:before {
        //  content: 'New';
        //  width: 45px;
        //  height: 20px;
        //  text-align: center;
        //  background-color: #FF5B5B;
        //  border-radius: 5px;
        //  position: absolute;
        //  top: 0;
        //  left: 0;
        //}
        //&:after {
        //  content: '';
        //  margin-top: -3px;
        //  width: 5px;
        //  height: 5px;
        //  background-color: #fff;
        //  border-radius: 50%;
        //  position: absolute;
        //  top: 50%;
        //  left: 60px;
        //}
      }
      &__title h3 {
        margin-bottom: 25px;
        color: #fff;
        font-size: 36px;
        line-height: 44px;
        -webkit-line-clamp: 3;
        &:hover {
          color: ${({ theme }) => theme.defaultColor};
        }
      }
      &__description {
        display: none;
      }
    }
    &:hover {
      .news-item__image {
        opacity: 0.9;
        transform: scale(1.015);
      }
    }
  }

  &:nth-child(2n) {
    grid-template-columns: 440px 1fr;
    grid-template-areas: 'img info';
    .article {
      &__action {
        text-align: right;
      }
    }
  }

  @media screen and (max-width: 992px) {
    margin-bottom: 15px;
    grid-template-columns: 1fr 275px;
    .news-item__info {
      margin: 20px;
    }
    .article {
      &__title h3 {
        font-size: 18px;
        line-height: 28px;
      }
    }
    
    &:first-child {
      .article {
        &__title h3 {
          font-size: 28px;
        }
      }
    }

    &:nth-child(2n) {
      grid-template-columns: 275px 1fr;
    }
  }
}

@media screen and (max-width: 767px) {
  height: 430px;
  grid-template-columns: 1fr !important;
  grid-template-areas: 'img'
                       'info' !important;
  grid-template-rows: 170px 1fr;
  .news-item__info {
    margin: 15px;
  }

  .article {
    &__title h3 {
      margin-bottom: 15px;
      font-size: 16px;
      line-height: 28px;
      white-space: nowrap;
    }

    &__description p {
      height: 90px;
      line-height: 22px;
      -webkit-line-clamp: 4;
      text-align: justify;
    }

    &__action {
      text-align: left !important;
    }
  }

  &:first-child {
    height: 380px;
    .news-item__info {
      padding: 25px;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 45px 1fr 44px;
    }
    .article {
      &__title h3 {
        font-size: 22px;
        line-height: 36px;
        white-space: normal;
        -webkit-line-clamp: 4;
      }
    }
  }
}
`;

export const StyledNewsItemInfo = styled.div``;

export const StyledNewsItemImage = styled.div`
  width: 440px;
  height: 100%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  @media screen and (max-width: 992px) {
    width: 275px;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

export const StyledNewsActualItem = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.defaultColor};
  border-radius: 10px;
  .actual-news__head h3 {
    font-size: 16px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .actual-news__body {
    padding: 20px 0;
    text-align: justify;
    line-height: 22px;
    opacity: 0.85;
    * {
      font-size: 14px;
      font-weight: 400;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      strong {
        font-weight: 400;
      }
      &:not(:first-child) {
        display: none;
      }
    }
  }
  .actual-news__footer {
    display: flex;
    justify-content: space-between;
  }
  .actual-news__date {
    opacity: 0.4;
  }
  .actual-news__action {
    font-weight: 700;
  }
  &:last-child {
    margin-bottom: 0;
  }
  @media screen and (max-width: 992px) {
    margin-bottom: 15px;
  }
`;