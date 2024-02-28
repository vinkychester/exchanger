import React, { useContext, useState } from "react";

import DelayInputComponent from "../../input-group/delay-input-group";
import FilterActiveSelect from "../../filter-components/filter-active-select.component";
import FilterPaymentSystemSelect from "../../filter-components/filter-payment-system-select.component";
import FilterServiceSelect from "../../filter-components/filter-service-select.component";
import FilterDirectionSelect from "../../filter-components/filter-direction-select.component";
import FilterTabsSelect from "./filter-components/filter-tabs-select.component";

import {
  StyledFilterBlock,
  StyledFilterIdent,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { StyledButton } from "../../styles/styled-button";

import { PairUnitFilterContext } from "./pair-unit.container";
import ItemsPerPageSelectComponent from "../../pagination/items-per-page-select.component";

const PairUnitFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter } = useContext(PairUnitFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || "upage" in filter || "cpage" in filter || "ppage" in filter );

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const {
    ucurrency,
    uactive,
    upayment_system,
    udirection,
    uservice,
    upercent_gte,
    upercent_lte,
    uconstant_gte,
    uconstant_lte,
    umin_gte,
    umin_lte,
    umax_gte,
    umax_lte,
    upriority_gte,
    upriority_lte,
    upayment_tab,
    uitemsPerPage
  } = filter;

  return (
    <StyledHiddenFilter>
      <StyledHiddenFilterAction col="2">
        <div className="filter-btn">
          <StyledButton
            color="main"
            type="button"
            title="Фильтр"
            weight="normal"
            onClick={toggleFilter}
          >
            <span className="icon-filter" /> Фильтр
          </StyledButton>
        </div>
        <ItemsPerPageSelectComponent
          name={"uitemsPerPage"}
          value={uitemsPerPage}
          handleChangeFilter={handleChangeFilter} />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="text"
            name="ucurrency"
            label="Валюта"
            handleChange={handleChangeInput}
            value={ucurrency ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <FilterActiveSelect
            name={"uactive"}
            value={uactive}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterPaymentSystemSelect
            name={"upayment_system"}
            value={upayment_system}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterServiceSelect
            name={"uservice"}
            value={uservice}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterDirectionSelect
            name={"udirection"}
            value={udirection}
            handleChangeFilter={handleChangeFilter}
          />
        </StyledFilterBlock>
        <StyledFilterTitle>Значения:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="number"
            name="upercent_gte"
            label="Процент от"
            handleChange={handleChangeInput}
            value={upercent_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="upercent_lte"
            label="Процент до"
            handleChange={handleChangeInput}
            value={upercent_lte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="uconstant_gte"
            label="Константа от"
            handleChange={handleChangeInput}
            value={uconstant_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="uconstant_lte"
            label="Константа до"
            handleChange={handleChangeInput}
            value={uconstant_lte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <StyledFilterIdent />
          <DelayInputComponent
            type="number"
            name="umin_gte"
            label="Минимум от"
            handleChange={handleChangeInput}
            value={umin_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="umin_lte"
            label="Минимум до"
            handleChange={handleChangeInput}
            value={umin_lte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="umax_gte"
            label="Максимум от"
            handleChange={handleChangeInput}
            value={umax_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="umax_lte"
            label="Максимум до"
            handleChange={handleChangeInput}
            value={umax_lte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="upriority_gte"
            label="Приоритет от"
            handleChange={handleChangeInput}
            value={upriority_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="upriority_lte"
            label="Приоритет до"
            handleChange={handleChangeInput}
            value={upriority_lte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
        </StyledFilterBlock>
        <StyledFilterTitle>Таб калькулятора:</StyledFilterTitle>
        <StyledFilterBlock>
          <FilterTabsSelect
            name={"upayment_tab"}
            value={upayment_tab}
            handleChangeFilter={handleChangeFilter}
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

export default PairUnitFilter;
