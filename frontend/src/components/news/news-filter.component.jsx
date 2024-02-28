import React, { useContext, useState } from "react";
import DatePicker from "react-date-picker";

import DelayInputComponent from "../input-group/delay-input-group";
import FilterPublishSelect from "./filter-components/filter-publish-select.component";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter, StyledHiddenFilterAction
} from "../styles/styled-filter";
import {
  StyledDatepicker,
  StyledDatepickerLabel,
} from "../styles/styled-datepicker";
import { StyledButton } from "../styles/styled-button";

import { NewsFilterContext } from "./news-admin.container";
import {
  convertDateToLocalDateTime,
  convertLocalDateTimeToFormat,
} from "../../utils/datetime.util";
import ItemsPerPageSelectComponent from "../pagination/items-per-page-select.component";
import Counter from "../badge-notifications/counter.component";

const NewsFilter = () => {
  const format = "DD-MM-YYYY";

  const { filter, handleChangeFilter, handleClearFilter, totalCount } = useContext(NewsFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || ("page" in filter));

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const { title, description, publish, date_gte, date_lte, itemsPerPage } = filter;

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
          name={"itemsPerPage"}
          value={itemsPerPage}
          handleChangeFilter={handleChangeFilter}
        />
        <Counter name="статей" count={totalCount} />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="text"
            name="title"
            label="Название"
            handleChange={handleChangeInput}
            value={title ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name="description"
            label="Описание"
            handleChange={handleChangeInput}
            value={description ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <FilterPublishSelect
            name={"publish"}
            value={publish}
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

export default NewsFilter;
