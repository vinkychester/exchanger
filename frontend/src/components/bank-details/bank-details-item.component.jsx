import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import Spinner from "../spinner/spinner.component";
import DelayInputComponent from "../input-group/delay-input-group";

import BankDetailsItemDelete from "./bank-details-item-delete.component";
import BankDetailsItemAttribute from "./bank-details-item-attribute.component";

import { StyledCol } from "../styles/styled-table";

import { UPDATE_BANK_DETAILS } from "../../graphql/mutations/bank-detail.mutation";
import { BankDetailsAttributesContext } from "./bank-details-list.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { parseApiErrors } from "../../utils/response";

const BankDetailsItem = () => {
  const { id, attributes, title } = useContext(BankDetailsAttributesContext);

  const [errors, setErrors] = useState({});
  const [updateBankDetail, { loading, error }] = useMutation(
    UPDATE_BANK_DETAILS, { 
      onComplete: () => { setErrors({}); closableNotificationWithClick("Данные изменены.", "success"); },
      onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
    }
  );

  const handleChangeBankDetails = (event) => {
    const { name, value } = event.target;
    if (value !== "") {
      updateBankDetail({
        variables: { id, [name]: value.trim() },
      });
    }
  };

  return (
    <>
      <StyledCol className="bank-details-table__wallet" data-title="Название">
        <DelayInputComponent
          type="input"
          name="title"
          label="Название"
          value={title}
          handleChange={handleChangeBankDetails}
          debounceTimeout={1000}
          disabled={loading}
          errorMessage={errors.title}
          //autoComplete="off"
          required
        />
        {loading && (
          <div className="default-spinner">
            <Spinner color="#EC6110" type="moonLoader" size="17px" />
          </div>
        )}
      </StyledCol>
      {attributes &&
        attributes.map(({ id, ...props }) => (
          <BankDetailsItemAttribute key={id} id={id} {...props} />
        ))}
      <StyledCol className="bank-details-table__action">
        <BankDetailsItemDelete />
      </StyledCol>
    </>
  );
};

export default BankDetailsItem;
