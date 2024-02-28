import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Checkbox from "rc-checkbox";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import Select, { Option } from "rc-select";

import { StyledButton } from "../../styles/styled-button";
import { StyledFormWrapper } from "../../styles/styled-form";
import { StyledLoadingWrapper } from "../../spinner/styled-spinner";
import {
  StyledSelect,
  StyledSelectLabel,
} from "../../styles/styled-img-select";

import FragmentSpinner from "../../spinner/fragment-spinner.component";
import Spinner from "../../spinner/spinner.component";

import {
  UDATE_PAIR_UNIT_TAB,
  UPDATE_PAIR_UNIT_ACTIVITY,
} from "../../../graphql/mutations/pair-unit.mutation";
import { GET_PAIR_UNITS_LIST_WITH_FEE } from "../../../graphql/queries/pair-unit.query";
import { GET_PAIR_UNIT_TABS } from "../../../graphql/queries/pair-unit-tab.query";
import { PairUnitFilterContext } from "./pair-unit.container";
import {
  StyledCheckboxLabel,
  StyledCheckboxWrapper,
} from "../../styles/styled-checkbox";
import LoadButton from "../../spinner/button-spinner.component";

const PairUnitMultiply = () => {
  const [hide, setHide] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const { filter, currentPage, countChecked } = useContext(
    PairUnitFilterContext
  );
  const { uitemsPerPage } = filter;
  const itemsPerPage = uitemsPerPage ? +uitemsPerPage : 50;
  const object = Object.entries(filter).reduce(
    (a, [k, v]) => ((a[k.slice(1)] = v), a),
    {}
  );
  const { active, ...props } = object;
  const [selectedPairUnitTabs, setSelectedPairUnitTabs] = useState(null);

  const { loading: queryLoading, data } = useQuery(GET_PAIR_UNIT_TABS);

  const [updatePairActivity, { loading: activeLoading }] = useMutation(
    UPDATE_PAIR_UNIT_ACTIVITY,
    {
      onCompleted: () => {
        closableNotificationWithClick(
          "Активность пар успешно изменена",
          "success"
        );
      },
      refetchQueries: () => [
        {
          query: GET_PAIR_UNITS_LIST_WITH_FEE,
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

  const [
    updatePairUnitTab,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UDATE_PAIR_UNIT_TAB, {
    onCompleted: () => {
      closableNotificationWithClick("Таб успешно изменен", "success");
    },
    refetchQueries: () => [
      {
        query: GET_PAIR_UNITS_LIST_WITH_FEE,
        variables: {
          ...props,
          itemsPerPage,
          page: currentPage,
          active: active ? active === "true" : null,
        },
      },
    ],
  });

  const handleChangePairUnitTab = (value) => {
    setSelectedPairUnitTabs(value);
  };

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  function onChangeCheckbox({ target }) {
    setIsActive(target.checked);
  }

  const onTabChange = () => {
    let data = document.getElementsByName("applyTo");

    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        updatePairUnitTab({
          variables: { id: data[i].id, pairUnitTabs: selectedPairUnitTabs },
        });
      }
    }
  };

  const onActivityChange = () => {
    let data = document.getElementsByName("applyTo");

    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        updatePairActivity({
          variables: { id: data[i].id, isActive },
        });
      }
    }
  };

  if (queryLoading)
    return <LoadButton weight="normal" text="Множественный выбор" mb="20" />;
  const { pairUnitTabs } = data;

  return (
    <div className="payment-settings-actions">
      <div className="payment-settings-actions__top">
        <StyledButton type="button" weight="normal" onClick={showForm}>
          Множественный выбор
        </StyledButton>
      </div>
      <StyledLoadingWrapper>
        {(activeLoading || mutationLoading) && (
          <FragmentSpinner position="center" />
        )}
        <StyledFormWrapper
          className={`payment-settings-form change-multiply ${
            mutationLoading && "loading"
          }`}
          hide={hide}
        >
          <div className="change-multiply__content">
            <div className="change-multiply__item">
              <StyledCheckboxWrapper className="change-multiply__checkbox">
                <StyledCheckboxLabel htmlFor="active_pair_unit">
                  Активность:
                </StyledCheckboxLabel>
                <Checkbox
                  id="active_pair_unit"
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
              <StyledSelect className="input-group">
                <StyledSelectLabel>Пункт калькулятора:</StyledSelectLabel>

                <Select
                  className="custom-select-img"
                  defaultValue={null}
                  disabled={mutationLoading}
                  onChange={handleChangePairUnitTab}
                >
                  <Option value={null} label="Таб не выбран">
                    <div className="option-select-item">Таб не выбран</div>
                  </Option>
                  {pairUnitTabs.map(({ id, name }) => (
                    <Option key={id} value={id} label={name}>
                      <div className="option-select-item">{name}</div>
                    </Option>
                  ))}
                </Select>
              </StyledSelect>
              {mutationLoading && (
                <div className="default-spinner">
                  <Spinner color="#EC6110" type="moonLoader" size="17px" />
                </div>
              )}
              {mutationError && <p>Error :( Please try again</p>}
              <StyledButton
                type="button"
                color="success"
                className="create-pair-form__button"
                weight="normal"
                onClick={onTabChange}
              >
                {"Применить к " + countChecked + " из " + itemsPerPage}
              </StyledButton>
            </div>
          </div>
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </div>
  );
};

export default PairUnitMultiply;
