import React, { useContext, useState } from "react";
import DatePicker from "react-date-picker";

import DelayInputComponent from "../../input-group/delay-input-group";
import FilterActionSelect from "../../logs/filter-components/filter-action-select.component";

import { StyledButton } from "../../styles/styled-button";
import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { StyledDatepicker, StyledDatepickerLabel } from "../../styles/styled-datepicker";

import { ClientDetailsLogsFilterContext } from "./client-details-logs.component";
import { convertDateToLocalDateTime, convertLocalDateTimeToFormat } from "../../../utils/datetime.util";
import ItemsPerPageSelectComponent from "../../pagination/items-per-page-select.component";

const ClientDetailsLogsFilter = () => {
  const format = "DD-MM-YYYY";
  const { filter, handleChangeFilter, handleClearFilter } = useContext(ClientDetailsLogsFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || ("lpage" in filter));

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { levent, lip, laction, ldate_gte, ldate_lte, itemsPerPage } = filter;

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
            name="levent"
            label="Событие"
            handleChange={handleChangeInput}
            value={levent ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name="lip"
            label="IP"
            handleChange={handleChangeInput}
            value={lip ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <FilterActionSelect
            name={"laction"}
            value={laction}
            handleChangeFilter={handleChangeFilter}
          />
        </StyledFilterBlock>
        <StyledFilterTitle>Дата:</StyledFilterTitle>
        <StyledFilterBlock>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>От:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="ldate_gte"
              name="ldate_gte"
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  "ldate_gte",
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={ldate_gte ? convertDateToLocalDateTime(ldate_gte) : ""}
            />
          </StyledDatepicker>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>До:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="ldate_lte"
              name="ldate_lte"
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  "ldate_lte",
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={ldate_lte ? convertDateToLocalDateTime(ldate_lte) : ""}
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

export default ClientDetailsLogsFilter;