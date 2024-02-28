import React, { useState, useContext } from "react";

import DelayInputComponent from "../../input-group/delay-input-group";
import ItemsPerPageSelectComponent from "../../pagination/items-per-page-select.component";
import Counter from "../../badge-notifications/counter.component";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction,
} from "../../styles/styled-filter";
import { StyledButton } from "../../styles/styled-button";

import { TrafficReportsClientDetailsContext } from "./traffic-reports-client-details-container.component";

const TrafficReportsClientDetailsFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter, totalCount } = useContext(TrafficReportsClientDetailsContext);
  const [hideFilter, setHideFilter] = useState(
    !Object.keys(filter).length || `page` in filter
  );

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { firstname, lastname, email, itemsPerPage } = filter;

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
        <Counter name="клиентов" count={totalCount} />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="text"
            name="firstname"
            label="Имя"
            handleChange={handleChangeInput}
            value={firstname}
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
            label="E-mail"
            handleChange={handleChangeInput}
            value={email ?? ""}
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

export default TrafficReportsClientDetailsFilter;
