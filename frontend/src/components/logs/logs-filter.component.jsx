import React, { useContext, useState } from "react";
import DatePicker from "react-date-picker";

import DelayInputComponent from "../input-group/delay-input-group";
import FilterRoleSelect from "./filter-components/filter-role-select.component";
import FilterActionSelect from "./filter-components/filter-action-select.component";

import { StyledButton } from "../styles/styled-button";
import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction,
} from "../styles/styled-filter";
import {
  StyledDatepicker,
  StyledDatepickerLabel,
} from "../styles/styled-datepicker";

import { LogsFilterContext } from "../../pages/logs/logs.component";
import {
  convertDateToLocalDateTime,
  convertLocalDateTimeToFormat,
} from "../../utils/datetime.util";
import ItemsPerPageSelectComponent from "../pagination/items-per-page-select.component";

const LogsFilter = () => {
  const format = "DD-MM-YYYY";
  const { filter, handleChangeFilter, handleClearFilter } = useContext(LogsFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || ('page' in filter));

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { email, event, ip, role, action, date_gte, date_lte, itemsPerPage } = filter;

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
          name={"itemsPerPage"}
          value={itemsPerPage}
          handleChangeFilter={handleChangeFilter}
        />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="text"
            name="email"
            label="E-mail"
            handleChange={handleChangeInput}
            value={email ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name="event"
            label="Событие"
            handleChange={handleChangeInput}
            value={event ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name="ip"
            label="IP"
            handleChange={handleChangeInput}
            value={ip ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <FilterRoleSelect
            name={"role"}
            value={role}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterActionSelect
            name={"action"}
            value={action}
            handleChangeFilter={handleChangeFilter}
          />
        </StyledFilterBlock>
        <StyledFilterTitle>Дата:</StyledFilterTitle>
        <StyledFilterBlock>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>От:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="date_gte"
              name="date_gte"
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  "date_gte",
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={date_gte ? convertDateToLocalDateTime(date_gte) : ""}
            />
          </StyledDatepicker>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>До:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="date_lte"
              name="date_lte"
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  "date_lte",
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={date_lte ? convertDateToLocalDateTime(date_lte) : ""}
            />
          </StyledDatepicker>
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

export default LogsFilter;