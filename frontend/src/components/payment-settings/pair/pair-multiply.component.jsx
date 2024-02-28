import React, { useCallback, useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Checkbox from "rc-checkbox";

import FragmentSpinner from "../../spinner/fragment-spinner.component";
import InputGroupComponent from "../../input-group/input-group.component";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import { UPDATE_PAIR_ACTIVITY, UPDATE_PAIR_PERCENT, UPDATE_PAIR_TOP } from "../../../graphql/mutations/pair.mutation";
import { PairFilterContext } from "./pair.container";
import { GET_ALL_PAIRS_WITH_IS_REQUISITION } from "../../../graphql/queries/pair.query";

import { StyledCheckboxLabel, StyledCheckboxWrapper } from "../../styles/styled-checkbox";
import { StyledButton } from "../../styles/styled-button";
import { StyledFormWrapper } from "../../styles/styled-form";
import { StyledLoadingWrapper } from "../../spinner/styled-spinner";

const PairMultiply = ({ hideMultiActions }) => {
  const [isActive, setIsActive] = useState(false);
  const { filter, currentPage, countChecked } = useContext(PairFilterContext);
  const { pitemsPerPage } = filter;
  const itemsPerPage = pitemsPerPage ? +pitemsPerPage : 50;
  const object = Object.entries(filter).reduce(
    (a, [k, v]) => ((a[k.slice(1)] = v), a),
    {}
  );
  const { active, ...props } = object;
  const [percent, setPercent] = useState(0);
  const [top, setTop] = useState(0);

  const [updatePairActivity, { loading: activeLoading }] = useMutation(
    UPDATE_PAIR_ACTIVITY,
    {
      onCompleted: () => {
        closableNotificationWithClick(
          "Активность пар успешно изменена",
          "success"
        );
      },
      refetchQueries: () => [
        {
          query: GET_ALL_PAIRS_WITH_IS_REQUISITION,
          variables: {
            ...props,
            itemsPerPage,
            page: currentPage,
            active: active ? active === "true" : null,
          },
        },
      ],
    }
  );

  const [updatePairPercent, { loading: mutationLoading }] = useMutation(
    UPDATE_PAIR_PERCENT,
    {
      onCompleted: () => {
        closableNotificationWithClick("Процент успешно изменен", "success");
      },
      refetchQueries: () => [
        {
          query: GET_ALL_PAIRS_WITH_IS_REQUISITION,
          variables: {
            ...props,
            itemsPerPage,
            page: currentPage,
            active: active ? active === "true" : null
          }
        },
      ],
    }
  );

  const [updatePairTop, { loading: topLoading }] = useMutation(UPDATE_PAIR_TOP, {
    onCompleted: () => {
      closableNotificationWithClick("Топ пары успешно изменен", "success");
    },
    onError: () => {
      closableNotificationWithClick("Топ может быть только целым числом", "error");
    },
    refetchQueries: () => [
      {
        query: GET_ALL_PAIRS_WITH_IS_REQUISITION,
        variables: {
          ...props,
          itemsPerPage,
          page: currentPage,
          active: active ? active === "true" : null
        }
      }
    ]
  });
  const handleChangeInput = useCallback((event) => {
    setPercent(+event.target.value);
  });
  
  const handleChangeTop = useCallback((event) => {
    setTop(+event.target.value);
  });

  function onChangeCheckbox ({ target }) {
    setIsActive(target.checked);
  }

  const onPercentChange = () => {
    let data = document.getElementsByName("applyTo");

    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        updatePairPercent({
          variables: { id: data[i].id, percent }
        });
      }
    }
  };

  const onActivityChange = () => {
    let data = document.getElementsByName("applyTo");

    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        updatePairActivity({
          variables: { id: data[i].id, isActive }
        });
      }
    }
  };
  
  const onTopChange = () => {
    let data = document.getElementsByName("applyTo");
    
    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        updatePairTop({
          variables: {
            id: data[i].id,
            top
          }
        });
      }
    }
  };
  
  return (
    <StyledLoadingWrapper>
      {(activeLoading || mutationLoading || topLoading) && (
        <FragmentSpinner position="center" />
      )}
      <StyledFormWrapper
        className={`payment-settings-form change-multiply ${
          mutationLoading && "loading"
        }`}
        hide={hideMultiActions}
      >
        <div className="change-multiply__content">
          <div className="change-multiply__item">
            <StyledCheckboxWrapper className="change-multiply__checkbox">
              <StyledCheckboxLabel htmlFor="active_pair">
                Активность:
              </StyledCheckboxLabel>
              <Checkbox
                id="active_pair"
                className="default-checkbox"
                onChange={onChangeCheckbox}
              />
            </StyledCheckboxWrapper>
            <StyledButton
              type="button"
              color="success"
              weight="normal"
              onClick={onActivityChange}
            >
              {"Применить к " + countChecked + " из " + itemsPerPage}
            </StyledButton>
          </div>
          <div className="change-multiply__item">
            <InputGroupComponent
              onChange={handleChangeInput}
              value={percent}
              name="percent"
              type="number"
              label="Процент"
              required="required"
              className="create-pair-form__percent"
            />
            <StyledButton
              type="button"
              color="success"
              className="create-pair-form__button"
              weight="normal"
              onClick={onPercentChange}
            >
              {"Применить к " + countChecked + " из " + itemsPerPage}
            </StyledButton>
          </div>
          <div className="change-multiply__item">
            <InputGroupComponent
              onChange={handleChangeTop}
              value={top}
              name="top"
              type="number"
              label="Топ"
              required="required"
              className="create-pair-form__percent"
            />
            <StyledButton
              type="button"
              color="success"
              className="create-pair-form__button"
              weight="normal"
              onClick={onTopChange}
            >
              {"Применить к " + countChecked + " из " + itemsPerPage}
            </StyledButton>
          </div>
        </div>
      </StyledFormWrapper>
    </StyledLoadingWrapper>
  );
};

export default PairMultiply;
