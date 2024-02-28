import styled from "styled-components";

export const StyledTariffWrapper = styled.div`
  padding: 20px 0;
  .tariff-breadcrumb {
    margin-bottom: 20px;
  }

  .tariff-table {
    &__head, &__row {
      grid-template-columns: repeat(5, 1fr);
    }
    &__name {
      display: grid;
      grid-template-columns: 25px 1fr;
      grid-gap: 10px;
      align-items: center;
    }

    @media screen and (max-width: 992px) {
      &__row {
        margin-bottom: 15px;
        background-color: ${({ theme }) => theme.bgElements};
        border-radius: 10px;
        grid-template-rows: auto;
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: 'name tag'
                             'const const'
                             'min max';
      }
      &__name {
        grid-area: name;
      }
      &__tag {
        grid-area: tag;
      }
      &__const {
        grid-area: const;
      }
      &__percent {
        grid-area: percent;
      }
      &__min {
        grid-area: min;
      }
      &__min {
        grid-area: max;
      }
    }
  }
`;