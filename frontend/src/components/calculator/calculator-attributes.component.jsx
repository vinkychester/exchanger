import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  createContext,
} from "react";
import Checkbox from "rc-checkbox";
import { useQuery } from "@apollo/react-hooks";

import $ from 'jquery';
import 'jquery-mask-plugin/dist/jquery.mask.min.js';

import AlertMessage from "../alert/alert.component";
import SkeletonInput from "../skeleton/skeleton-input";

import CalculatorAttributesContent from "./calculator-attributes-content.component";

import { StyledRequisitesField } from "./styled-calculator";
import {
  StyledCheckboxLabel,
  StyledCheckboxWrapper,
} from "../styles/styled-checkbox";

import { GET_ATTRIBUTES } from "../../graphql/queries/attribute.query";
import { CalculatorContext, CalculatorAttributesContext } from "./calculator.component";
import { getMask } from "../../utils/mask.util";

export const CalculatorAttributesContentContext = createContext();

const CalculatorAttributes = () => {
  const { handleChangeRequisitionDetails } = useContext(CalculatorContext);
  const { saveBankDetails, pairUnitId, direction, subName } = useContext(CalculatorAttributesContext);
  const [isShowCheckbox, setShowCheckbox] = useState(true);

  const handleToggleCheckbox = useCallback(
    (state) => {
      setShowCheckbox(state);
    },
    []
  );

  const { data, loading, error } = useQuery(GET_ATTRIBUTES, {
    variables: { pairUnit_id: pairUnitId, direction, locale: "ru" },
    fetchPolicy: "network-only",
  });

  const field = `${direction}Attributes`;

  useEffect(() => {
    if (data) {
      const { collectionQueryAttributes } = data;
      if (0 !== collectionQueryAttributes.length) {
        let requisites = [];
        collectionQueryAttributes.map(({ id, fieldType, name, regex }) => {
          getMask(name) !== "" && $(`input[name=${name}]`).mask(getMask(name));
          if ("cityId" === name && "CASH" === subName) {
            requisites.push({ id, name, isHidden: false, regex, value: "", information: null });
          }
          if ("contacts" === name && "CASH" === subName) {
            requisites.push({ id, name, isHidden: false, regex, value: "", information: null });
          }
          if ("hidden" === fieldType) {
            let value = "";
            if ("min" === name || "max" === name)
              value = +document.getElementById(`payment-exchange-${name}`).innerHTML;
            requisites.push({ id, name, isHidden: true, regex, value, information: null });
          }
        });
        handleChangeRequisitionDetails(field, requisites);
      }
    }
  }, [data]);

  if (loading) return <SkeletonInput width="10" label="skeleton" />;
  if (error) return <AlertMessage type="error" message="Error" margin="0 0 10px" />;
  if (!data) <AlertMessage type="warning" message="Not found" margin="0 0 10px" />;

  const { collectionQueryAttributes } = data;

  if (!collectionQueryAttributes.length) return <></>;

  const checkbox = `save${direction.charAt(0).toUpperCase() + direction.slice(1)}BankDetails`;

  return (
    <StyledRequisitesField>
      <div className="requisite-label">
        {"payment" === direction ? "Реквизиты для оплаты:" : "Реквизиты для получение:"}
      </div>
      <CalculatorAttributesContentContext.Provider
        value={{ collectionQueryAttributes, handleToggleCheckbox }}
      >
        <CalculatorAttributesContent />
      </CalculatorAttributesContentContext.Provider>
      {isShowCheckbox && "CASH" !== subName && (
        <StyledCheckboxWrapper margin="0 0 10px">
          <Checkbox
            id={`${direction}_save_details`}
            className="default-checkbox"
            onClick={() =>
              handleChangeRequisitionDetails(checkbox, !saveBankDetails)
            }
            name={`${direction}_save_details`}
            value={saveBankDetails}
          />
          <StyledCheckboxLabel position="right" htmlFor={`${direction}_save_details`}>
            Сохранить реквизиты в личный кабинет
          </StyledCheckboxLabel>
        </StyledCheckboxWrapper>
      )}
    </StyledRequisitesField>
  );
};

export default React.memo(CalculatorAttributes);
