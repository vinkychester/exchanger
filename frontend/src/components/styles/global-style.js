import { createGlobalStyle } from "styled-components";

const mainFont = "Open Sans, sans-serif";
const mainFontSize = "14px";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: ${mainFont};
    font-size: ${mainFontSize};
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.body};
  }

  h1, h2, h3, h4, h5, h6, p, span, select, input {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
  }

  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  input, select {
    color: ${({ theme }) => theme.text};
  }
  input::-webkit-search-decoration,
  input::-webkit-search-cancel-button,
  input::-webkit-search-results-button,
  input::-webkit-search-results-decoration { 
    display: none; 
  }

  button {
    padding: 0;
    font: inherit;
    background-color: transparent;
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover, a:focus, a:active {
    text-decoration: none;
  }
  
  .orange {
    color: ${({ theme }) => theme.defaultColor};
  }
  .red {
    color: #FF5B5B;
  }
  .green {
    color: #1FC173;
  }
  .transparent {
    opacity: 0.4;
  }
  
  .orange-tooltip {
    opacity: 1;
    .rc-tooltip-arrow {
      border-top-color: ${({ theme }) => theme.defaultColor};
    }
    .rc-tooltip-inner {
      color: #fff;
      background-color: ${({ theme }) => theme.defaultColor};
    }
  }


  .default-link {
    color: ${({ theme }) => theme.defaultColor};
    transition: all .1s ease;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  //Progressbar custom style
  #nprogress .bar {
    height: 3px;
    background: ${({ theme }) => theme.defaultColor};
  }

  #nprogress .peg {
    box-shadow: 0 0 10px ${({ theme }) => theme.defaultColor}, 0 0 5px ${({ theme }) => theme.defaultColor};
  }

  #nprogress .spinner-icon {
    display: none;
    border-top-color: ${({ theme }) => theme.defaultColor};
    border-left-color: ${({ theme }) => theme.defaultColor};
  }

  //AntDesign drawer custom style
  .drawer.drawer-open .drawer-mask {
    opacity: 0.45;
  }

  .drawer-right .drawer-content {
    background-color: ${({ theme }) => theme.navBarBg};
  }

  //AntDesign select
  .rc-select-item-empty {
    padding: 10px;
    color: #fff;
    background-color: ${({ theme }) => theme.defaultColor};
  }
  .rc-select-selector {
    min-height: 38px;
    span.rc-select-selection-item, span.rc-select-selection-placeholder {
      padding: 5px 10px;
      display: flex;
    }
  }
  .rc-select-dropdown {
    border: 1px solid ${({ theme }) => theme.navBarBorder};
    box-shadow: none;
    
    .rc-select-item-option {
      padding: 5px 10px;
      background: ${({ theme }) => theme.navBarBg};
      cursor: pointer;

      &:hover {
        color: #fff;
        background: ${({ theme }) => theme.defaultColor};
      }

      .option-select-item {
        text-transform: uppercase;
        display: flex;
        align-items: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        b {
          padding: 0 10px;
        }

        img {
          margin-right: 5px;
        }
      }
    }

    .rc-select-item-option-selected {
      color: #fff;
      background: ${({ theme }) => theme.defaultColor};

      .rc-select-item-option-state {
        display: none;
      }
    }
  }

  //AntDesign switch
  .default-switch {
    background-color: transparent;
    border-color: ${({ theme }) => theme.defaultColor};

    &:after {
      background-color: ${({ theme }) => theme.defaultColor};
      box-shadow: none;
    }

    &:focus {
      box-shadow: none;
    }
  }

  .rc-switch-checked {
    background-color: ${({ theme }) => theme.defaultColor};

    &:after {
      background-color: #fff;
    }
  }

  //AntDesign custom checkbox
  .default-checkbox {
    input {
      width: 17px;
      height: 17px;

      &:focus {
        box-shadow: none;
        outline: none;
      }
    }

    .rc-checkbox-inner {
      width: 17px;
      height: 17px;
      border-color: ${({ theme }) => theme.defaultColor};
      background-color: ${({ theme }) => theme.body};

      &:after {
        border: none
      }
    }
  }

  .rc-checkbox-checked {
    .rc-checkbox-inner {
      background-color: ${({ theme }) => theme.defaultColor};

      &:after {
        border: 2px solid #fff;
        border-top: 0;
        border-left: 0;
      }
    }
  }

  //AntDesign custom tabs
  .rc-tabs-dropdown {
    color: ${({theme}) => theme.text};
    background-color: ${({theme}) => theme.bgElements};
    border: 1px solid ${({theme}) => theme.borderElements};
  }
  
  .default-tabs {
    border: none;
    grid-gap: 20px;
    
    .rc-tabs-nav-more {
      margin-left: 5px;
      padding: 2px 3px;
      color: ${({theme}) => theme.defaultColor};
      font-size: 12px;
      font-weight: 700;
      background-color: ${({theme}) => theme.hoverColor};
      border: 1px solid ${({theme}) => theme.hoverShadow};
      border-radius: 3px;
      outline: none;
    }

    .rc-tabs-nav-list {
      .rc-tabs-tab {
        font-size: 14px;
        background: transparent;
        opacity: 0.4;

        &:hover {
          opacity: 1;
        }

        .rc-tabs-tab-btn {
          outline: none;
        }
      }

      .rc-tabs-tab-active {
        font-weight: 400;
        opacity: 1;
      }

      .rc-tabs-ink-bar {
        background: ${({ theme }) => theme.defaultColor};
      }
    }

    .rc-tabs-content-holder {
      .rc-tabs-tabpane {
        outline: none;
      }
    }

    @media screen and (max-width: 992px) {
      grid-template-columns: 100%;
      grid-template-rows: repeat(2, auto);
    }
  }

  .default-tabs-left {
    display: grid;
    grid-template-columns: 256px auto;
    @media screen and (max-width: 992px) {
      grid-template-columns: 100%;
      grid-template-rows: auto;
    }
  }

  .default-tabs-top {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 40px auto;

    .rc-tabs-nav-list {
      width: 100%;
      border-bottom: 1px solid ${({ theme }) => theme.navBarBorder};
    }

    .rc-tabs-tab {
      margin-right: 20px;
      padding: 10px 0;

      &:last-child {
        margin: 0;
      }
    }

    .rc-tabs-tab-active {
      color: ${({ theme }) => theme.defaultColor};
    }
    
    .rc-tabs-nav-more {
      min-width: 25px;
    }
  }

  //AntDesign custom submenu 
  .card-submenu {
    background-color: ${({ theme }) => theme.body};
    border-color: ${({ theme }) => theme.borderElements};
    box-shadow: none;

    .rc-dropdown-menu-item {
      padding: 0;

      &:hover {
        background-color: ${({ theme }) => theme.hoverColor};
      }
    }

    .rc-dropdown-menu-item-selected {
      background-color: ${({ theme }) => theme.hoverColor};

      &:after {
        display: none;
      }
    }
  }

  //MainSubmenu
  /*.submenu-wrapper {
    background-color: ${({ theme }) => theme.navBarBg};
    border-color: ${({ theme }) => theme.navBarBorder};
    box-shadow: none;
    .rc-dropdown-menu-item {
      padding: 0;
      color: ${({ theme }) => theme.text};
      font-size: 14px;
      font-weight: 700;
      .submenu-wrapper__item {
        padding: 7px 10px;
        display: flex;
      }
      .submenu-wrapper__current {
        color: #fff;
        background-color: ${({ theme }) => theme.defaultColor};
      }
      &:hover {
        color: #fff;
        background-color: ${({ theme }) => theme.defaultColor};
      }
    }
    .rc-dropdown-menu-item-selected {
      background-color: inherit;
      &:after {
        display: none;
      }
    }
  }*/

  //AntDesign custom pagination 
  .default-pagination {
    padding: 30px 0;
    display: flex;
    justify-content: center;

    .rc-pagination-item, .rc-pagination-item-link {
      color: ${({ theme }) => theme.text};
      font-weight: 700;
      background-color: transparent;
      border: none;
      outline: none;

      a {
        color: ${({ theme }) => theme.text};
      }

      &:hover {
        color: ${({ theme }) => theme.defaultColor};

        a {
          color: ${({ theme }) => theme.defaultColor};
        }
      }
    }

    .rc-pagination-item-active {
      color: #fff;
      background: linear-gradient(90deg, #EA5400 0%, #F28C3C 100%);
      border-radius: 4px;

      a {
        color: #fff;
      }

      &:hover a {
        color: #fff;
      }
    }
  }

  //AntDesign notifications
  .rc-notification {
    padding: 0;
    transform: translateX(-50%);
    z-index: 1055;
    @media screen and (max-width: 576px) {
      width: 100%;
      padding: 0 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: inherit;
      left: 0 !important;
    }

    .rc-notification-notice-close {
      color: ${({ theme }) => theme.text};
      opacity: .5;

      &:hover {
        opacity: 1;
      }
    }

    .rc-notification-notice {
      margin: 0;
      padding: 5px 20px 0 0;
      background-color: transparent;
      border-radius: 0;
      box-shadow: none;
    }

    .message {
      padding: 10px;
      color: #fff;
      display: inline-flex;
      border-radius: 5px;
    }
    .message.error {
      background-color: #FF5B5B;
    }
    .message.success {
      background-color: #1FC173;
    }
    
    .message-with-icon {
      padding: 10px 10px 10px 33px;
      display: inline-flex;
      border-radius: 5px;
      position: relative;
      &:before {
        width: 17px;
        height: 17px;
        color: #fff;
        font-size: 8px;
        font-family: 'theme-icon', serif;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        position: absolute;
        top: 12px;
        left: 10px;
      }
    }
    .message-with-icon.success {
      color: rgb(30, 70, 32);
      background-color: #e0f9da;
      &:before {
        content: '\\e90f';
        background-color: #4caf50;
      }
    }
    .message-with-icon.error {
      color: rgb(97, 26, 21);
      background-color: #f7dfdc;
      &:before {
        content: '\\e90e';
        background-color: #f44336;
      }
    }
    .message-with-icon.info {
      color: rgb(43, 93, 139);
      background-color: #e3f4ff;
      &:before {
        content: '\\e92b';
        background-color: #479cea;
      }
    }
    .message-with-icon.warning {
      color: rgb(187, 126, 10);
      background-color: #fff8e3;
      &:before {
        content: '\\e91f';
        background-color: #f6c054;
      }
    }
  }
  
  //AntDesign dialog window
  .rc-modal-center {
    display: flex;
    align-items: center;
    justify-content: center;
    .rc-dialog-close {
      color: ${({ theme }) => theme.text};
      outline: none;
      opacity: .7;
      &:hover {
        opacity: 1;
      }
    }
    .rc-dialog-header,
    .rc-dialog-content {
      min-width: 300px;
      color: ${({ theme }) => theme.text};
      background-color: ${({ theme }) => theme.body};
    }
    .rc-dialog-header {
      border-bottom: 1px solid ${({ theme }) => theme.bgElements};
    }
    .default-modal {
      &_loading {
        position: relative;
        .default-modal__body-content {
          transition: all .1s ease;
          filter: blur(1px);
        }
      }
      &__body-footer {
        padding-top: 15px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(75px, max-content));
        grid-gap: 15px;
        justify-content: end;
      }
    }
  }
  .rc-dialog-mask {
    background-color: rgba(0, 0, 0, 0.45);
  }

  //Fix Jivosite button
  .__jivoMobileButton {
    margin-bottom: 70px;
    margin-right: -5px;
    & > jdiv {
      width: 55px;
      height: 55px;
    }
  }
  
  .grecaptcha-badge {
    opacity: 0;
    visibility: hidden;
  }
    
  .drawer-left.drawer-open, .drawer-right.drawer-open {
    z-index: 2147483648;
  }

  .react-fancybox .box {
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.5);
    .close-btn {
      //background-color: ${({ theme }) => theme.defaultColor};
    }
    .image-box {
      padding: 0;
      background-color: transparent;
      @media screen and (max-width: 992px) {
        width: calc(100% - 50px);
        height: calc(100% - 50px);
        display: flex;
        justify-content: center;
        align-items: center;
        img[alt="original"] {
          max-height: 100% !important;
          max-width: 100%;
        }
      }
    }
  }
  //LightBox
  .lb-canvas .lb-img {
    max-width: 100%;
    min-height: auto;
    padding: 0 15px;
  }

  //Animations
  @keyframes loadContent {
    0% {
      opacity: 0;
      transform: translateY(-25px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;
