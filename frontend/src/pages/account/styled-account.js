import styled from 'styled-components';

export const StyledAccountWrapper = styled.div`
  padding: 20px 0;
`;

export const StyledPersonalDataWrapper = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 30px;
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, auto);
  }
`;

export const StyledUserInfo = styled.form`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: 30px;
  .client-name {
    padding: 10px 10px 0 10px;
    background-color: ${({theme}) => theme.bgElements};
    border-bottom: 1px solid ${({theme}) => theme.borderElements};
    border-radius: 5px;
    .input-group {
      margin-bottom: 15px;
      label {
        display: flex;
        font-size: 12px;
        font-weight: 400;
        opacity: 0.5;
      }
    }
  }
  .button-align {
    button {
      margin: 0 10px 10px 0;
    }
  }
  @media screen and (max-width: 576px) {
    grid-template-columns: 100%;
  }
`;

export const StyledUserAvatar = styled.div`
  .user-image {
    width: 140px;
    height: 140px;
    border: 2px solid ${({theme}) => theme.defaultColor};
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 576px) {
      width: 100px;
      height: 100px;
    }
    img {
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
    }
  }
  .user-edit-image {
    margin-top: 15px;
    max-width: 140px;
    width: 100%;
    padding: 3px 8px;
    display: inline-flex;
    justify-content: center;
    background-color: ${({theme}) => theme.defaultColor};
    border-radius: 5px;
    position: relative;
    transition: all .3s ease;
    cursor: pointer;
    span {
      color: #fff;
      position: relative;
      z-index: 2;
    }
    input {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      visibility: hidden;
      opacity: 0;
    }
    &:hover {
      transform: scale(0.98);
    }
    @media screen and (max-width: 576px) {
      margin-right: 15px;
    }
  }
`;

export const StyledUpdateTokenBtn = styled.button `
  margin-top: 15px;
  max-width: 140px;
  width: 100%;
  padding: 3px 8px;
  color: #fff;
  display: inline-flex;
  justify-content: center;
  background-color: ${({theme}) => theme.defaultColor};
  border-radius: 5px;
  border: none;
  outline: none;
  transition: all .3s ease;
  &:hover {
    transform: scale(0.98);
  }

`;

export const StyledChangePassword = styled.form`
  padding: 10px;
  display: grid;
  background-color: ${({theme}) => theme.bgElements};
  border-bottom: 1px solid ${({theme}) => theme.borderElements};
  border-radius: 5px;
  //grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  & .submit-btn {
    justify-content: end;
    display: grid;
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, auto);
  }
`;

export const StyledGoogleSecurity = styled.div`
  .security-title {
    color: ${({theme}) => theme.defaultColor};
    font-size: 22px;
    font-weight: 700;
  }
  .security-description {
    p {
      padding-bottom: 15px;
    }
    ul li{
      padding: 3px 0;
      font-weight: 700;
    }
  }
  .use-security {
    label {
      padding-left: 10px;
      font-weight: 700;
    }
  }
  .security-code {
    padding: 10px;
    background-color: ${({theme}) => theme.bgElements};
    border-bottom: 1px solid ${({theme}) => theme.borderElements};
    border-radius: 5px;
    h4 {
      color: ${({theme}) => theme.defaultColor};
      font-size: 22px;
    }
    p {
      padding-bottom: 15px;
      color: #FF5B5B;
      font-size: 12px;
    }
  }
  .security-modal__message {
    font-size: 16px;
    margin-bottom: 15px;
  }
  .security-modal__input input {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 5px;
    text-align: center;
  }
  .security-modal__code {
    text-align: center;
  }
`;

export const StyledUserStatisticsWrapper = styled.div`
  h4 {
    margin-bottom: 20px;
    font-size: 16px;
  }
  .statistics-data {
    margin-bottom: 10px;
    span {
      color: ${({theme}) => theme.defaultColor};
      font-weight: 700;
    }
  }
  @media screen and (max-width: 768px) {
    padding: 12px 10px;
    background-color: ${({theme}) => theme.bgElements};
    border-radius: 10px;
  }
`;



