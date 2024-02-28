import React, { useContext, useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";

import SkeletonInput from "../skeleton/skeleton-input";
import DelayInputComponent from "../input-group/delay-input-group";

import { StyledTabInputWrapper } from "./styled-calculator";

import { GET_CALCULATED_DETAILS } from "../../graphql/mutations/pair.mutation";
import { CalculatorContext, CalculatorTabContext, CalculatorFooterContext } from "./calculator.component";
import { getID } from "../../utils/calculator.utils";

const INITIAL_STATE = { min: 0, max: 0, constant: 0, asset: "" };

const CalculatorFooter = () => {
  let history = useHistory();
  const { pair, errors, handleChangeRequisitionDetails } = useContext(CalculatorContext);
  const { direction } = useContext(CalculatorTabContext);
  const {
    amount,
    handleChangeRequisitionAmount,
    loading,
    refetch,
  } = useContext(CalculatorFooterContext);

  const [calculatedDetails, setCalculatedDetails] = useState(INITIAL_STATE);
  const field = `${direction}Amount`;

  const [getCalculatedDetails, { loading: mutationLoading }] = useMutation(
    GET_CALCULATED_DETAILS,
    {
      onCompleted: ({ calculatorDetailsMutationPair }) => {
        const { pair } = calculatorDetailsMutationPair;
        const { amount, min, max, fee, currency } = pair[direction];
        handleChangeRequisitionDetails(field, amount);
        setCalculatedDetails({ min, max, constant: fee.constant, asset: currency.asset });
      },
    }
  );

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    if (history.location.state) {
      const { direction } = history.location.state;
        getCalculatedDetails({
          variables: { pairID: getID(pair), direction, amount: "1" },
          context: { fetchOptions: { signal }}
        });
    } else {
      getCalculatedDetails({ 
        variables: { pairID: getID(pair) },
        context: { fetchOptions: { signal }}
       });
    }
    return () => {
      abortController.abort();
    };
  }, [refetch]);

  const handleChangeAmount = (event) => {
    const { value } = event.target;
    handleChangeRequisitionAmount(value.trim(), direction);
  };

  const handleChangeLimit = (event) => {
    const { innerHTML } = event.target;
    handleChangeRequisitionDetails(field, innerHTML);
    handleChangeRequisitionAmount(innerHTML, direction);
  };

  const { min, max, constant, asset } = calculatedDetails;
  const isLoadingAmount = loading || mutationLoading;

  return (
    <StyledTabInputWrapper className="exchange-data">
      <div className="exchange-data__input" data-currency={isLoadingAmount ? null : asset}>
        {isLoadingAmount ? (
          <SkeletonInput />
        ) : (
          <DelayInputComponent
            type="text"
            name={`${direction}-amount`}
            value={
              isLoadingAmount ? "пересчет..." : amount === 0 ? "0" : amount
            }
            debounceTimeout={1000}
            handleChange={handleChangeAmount}
            disabled={isLoadingAmount}
            errorMessage={errors && errors[field]}
          />
        )}
      </div>

      <div className="exchange-data__min-max">
        <p>
          Мин.:{" "}
          <span id={`${direction}-exchange-min`} onClick={handleChangeLimit}>
            {mutationLoading ? "пересчет..." : min}
          </span> {asset}{" "}
          / Макс.:{" "}
          <span id={`${direction}-exchange-max`} onClick={handleChangeLimit}>
            {mutationLoading ? "пересчет..." : max}
          </span> {asset}
        </p>
        <p>
          Комиссия за перевод: {constant} {asset}, некоторые банки могут брать
          доп. комиссию за перевод
        </p>
      </div>
    </StyledTabInputWrapper>
  );
};

export default React.memo(CalculatorFooter);
