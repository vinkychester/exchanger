import styled from "styled-components";

export const StyledHtmlParserWrapper = styled.div`
  h2, h3, h4, h5, h6 {
    margin-bottom: 15px;
    color: ${({theme}) => theme.defaultColor};
  }
  h2 {
    font-size: 20px;
  }
  h3, h4 {
    font-size: 18px;
  }
  h5, h6{
    font-size: 16px;
  }
  p {
    margin-bottom: 15px;
    text-align: justify;
    text-indent: 22px;
    line-height: 22px;
    opacity: 0.85;
    strong {
      font-weight: 700;
    }
    img {
      width: 100%;
      margin: 0 auto;
      display: block;
    }
    &:last-child {
      margin-bottom: 0;
    }
    @media screen and (max-width: 767px) {
      img {
        width: 100% !important;
        height: auto !important;
      }
    }
  }
  blockquote {
    margin: 10px 15px;
    padding: 25px 10px 10px;
    background-color: ${({theme}) => theme.bgElements};
    border: 1px solid  ${({theme}) => theme.borderElements};
    border-radius: 5px;
    position: relative;
    &:before {
      content: '\\e935';
      font-size: 20px;
      font-family: 'theme-icon', serif;
      opacity: 0.1;
      position: absolute;
      top: 5px;
      left: 10px;
    }
  }
  pre {
    margin-bottom: 15px;
    font-family: inherit;
    text-align: justify;
    overflow: inherit;
    white-space: normal;
  }
  ul, ol {
    margin-bottom: 15px;
    padding-left: 15px;
    opacity: 0.85;
    li {
      padding: 0 0 3px 3px;
      &:last-child {
        padding-bottom: 0;
      }
    }
  }
  ul {
    list-style: disc;
  }
  ol {
    list-style: decimal;
  }
`;