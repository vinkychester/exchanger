import React, { useContext, useState } from "react";
import DelayInputComponent from "../../input-group/delay-input-group";
import Select, { Option } from "rc-select";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import { StyledButton } from "../../styles/styled-button";
import { ReferralsFilterContext } from "./client-referral-report.container";

const ClientReferralReportFilter = () => {
  const isEnabledConst = "isEnabled";
  const statusConst = "status";
  const isVerifiedConst = "isVerified";

  const { filter, handleChangeFilter, handleClearFilter } = useContext(ReferralsFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || ("page" in filter && Object.keys(filter).length === 1));

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };
  const style = {
    textTransform: "inherit"
  };

  const {
    isEnabled,
    firstname,
    lastname,
    email,
    status,
    isVerified
  } = filter;

  return (
    <StyledHiddenFilter>
      <StyledHiddenFilterAction col="1">
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
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
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
            label="E-Mail"
            handleChange={handleChangeInput}
            value={email ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
        </StyledFilterBlock>
        <StyledFilterBlock>
          <StyledSelect className="input-group">
            <StyledSelectLabel
              as="label"
            >
              Активность:
            </StyledSelectLabel>
            <Select
              className="custom-select"
              id={isEnabledConst}
              name={isEnabledConst}
              onChange={(value) => handleChangeFilter(isEnabledConst, value)}
              value={isEnabled ?? null}
            >
              <Option value={null}>
                <div className="option-select-item" style={style}>
                  Все
                </div>
              </Option>
              <Option value={true}>
                <div className="option-select-item" style={style}>
                  Подтвержден
                </div>
              </Option>
              <Option value={false}>
                <div className="option-select-item" style={style}>
                  Неподтвержден
                </div>
              </Option>
            </Select>
          </StyledSelect>
          <StyledSelect className="input-group">
            <StyledSelectLabel
              as="label"
            >
              Статус:
            </StyledSelectLabel>
            <Select
              className="custom-select"
              id={statusConst}
              name={statusConst}
              onChange={(value) => handleChangeFilter(statusConst, value)}
              value={status ?? null}
            >
              <Option value={null}>
                <div className="option-select-item" style={style}>
                  Все
                </div>
              </Option>
              <Option value="trusted">
                <div className="option-select-item" style={style}>
                  Доверенный
                </div>
              </Option>
              <Option value="suspicious">
                <div className="option-select-item" style={style}>
                  Подозрительный
                </div>
              </Option>
              <Option value="ОК">
                <div className="option-select-item" style={style}>
                  Стабильный
                </div>
              </Option>
            </Select>
          </StyledSelect>
          <StyledSelect className="input-group">
            <StyledSelectLabel
              as="label"
            >
              Документы:
            </StyledSelectLabel>
            <Select
              className="custom-select"
              id={isVerifiedConst}
              name={isVerifiedConst}
              onChange={(value) => handleChangeFilter(isVerifiedConst, value)}
              value={isVerified ?? null}
            >
              <Option value={null}>
                <div className="option-select-item" style={style}>
                  Все
                </div>
              </Option>
              <Option value={true}>
                <div className="option-select-item" style={style}>
                  Верифицированы
                </div>
              </Option>
              <Option value={false}>
                <div className="option-select-item" style={style}>
                  Не верифицированы
                </div>
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

export default ClientReferralReportFilter;
