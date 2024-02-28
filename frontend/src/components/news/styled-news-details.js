import styled from "styled-components";

export const StyledNewsDetailsWrapper = styled.article`
  padding: 25px 0 0;
`;

export const StyledNewsDetailsHead = styled.header`
  .article-details__date {
    padding-bottom: 15px;
    opacity: 0.4;
  }
  .article-details__image {
    width: 100%;
    height: 460px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
    }
    @media screen and (max-width: 992px) {
      height: 350px;
    }
    @media screen and (max-width: 576px) {
      height: 200px;
    }
  }
`;

export const StyledNewsDetailsTitle = styled.h1`
  max-width: 728px;
  width: 100%;
  padding: 10px 0;
  font-size: 24px;
  @media screen and (max-width: 992px) {
    max-width: 100%;
  }
`;

export const StyledNewsDetailsBody = styled.div`
  padding-top: 25px;
  display: grid;
  grid-template-columns: 1fr 350px;
  grid-gap: 30px;
  @media screen and (max-width: 992px) {
    grid-template-columns: 100%;
  }
`;

export const StyledNewsDetailsFooter = styled.div`
  min-height: 95px;
  margin-top: 50px;    
  padding-top: 50px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${({theme}) => theme.defaultColor};
  position: relative;
  a {
    position: absolute;
    text-decoration: none !important;
  }
  .prev {
    left: 0;
  }
  .next {
    right: 0;
  }
  
  @media screen and (max-width: 576px) {
    margin-top: 25px;
    padding-top: 25px;
    flex-direction: column;
    position: static;
    a {
      margin-bottom: 15px;
      position: static;
    }
  }
`;

export const StyledNewsDetailsContent = styled.div`
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
      width: 100% !important;
      height: auto !important;
      margin: 0 auto;
      display: block;
    }
    &:last-child {
      margin-bottom: 0;
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
    text-align: justify;
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
  a {
    color: ${({theme}) => theme.defaultColor};
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StyledNewsDetailsAside = styled.div`
  .article-aside__title {
    margin-bottom: 20px;
    font-size: 24px;
    text-transform: uppercase;
    span {
      font-weight: 400;
    }
  }
`;

export const StyledNewsRates = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  color: #fff;
  background: linear-gradient(90deg, rgba(236, 97, 17, 0.85) 0%, rgba(242, 139, 59, 0.85) 100%);
  border-radius: 10px;
  .dynamic-rates {
    margin-bottom: 10px;
    padding-bottom: 5px;
    display: grid;
    grid-template-columns: minmax(145px, 1fr) repeat(2, 1fr);
    grid-gap: 5px;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    &__direction {
      opacity: 0.75;
    }
  }
  .crypto {
    display: grid;
    grid-template-columns: 25px 1fr max-content;
    grid-gap: 5px;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &__name {
      max-width: 100%;
      font-size: 16px;
      font-weight: 700;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .icon-info {
      font-size: 10px;
      opacity: 0.45;
      font-weight: 400;
      border: 2px solid rgba(255, 255, 255, 1);
      width: 18px;
      height: 18px;
      display: inline-flex;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      cursor: help;
    }
  }
  .exchange-item {
    display: grid;
    grid-template-columns: minmax(145px, 1fr) repeat(2, 1fr);
    grid-gap: 5px;
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    &__name {
      display: grid;
      grid-template-columns: 25px max-content;
      grid-gap: 5px;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__course {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        // color: ${({theme}) => theme.defaultColor};
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
`;