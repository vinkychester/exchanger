import styled from "styled-components";

const colorButton = {
    color: String,
}

const styledSize = (size) => {
    switch (size) {
        case 'small':
            return `
                padding: 4px 8px;
                font-size: 12px;
            `;
        default:
            return ``;
    }
}

const styleButton = (color) => {
    switch (color) {
        case 'main':
            return `
                padding: 11px 15px;
                color: #fff;
                background: linear-gradient(90deg, #EA5400 0%, #F28C3C 100%);
                border: none;
                box-shadow: 0 4px 10px rgba(255, 122, 0, 0.5);
            `;
        case 'success':
            return `
                padding: 11px 15px;
                color: #fff;
                background: linear-gradient(90deg, #21793F 0%, #1BA249 98.26%);
                border: none;
                box-shadow: 0 4px 10px rgba(32, 122, 63, 0.5);
            `;
        case 'danger':
            return `
                padding: 11px 15px;
                color: #fff;
                background: linear-gradient(90deg, #C74545 0%, #E93939 98.26%);
                border: none;
                box-shadow: 0 4px 10px rgba(255, 91, 91, 0.5);
            `;
        case 'warning':
            return `
                padding: 11px 15px;
                color: #202020;
                background: linear-gradient(90deg, #EAD200 0%, #F2B43C 100%);
                border: none;
                box-shadow: 0 4px 10px rgba(255, 199, 0, 0.5);
            `;
        case 'info':
            return `
                padding: 11px 15px;
                color: #fff;
                background: linear-gradient(90deg, #1D3D6F 0%, #29579D 98.26%);
                border: none;
                box-shadow: 0 4px 10px rgba(29, 62, 112, 0.5);
            `;
        default:
            return `
                padding: 10px 14px;
                background: transparent;
                border: 1px solid #EC6110;
                box-shadow: none;
            `;
    }
}

export const StyledButton = styled('button', colorButton)`
  ${({mt}) => mt && `margin-top: ${mt}px`};
  ${({mb}) => mb && `margin-bottom: ${mb}px`};
    width: ${({figure}) => figure !== 'circle' ? 'auto' : '46px'};
    height: ${({figure}) => figure !== 'circle' ? 'auto' : '46px'};
    color: ${({theme}) => theme.text};
    font-size: 16px;
    font-weight: ${({weight}) => weight === 'normal' ? '400' : '700'};
    text-align: center;
    vertical-align: middle;
    text-transform: ${({weight}) => weight === 'normal' ? 'inherit' : 'uppercase'};
    letter-spacing: 0.5px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: ${({figure}) => figure === 'circle' ? '50%' : '5px'};
    outline: none;
    cursor: pointer;
    transition: all .1s ease;
    ${({disabled}) => disabled && `
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.5;
        transform: scale(1) !important;
    `};
    ${({color}) => styleButton(color)}
    ${({size}) => styledSize(size)}
    &:hover {
      transform: scale(0.98) ;
    }
    &:active {
      transform: scale(0.95);
    }
`;
