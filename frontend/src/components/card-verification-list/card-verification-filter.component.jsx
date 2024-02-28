import React, { useContext, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import DatePicker from "react-date-picker";

import Can from "../can/can.component";
import DelayInputComponent from "../input-group/delay-input-group";
import FilterUserDetails from "../filter-components/filter-user-details.component";
import FilterCardVerificationStatusSelect from "./filter-components/filter-card-verification-status-select.component";

import { StyledButton } from "../styles/styled-button";
import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper, StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../styles/styled-filter";
import { StyledDatepicker, StyledDatepickerLabel } from "../styles/styled-datepicker";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { CardVerificationContext } from "../../pages/card-verification/card-verification.component";
import { cardVerification } from "../../rbac-consts";
import { convertDateToLocalDateTime, convertLocalDateTimeToFormat } from "../../utils/datetime.util";
import ItemsPerPageSelectComponent from "../pagination/items-per-page-select.component";
import Counter from "../badge-notifications/counter.component";
import { NavLink } from "react-router-dom";

const CardVerificationFilter = ({ showForm }) => {
  const format = "DD-MM-YYYY";
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { filter, handleChangeFilter, handleClearFilter, totalCount } = useContext(CardVerificationContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || ("page" in filter) || "status" in filter);

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { cardMask, status, date_gte, date_lte, itemsPerPage, ...props } = filter;

  return (
    <StyledHiddenFilter>
      <div className="card-verification-head">
        <Can
          role={userRole}
          perform={cardVerification.CREATE}
          yes={() => (
            <React.Fragment>
              <StyledButton type="button" color="main" onClick={showForm}>
                Добавить карту
              </StyledButton>
              <StyledButton type="button" color="main" as={NavLink} to="/panel/requisitions">
                Список заявок
              </StyledButton>
            </React.Fragment>
          )}
        />
        <StyledHiddenFilterAction col="3" counter className="card-verification-filter">
          <StyledButton
            color="main"
            type="button"
            title="Фильтр"
            weight="normal"
            onClick={toggleFilter}
          >
            <span className="icon-filter" /> Фильтр
          </StyledButton>
          <ItemsPerPageSelectComponent
            name={"itemsPerPage"}
            value={itemsPerPage}
            handleChangeFilter={handleChangeFilter}
          />
          <Counter name="карт" count={totalCount} />
        </StyledHiddenFilterAction>
      </div>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="text"
            name="cardMask"
            label="Номер карты"
            handleChange={handleChangeInput}
            value={cardMask ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <Can
            role={userRole}
            perform={cardVerification.FILTER_CLIENT_DETAILS}
            yes={() => (
              <FilterUserDetails
                {...props}
                handleChangeInput={handleChangeInput}
              />
            )}
          />
          <FilterCardVerificationStatusSelect
            value={status}
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

export default CardVerificationFilter;