import React, { useContext, useState } from "react";
import DatePicker from "react-date-picker";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter, StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { StyledDatepicker, StyledDatepickerLabel } from "../../styles/styled-datepicker";
import { StyledButton } from "../../styles/styled-button";

import { convertDateToLocalDateTime, convertLocalDateTimeToFormat } from "../../../utils/datetime.util";

import { ManagersReportsDetailsFilterContext } from "./managers-reports-details.container";

const ManagersReportsDetailsFilter = () => {
  const format = "DD-MM-YYYY";
  const { filter, handleChangeFilter, handleClearFilter } = useContext(ManagersReportsDetailsFilterContext);
  
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length
    || ("page" in filter && Object.keys(filter).length === 1));
  
  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };
  
  const {
    date_gte,
    date_lte
  } = filter;
  
  return (
    <StyledHiddenFilter>
      <StyledHiddenFilterAction className="requisition-head">
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
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
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

export default ManagersReportsDetailsFilter;
