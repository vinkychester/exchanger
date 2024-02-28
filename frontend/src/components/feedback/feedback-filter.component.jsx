import React, { useContext, useState } from "react";
import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../styles/styled-filter";
import { StyledButton } from "../styles/styled-button";
import DelayInputComponent from "../input-group/delay-input-group";
import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import Select, { Option } from "rc-select";
import { StyledDatepicker, StyledDatepickerLabel } from "../styles/styled-datepicker";
import DatePicker from "react-date-picker";
import { feedbackStatus, feedbackStatusConst, feedbackType, feedbackTypeCons } from "../../utils/feedback-status";
import { convertDateToLocalDateTime, convertLocalDateTimeToFormat } from "../../utils/datetime.util";
import { FeedbackFilterContext } from "../../pages/feedback/feedbacks-page.component";
import ItemsPerPageSelectComponent from "../pagination/items-per-page-select.component";
import Counter from "../badge-notifications/counter.component";

const FeedbackFilter = () => {

  const format = "DD-MM-YYYY";
  const {
    filter,
    handleChangeFilter,
    handleClearFilter,
    totalCount
  } = useContext(FeedbackFilterContext);
  const [showFilter, setShowFilter] = useState(!Object.keys(filter).length || ("page" in filter && Object.keys(filter).length === 1));

  const showFilterClick = () => {
    setShowFilter(!showFilter);
  };
  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { firstname, lastname, email, type, status, date_gte, date_lte, itemsPerPage } = filter;
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
        <Counter name={'тикетов'} count={totalCount} />
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
          <DelayInputComponent
            type="text"
            name="email"
            label="E-mail"
            handleChange={handleChangeInput}
            value={email ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <StyledSelect className="input-group">
            <StyledSelectLabel as="label">
              Статус:
            </StyledSelectLabel>
            <Select
              className="custom-select"
              name="status"
              value={status ?? null}
              onChange={(status) => handleChangeFilter("status", status)}
              defaultValue={null}
            >
              <Option value={null}>
                <div className="option-select-item" style={style}>
                  Все
                </div>
              </Option>
              <Option value={feedbackStatusConst.NOT_VIEWED}>
                <div className="option-select-item" style={style}>
                  {feedbackStatus(feedbackStatusConst.NOT_VIEWED)}
                </div>
              </Option>
              <Option value={feedbackStatusConst.VIEWED}>
                <div className="option-select-item" style={style}>
                  {feedbackStatus(feedbackStatusConst.VIEWED)}
                </div>
              </Option>
              <Option value={feedbackStatusConst.WELL_DONE}>
                <div className="option-select-item" style={style}>
                  {feedbackStatus(feedbackStatusConst.WELL_DONE)}
                </div>
              </Option>
              <Option value={feedbackStatusConst.DELETED}>
                <div className="option-select-item" style={style}>
                  {feedbackStatus(feedbackStatusConst.DELETED)}
                </div>
              </Option>
            </Select>
          </StyledSelect>
          <StyledSelect className="input-group">
            <StyledSelectLabel as="label">
              Тип:
            </StyledSelectLabel>
            <Select
              className="custom-select"
              name="type"
              value={type}
              onChange={(type) => handleChangeFilter("type", type)}
              defaultValue={null}
            >
              <Option value={null}>
                <div
                  className="option-select-item"
                  style={style}
                >
                  Все
                </div>
              </Option>
              <Option value={feedbackTypeCons.BANK}>
                <div
                  className="option-select-item"
                  style={style}
                >
                  {feedbackType(feedbackTypeCons.BANK)}
                </div>
              </Option>
              <Option value={feedbackTypeCons.CASH}>
                <div
                  className="option-select-item"
                  style={style}
                >
                  {feedbackType(feedbackTypeCons.CASH)}
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

export default FeedbackFilter;
