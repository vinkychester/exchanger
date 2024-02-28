import React, { useState, useContext } from "react";
import DatePicker from "react-date-picker";

import DelayInputComponent from "../input-group/delay-input-group";
import FilterStatusSelect from "./filter-components/filter-status-select.component";
import FilterDeletedSelect from "./filter-components/filter-deleted-select.component";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction,
} from "../styles/styled-filter";
import { StyledButton } from "../styles/styled-button";
import {
  StyledDatepicker,
  StyledDatepickerLabel,
} from "../styles/styled-datepicker";

import { ClientFilterContext } from "./client.container";
import {
  convertDateToLocalDateTime,
  convertLocalDateTimeToFormat,
} from "../../utils/datetime.util";

import ItemsPerPageSelectComponent from "../pagination/items-per-page-select.component";
import Counter from "../badge-notifications/counter.component";

const ClientFilter = () => {
  const format = "DD-MM-YYYY";

  const { filter, sign, handleChangeFilter, handleClearFilter, totalCount } = useContext(ClientFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || `${sign}page` in filter);

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

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
          name={sign + "itemsPerPage"}
          value={filter[`${sign}itemsPerPage`]}
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
            name={`${sign}firstname`}
            label="Имя"
            handleChange={handleChangeInput}
            value={filter[`${sign}firstname`] ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name={`${sign}lastname`}
            label="Фамилия"
            handleChange={handleChangeInput}
            value={filter[`${sign}lastname`] ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name={`${sign}email`}
            label="E-mail"
            handleChange={handleChangeInput}
            value={filter[`${sign}email`] ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name={`${sign}referralName`}
            label="Реферальный уровень"
            handleChange={handleChangeInput}
            value={filter[`${sign}referralName`] ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <FilterStatusSelect
            name={`${sign}status`}
            value={filter[`${sign}status`]}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterDeletedSelect 
            name={`${sign}isDeleted`}
            value={filter[`${sign}isDeleted`]}
            handleChangeFilter={handleChangeFilter}
          />
        </StyledFilterBlock>
        <StyledFilterTitle>Дата регистрации:</StyledFilterTitle>
        <StyledFilterBlock>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>От:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id={`${sign}date_gte`}
              name={`${sign}date_gte`}
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  `${sign}date_gte`,
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={filter[`${sign}date_gte`] ? convertDateToLocalDateTime(filter[`${sign}date_gte`]) : ""}
            />
          </StyledDatepicker>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>До:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id={`${sign}date_lte`}
              name={`${sign}date_lte`}
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  `${sign}date_lte`,
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={filter[`${sign}date_lte`] ? convertDateToLocalDateTime(filter[`${sign}date_lte`]) : ""}
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

export default ClientFilter;
