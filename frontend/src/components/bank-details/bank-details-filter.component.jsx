import React, { useState , useContext} from "react";

import DelayInputComponent from "../input-group/delay-input-group";
import FilterPaymentSystemSelect from "../filter-components/filter-payment-system-select.component";
import FilterDirectionSelect from "../filter-components/filter-direction-select.component";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction,
} from "../styles/styled-filter";
import { StyledButton } from "../styles/styled-button";

import { BankDetailsFilterContext } from "./bank-details.container";

const BankDetailsFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter } = useContext(BankDetailsFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || "page" in filter);

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { payment_system, direction, currency, title, value } = filter;

  return (
    <StyledHiddenFilter>
      <StyledHiddenFilterAction>
        <StyledButton
          color="main"
          type="button"
          title="Фильтр"
          weight="normal"
          onClick={toggleFilter}
        >
          <span className="icon-filter" /> Фильтр
        </StyledButton>
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <FilterPaymentSystemSelect
            name={"payment_system"}
            value={payment_system}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterDirectionSelect
            name={"direction"}
            value={direction}
            handleChangeFilter={handleChangeFilter}
          />
          <DelayInputComponent
            type="text"
            name={"currency"}
            label="Валюта"
            handleChange={handleChangeInput}
            value={currency ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name={"title"}
            label="Название"
            handleChange={handleChangeInput}
            value={title ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name={"value"}
            label="Значение"
            handleChange={handleChangeInput}
            value={value ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
        </StyledFilterBlock>
        <StyledFilterBlock actions>
          <StyledButton
            type="button"
            color="main"
            className="clear-filter"
            title="Очистить фильтр"
            weight="normal"
            onClick={handleClearFilter}
          >
            <span className="icon-trash" /> Очистить фильтр
          </StyledButton>
        </StyledFilterBlock>
      </StyledFilterWrapper>
    </StyledHiddenFilter>
  );
};

export default BankDetailsFilter;