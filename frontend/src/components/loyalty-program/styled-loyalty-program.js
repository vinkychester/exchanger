import styled from "styled-components";

export const StyledLoyaltyProgramWrapper = styled.div`
  padding: 20px 0;
`

export const StyledLoyaltyProgramContent = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  .icon-star-solid, .icon-star-regular {
    color: ${({ theme }) => theme.defaultColor};
    &:not(:last-child) {
      margin-right: 3px;
    }
  }
  .loyalty-program-table {
    margin-bottom: 15px;
    &__head, &__row {
      grid-template-columns: repeat(4, 1fr);
    }
    &__row {
      @media screen and (max-width: 768px) {
        grid-template-columns: 100%;
      }
    }
  }
  p, ul {
    text-align: justify;
  }
`
/*
export const StyledLoyaltyProgramStepsWrapper = styled.div`
  padding: 30px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  @media screen and (max-width: 768px) {
    grid-template-columns: 100%;
  }
`
export const StyledLoyaltyProgramStepItem = styled.div`
  text-align: center;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 60px 45px max-content;
  grid-gap: 15px;
  .step__title {
    font-size: 16px;
  }
  .step__content {
    display: inline-grid;
    align-items: start;
    text-align: center;
    opacity: 0.85;
  }
`*/
