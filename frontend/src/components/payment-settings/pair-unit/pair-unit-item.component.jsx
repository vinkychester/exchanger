import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Checkbox from "rc-checkbox";

import PairUnitTab from "./pair-unit-tab.component";
import ActiveToggler from "../../active-toggler/active-toggler.component";
import DelayInputComponent from "../../input-group/delay-input-group";
import PairUnitFee from "./pair-unit-fee.component";

import { StyledCol, StyledRow } from "../../styles/styled-table";
import { StyledDirectionType } from "../../styles/styled-direction-type";

import {
  UPDATE_PAIR_UNIT_ACTIVITY,
  UPDATE_PAIR_UNIT_PRIORITY,
} from "../../../graphql/mutations/pair-unit.mutation";
import { UPDATE_PAIR_UNIT_DETAILS } from "../../../graphql/mutations/pair-unit.mutation";
import { GET_ACTIVE_PAIR_UNITS } from "../../../graphql/queries/pair-unit.query";
import { parseApiErrors } from "../../../utils/response";
import { PairUnitFilterContext } from "./pair-unit.container";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

const PairUnit = ({
  id,
  isActive,
  balance,
  priority,
  paymentSystem,
  currency,
  direction,
  service,
  fee,
  pairUnitTabs,
  isCardVerification,
  price,
}) => {
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState([]);

  const { setCountChecked } = useContext(PairUnitFilterContext);

  const [updatePairUnitActivity, { loading, error }] = useMutation(
    UPDATE_PAIR_UNIT_ACTIVITY,
    {
      onCompleted: () =>
        closableNotificationWithClick(
          "Активность платежной системы успешно изменена",
          "success"
        ),
        refetchQueries: [
          {
            query: GET_ACTIVE_PAIR_UNITS,
          }
        ]
    }
  );

  const [
    updatePairUnitDetails,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_PAIR_UNIT_DETAILS, {
    onCompleted: () =>
      closableNotificationWithClick(
        "Активность верификации карт успешно изменена",
        "success"
      ),
  });

  function onChangeCheckbox({ target }) {
    setChecked(checked);
    target.checked
      ? setCountChecked((prev) => ++prev)
      : setCountChecked((prev) => --prev);
  }

  return (
    <StyledRow
      scroll="auto"
      col="12"
      className="pair-unit-table__row"
      title={paymentSystem.name}
    >
      <StyledCol data-title="Применить к" className="pair-unit-table__apply-to">
        <Checkbox
          className="default-checkbox"
          onChange={onChangeCheckbox}
          name="applyTo"
          id={id}
        />
      </StyledCol>
      <StyledCol data-title="Активность" className="pair-unit-table__activity">
        <ActiveToggler
          id={id}
          name="isActive"
          value={isActive}
          text="Вы действительно хотите изменить активность платежной системы?"
          action={updatePairUnitActivity}
          loading={loading}
          error={error}
        />
      </StyledCol>
      <StyledCol
        data-title="Платежная система"
        className="pair-unit-settings-table__name payment-system"
      >
        <div
          className={`exchange-icon-${
            paymentSystem.tag === "CRYPTO" ? currency.asset : paymentSystem.tag
          }`}
        />
        <div className="payment-system__name">{paymentSystem.name}</div>
      </StyledCol>
      <StyledCol data-title="Валюта" className="pair-unit-table__currency">
        {currency.asset}
      </StyledCol>
      <StyledCol data-title="Баланс" className="pair-unit-table__currency">
        {balance}
      </StyledCol>
      <StyledCol data-title="Провайдер" className="pair-unit-table__provider">
        {service.name}
      </StyledCol>
      <StyledCol data-title="Тип" className="pair-unit-table__type">
        <StyledDirectionType type={direction}>
          {direction === "payment" ? "покупка" : "продажа"}
        </StyledDirectionType>
      </StyledCol>
      <StyledCol data-title="Процент" className="pair-unit-table__percent">
        {fee.percent}
      </StyledCol>
      <StyledCol data-title="Константа" className="pair-unit-table__const">
        {fee.constant}
      </StyledCol>
      <StyledCol data-title="Минимум" className="pair-unit-table__min">
        {fee.min}
      </StyledCol>
      <StyledCol data-title="Максимум" className="pair-unit-table__max">
        {fee.max}
      </StyledCol>
      <StyledCol data-title="Себестоимость" className="pair-unit-table__price">
        <PairUnitFee
          id={id}
          type="text"
          name="price"
          field={price}
          regex={/^[+-]?([0-9]*[.])?[0-9]+/g}
          successMessage="Себестоимость успешно изменена"
          errorMessage="Значение не должно содержать символы"
        />
      </StyledCol>
      <StyledCol data-title="Приоритет" className="pair-unit-table__priority">
        <PairUnitFee
          id={id}
          type="text"
          name="priority"
          field={priority}
          regex={/^\d*/g}
          successMessage="Приоритет успешно изменен"
          errorMessage="только целые числа"
        />
      </StyledCol>
      <StyledCol
        data-title="Верификация карт"
        className="pair-unit-table__card-verification"
      >
        {direction === "payment" && currency.tag === "CURRENCY" && (
          <ActiveToggler
            id={id}
            name="isCardVerification"
            value={isCardVerification}
            text="Вы действительно хотите изменить активность верификации карт?"
            action={updatePairUnitDetails}
            loading={mutationLoading}
            error={mutationError}
          />
        )}
      </StyledCol>
      <StyledCol
        data-title="Пункт калькулятора"
        className="pair-unit-table__calculator"
      >
        <PairUnitTab currentTab={pairUnitTabs} pairUnitId={id} />
      </StyledCol>
    </StyledRow>
  );
};

export default PairUnit;
