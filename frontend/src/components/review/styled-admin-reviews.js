import styled from "styled-components";

export const StyledAdminReviewsWrapper = styled.div`
  .admin-reviews-title {
    margin: 0;
    padding: 20px 0;
  }
  .admin-reviews-table {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${({theme}) => theme.defaultColor};
    &__head, &__row {
      grid-template-columns: repeat(2, 100px) minmax(0, 250px) minmax(300px, 1fr) 160px;
    }
    &__publish {
      justify-content: center;
    }
    &__message {
      opacity: 0.55;
    }
    &__action{
      padding: 0;
      grid-gap: 10px;
      align-items: center;
      &:before {
        display: none;
      }
    }
    &__row {
      @media screen and (max-width: 992px) {
        margin: 15px 0;
        background-color: ${({theme}) => theme.bgElements};
        border-radius: 10px;
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: 'publish date'
                             'username username'
                             'message message'
                             'action action';
      }
    }
    @media screen and (max-width: 992px) {
      margin-top: 15px;
      padding-top: 0;
      &__publish {
        grid-area: publish;
        justify-content: start;
      }
      &__message {
        grid-area: date;
      }
      &__message {
        grid-area: username;
      }
      &__message {
        grid-area: message;
      }
      &__action{
        grid-area: action;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
      }
    }
  }
`;

export const StyledAdminEditReview = styled.div`
  //padding: 25px 0 0;
  .edit-review__title {
    margin: 0;
    padding: 20px 0;
  }
  .edit-review__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media screen and (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .edit-review__date {
    padding: 5px 0;
    opacity: 0.4;
    @media screen and (max-width: 576px) {
      width: 100%;
      padding: 5px 0 10px;
      //text-align: center;
    }
  }
  
  .loading-edit-review-form {
    //max-width: 450px;
    //width: 100%;
    margin-top: 20px;
  }
  .edit-review-form {
    padding: 15px;
    &__field {
      textarea {
        min-height: 370px;
        resize: vertical;
      }
    }
  }

`;