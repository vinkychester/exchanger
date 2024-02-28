import React from "react";

import DelayInputComponent from "../input-group/delay-input-group";

const FilterUserDetails = ({ firstname, lastname, handleChangeInput }) => {
  return (
    <>
      <DelayInputComponent
        type="text"
        name="firstname"
        label="Имя"
        handleChange={handleChangeInput}
        value={firstname ?? ""}
        debounceTimeout={600}
        autoComplete="off"
      />
      <DelayInputComponent
        type="text"
        name="lastname"
        label="Фамилия"
        handleChange={handleChangeInput}
        value={lastname ?? ""}
        debounceTimeout={600}
        autoComplete="off"
      />
    </>
  );
};

export default FilterUserDetails;
