import styled from "styled-components";

export const StyledRequisitionDetailsAmount = styled.div`
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  grid-template-areas: "payment payout rate";
  @media screen and (max-width: 992px) {
    margin-bottom: 15px;
  }
  
  .requisition-info {
    margin-bottom: 0;
    &__subinfo {
      margin-top: 5px;
    }
  }
  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
    grid-template-areas:
          "payment payout"
          "rate rate";
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 100%;
    grid-template-areas:
          "payment"
          "payout"
          "rate";
  }

  .requisition-tab_payment {
    grid-area: payment;
  }

  .requisition-tab_payout {
    grid-area: payout;
  }

  .requisition-tab_rate {
    grid-area: rate;
  }

  .rate {
    &__arrow {
      padding: 0 10px;
      opacity: 0.5;
    }
  }
`;

