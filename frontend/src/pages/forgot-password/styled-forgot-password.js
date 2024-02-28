import styled from 'styled-components';

export const StyledForgotPasswordWrapper = styled.div`
  padding: 20px 0;
  .loading-forgot-password-form {
    max-width: 450px;
    width: 100%;
    margin: 0 auto;
  }
  .forgot-password-form {
    text-align: center;
    &__title {
      padding-bottom: 15px;
    }
    &__account {
      padding-top: 15px;
      color: ${({theme}) => theme.text };
      display: inline-block;
      opacity: 0.5;
    }
  }
`;