import styled from 'styled-components';

export const StyledLoginWrapper = styled.div`
    padding: 20px 0;
    .loading-login-form {
      max-width: 450px;
      width: 100%;
      margin: 0 auto;
    }
    .login-form {
        text-align: center;
        &__footer {
          display: flex;
          justify-content: center;
        }
        &__google {
          margin: 15px auto 0;
        }
        &__user-agree {
          font-size: 12px;
        }
        &__button {
          margin-right: 10px;
          &:last-child {
            margin: 0;
          }
        }
        &__forgot-password {
          padding-top: 15px;
          color: ${({theme}) => theme.text };
          display: inline-block;
          opacity: 0.5;
        }
    }
  
    .two-factor-form {
      &__title {
        padding-bottom: 25px;
      }
      &__input input {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 5px;
        text-align: center;
      }
      &__footer {
        padding: 10px 0;
        display: flex;
        justify-content: center;
      }
    }
`;