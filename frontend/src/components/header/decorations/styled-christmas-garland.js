import styled from "styled-components";

export const StyledButtonOn = styled.button`
    height: 22px;
    width: 40px;
    margin-right: 15px;
    padding: 0;
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 35% 55%;
    background-color: ${({light}) => light === true ? '#41c2ff' : 'transparent'};
    border: 1px solid #41c2ff;
    border-radius: 12px;
    outline: none;
    cursor: pointer;
    position: relative;
    &:after {
        content: '';
        height: 18px;
        width: 18px;
        background-color: ${({light}) => light === true ? '#fff' : '#41c2ff'};
        border-radius: 50%;
        position: absolute;
        top: 1px;
        left: ${({light}) => light === true ? '1px' : 'calc(100% - 19px)'};
        transition: all .1s ease;
    }
`;

export const StyledChristmasGarland = styled.div`
  position: relative;
  .test {
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
  }
  .lightrope {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    position: absolute;
    z-index: 2;
    margin: -15px 0 0 0;
    padding: 0;
    pointer-events: none;
    width: 100%;
  }

  .lightrope li {
    position: relative;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    list-style: none;
    margin: 0;
    padding: 0;
    display: block;
    width: 12px;
    height: 28px;
    border-radius: 50%;
    margin: 20px;
    display: inline-block;
    background: rgba(0, 247, 165, 0.4);
    box-shadow: 0px 4.66667px 24px 3px rgba(0, 247, 165, 0.2);
    ${({light}) => light && `
    -webkit-animation-name: flash-1;
    animation-name: flash-1;
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
    `};
  }

  .lightrope li:nth-child(2n+1) {
    background: rgba(0, 255, 255, 0.4);
    box-shadow: 0px 4.66667px 24px 3px rgba(0, 255, 255, 0.2);
    ${({light}) => light && `
    -webkit-animation-name: flash-2;
    animation-name: flash-2;
    -webkit-animation-duration: 0.4s;
    animation-duration: 0.4s;
    `};
  }

  .lightrope li:nth-child(4n+2) {
    background: rgba(247, 0, 148, 0.4);
    box-shadow: 0px 4.66667px 24px 3px rgba(247, 0, 148, 0.2);
    ${({light}) => light && `
    -webkit-animation-name: flash-3;
    animation-name: flash-3;
    -webkit-animation-duration: 1.1s;
    animation-duration: 1.1s;
    `};
  }

  .lightrope li:nth-child(odd) {
    -webkit-animation-duration: 1.8s;
    animation-duration: 1.8s;
  }

  .lightrope li:nth-child(3n+1) {
    -webkit-animation-duration: 1.4s;
    animation-duration: 1.4s;
  }

  .lightrope li:before {
    content: "";
    position: absolute;
    background: #222;
    width: 10px;
    height: 9.33333px;
    border-radius: 3px;
    top: -4.66667px;
    left: 1px;
  }

  .lightrope li:after {
    content: "";
    top: -14px;
    left: 9px;
    position: absolute;
    width: 52px;
    height: 18.66667px;
    border-bottom: solid #222 2px;
    border-radius: 50%;
  }

  .lightrope li:last-child:after {
    content: none;
  }

  .lightrope li:first-child {
    margin-left: -40px;
  }

  @-webkit-keyframes flash-1 {
    0%, 100% {
      background: rgba(0, 247, 165, 0.4);
      box-shadow: 0px 4.66667px 24px 3px rgba(0, 247, 165, 0.2);
    }
    50% {
      background: #00f7a5;
      box-shadow: 0px 4.66667px 24px 3px #00f7a5;
    }
  }

  @keyframes flash-1 {
    0%, 100% {
      background: rgba(0, 247, 165, 0.4);
      box-shadow: 0px 4.66667px 24px 3px rgba(0, 247, 165, 0.2);
    }
    50% {
      background: #00f7a5;
      box-shadow: 0px 4.66667px 24px 3px #00f7a5;
    }
  }

  @-webkit-keyframes flash-2 {
    0%, 100% {
      background: rgba(0, 255, 255, 0.4);
      box-shadow: 0px 4.66667px 24px 3px rgba(0, 255, 255, 0.2);
      
    }
    50% {
      background: cyan;
      box-shadow: 0px 4.66667px 24px 3px cyan;
    }
  }

  @keyframes flash-2 {
    0%, 100% {
      background: rgba(0, 255, 255, 0.4);
      box-shadow: 0px 4.66667px 24px 3px rgba(0, 255, 255, 0.2);
      
    }
    50% {
      background: cyan;
      box-shadow: 0px 4.66667px 24px 3px cyan;
    }
  }

  @-webkit-keyframes flash-3 {
    0%, 100% {
      background: rgba(247, 0, 148, 0.4);
      box-shadow: 0px 4.66667px 24px 3px rgba(247, 0, 148, 0.2);
    }
    50% {
      background: #f70094;
      box-shadow: 0px 4.66667px 24px 3px #f70094;
    }
  }

  @keyframes flash-3 {
    0%, 100% {
      background: rgba(247, 0, 148, 0.4);
      box-shadow: 0px 4.66667px 24px 3px rgba(247, 0, 148, 0.2);
    }
    50% {
      background: #f70094;
      box-shadow: 0px 4.66667px 24px 3px #f70094;
    }
  }
`;