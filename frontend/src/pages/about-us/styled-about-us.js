import styled from "styled-components";

export const StyledAboutUsWrapper = styled.div`
  padding: 20px 0;
  p, ul {
    text-align: justify;
  }
  p {
    text-indent: 22px;
  }
`;

export const StyledAboutUsContent = styled.div``;

export const StyledAboutUsSection = styled.div`
  padding: 30px 0;
  display: grid;
  grid-template-columns: 1fr 300px;
  align-items: center;
  grid-gap: 30px;
  .about-us__sub-title {
    margin: 0;
    padding: 25px 0;
  }
  .about-us__icon {
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({theme}) => theme.bgElements};
    border-radius: 50%;
    img {
      object-fit: contain;
      object-position: center;
    }
  }
  &:nth-child(2n) {
    grid-template-columns: 300px 1fr;
    .about-us__action {
      text-align: right;
    }
  }
  @media screen and (max-width: 992px) {
    grid-template-columns: 1fr 150px;
    grid-gap: 15px;
    .about-us__icon {
      width: 150px;
      height: 150px;
    }
    &:nth-child(2n) {
      grid-template-columns: 150px 1fr;
    }
  }
  @media screen and (max-width: 992px) {
    grid-template-columns: 100% !important;
    grid-template-areas: 'images'
                         'conent';
    .about-us__content {
      grid-area: conent;
    } 
    .about-us__icon {
      margin: 0 auto;
      grid-area: images;
    }
    .about-us__sub-title {
      text-align: center;
      padding: 15px 0;
    }
    .about-us__action {
      text-align: center !important;
    }
  }
`;