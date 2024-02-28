import styled from "styled-components";

export const StyledAdminCitiesWrapper = styled.div`
  .admin-cities-title {
    margin: 0;
    padding: 20px 0;
  }

  .hidden-add-city-form {
    margin: 0;
  }
  .add-city-form {
    padding: 20px;
    background-color: ${({ theme }) => theme.bgElements};
    border-color: ${({ theme }) => theme.borderElements};
    &__body {
      display: grid;
      grid-gap: 15px;
      grid-template-columns: 1fr 400px;
      @media screen and (max-width: 992px) {
        grid-template-columns: 1fr 250px;
      }
      @media screen and (max-width: 768px) {
        grid-template-columns: 100%;
      }
    }
    &__city-select {
      margin-bottom: 15px;
    }
    &__action {
      padding-top: 15px;
    }
    .ckeditor-wrapper {
      margin-bottom: 15px;
      &__label {
        padding-bottom: 5px;
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
  
  .admin-cities-table {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${({theme}) => theme.defaultColor};
    &__head, &__row {
      grid-template-columns: 100px 200px 1fr 160px;
    }
    &__row {
      @media screen and (max-width: 992px) {
        margin: 15px 0;
        background-color: ${({theme}) => theme.bgElements};
        border-radius: 10px;
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: 'title title'
                             'desc desc'
                             'publish publish'
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
      &__action {
        grid-area: action;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
      }
    }
  }
`;

export const StyledAdminEditCity = styled.div`
  padding: 25px 0 0;
  .input-group {
    margin-bottom: 15px;
  }
  .ckeditor-wrapper {
    margin-bottom: 15px;
    &__label {
      padding-bottom: 5px;
      font-size: 16px;
      font-weight: 700;
    }
    @media screen and (max-width: 992px) {
      margin-bottom: 0;
    }
  }
  .edit-city {
    &__body {
      padding-top: 20px;
      display: grid;
      grid-template-columns: 1fr 450px;
      grid-gap: 30px;
      @media screen and (max-width: 992px) {
        grid-template-columns: 100%;
        grid-gap: 15px;
      }
    }
    &__options {
      padding: 15px;
      margin-bottom: 15px;
      background-color: ${({theme}) => theme.bgElements};
      border: 1px solid ${({theme}) => theme.borderElements};
      border-radius: 10px;
    }
  }
  
`;