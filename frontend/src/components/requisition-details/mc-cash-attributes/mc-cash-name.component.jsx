import React from "react";

import DelayInputComponent from "../../input-group/delay-input-group";
import translate from "../../../i18n/translate";

const MCCashName = ({ id, name, value, handleChangeMCCashDetails }) => {
  const handleChangeExchangePointName = (event) => {
    const { name, value } = event.target;
    handleChangeMCCashDetails(id, name, value.trim(), null);
  };

  return (
    <DelayInputComponent
      type="text"
      name={name}
      label={translate(name)}
      className="mscash-field"
      value={value}
      handleChange={handleChangeExchangePointName}
      debounceTimeout={600}
      required
    />
  );
};

export default MCCashName;
