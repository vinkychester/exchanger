import styled from 'styled-components';

const type = {
  type: ''
}

const changeType = (type) => {
  switch (type) {
    case 'error' :
      return `
        border: 1px solid #ffccc7;
        background-color: rgba(255, 125, 140, .25);
        &:before {
          content: '\\e90e';
          background-color: #ff4d4f;
        }
      `;
    case 'success' :
      return `
        border: 1px solid #b7eb8f;
        background-color: rgba(183, 255, 143, .25);
        &:before {
          content: '\\e90f';
          background-color: #52c41a;
        }
      `;
    case 'info' :
      return `
        border: 1px solid #91d5ff;
        background-color: rgba(145, 213, 255, .25);
        &:before {
          content: '\\e92b';
          background-color: #1890ff;
        }
      `;
    default :
      return `
        border: 1px solid #ffe58f;
        background-color: rgba(255, 229, 143, .25);
        &:before {
          content: '\\e91f';
          background-color: #faad14;
        }
      `;
  }
}

export const StyledAlertWrapper = styled('div', type)`
  ${({center}) => center && 'max-width: 1110px'};
  margin: ${({margin}) => margin};
  padding: 15px 15px 15px 48px;
  border-radius: 7px;
  position: relative;
  &:before {
    width: 18px;
    height: 18px;
    color: #fff;
    font-size: 10px;
    font-family: 'theme-icon', serif;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    position: absolute;
    top: 15px;
    left: 15px;
  }
  ${({type}) => changeType(type)}
`;