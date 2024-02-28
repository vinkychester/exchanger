import React, { useCallback, useContext, useState } from "react";
import InputGroupComponent from "../input-group/input-group.component";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_REFERRAL_LEVEL } from "../../graphql/mutations/referral-level.mutation";
import { PaginationContext } from "./referral-level.container";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { StyledFormWrapper, StyledHiddenForm, StyledHiddenFormAction } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";
import {parseApiErrors} from "../../utils/response";

const ReferralLevelForm = () => {
  const [hide, setHide] = useState(true);
  const {
    paginationInfo: { currentPage, lastPage, totalCount, itemsPerPage },
    setPaginationInfo
  } = useContext(PaginationContext);

  const [errors, setErrors] = useState({});

  const [{ code, name, level, percent, isDefault }, setReferralLevel] = useState({
    code: "default",
    name: "",
    level: 1,
    percent: 0,
    isDefault: false
  });

  const [createReferralLevel, { loading }] = useMutation(CREATE_REFERRAL_LEVEL, {
    onCompleted: data => {
      setPaginationInfo(prevState => {
        return { ...prevState, totalCount: totalCount + 1 };
      });
      closableNotificationWithClick(
        `Реферальный уровень успешно создан.`,
        "success"
      );
    },
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
  });

  const handleChangeInput = useCallback(
    (event) => {
      const { name, value } = event.target;

      let localValue = value;
      if (event.target.type === "number") {
        localValue = +localValue;
      }

      setReferralLevel(prevState => ({ ...prevState, [name]: localValue }));
  });

  const onSubmit = (event) => {
    event.preventDefault();

    createReferralLevel({
      variables: {
        code, name, level, percent
      }
    });
  };

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  return (
    <StyledHiddenForm className="hidden-create-referral-level-form">
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
          className={`create-referral-level-form ${loading && "loading"}`}
          hide={hide}
        >
          <div className="create-referral-level-form__content">
            <InputGroupComponent
              handleChange={handleChangeInput}
              value={name}
              name="name"
              type="text"
              label="Имя уровня"
              required="required"
              className="create-referral-level-form__title"
            />
            <InputGroupComponent
              handleChange={handleChangeInput}
              value={+level}
              name="level"
              type="number"
              label="Уровень"
              min={1}
              errors={errors}
              required="required"
              className="create-referral-level-form__level"
            />
            <InputGroupComponent
              handleChange={handleChangeInput}
              value={percent}
              name="percent"
              type="number"
              label="Процент"
              required="required"
              className="create-referral-level-form__percent"
            />
          </div>
          <StyledButton
            type="submit"
            color="success"
            className="create-referral-level-form__button"
            weight="normal"
          >
            Сохранить
          </StyledButton>
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </StyledHiddenForm>

  );
};

export default ReferralLevelForm;