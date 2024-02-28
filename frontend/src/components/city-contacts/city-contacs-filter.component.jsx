import React, { useContext, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import DelayInputComponent from "../input-group/delay-input-group";

import { StyledButton } from "../styles/styled-button";
import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../styles/styled-filter";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { CityContactsFilterContext } from "./city-contacs.container";
import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import Select, { Option } from "rc-select";
import ItemsPerPageSelectComponent from "../pagination/items-per-page-select.component";

const CityContactsFilter = ({}) => {
  const format = "DD-MM-YYYY";
  const client = useApolloClient();
  
  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const style = {
    textTransform: "inherit"
  };

  const {
    filter,
    handleChangeFilter,
    handleClearFilter,
  } = useContext(CityContactsFilterContext);

  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || ("page" in filter && Object.keys(filter).length === 1));

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const {
    isPublic,
    cityName,
    type,
    fieldValue,
    itemsPerPage
  } = filter;

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
          name={"itemsPerPage"}
          value={itemsPerPage}
          handleChangeFilter={handleChangeFilter}
        />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          {/*cityName*/}
          <DelayInputComponent
            type="text"
            name="cityName"
            label="Название города"
            handleChange={handleChangeInput}
            value={cityName ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          {/*fieldValue*/}
          <DelayInputComponent
            type="text"
            name="fieldValue"
            label="Значение поля"
            handleChange={handleChangeInput}
            value={fieldValue ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          {/*Type*/}
          <StyledSelect className="input-group">
            <StyledSelectLabel as="label">Тип контакта:</StyledSelectLabel>
            <Select
              className="custom-select"
              name="type"
              onChange={value => handleChangeFilter("type", value)}
              value={type ?? null}
              defaultValue={null}
              id="paymentSystem"
            >
              <Option value={null}>
                <div className="option-select-item" style={style}> Все</div>
              </Option>
              <Option value={"cash"}>
                <div className="option-select-item" style={style}> Наличный расчет</div>
              </Option>
              <Option value={"bank"}>
                <div className="option-select-item" style={style}> Безналичный расчет</div>
              </Option>
            </Select>
          </StyledSelect>
          {/*Publication*/}
          <StyledSelect className="input-group">
            <StyledSelectLabel as="label">Публикация:</StyledSelectLabel>
            <Select
              className="custom-select"
              name="type"
              onChange={value => handleChangeFilter("isPublic", value)}
              value={isPublic ?? null}
              defaultValue={null}
              id="paymentSystem"
            >
              <Option value={null}>
                <div className="option-select-item" style={style}> Все</div>
              </Option>
              <Option value={true}>
                <div className="option-select-item" style={style}> Опубликован</div>
              </Option>
              <Option value={false}>
                <div className="option-select-item" style={style}> Не опубликован</div>
              </Option>
            </Select>
          </StyledSelect>
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

export default CityContactsFilter;
