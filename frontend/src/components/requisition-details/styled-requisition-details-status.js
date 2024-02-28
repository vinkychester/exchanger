import styled from 'styled-components';

const typeStep = {
  type: String,
}

const typeColor = (type) => {
  switch (type) {
    case 'done' :
      return `
        &:before, &:after {
          background: #EC6110;
        }
        .step__icon:before {
          content: '\\e90f';
          color: #EC6110;
          border: 1px solid #EC6110;
          animation: none;
        }
      `;
    case 'inProgress' :
      return `
        &:before {
          background: #EC6110;
          z-index: 2;
          @media screen and (max-width: 567px) {
            width: 50px;
            left: -2px;
          } 
        }
        .step__title {
          display: block;
          @media screen and (max-width: 375px) {
            display: none;
          }
        }
        .step__icon:before {
          content: '\\e919';
          color: #fff;
          background: #EC6110;
          border: 1px solid #EC6110;
          animation: none;
        }
        &:nth-child(3) {
          .step__icon:before {
            content: '\\e91a';
          }
        }
      `;
    case 'canceled' :
      return `
        .step__icon:before {
          content: '\\e90e';
          animation: none;
        }
      `;
    case 'disabled' :
      return `
        .step__icon:before {
          content: '\\e91c';
          animation: none;
        }
      `;
    case 'error' :
      return `
        color: #FF5B5B;
        &:before {
          background: #FF5B5B;
          z-index: 2;
          @media screen and (max-width: 567px) {
            width: 50px;
            left: -2px;
          }   
        }
        .step__icon:before {
          content: '\\e90e';
          color: #FF5B5B;
          border: 1px solid #FF5B5B;
          animation: none;
        }
      `;
    default :
      return ``;
  }
}

export const StyledRequisitionDetailsStatus = styled.div`
  padding: 20px 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 190px)) 1fr;
  grid-template-rows: 1fr;
  overflow: hidden;
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
export const StyledStatusItem = styled('div', typeStep)`
  position: relative;
  &:before, &:after {
    content: '';
    height: 1px;
    width: 75px;
    background: ${({theme}) => theme.requisitionStatusDefault};
    position: absolute;
    top: 20px;
  }
  &:before {
    left: 0;
  }
  &:after {
    right: 0;
  }
  &:last-child {
    &:after {
      width: calc(100% - 75px);
    }
    .step__icon, .step__title {
      max-width: 190px;
      width: 100%;
    }
  }
  ${({type}) => typeColor(type)}
`;

export const StyledStatusIcon = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  z-index: 2;
  &:before {
    content: '\\e929';
    width: 38px;
    height: 38px;
    margin: 0 0 0 -20px;
    color: ${({theme}) => theme.requisitionStatusDefault};
    font-size: 15px;
    font-family: 'theme-icon', serif;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({theme}) => theme.body};
    border: 1px solid ${({theme}) => theme.requisitionStatusDefault};
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 50%;
    animation: waiting 10s ease-in infinite 3s;
    @keyframes waiting {
      0% {
        transform: rotate(-180deg);
      } 
      5% {
        transform: rotate(0deg);
      } 
      100% {
        transform: rotate(0deg);
      } 
    }
  }
`;
export const StyledStatusTitle = styled.div`
  padding-top: 10px;
  font-size: 12px;
  text-align: center;
   @media screen and (max-width: 576px) {
     display: none;
   }
`;