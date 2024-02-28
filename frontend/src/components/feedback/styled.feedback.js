import styled from "styled-components";

export const StyledFeedbackWrapper = styled.div`
  .feedback-title {
    margin: 0;
    padding: 20px 0;
  }
  
  .feedback-table {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${({theme}) => theme.defaultColor};
    &__head, &__row {
      grid-template-columns: repeat(5, 1fr) 160px;
    }
    &__row {
      cursor: pointer;
    }
    &__action{
      padding: 0;
      grid-gap: 10px;
      align-items: center;
      &:before {
        display: none;
      }
    }
    .not_viewed {
      background-color: ${({theme}) => theme.hoverShadow};
      box-shadow: 0 -1px 0 0 rgb(0 0 0 / 25%);
      &:hover {
        background-color: ${({theme}) => theme.hoverColor};
      }
    }
    @media screen and (max-width: 992px) {
      padding-top: 0;
      &__row {
        margin: 15px 0;
        border-radius: 10px;
        background-color: ${({theme}) => theme.bgElements};
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: 'user user'
                             'email date'
                             'status type'
                             'action action';
      }
      &__user {
        grid-area: user;
      }
      &__email {
        grid-area: email;
      }
      &__date {
        grid-area: date;
      }
      &__status {
        grid-area: status;
      }
      &__type {
        grid-area: type;
      }
      &__action {
        grid-area: action;
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media screen and (max-width: 576px) {
      &__row {
        grid-template-columns: 100%;
        grid-template-areas: 'user'
                           'email'
                           'date'
                           'status'
                           'type'
                           'action';
      }
    }
  }
  
  .user {
    align-content: center;
    &__name {
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__email {
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0.4;
    }
  }
  .icon-copy {
    padding-left: 5px;
    font-size: 12px;
    color: ${({ theme }) => theme.defaultColor};
    cursor: pointer;
  }
`;


export const StyledFeedbackDetailsWrapper = styled.div`
  .feedback-details__title {
    margin: 0;
    padding: 20px 0;
  }
  .feedback-details__action {
    //border: 1px dashed red;
    padding-top: 15px;
  }
  .feedback-details__body {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding-top: 20px;

  }
  .message-wrapper {
    margin-bottom: 15px;
    padding: 0 5px 15px;
    min-height: 250px;
    //min-height: calc(100vh - 1050px);
    max-height: calc(100vh - 1105px);
    overflow-y: auto;
    //display: flex;
    //flex-direction: column-reverse;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 9px;
      background-color: ${({theme}) => theme.hoverShadow};
      border-radius: 20px;
    }
    &::-webkit-scrollbar-track{
      background: ${({theme}) => theme.hoverShadow};
      border-radius: 20px;
    }
    &::-webkit-scrollbar-thumb {
      width: 15px;
      background-color: ${({theme}) => theme.defaultColor};
      border: 2px solid ${({theme}) => theme.hoverShadow};
      border-radius: 12px;
    }
  }
  .message-item {
    max-width: 50%;
    padding: 3px 6px;
    text-align: left;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    position: relative;
    word-wrap: break-word;
    @media screen and (max-width: 768px) {
      max-width: 90%;
    }
    &:before {
      content: '';
      width: 0;
      height: 0;
      bottom: -5px;
      border: 5px solid;
      position: absolute;
    }
    &:last-child {
      margin-bottom: 5px;
    }
    &__author {
      font-weight: 700;
    }
    &__email {
      color: ${({theme}) => theme.defaultColor};
      font-size: 11px;
      opacity: 0.55;
      cursor: pointer;
      &:hover {
        opacity: 0.75;
      }
    }
    &__content {
      padding: 5px 0;
      white-space: pre-wrap;
    }
    &__date {
      font-size: 11px;
      opacity: 0.5;
    }
  }
`;

export const StyledMessageAlign = styled.div`
  padding-bottom: 10px;
  display: flex;
  align-items: end;
  ${({author}) => author === 'manager' ? 'flex-direction: row-reverse' : null};
  &:last-child {
    padding-bottom: 0;
  }
  
  .message-item {
    background-color: ${({author, theme}) => author === 'manager' ? theme.navBarBg : theme.hoverColor};
    &:before {
      left: ${({author}) => author === 'manager' ? 'auto' : '0'};
      right: ${({author}) => author === 'manager' ? '0' : 'auto'};
      border-color: ${({author, theme}) => author === 'manager' ? 
              `${theme.navBarBg} ${theme.navBarBg} transparent transparent` : 
              `${theme.hoverColor} transparent transparent ${theme.hoverColor}`};
    }
    &__author {
      color: ${({author, theme}) => author === 'manager' ? theme.text : theme.defaultColor};
    }
    &__date {
      color: ${({author, theme}) => author === 'manager' ? theme.text : theme.defaultColor};
    }
  }
`;