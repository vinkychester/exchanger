import React from "react";

import DelayInputComponent from "../../input-group/delay-input-group";
import translate from "../../../i18n/translate";

const MCCashDescription = ({ id, name, value, handleChangeMCCashDetails }) => {
  const handleChangeDescription = (event) => {
    const { value } = event.target;
    handleChangeMCCashDetails(id, name, value.trim(), null);
  };

  return (
    <DelayInputComponent
      type="text"
      name={name}
      label={translate(name)}
      className="mscash-field"
      value={value}
      handleChange={handleChangeDescription}
      debounceTimeout={600}
      required
    />
  );
};

export default MCCashDescription;
