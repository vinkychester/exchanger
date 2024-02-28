import React, { useContext, useState } from "react";
import DatePicker from "react-date-picker";

import DelayInputComponent from "../../input-group/delay-input-group";

import { StyledButton } from "../../styles/styled-button";
import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { StyledDatepicker, StyledDatepickerLabel } from "../../styles/styled-datepicker";

import { ClientDetailsCardContext } from "./client-details-credit.component";
import { convertDateToLocalDateTime, convertLocalDateTimeToFormat } from "../../../utils/datetime.util";

const ClientDetailsCreditFilter = () => {
  const format = "DD-MM-YYYY";
  const { filter, handleChangeFilter, handleClearFilter } = useContext(ClientDetailsCardContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || ("lpage" in filter));

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { ccardMask, cdate_gte, cdate_lte } = filter;

  return (
    <StyledHiddenFilter>
      <StyledHiddenFilterAction>
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
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="text"
            name="ccardMask"
            label="Номер карты"
            handleChange={handleChangeInput}
            value={ccardMask ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
        </StyledFilterBlock>
        <StyledFilterTitle>Дата:</StyledFilterTitle>
        <StyledFilterBlock>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>От:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="cdate_gte"
              name="cdate_gte"
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  "cdate_gte",
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={cdate_gte ? convertDateToLocalDateTime(cdate_gte) : ""}
            />
          </StyledDatepicker>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>До:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="cdate_lte"
              name="cdate_lte"
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  "cdate_lte",
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={cdate_lte ? convertDateToLocalDateTime(cdate_lte) : ""}
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

export default ClientDetailsCreditFilter;