import React, { useCallback } from "react";

import DelayInputComponent from "../input-group/delay-input-group";

import { refineParams } from "../../utils/filter.utils";

const ClientsNewsFilter = ({ filter, setFilter }) => {
  const handleChange = useCallback((event) => {
    const { value, name } = event.target;

    setFilter(
      refineParams({
        ...filter,
        [name]: value.trim(),
        page: 1,
      })
    );
  });

  return (
    <>
      <DelayInputComponent
        type="text"
        name="text"
        label="Поиск"
        handleChange={handleChange}
        value={filter.text ?? ""}
        debounceTimeout={600}
        autoComplete="off"
      />
      {/*<StyledButton
        type="button"
        color="main"
        className="clear-filter"
        title="Очистить фильтр"
        weight="normal"
        onClick={() => clearFilter(setFilter)}
      >
        <span className="icon-trash" /> Очистить фильтр
      </StyledButton>*/}
    </>
  );
};

export default ClientsNewsFilter;
