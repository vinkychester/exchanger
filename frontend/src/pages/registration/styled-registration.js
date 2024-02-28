import styled from 'styled-components';

export const StyledRegistrationWrapper = styled.div`
    padding: 20px 0;
    .loading-registration-form {
      max-width: 450px;
      width: 100%;
      margin: 0 auto;
    }
    .registration-form {
        text-align: center;
        &__title {
          padding-bottom: 15px;
        }
        &__footer {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          @media screen and (max-width: 576px) {
            display: inline-flex;
            flex-direction: column-reverse;
          }
        }
        &__user-agree {
          font-size: 12px;
        }
        &__button {
          margin: 0 5px;
          @media screen and (max-width: 576px) {
            margin-bottom: 10px;
            &:first-child {
              margin-bottom: 0;
            }
          }
        }
        &__forgot-password {
          padding-top: 15px;
          color: ${({theme}) => theme.text };
          display: inline-block;
          opacity: 0.5;
        }
    }
`;