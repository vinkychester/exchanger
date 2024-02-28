import React, { useCallback, useState } from "react";
import { StyledFormWrapper, StyledHiddenForm, StyledHiddenFormAction } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import InputGroupComponent from "../input-group/input-group.component";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_CASHBACK_LEVEL } from "../../graphql/mutations/cashback-level.mutation";
import { GET_CASHBACK_LEVELS } from "../../graphql/queries/cashback-level.query";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import {parseApiErrors} from "../../utils/response";

const CashbackLevelForm = ({ setPaginationInfo }) => {
  const [hide, setHide] = useState(true);

  const [{ name, profitRangeFrom, profitRangeTo, level, percent }, setCashbackLevel] = useState({
    name: "",
    profitRangeFrom: 0,
    profitRangeTo: 0,
    level: 1,
    percent: 1,
    isDefault: false
  });

  const [errors, setErrors] = useState({});


  const [createCashbackLevel, { loading }] = useMutation(CREATE_CASHBACK_LEVEL, {
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors)),
    refetchQueries: [
      {
        query: GET_CASHBACK_LEVELS
      }],
    onCompleted: data => {
      setPaginationInfo(prevState => {
          return { ...prevState, totalCount: prevState.totalCount + 1 };
        }
      );

      closableNotificationWithClick(
        `Кешбэк уровень успешно создан.`,
        "success"
      );
    }
  });

  const handleChangeInput = useCallback(
    (event) => {
      const { name, value } = event.target;

      let localValue = value;
      if (event.target.type === "number") {
        localValue = +localValue;
      }

      setCashbackLevel(prevState => ({ ...prevState, [name]: localValue }));
    });

  const onSubmit = (event) => {
    event.preventDefault();

    createCashbackLevel({
      variables: {
        name, profitRangeFrom, profitRangeTo, level, percent
      }
    });
  };

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  return (
    <StyledHiddenForm className="hidden-create-cashback-level-form">
      <StyledHiddenFormAction>
        <StyledButton
          type="button"
          color="main"
          onClick={showForm}
        >
          Добавить уровень
        </StyledButton>
      </StyledHiddenFormAction>
      <StyledLoadingWrapper mt="20" mb="10">
        {loading && <FragmentSpinner position="center" />}
        <StyledFormWrapper
          onSubmit={onSubmit}
          className={`create-cashback-level-form ${loading && "loading"}`}
          hide={hide}
        >
          <div className="create-cashback-level-form__content">
            <InputGroupComponent
              handleChange={handleChangeInput}
              value={name}
              name="name"
              type="text"
              label="Имя уровня"
              required="required"
              className="create-cashback-level-form__title"
            />
            <InputGroupComponent
              handleChange={handleChangeInput}
              value={level}
              name="level"
              type="number"
              label="Уровень"
              required="required"
              min={1}
              errors={errors}
              className="create-cashback-level-form__level"
            />
            <InputGroupComponent
              handleChange={handleChangeInput}
              value={percent}
              name="percent"
              type="number"
              label="Процент"
              min={0}
              max={50}
              required="required"
              className="create-cashback-level-form__percent"
            />
            <InputGroupComponent
              handleChange={handleChangeInput}
              value={profitRangeFrom}
              name="profitRangeFrom"
              type="number"
              label="С какого количества средств"
              required="required"
              className="create-cashback-level-form__range-from"
            />
            <InputGroupComponent
              handleChange={handleChangeInput}
              value={profitRangeTo}
              name="profitRangeTo"
              type="number"
              label="По какое количество средств"
              required="required"
              className="create-cashback-level-form__range-to"
            />
          </div>

          <StyledButton
            type="submit"
            color="success"
            className="create-cashback-level-form__button"
            weight="normal"
          >
            Сохранить
          </StyledButton>
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </StyledHiddenForm>

  );
};

export default CashbackLevelForm;
