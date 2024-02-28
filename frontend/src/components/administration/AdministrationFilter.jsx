import React, { useState } from "react";
import DelayInputComponent from "../input-group/delay-input-group";
import DatePicker from "react-date-picker";
import { clearFilter, convertDate, refineParams } from "../../utils/filter.utils";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../styles/styled-filter";
import { StyledButton } from "../styles/styled-button";
import { StyledDatepicker, StyledDatepickerLabel } from "../styles/styled-datepicker";
import Counter from "../badge-notifications/counter.component";

const AdministrationFilter = ({ filter, setFilter, pagePrefix, count, name }) => {
  const [showFilter, setShowFilter] = useState(!Object.keys(filter).length);

  const handleChange = event => {
    const { name, value } = event.target;
    setFilter(refineParams({
      ...filter,
      [name]: value.trim(),
      [pagePrefix + "page"]: 1
    }));
  };

  const onChangeDate = (dateName, dateValue) => {
    let dStr;
    if (dateValue) {
      dStr = dateValue.getDate() + "-" + (dateValue.getMonth() + 1) + "-" + dateValue.getFullYear();
    }
    if (dateName === "dateFrom") {
      setFilter(refineParams({
        ...filter,
        [pagePrefix + "dateFrom"]: !!dateValue ? dStr : "",
        [pagePrefix + "page"]: 1
      }));
    }
    if (dateName === "dateTo") {
      setFilter(refineParams({
        ...filter,
        [pagePrefix + "dateTo"]: !!dateValue ? dStr : "",
        [pagePrefix + "page"]: 1
      }));
    }
  };

  const showFilterClick = () => {
    showFilter ? setShowFilter(false) : setShowFilter(true);
  };

  return (
    <StyledHiddenFilter>
      <StyledHiddenFilterAction col="2" counter>
        <StyledButton
          color="main"
          type="button"
          title="Фильтр"
          weight="normal"
          onClick={showFilterClick}
        >
          <span className="icon-filter" /> Фильтр
        </StyledButton>
        <Counter name={name} count={count} />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={showFilter}>
        <StyledFilterTitle>
          Фильтровать по:
        </StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="text"
            name={pagePrefix + "firstname"}
            label="Имя"
            handleChange={handleChange}
            value={filter[pagePrefix + "firstname"] ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name={pagePrefix + "lastname"}
            label="Фамилия"
            handleChange={handleChange}
            value={filter[pagePrefix + "lastname"] ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name={pagePrefix + "email"}
            label="E-mail"
            handleChange={handleChange}
            value={filter[pagePrefix + "email"] ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
        </StyledFilterBlock>
        <StyledFilterTitle>
          Дата регистрации:
        </StyledFilterTitle>
        <StyledFilterBlock>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>
              От:
            </StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id={pagePrefix + "dateFrom"}
              name={pagePrefix + "dateFrom"}
              className="date-input"
              onChange={dateFrom => onChangeDate("dateFrom", dateFrom)}
              value={(filter[pagePrefix + "dateFrom"] ? convertDate(filter[pagePrefix + "dateFrom"]) : "")}
            />
          </StyledDatepicker>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>
              До:
            </StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id={pagePrefix + "dateTo"}
              name={pagePrefix + "dateTo"}
              className="date-input"
              onChange={dateTo => onChangeDate("dateTo", dateTo)}
              value={(filter[pagePrefix + "dateTo"] ? convertDate(filter[pagePrefix + "dateTo"]) : "")}
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
            onClick={() => clearFilter(setFilter)}
          >
            <span className="icon-trash" /> Очистить фильтр
          </StyledButton>
        </StyledFilterBlock>
      </StyledFilterWrapper>
    </StyledHiddenFilter>
  );
};

export default AdministrationFilter;
