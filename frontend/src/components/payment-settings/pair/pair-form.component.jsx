import React, { useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";

import FragmentSpinner from "../../spinner/fragment-spinner.component";
import InputGroupComponent from "../../input-group/input-group.component";
import AlertMessage from "../../alert/alert.component";
import PairUnitSelect from "./pair-unit-select.component";

import { StyledButton } from "../../styles/styled-button";
import { StyledFormWrapper } from "../../styles/styled-form";
import { StyledLoadingWrapper } from "../../spinner/styled-spinner";

import { CREATE_PAIR } from "../../../graphql/mutations/pair.mutation";
import { GET_ACTIVE_PAIR_UNITS } from "../../../graphql/queries/pair-unit.query";
import { GET_ALL_PAIRS_WITH_IS_REQUISITION } from "../../../graphql/queries/pair.query";
import { PairFilterContext } from "./pair.container";
import { filterPairUnitsByDirection } from "../../../graphql/pairUnit.utils";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { parseApiErrors } from "../../../utils/response";
import PairFormSkeleton from "../skeleton/pair-form-skeleton.component";

const INITIAL_STATE = { percent: 0, payment: 0, payout: 0 };

const PairForm = ({hideCreateForm}) => {
  const [pairDetails, setPairDetails] = useState(INITIAL_STATE);
  const { filter, currentPage } = useContext(PairFilterContext);
  const { pitemsPerPage } = filter;
  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { active, ...props } = object;

  const { loading, error, data } = useQuery(GET_ACTIVE_PAIR_UNITS, { 
    fetchPolicy : "network-only"
  });

  const [createPair, { loading: mutationLoading }] = useMutation(CREATE_PAIR, {
    onCompleted: () => {
      setPairDetails(prevState => ({ ...prevState, percent: 0, priority: "" }));
      closableNotificationWithClick("Пара успешно создана", "success");
    },
    refetchQueries: () => [
      {
        query: GET_ALL_PAIRS_WITH_IS_REQUISITION,
        variables: {
          ...props,
          itemsPerPage: pitemsPerPage ? parseInt(pitemsPerPage) : 50,
          page: currentPage,
          active: active ? active === "true" : null,
        },
      },
    ],
    onError: ({ graphQLErrors }) => {
      if (parseApiErrors(graphQLErrors).payment) {
        closableNotificationWithClick(parseApiErrors(graphQLErrors).payment, "error");
      }
    },
  });

  useEffect(() => {
    if (data) {
      const { collection } = data.pairUnits;
      if (collection.length !== 0) {
        const paymentCollection = filterPairUnitsByDirection(
          collection,
          "payment"
        );
        const payoutCollection = filterPairUnitsByDirection(
          collection,
          "payout"
        );

        setPairDetails((prevState) => ({
          ...prevState,
          payment: paymentCollection[0].id,
          payout: payoutCollection[0].id,
        }));
      } else {
        closableNotificationWithClick("Настройте табы и активность для платежных систем", "error");
      }
    }
  }, [data]);

  const handleChangeInput = useCallback((event) => {
    const { name, value } = event.target;
    setPairDetails((prevState) => ({ ...prevState, [name]: +value }));
  });

  const handleChangeSelect = useCallback((direction, value) => {
    setPairDetails((prevState) => ({ ...prevState, [direction]: value }));
  });

  if (loading) return <PairFormSkeleton hideCreateForm={hideCreateForm}/>;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.pairUnits;

  const paymentCollection = filterPairUnitsByDirection(collection, "payment");
  const payoutCollection = filterPairUnitsByDirection(collection, "payout");

  const onSubmit = (event) => {
    event.preventDefault();
    
    if(!Array.isArray(pairDetails.payment) && !Array.isArray(pairDetails.payout)){
      createPair({ variables: { ...pairDetails } });
    }
    if(Array.isArray(pairDetails.payment) && !Array.isArray(pairDetails.payout)){
      pairDetails.payment.map(payment => {
        createPair({ variables: { ...pairDetails, payment }});
      })
    }
    if(!Array.isArray(pairDetails.payment) && Array.isArray(pairDetails.payout)){
      pairDetails.payout.map(payout => {
        createPair({ variables: { ...pairDetails, payout }});
      })
    }
    if(Array.isArray(pairDetails.payment) && Array.isArray(pairDetails.payout)){
      pairDetails.payment.map(payment => {
        pairDetails.payout.map(payout => {
          createPair({ variables: { ...pairDetails, payment, payout }});
        })
      })
    }
  };

  const { payment, payout, percent, } = pairDetails;

  return (
    <StyledLoadingWrapper>
      {mutationLoading && <FragmentSpinner position="center" />}
      <StyledFormWrapper
        onSubmit={onSubmit}
        className={`payment-settings-form create-pair-form ${mutationLoading && "loading"}`}
        hide={hideCreateForm}
      >
        <div className="create-pair-form__content">
          <PairUnitSelect
            label="Отдаю"
            direction="payment"
            selected={payment}
            collection={paymentCollection}
            handleChangeSelect={handleChangeSelect}
          />
          <PairUnitSelect
            label="Получаете"
            direction="payout"
            selected={payout}
            collection={payoutCollection}
            handleChangeSelect={handleChangeSelect}
          />
          <InputGroupComponent
            handleChange={handleChangeInput}
            value={percent}
            name="percent"
            type="number"
            label="Процент"
            required="required"
            className="create-pair-form__percent"
          />
        </div>
        <StyledButton
          type="submit"
          color="success"
          className="create-pair-form__button"
          weight="normal"
        >
          Сохранить
        </StyledButton>
      </StyledFormWrapper>
    </StyledLoadingWrapper>
  );
};

export default PairForm;
