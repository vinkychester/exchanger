import React, { useContext, useState } from "react";
import DatePicker from "react-date-picker";

import DelayInputComponent from "../../input-group/delay-input-group";
import ManagerStatusSelect from "../../filter-components/manager-status-select.component";
import ManagerCitySelect from "../../filter-components/manager-city-select.component";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { StyledDatepicker, StyledDatepickerLabel } from "../../styles/styled-datepicker";
import { StyledButton } from "../../styles/styled-button";

import { convertDateToLocalDateTime, convertLocalDateTimeToFormat } from "../../../utils/datetime.util";
import { ManagersReportsFilterContext } from "./managers-reports.container";

const ManagersReportsFilter = () => {
  const format = "DD-MM-YYYY";
  const { filter, handleChangeFilter, handleClearFilter } = useContext(ManagersReportsFilterContext);

  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length
    || ("page" in filter && Object.keys(filter).length === 1));

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const {
    firstname,
    lastname,
    email,
    isBank,
    date_gte,
    date_lte,
    city,
    percent_gte,
    percent_lte
  } = filter;

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
          <div>
            <DelayInputComponent
              label="Имя"
              name="firstname"
              value={firstname ?? ""}
              autoComplete="off"
              debounceTimeout={600}
              handleChange={handleChangeInput}
            />
          </div>
          <div>
            <DelayInputComponent
              label="Фамилия"
              name="lastname"
              value={lastname ?? ""}
              autoComplete="off"
              debounceTimeout={600}
              handleChange={handleChangeInput}
            />
          </div>
          <div>
            <DelayInputComponent
              label="E-mail"
              name="email"
              value={email ?? ""}
              autoComplete="off"
              debounceTimeout={600}
              handleChange={handleChangeInput}
            />
          </div>
          <ManagerStatusSelect
            name={"isBank"}
            value={isBank}
            handleChangeFilter={handleChangeFilter}
          />
          <ManagerCitySelect
            name={"city"}
            value={city}
            handleChangeFilter={handleChangeFilter}
          />
        </StyledFilterBlock>
        <StyledFilterBlock>
          <DelayInputComponent
            type="number"
            name="percent_gte"
            label="Процент от"
            handleChange={handleChangeInput}
            value={percent_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="percent_lte"
            label="Процент до"
            handleChange={handleChangeInput}
            value={percent_lte ?? ""}
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

export default ManagersReportsFilter;
