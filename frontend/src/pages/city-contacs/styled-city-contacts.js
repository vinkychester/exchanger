import styled from "styled-components";

export const StyledCityContactsWrapper = styled.div`
  .city-contact-title {
    margin: 0;
    padding: 20px 0;
  }
  .hidden-add-messenger-form {
    margin: 0;
  }
  .add-messenger-form {
    margin: 20px 0 0;
    padding: 20px;
    background-color: ${({ theme }) => theme.bgElements};
    border-color: ${({ theme }) => theme.borderElements};
  }
  .messenger-table {
    padding-top: 15px;
  }
`;

export const StyledCityContactsList = styled.div`
  .contacts-head {
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-gap: 15px;
    @media screen and (max-width: 576px) {
      grid-template-columns: max-content;
    }
  }
  .hidden-create-contact-form {
    margin: 0;
    .create-contact-form {
      margin: 20px 0 0;
      padding: 20px;
      background-color: ${({ theme }) => theme.bgElements};
      border-color: ${({ theme }) => theme.borderElements};
      &__content {
        display: grid;
        grid-gap: 15px;
        grid-template-columns: 100%;
      }
      &__field {
        margin-bottom: 0;
      }
      &__public {
        margin-bottom: 15px;
      }
    }
  }
  
  /**/
`;

export const StyledContactFieldTable = styled.div`
  .contact-fields-table {
    padding-top: 15px;
    &__head, &__row {
      grid-template-columns: ${({col}) => `repeat(${col}, 1fr)`};
    }
    &_edit {
      opacity: 0.5;
    }
  }
`;