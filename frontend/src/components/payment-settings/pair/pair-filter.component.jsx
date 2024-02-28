import React, { useContext, useState } from "react";

import DelayInputComponent from "../../input-group/delay-input-group";
import FilterActiveSelect from "../../filter-components/filter-active-select.component";
import FilterPaymentSystemSelect from "../../filter-components/filter-payment-system-select.component";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { StyledButton } from "../../styles/styled-button";

import { PairFilterContext } from "./pair.container";
import ItemsPerPageSelectComponent from "../../pagination/items-per-page-select.component";
import FilterServiceSelect from "../../filter-components/filter-service-select.component";

const PairFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter } = useContext(PairFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || "ppage" in filter || "cpage" in filter || "upage" in filter);

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const {
    pactive,
    ppayment_system_in,
    ppayment_system_out,
    pcurrency_in,
    pcurrency_out,
    ppercent_gte,
    ppercent_lte,
    pservice_in,
    pservice_out,
    pitemsPerPage
  } = filter;

  const style = {
    textTransform: "inherit",
  };

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
          name={"pitemsPerPage"}
          value={pitemsPerPage}
          handleChangeFilter={handleChangeFilter}
        />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <FilterActiveSelect
            name={"pactive"}
            value={pactive}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterPaymentSystemSelect
            name={"ppayment_system_in"}
            value={ppayment_system_in}
            handleChangeFilter={handleChangeFilter}
            label=" (IN)"
          />
          <DelayInputComponent
            type="text"
            name="pcurrency_in"
            label="Валюта (IN)"
            handleChange={handleChangeInput}
            value={pcurrency_in ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <FilterServiceSelect
            name={"pservice_in"}
            value={pservice_in}
            handleChangeFilter={handleChangeFilter}
            label=" (IN)"
          />
          <FilterPaymentSystemSelect
           name={"ppayment_system_out"}
           value={ppayment_system_out}
           handleChangeFilter={handleChangeFilter}
           label=" (OUT)"
          />
          <DelayInputComponent
            type="text"
            name="pcurrency_out"
            label="Валюта (OUT)"
            handleChange={handleChangeInput}
            value={pcurrency_out ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <FilterServiceSelect
            name={"pservice_out"}
            value={pservice_out}
            handleChangeFilter={handleChangeFilter}
            label=" (OUT)"
          />
        </StyledFilterBlock>
        <StyledFilterTitle>Значения:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="number"
            name="ppercent_gte"
            label="Процент от"
            handleChange={handleChangeInput}
            value={ppercent_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="ppercent_lte"
            label="Процент до"
            handleChange={handleChangeInput}
            value={ppercent_lte ?? ""}
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

export default PairFilter;
