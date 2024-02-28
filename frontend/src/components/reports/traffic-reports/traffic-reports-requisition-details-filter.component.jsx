import React, { useState, useContext } from "react";

import DelayInputComponent from "../../input-group/delay-input-group";
import ItemsPerPageSelectComponent from "../../pagination/items-per-page-select.component";
import FilterPaymentSystemSelect from "../../filter-components/filter-payment-system-select.component";
import Counter from "../../badge-notifications/counter.component";
import RequisitionCurrencySelect from "../../requisition-list/filter-components/requisition-currency-select.component";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction,
} from "../../styles/styled-filter";
import { StyledButton } from "../../styles/styled-button";

import { TrafficReportsRequisitionDetailsContext } from "./traffic-reports-requisition-details.container";

const TrafficReportsRequisitionDetailsFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter, totalCount } = useContext(TrafficReportsRequisitionDetailsContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || "page" in filter);

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const {
    id,
    firstname,
    lastname,
    email,
    payment_system,
    currency,
    itemsPerPage,
  } = filter;

  return (
    <StyledHiddenFilter>
      <StyledHiddenFilterAction col="3" counter>
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
          name="itemsPerPage"
          value={itemsPerPage}
          handleChangeFilter={handleChangeFilter}
          user={true}
        />
        <Counter name="заявок" count={totalCount} />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="text"
            name="id"
            label="Номер заявки"
            handleChange={handleChangeInput}
            value={id ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
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
          <DelayInputComponent
            type="text"
            name="email"
            label="Email"
            handleChange={handleChangeInput}
            value={email ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <RequisitionCurrencySelect
            value={currency}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterPaymentSystemSelect
            name={"payment_system"}
            value={payment_system}
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

export default TrafficReportsRequisitionDetailsFilter;