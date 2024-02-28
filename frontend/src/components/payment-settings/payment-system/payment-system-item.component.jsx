import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import DelayInputComponent from "../../input-group/delay-input-group";
import Checkbox from "rc-checkbox";

import { StyledCol, StyledRow } from "../../styles/styled-table";

import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import Spinner from "../../spinner/spinner.component";

import { UPDATE_PAYMENT_SYSTEM_DETAILS } from "../../../graphql/mutations/payment-system.mutation";
import { parseApiErrors } from "../../../utils/response";

import { PaymentSystemContext } from "./payment-system.container";

const PaymentSystemItem = ({ id, name, price, tag, subName }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [checked, setChecked] = useState(false);
  const { setCountChecked } = useContext(PaymentSystemContext);
  const [updatePaymentSystemDetails, { loading, error }] = useMutation(
    UPDATE_PAYMENT_SYSTEM_DETAILS,
    {
      onCompleted: () => {
        setErrorMessage("");
        closableNotificationWithClick("Себестоимость успешно изменена", "success")
      },
      onError: ({ graphQLErrors }) =>
        setErrorMessage(parseApiErrors(graphQLErrors))
    }
  );

  const regex = /^[+-]?([0-9]*[.])?[0-9]+$/;

  const handleUpdatePrice = (event) => {
    const { name, value } = event.target;
    if (!regex.test(value)) {
      setErrorMessage("Значение не должно содержать символы");
      return false;
    }
    updatePaymentSystemDetails({
      variables: { id, [name]: +value.replace(/,/g, ".") }
    });
  };

  function onChangeCheckbox ({ target }) {
    setChecked(checked);
    target.checked ? setCountChecked(prev => ++prev) : setCountChecked(prev => --prev);
  }
  
  return (
    <StyledRow col="4" className="payment-system-price-table__row">
      <StyledCol data-title="Применить к" className="pairs-table__apply-to">
        <Checkbox className="default-checkbox" onChange={onChangeCheckbox} name="applyTo" id={id}/>
      </StyledCol>
      <StyledCol
        data-title="Название"
        className="payment-system-price-table__name"
      >
        <span className={`exchange-icon-${tag === "CRYPTO" ? subName : tag}`} />
        {name}
      </StyledCol>
      <StyledCol
        data-title="Тег"
        className="payment-system-price-table__tag"
      >
        {tag}
      </StyledCol>
      <StyledCol
        data-title="Ключ"
        className="payment-system-price-table__sub-name"
      >
        {subName}
      </StyledCol>
      <StyledCol
        data-title="Себестоимость"
        className="payment-system-price-table__price"
      >
        <DelayInputComponent
          type="text"
          name="price"
          value={price ? price : "0"}
          errorMessage={errorMessage}
          disabled={loading}
          handleChange={handleUpdatePrice}
          debounceTimeout={600}
        />
        {loading && <Spinner color="#EC6110" type="moonLoader" size="17px" />}
      </StyledCol>
    </StyledRow>
  );
};

export default PaymentSystemItem;
