import styled from "styled-components";

export const StyledAdminNewsWrapper = styled.div`
  .admin-news-title {
    margin: 0;
    padding: 20px 0;
  }
  .admin-news-action {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-gap: 15px;
    @media screen and (max-width: 350px) {
      grid-template-columns: 100%;
    }
  }
  .admin-news-table {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${({theme}) => theme.defaultColor};
    &__head, &__row {
      grid-template-columns: 100px 1fr 2fr repeat(2, 100px) 160px;
    }
    &__row {
      @media screen and (max-width: 992px) {
        margin: 15px 0;
        background-color: ${({theme}) => theme.bgElements};
        border-radius: 10px;
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: 'title title'
                             'desc desc'
                             'publish date'
                             'lang lang'
                             'action action';
      }
    }
    &__publish {
      justify-content: center;
    }
    &__title, &__desc {
      height: 100px;
      overflow: hidden;
    }
    &__desc {
      margin-bottom: 5px;
      opacity: 0.55;
      * {
        font-size: 14px;
        font-weight: 400;
      }
    }
    &__action{
      padding: 0;
      grid-gap: 10px;
      align-items: center;
      &:before {
        display: none;
      }
    }
    @media screen and (max-width: 992px) {
      margin-top: 15px;
      padding-top: 0;
      &__publish {
        grid-area: publish;
        justify-content: start;
      }
      &__title {
        grid-area: title;
        height: auto;
      }
      &__desc {
        grid-area: desc;
        max-height: 100px;
        height: 100%;
      }
      &__date {
        grid-area: date;
      }
      &__lang {
        grid-area: lang;
      }
      &__action {
        grid-area: action;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
      }
    }
  }
`;

export const StyledAdminNewsCreatePost = styled.div`
  padding: 25px 0 0;
  .create-post__body {
    padding-top: 20px;
    display: grid;
    grid-template-columns: 1fr 450px;
    grid-gap: 30px;
    @media screen and (max-width: 992px) {
      grid-template-columns: 100%;
      grid-gap: 15px;
    }
  }
  .create-post__options {
    padding: 15px;
    background-color: ${({theme}) => theme.bgElements};
    border: 1px solid ${({theme}) => theme.borderElements};
    border-radius: 10px;
  }
  .create-post_select, .create-post__action, .create-post__date {
   margin-bottom: 15px;
  }
  .create-post_select {
    .create-post_select-item {
      span {
        margin-right: 5px;
      }
    }
  }
  .ckeditor-wrapper {
    margin-bottom: 15px;
    &__label {
      padding-bottom: 5px;
      font-size: 16px;
      font-weight: 700;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .text-danger {
    color: #FF5B5B;
  }
`;

export const StyledNewsImageWrapper = styled.div`
  margin-bottom: 15px;
  .news-image {
    max-width: 420px;
    width: 100%;
    height: 173px;
    margin-bottom: 10px;
    border-radius: 7px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 7px;
    }
  }
  .news-image__cropper {
    margin-top: 15px;
    button {
      margin-top: 15px;
    }
  }
  .news-image__help {
    padding-bottom: 5px;
    color: #FF5B5B;
    font-size: 13px;
  }
  .news-image__button {
    position: relative;
    input {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      visibility: hidden;
    }
  }
`