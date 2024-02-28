import React from "react";
import { useQuery } from "@apollo/react-hooks";

import AlertMessage from "../alert/alert.component";
import Calculator from "./calculator.component";
import LoadCalculator from "./skeleton/load-calculator";

import { StyledContainer } from "../styles/styled-container";

import { GET_PAIRS_TOTAL_COUNT } from "../../graphql/queries/pair.query";

const CalculatorContainer = () => {
  const { data, loading, error } = useQuery(GET_PAIRS_TOTAL_COUNT, {
    fetchPolicy: "network-only",
  });

  if (loading || !data) return <LoadCalculator />;

  const { totalCount } = data.pairs.paginationInfo;

  if (totalCount === 0) {
    return (
      <StyledContainer as="section" wrapper="content">
        <AlertMessage
          margin="30px 0"
          type="warning"
          message="Нет обменных пар"
        />
      </StyledContainer>
    );
  }

  return <Calculator />;
};

export default CalculatorContainer;
