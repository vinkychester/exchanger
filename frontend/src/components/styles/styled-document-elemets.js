import styled from "styled-components";

const typeStyled = {
  as: String
}

const styledList = (as) => {
  switch (as) {
    case 'ol':
      return `
        counter-reset: item;
        li:before {
          content: counter(item) ".";
          counter-increment: item;
          font-weight: 700;
        }
      `;
    default:
      return `
        li:before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #EC6110;
          top: 8px;
        }
      `;
  }
}
// lower-alpha
export const StyledList = styled('ul', typeStyled)`
  margin-bottom: 15px;
  line-height: 22px;
  ${({as}) => styledList(as)}
  
  li {
    margin-bottom: 10px;
    padding-left: 22px;
    text-align: justify;
    position: relative;
    opacity: 0.85;
    ${({countStart}) => countStart && `
      padding-left: 36px;
      &:before {
        content: "${countStart}." counter(item) ".";
    }`};
    p, li {
      opacity: 1;
    }
    &:before {
      position: absolute;
      left: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
  b {
    padding-bottom: 7px;
    display: block;
  }
  ${({listStyle}) => listStyle === 'alpha' &&
      `list-style: lower-alpha;
       padding-left: 22px;
       li {padding-left: 5px;}
       li:before {display: none;}
       li::marker {font-weight: 700;}
  ` };
`;

export const StyledBlockTitle = styled.h2`
  padding-bottom: 15px;
  color: ${({theme}) => theme.defaultColor};
  font-size: 16px;
`;

export const StyledParagraph = styled.p`
  padding-bottom: 15px;
  opacity: 0.85;
  b {
    padding-bottom: 7px;
  }
  b.block {
    display: block;
  }
  strong {
    font-weight: inherit;
  }
  strong.bold {
    font-weight: 700;
  }
  &:last-child {
    padding-bottom: 0;
  }
`;

export const StyledDocumentImage = styled.div`
  ${({center}) => center && 'margin: 0 auto;'};
  ${({mt}) => mt && `margin-top: ${mt}px`};
  max-width: ${({width}) => `${width}px`};
  img {
    width: 100%;
    height: auto;
  }
`;