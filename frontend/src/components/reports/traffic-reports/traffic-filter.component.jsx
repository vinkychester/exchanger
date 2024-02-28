import React, { useContext, useState } from "react";
import DatePicker from "react-date-picker";

import DelayInputComponent from "../../input-group/delay-input-group";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { StyledButton } from "../../styles/styled-button";
import { StyledDatepicker, StyledDatepickerLabel } from "../../styles/styled-datepicker";

import { convertDateToLocalDateTime, convertLocalDateTimeToFormat } from "../../../utils/datetime.util";
import { TrafficFilterContext } from "./traffic-reports-container.component";
import ItemsPerPageSelectComponent from "../../pagination/items-per-page-select.component";

const TrafficFilter = () => {
  const date = new Date();
  const dateFrom = new Date(date.getFullYear(), date.getMonth(), 1);
  const dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const format = "DD-MM-YYYY";
  const {
    filter,
    handleChangeFilter,
    handleClearFilter,
  } = useContext(TrafficFilterContext);

  const [hideFilter, setHideFilter] = useState(
    !Object.keys(filter).length ||
    ("tpage" in filter && Object.keys(filter).length === 1) || "tdate_gte" in filter || "tdate_lte" in filter
  );
  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const {
    siteName,
    tdate_gte,
    tdate_lte,
    titemsPerPage
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
          name={"titemsPerPage"}
          value={titemsPerPage}
          handleChangeFilter={handleChangeFilter}
        />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>
          Фильтровать по:
        </StyledFilterTitle>
        <StyledFilterBlock>
          <div>
            <DelayInputComponent
              label="Сайт"
              name="siteName"
              value={siteName ?? ""}
              autoComplete="off"
              debounceTimeout={600}
              handleChange={handleChangeInput}
            />
          </div>
        </StyledFilterBlock>
        <StyledFilterTitle>
          Дата:
        </StyledFilterTitle>
        <StyledFilterBlock>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>От:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="tdate_gte"
              name="tdate_gte"
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  "tdate_gte",
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={tdate_gte ? convertDateToLocalDateTime(tdate_gte) : dateFrom}
            />
          </StyledDatepicker>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>До:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="tdate_lte"
              name="tdate_lte"
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  "tdate_lte",
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={tdate_lte ? convertDateToLocalDateTime(tdate_lte) : dateTo}
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

export default TrafficFilter;
