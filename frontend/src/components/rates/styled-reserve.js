import styled from "styled-components";

export const StyledReserveWrapper = styled.div`
  padding: 30px 0 25px;
  border-bottom: 1px solid ${({ theme }) => theme.defaultColor};
  display: grid;
  grid-template-rows: 60px;
  grid-template-columns: repeat(3, 1fr) repeat(2, 205px);
  grid-template-areas: "bank bank limits limits limits";
  grid-gap: 15px;
  @media screen and (max-width: 992px) {
    padding: 15px 0;
    grid-template-columns: 100%;
    grid-template-rows: repeat(2, auto);
    grid-template-areas:
      "bank"
      "limits";
  }
`;

export const StyledLimits = styled.div`
  display: grid;
  grid-template-columns: 1fr repeat(2, 205px);
  grid-template-rows: 52px auto;
  column-gap: 15px;
  row-gap: 5px;
  grid-area: limits;
  grid-template-areas: "min-max selling purchase "
                       "cardLimit cardLimit cardLimit";
  .min-max {
    grid-area: min-max;
  }
  .purchase {
    grid-area: purchase;
  }
  .selling {
    grid-area: selling;
  }
  .card-limit {
    grid-area: cardLimit;
  }
  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, auto);
    grid-template-areas:
      "selling purchase"
      "cardLimit cardLimit";
  }
`;

export const StyledAvailableReserve = styled.div`
  display: grid;
  grid-template-columns: 35px 1fr;
  grid-gap: 15px;
  grid-area: bank;
  .bank-reserve {
    &__title {
      font-size: 14px;
    }
    &__help {
      font-size: 10px;
      opacity: 0.5;
      a {
        text-decoration: underline;
      }
    }
  }
`;

export const StyledMinMaxTitle = styled.div`
  display: grid;
  align-items: center;
  p {
    font-weight: 700;
    display: flex;
    align-items: center;
    span {
      padding-right: 15px;
    }
  }
  @media screen and (max-width: 992px) {
    display: none;
  }
`;

export const StyledMinMax = styled.div`
  display: grid;
  align-items: center;
  position: relative;
  &:before {
    content: attr(data-title) ":";
    font-size: 14px;
    font-weight: 700;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    @media screen and (max-width: 992px) {
      display: block;
    }
  }
  @media screen and (max-width: 992px) {
    padding-top: 25px;
    p {
      margin: 5px 0;
      padding: 15px 0 0;
      position: relative;
      &:before {
        content: attr(data-title) ":";
        font-size: 10px;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0.5;
      }
    }
  }
`;

export const StyledCardLimit = styled.div`
  font-size: 12px;
  opacity: 0.5;
`;