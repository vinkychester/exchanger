import React, { useState, useContext } from "react";
import Checkbox from "rc-checkbox";
import Tooltip from "rc-tooltip";
import { NavLink } from "react-router-dom";

import LoadButton from "../spinner/button-spinner.component";

import { StyledAgreeMessage } from "./styled-calculator";
import { StyledButton } from "../styles/styled-button";
import {
  StyledCheckboxLabel,
  StyledCheckboxWrapper,
} from "../styles/styled-checkbox";

import { CalculatorExchangeContext } from "./calculator.component";

const CalculatorRequisites = ({ createRequisitionLoading }) => {
  const { isCollectionLoading } = useContext(CalculatorExchangeContext);
  const [isTermsAccepted, setTermsAccepted] = useState(false);

  return (
    <>
      <StyledCheckboxWrapper>
        <Checkbox
          id="isTermsAccepted"
          name="isTermsAccepted"
          className="default-checkbox"
          onClick={() => setTermsAccepted(!isTermsAccepted)}
          value={isTermsAccepted}
        />
        <StyledCheckboxLabel position="right" htmlFor="isTermsAccepted">
          Ознакомлен и согласен с{" "}
          <NavLink to="/useterms" className="default-link" target="_blank" rel="noreferrer">
            правилами использования сервиса
          </NavLink>
          .
        </StyledCheckboxLabel>
      </StyledCheckboxWrapper>
      {!isCollectionLoading && (
        <StyledAgreeMessage>
          <p>
            Нажимая кнопку "подтвердить", Вы подтверждаете свое согласие с{" "}
            правилами использования сервиса
            .
          </p>
          <Tooltip placement="top" overlay="Заполните все атрибуты">
            <div
              className={`contact-form__tooltip ${!isTermsAccepted && "contact-form_tooltip-off"
                }`}
            />
          </Tooltip>
          {createRequisitionLoading ? (
            <LoadButton color="main" text="Подтвердить" type="button" />
          ) : (
            <StyledButton type="submit" color="main" disabled={!isTermsAccepted}>
              Подтвердить
            </StyledButton>
          )}
        </StyledAgreeMessage>
      )}
    </>
  );
};

export default React.memo(CalculatorRequisites);
