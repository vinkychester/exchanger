import React, { useState } from "react";
import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper, StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { StyledButton } from "../../styles/styled-button";
import DelayInputComponent from "../../input-group/delay-input-group";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import Select, { Option } from "rc-select";
import { StyledDatepicker, StyledDatepickerLabel } from "../../styles/styled-datepicker";
import DatePicker from "react-date-picker";
import { clearFilter, convertDate, refineParams } from "../../../utils/filter.utils";
import { requisitionStatusConst, requisitionStatus } from "../../../utils/requsition.status";

const ReferralPayoutRequisitionFilter = ({ filter, setFilter }) => {

  const [showFilter, setShowFilter] = useState(!Object.keys(filter).length);

  const handleChange = event => {
    const { name, value } = event.target;
    setFilter(refineParams({
      ...filter,
      [name]: value.trim(),
      requisitionPage: 1
    }));
  };

  const handleChangeSelect = (value) => {
    setFilter(refineParams({
      ...filter,
      requisitionStatus: value,
      requisitionPage: 1
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
        requisitionDateFrom: !!dateValue ? dStr : "",
        requisitionPage: 1
      }));
    }
    if (dateName === "dateTo") {
      setFilter(refineParams({
        ...filter,
        requisitionDateTo: !!dateValue ? dStr : "",
        requisitionPage: 1
      }));
    }
  };

  const showFilterClick = () => {
    showFilter ? setShowFilter(false) : setShowFilter(true);
  };

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledHiddenFilter>
      <StyledHiddenFilterAction>
        <StyledButton
          color="main"
          type="button"
          title="Фильтр"
          weight="normal"
          onClick={showFilterClick}
        >
          <span className="icon-filter" /> Фильтр
        </StyledButton>
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={showFilter}>
        <StyledFilterTitle>
          Фильтровать по:
        </StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="number"
            name="requisitionAmountFrom"
            label="Сумма от"
            handleChange={handleChange}
            value={filter.requisitionAmountFrom ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="requisitionAmountTo"
            label="Сумма до"
            handleChange={handleChange}
            value={filter.requisitionAmountTo ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name="requisitionFirstName"
            label="Имя"
            handleChange={handleChange}
            value={filter.requisitionFirstName ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name="requisitionLastName"
            label="Фамилия"
            handleChange={handleChange}
            value={filter.requisitionLastName ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <StyledSelect className="input-group">
            <StyledSelectLabel as="label">
              Статус:
            </StyledSelectLabel>
            <Select
              className="custom-select"
              name="requisitionStatus"
              value={filter.requisitionStatus ?? "all"}
              onChange={handleChangeSelect}
              defaultValue={"all"}
            >
              <Option value={"all"}>
                <div className="option-select-item" style={style}>
                  Все
                </div>
              </Option>
              <Option value={requisitionStatusConst.NEW}>
                <div className="option-select-item" style={style}>
                  {requisitionStatus(requisitionStatusConst.NEW)}
                </div>
              </Option>

              <Option value={requisitionStatusConst.PROCESSED}>
                <div className="option-select-item" style={style}>
                  {requisitionStatus(requisitionStatusConst.PROCESSED)}
                </div>
              </Option>

              <Option value={requisitionStatusConst.FINISHED}>
                <div className="option-select-item" style={style}>
                  {requisitionStatus(requisitionStatusConst.FINISHED)}
                </div>
              </Option>

              <Option value={requisitionStatusConst.CANCELED}>
                <div className="option-select-item" style={style}>
                  {requisitionStatus(requisitionStatusConst.CANCELED)}
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
            <StyledDatepickerLabel>
              От:
            </StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="dateFrom"
              name="requisitionDateFrom"
              className="date-input"
              onChange={dateFrom => onChangeDate("dateFrom", dateFrom)}
              value={(filter.requisitionDateFrom ? convertDate(filter.requisitionDateFrom) : "")}
            />
          </StyledDatepicker>
          <StyledDatepicker className="input-group">
            <StyledDatepickerLabel>
              До:
            </StyledDatepickerLabel>
            <DatePicker
              format="dd-MM-y"
              id="dateTo"
              name="requisitionDateTo"
              className="date-input"
              onChange={dateTo => onChangeDate("dateTo", dateTo)}
              value={(filter.requisitionDateTo ? convertDate(filter.requisitionDateTo) : "")}
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

export default ReferralPayoutRequisitionFilter;
