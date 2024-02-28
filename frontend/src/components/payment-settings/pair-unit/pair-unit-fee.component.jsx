import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import DelayInputComponent from "../../input-group/delay-input-group";

import { UPDATE_PAIR_UNIT_DETAILS } from "../../../graphql/mutations/pair-unit.mutation";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { parseApiErrors } from "../../../utils/response";

const PairUnitFee = ({ id, type, name, field, regex, successMessage, errorMessage }) => {
  const [fee, setFee] = useState(field ?? 0);
  const [errors, setErrors] = useState({});

  const [updatePairUnitDetails, { loading, error }] = useMutation(
    UPDATE_PAIR_UNIT_DETAILS,
    {
      onCompleted: () => {
        setErrors([])
        closableNotificationWithClick(successMessage, "success");
        // setFee(updatePairUnit.pairUnit[name])
      },
      onError: ({ graphQLErrors }) => {
        setErrors(parseApiErrors(graphQLErrors));
      },
    }
  );

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setFee(value.trim().replace(/,/g, "."));
    if (value.trim() === "") {
      setErrors({ [name]: "Значение не должно быть пустым" });
      return false;
    }
    if (!value.trim().replace(/,/g, ".").match(regex)) {
      setErrors({ [name]: errorMessage });
      return false;
    }
    updatePairUnitDetails({
      variables: { id, [name]: +value.trim().replace(/,/g, ".") },
    });
  };

  return (
    <DelayInputComponent
      type={type}
      name={name}
      value={loading ? fee.toString() + " загрузка..." : fee.toString()}
      handleChange={handleChangeInput}
      debounceTimeout={1200}
      disabled={loading}
      errorMessage={errors[name]}
    />
  );
};

export default PairUnitFee;
