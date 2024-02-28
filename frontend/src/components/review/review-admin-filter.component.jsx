import React, { useContext, useState } from "react";
import DelayInputComponent from "../input-group/delay-input-group";
import DatePicker from "react-date-picker";
import Select, { Option } from "rc-select";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../styles/styled-filter";
import { StyledButton } from "../styles/styled-button";
import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import { StyledDatepicker, StyledDatepickerLabel } from "../styles/styled-datepicker";
import { ReviewFilterContext } from "../../pages/review/review-admin.component";
import { convertDateToLocalDateTime, convertLocalDateTimeToFormat } from "../../utils/datetime.util";
import ItemsPerPageSelectComponent from "../pagination/items-per-page-select.component";
import Counter from "../badge-notifications/counter.component";

const ReviewFilter = () => {

  const format = "DD-MM-YYYY";
  const { filter, handleChangeFilter, handleClearFilter, totalCount } = useContext(ReviewFilterContext);
  const [showFilter, setShowFilter] = useState(!Object.keys(filter).length || ('page' in filter && Object.keys(filter).length === 1));

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { firstname, lastname, publish, date_gte, date_lte, itemsPerPage } = filter;
  const showFilterClick = () => {
    showFilter ? setShowFilter(false) : setShowFilter(true);
  };
  //
  const style = {
    textTransform: "inherit"
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
            onClick={showFilterClick}
          >
            <span className="icon-filter" /> Фильтр
          </StyledButton>
        </div>
        <ItemsPerPageSelectComponent
          name={"itemsPerPage"}
          value={itemsPerPage}
          handleChangeFilter={handleChangeFilter}
        />
        <Counter name="отзывов" count={totalCount} />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={showFilter}>
        <StyledFilterTitle>
          Фильтровать по:
        </StyledFilterTitle>
        <StyledFilterBlock>
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
          <StyledSelect className="input-group">
            <StyledSelectLabel as="label">
              Публикиция:
            </StyledSelectLabel>
            <Select
              className="custom-select"
              name="publish"
              value={publish ?? null}
              onChange={(publish) => handleChangeFilter('publish', publish)}
              defaultValue={null}
            >
              <Option value={null}>
                <div className="option-select-item" style={style}>
                  Все
                </div>
              </Option>
              <Option value={true}>
                <div className="option-select-item" style={style}>
                  Опубликаван
                </div>
              </Option>
              <Option value={false}>
                <div className="option-select-item" style={style}>
                  Неопубликован
                </div>
              </Option>
            </Select>
          </StyledSelect>
        </StyledFilterBlock>
        <StyledFilterTitle>
          Дата:
        </StyledFilterTitle>
        <StyledFilterBlock>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>От:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="date_gte"
              name="date_gte"
              className="date-input"
              onChange={(date) => handleChangeFilter("date_gte", convertLocalDateTimeToFormat(date, format))}
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
              onChange={(date) => handleChangeFilter("date_lte", convertLocalDateTimeToFormat(date, format))}
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

export default ReviewFilter;
