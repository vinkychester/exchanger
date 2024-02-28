import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import $ from "jquery";
import "jquery-mask-plugin/dist/jquery.mask.min.js";

import Spinner from "../spinner/spinner.component";
import DelayInputComponent from "../input-group/delay-input-group";

import { StyledCol } from "../styles/styled-table";

import { UPDATE_ATTRIBUTE_DETAILS } from "../../graphql/mutations/attribute.mutation";
import { BankDetailsAttributesContext } from "./bank-details-list.component";
import { validateCryptoWallet } from "../../utils/crypto.utils";
import { getMask, getPlaceholder } from "../../utils/mask.util";
import { parseApiErrors } from "../../utils/response";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import translate from "../../i18n/translate";

const BankDetailsItemAttribute = ({ id, name, value, regex }) => {
  const { asset } = useContext(BankDetailsAttributesContext);

  const [errors, setErrors] = useState({});
  const [updateAttributeDetail, { loading, error }] = useMutation(
    UPDATE_ATTRIBUTE_DETAILS, { 
      onComplete: () => {
        setErrors((prevState) => ({ ...prevState, [name]: "" }));
        closableNotificationWithClick("Данные изменены.", "success");
      },
      onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
    }
  );

  useEffect(() => {
    getMask(name) !== "" && $(`input[name=${name}]`).mask(getMask(name));
  }, [])

  const handleChangeAttribute = (event) => {
    const { name, value } = event.target;
    if (value !== "") {
      let regex = /\(\w+\)/;
      if ("wallet" === name && !regex.test(asset) && !validateCryptoWallet(asset, value.trim())) {
        setErrors({ wallet: "Невалидный кошелек" });
      } else {
        setErrors((prevState) => ({ ...prevState, wallet: "" }));
        updateAttributeDetail({
          variables: { id, value: value.trim() },
        });
      }
    }
  };

  return (
    <StyledCol className="bank-details-table__wallet" data-title="Реквизиты">
      <DelayInputComponent
        type="input"
        name={name}
        label={translate(name)}
        value={value}
        placeholder={getPlaceholder(name)}
        handleChange={handleChangeAttribute}
        debounceTimeout={1000}
        disabled={loading}
        errorMessage={errors[name]}
        //autoComplete="off"
        required
      />
      {loading && (
        <div className="default-spinner">
          <Spinner color="#EC6110" type="moonLoader" size="17px" />
        </div>
      )}
      {/* {error && <p>Error :( Please try again</p>} */}
    </StyledCol>
  );
};

export default BankDetailsItemAttribute;
