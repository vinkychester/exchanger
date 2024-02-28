import styled from "styled-components";

export const StyledMailingWrapper = styled.div`
  .mailing-title {
    margin: 0;
    padding: 20px 0;
  }
  .loading-mailing-form {
    margin-top: 20px;
  }
  .mailing-form {
    padding: 20px;
    background-color: ${({ theme }) => theme.bgElements};
    border-color: ${({ theme }) => theme.borderElements};
  }
  
  .admin-mailing-table {
    &__head, &__row {
      grid-template-columns: minmax(200px, 0.2fr) 1fr repeat(2, 150px) 110px;
    }
    &__message p {
      overflow: hidden;
      text-align: justify;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      opacity: 0.55;
    }
    &_status-active {
      color: #1BA249;
    }
    &_status-inactive {
      color: #FF5B5B;
    }
    &__action {
      padding: 0;
      grid-gap: 10px;
      align-items: center;
    }
    @media screen and (max-width: 992px) {
      &__row {
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: 'title title'
                             'message message'
                             'status date'
                             'action action';
      }
      &__title {
        grid-area: title;
      }
      &__message {
        grid-area: message;
      }
      &__status {
        grid-area: status;
      }
      &__date {
        grid-area: date;
      }
      &__action{
        grid-area: action;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
      }
    }
  }
`;

export const StyledMailingDetailsWrapper = styled.div`
  .edit-mailing__title {
    margin: 0;
    padding: 20px 0;
  }
  .edit-mailing__head{ // Специально для "редактирования письма"
    margin-bottom: 20px;
  }
  .edit-mailing__send-out-btn {
    margin: 20px 0px 0px 0px;
    position: relative;
  }
  .edit-mailing-form {
    padding: 15px;
    &__field {
      textarea {
        min-height: 370px;
        resize: vertical;
      }
    }
  }
  
  .images {
    padding-top: 15px;
    display: flex;
    flex-wrap: wrap;
    .image {
      width: 200px;
      height: 150px;
      margin: 5px 10px 5px 0;
      border: 1px solid ${({ theme }) => theme.defaultColor};
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
    }
  }
`;