import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import DatePicker from "react-date-picker";

import Can from "../can/can.component";
import DelayInputComponent from "../input-group/delay-input-group";
import RequisitionStatusSelect from "./filter-components/requisition-status-select.component";
import RequisitionExchangeTypeSelect from "./filter-components/requisition-exchange-type-select.component";
import FilterPaymentSystemSelect from "../filter-components/filter-payment-system-select.component";

import { StyledButton } from "../styles/styled-button";
import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper, StyledHiddenFilterAction
} from "../styles/styled-filter";
import {
  StyledDatepicker,
  StyledDatepickerLabel,
} from "../styles/styled-datepicker";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { RequisitionFilterContext } from "../../pages/requisition/requisition.component";
import { calculator, requisition } from "../../rbac-consts";
import {
  convertDateToLocalDateTime,
  convertLocalDateTimeToFormat,
} from "../../utils/datetime.util";
import ItemsPerPageSelectComponent from "../pagination/items-per-page-select.component";
import RequisitionCurrencySelect from "./filter-components/requisition-currency-select.component";
import Counter from "../badge-notifications/counter.component";


const RequisitionFilter = () => {
  const format = "DD-MM-YYYY";
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { filter, handleChangeFilter, handleClearFilter, totalCount } = useContext(RequisitionFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || ('page' in filter) || ('status' in filter));

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const {
    id,
    firstname,
    lastname,
    email,
    status,
    payment_system,
    currency,
    wallet,
    payment_amount_gte,
    payment_amount_lte,
    payout_amount_gte,
    payout_amount_lte,
    date_gte,
    date_lte,
    itemsPerPage,
    end_date_gte,
    end_date_lte,
    exchangeType
  } = filter;

  return (
    <>
      <div className="requisition-head">
        <Can
          role={userRole}
          perform={calculator.EXCHANGE}
          yes={() => (
            <StyledButton as={NavLink} to="/" color="main">
              Новый обмен
            </StyledButton>
          )}
        />
        <StyledHiddenFilterAction col="3" counter className="requisition-filter">
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
          <Counter name="заявок" count={totalCount} />
        </StyledHiddenFilterAction>
      </div>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="text"
            name="id"
            label="Номер заявки"
            handleChange={handleChangeInput}
            value={id ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <Can
            role={userRole}
            perform={requisition.CLIENT_DETAILS}
            yes={() => (
              <>
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
              </>
            )}
          />
          <RequisitionStatusSelect
            value={status}
            handleChangeFilter={handleChangeFilter}
          />
            <RequisitionExchangeTypeSelect
            value={exchangeType}
            handleChangeFilter={handleChangeFilter}
          />
          <FilterPaymentSystemSelect
            name={"payment_system"}
            value={payment_system}
            handleChangeFilter={handleChangeFilter}
          />
        </StyledFilterBlock>
        <StyledFilterTitle>Сумма:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="number"
            name="payment_amount_gte"
            label="Платеж от"
            handleChange={handleChangeInput}
            value={payment_amount_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="payment_amount_lte"
            label="Платеж до"
            handleChange={handleChangeInput}
            value={payment_amount_lte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="payout_amount_gte"
            label="К получению от"
            handleChange={handleChangeInput}
            value={payout_amount_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="payout_amount_lte"
            label="К получению до"
            handleChange={handleChangeInput}
            value={payout_amount_lte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <RequisitionCurrencySelect
            value={currency}
            handleChangeFilter={handleChangeFilter}
          />
        </StyledFilterBlock>
        <Can
          role={userRole}
          perform={requisition.CLIENT_DETAILS}
          yes={() => (
            <>
              <StyledFilterTitle>Дата выполнения:</StyledFilterTitle>
              <StyledFilterBlock>
                <StyledDatepicker className="input-group">
                  <StyledDatepickerLabel>От:</StyledDatepickerLabel>
                  <DatePicker
                    format="dd-MM-y"
                    id="end_date_gte"
                    name="end_date_gte"
                    className="date-input"
                    onChange={(date) =>
                      handleChangeFilter(
                        "end_date_gte",
                        convertLocalDateTimeToFormat(date, format)
                      )
                    }
                    value={
                      end_date_gte
                        ? convertDateToLocalDateTime(end_date_gte)
                        : ""
                    }
                  />
                </StyledDatepicker>
                <StyledDatepicker className="input-group">
                  <StyledDatepickerLabel>До:</StyledDatepickerLabel>
                  <DatePicker
                    format="dd-MM-y"
                    id="end_date_lte"
                    name="end_date_lte"
                    className="date-input"
                    onChange={(date) =>
                      handleChangeFilter(
                        "end_date_lte",
                        convertLocalDateTimeToFormat(date, format)
                      )
                    }
                    value={
                      end_date_lte
                        ? convertDateToLocalDateTime(end_date_lte)
                        : ""
                    }
                  />
                </StyledDatepicker>
                <DelayInputComponent
                  type="text"
                  name="wallet"
                  label="Кошелёк/Карта"
                  handleChange={handleChangeInput}
                  value={wallet ?? ""}
                  debounceTimeout={600}
                  autoComplete="off"
                />
              </StyledFilterBlock>
            </>
          )}
        />
        <StyledFilterTitle>Дата создания:</StyledFilterTitle>
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
    </>
  );
};

export default React.memo(RequisitionFilter);
