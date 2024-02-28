import React, { useContext, useState } from "react";
import DatePicker from "react-date-picker";

import DelayInputComponent from "../../input-group/delay-input-group";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction,
} from "../../styles/styled-filter";
import {
  StyledDatepicker,
  StyledDatepickerLabel,
} from "../../styles/styled-datepicker";
import { StyledButton } from "../../styles/styled-button";

import { SystemReportFilterContext } from "./system-report.container";
import {
  convertDateToLocalDateTime,
  convertLocalDateTimeToFormat,
} from "../../../utils/datetime.util";
import ItemsPerPageSelectComponent from "../../pagination/items-per-page-select.component";
import SystemReportTypeSelect from "./system-report-type-select.component";
import SystemReportManagerSelect from "./system-report-manager-select.component";

const SystemReportFilter = () => {
  const format = "DD-MM-YYYY";
  const { filter, handleChangeFilter, handleClearFilter } = useContext(
    SystemReportFilterContext
  );
  const [hideFilter, setHideFilter] = useState(
    !Object.keys(filter).length ||
      ("rpage" in filter && Object.keys(filter).length === 1) || "rdate_gte" in filter || "rdate_lte" in filter
  );

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };
  const { firstname, lastname, email, rdate_gte, rdate_lte, ritemsPerPage, type, manager } = filter;

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
          name={"ritemsPerPage"}
          value={ritemsPerPage}
          handleChangeFilter={handleChangeFilter}
          user={true}
        />
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
        </StyledFilterBlock>
        <StyledFilterTitle>Фильтр для excel:</StyledFilterTitle>
        <StyledFilterBlock>
          <div>
            <SystemReportTypeSelect
              name={"type"}
              value={type}
              handleChangeFilter={handleChangeFilter}
            />
          </div>
          <div>
            <SystemReportManagerSelect
              name={"manager"}
              value={manager}
              handleChangeFilter={handleChangeFilter}
            />
          </div>
        </StyledFilterBlock>
        <StyledFilterTitle>Дата:</StyledFilterTitle>
        <StyledFilterBlock>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>От:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="rdate_gte"
              name="rdate_gte"
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  "rdate_gte",
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={rdate_gte ? convertDateToLocalDateTime(rdate_gte) : ""}
              clearIcon={null}
            />
          </StyledDatepicker>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>До:</StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="rdate_lte"
              name="rdate_lte"
              className="date-input"
              onChange={(date) =>
                handleChangeFilter(
                  "rdate_lte",
                  convertLocalDateTimeToFormat(date, format)
                )
              }
              value={rdate_lte ? convertDateToLocalDateTime(rdate_lte) : ""}
              clearIcon={null}
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

export default SystemReportFilter;
