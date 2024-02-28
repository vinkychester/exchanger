import styled from "styled-components";

export const StyledCardVerificationDetailsWrapper = styled.div`
  .verification-card-details__title {
    margin: 0;
    padding: 20px 0;
  }
  .verification-card-details__action {
    padding-top: 15px;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-gap: 15px;
    @media screen and (max-width: 480px) {
      grid-template-columns: 100%;
    }
  }
  
  .card-verification-details-table {
    padding-top: 15px;
    &__head, &__row {
      grid-template-columns: repeat(${({ role }) => role === "client" ? "4" : "7"}, 1fr);
    }

    .client {
      align-content: center;
      &__name {
        font-weight: 700;
        text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        a:hover {
          color: ${({theme}) => theme.defaultColor};
        }
      }
      &__email {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 0.4;
      }
    }
    
    @media screen and (max-width: 992px) {
      &__row {
        grid-template-columns: 100%;
      }
    }
  }
`;

export const StyledCVDetailsImages = styled.div`
  padding-top: 15px;
  display: flex;
  flex-wrap: wrap;
  .image-item {
    width: 200px;
    height: 150px;
    margin: 5px 10px 5px 0;
    border: 1px solid ${({ theme }) => theme.defaultColor};
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
`;