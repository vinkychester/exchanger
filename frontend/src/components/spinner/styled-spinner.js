import styled from "styled-components";

const positionTemplate = {
  position: String,
}

const stylePosition = (position) => {
  switch (position) {
    case 'center':
      return `
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(215, 215, 230, 0.75);
        z-index: 10;
      `;
    default:
      return `
        
      `;
  }
}

export const StyledSpinner = styled('div', positionTemplate)`
  ${({position}) => stylePosition(position)}
`;

export const StyledFragmentSpinner = styled('div', positionTemplate)`
  ${({position}) => stylePosition(position)};
  border-radius: 10px;
  background-color: ${({theme}) => theme.loadingForm};
`;

export const StyledLoadingWrapper = styled.div`
  ${({mt}) => mt && `margin-top: ${mt}px`};
  ${({mb}) => mb && `margin-bottom: ${mb}px`};
  display: grid;
  position: relative;
  .loading {
    transition: all .1s ease;
    filter: blur(1px);
  }
`;

export const StyledLoadButton = styled.div`
  display: inline-grid;
  .loading-button{
    position: relative;
    opacity: 0.5;
    &__spinner {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
 
`;

export const StyledPageSpinner = styled.div`
  padding: 50px 0;
`;