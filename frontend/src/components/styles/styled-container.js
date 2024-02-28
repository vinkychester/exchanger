import styled from 'styled-components';

const tableSize = {
  size: ''
}

const changeContainerSize = (size) => {
  switch (size) {
    case 'xl':
      return `
        max-width: 1920px
      `
    default:
      return `
        max-width: 1140px
      `
  }
}

export const StyledContainer = styled('div', tableSize)`
    ${({size}) => changeContainerSize(size)};
    width: 100%;
    margin: 0 auto;
    padding: 0 15px;
    ${({wrapper}) => wrapper !== 'content' && `min-height: calc(100vh - 95px - 429px)`};
    ${({wrapper}) => wrapper !== 'content' && `padding-bottom: 30px`};
    @media screen and (max-width: 992px) {
      ${({wrapper}) => wrapper !== 'content' && `height: auto`};
      ${({wrapper}) => wrapper !== 'content' && `padding-bottom: 50px`};
    }
`;
