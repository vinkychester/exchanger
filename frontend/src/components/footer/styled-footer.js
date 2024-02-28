import styled from 'styled-components'

export const StyledFooter = styled.footer`
  padding: 75px 0 40px;
  background-color: ${({theme}) => theme.bgElements}; 
  .footer-author {
    opacity: 0.5;
  }
  @media screen and (max-width: 992px) {
    padding: 50px 0 110px;
  }
  @media screen and (max-width: 576px) {
    padding-bottom: 90px
  }
`;

export const StyledFooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 30px;
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: 'info document'
                         'address address'
                         'social social';
    .footer-info-links {
      grid-area: info;
    }
    .footer-document-links {
      grid-area: document;
    }
    .footer-address-links {
      grid-area: address;
    }
    .footer-social-links {
      grid-area: social;
      grid-template-columns: repeat(2, 1fr);
      grid-template-areas: 'email social-list';
      &__email{
        grid-area: email;
      }
      &__social-list {
        grid-area: social-list;
      }
    }
  }
  
  
  @media screen and (max-width: 480px) {
    grid-template-columns: 100%;
    grid-template-areas: 'social'
                         'info'
                         'document'
                         'address';
    //.footer-info-links {
    //  grid-area: info;
    //}
    //.footer-document-links {
    //  grid-area: document;
    //}
    //.footer-address-links {
    //  grid-area: address;
    //}
    .footer-social-links {
      //grid-area: social;
      grid-template-columns: 100%;
      grid-template-areas: 'social-list'
                           'email';
      //&__email{
      //  grid-area: email;
      //}
      //&__social-list {
      //  grid-area: social-list;
      //}
    }
  }
`;

export const StyledFooterContentItem = styled.div`
  .footer-item__title {
    padding-bottom: 10px;
    font-weight: 700;
    text-transform: uppercase;
    opacity: 0.75;
  }
  .footer-item__list {
    li {
      padding: 5px 0;
      opacity: 0.5;
      a {
        &:hover{
          color: ${({theme}) => theme.defaultColor};
        }
      }
    }
  }
  .social-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 30px);
    grid-gap: 10px;
    li {
      padding: 0;
      opacity: 1;
      a {
        display: block;
        transition: all .3s ease;
        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
`;

export const StyledFooterBlock = styled.div`
  display: grid;
  grid-gap: 25px;
  grid-template-columns: 100%;
  grid-template-rows: max-content;
  @media screen and (max-width: 768px) {
    grid-template-rows: minmax(120px, max-content);
  }
  @media screen and (max-width: 480px) {
    grid-template-rows: max-content;
  }
`;

export const StyledMerchantsWrapper = styled.div`
  padding: 40px 0;
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(4, max-content);
  align-items: center;
  @media screen and (max-width: 992px) {
    padding: 25px 0;
  }
`;