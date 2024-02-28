import React, { useContext, useState } from "react";

import DelayInputComponent from "../../input-group/delay-input-group";
import FilterPaymentSystemSelect from "../../filter-components/filter-payment-system-select.component";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { StyledButton } from "../../styles/styled-button";

import { PaymentSystemContext } from "./payment-system.container";
import ItemsPerPageSelectComponent from "../../pagination/items-per-page-select.component";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import Select, { Option } from "rc-select";

const PaymentSystemFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter } = useContext(PaymentSystemContext);
  const [showFilter, setShowFilter] = useState(!Object.keys(filter).length || "cpage" in filter || "upage" in filter || "ppage" in filter);

  const showFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { cname, cprice_gte, cprice_lte, citemsPerPage, ctag } = filter;

  const style = {
    textTransform: "inherit"
  };
  
  return (
    <StyledHiddenFilter>
      <StyledHiddenFilterAction col="2">
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
          name={"citemsPerPage"}
          value={citemsPerPage}
          handleChangeFilter={handleChangeFilter}
        />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={showFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <FilterPaymentSystemSelect
            name={"cname"}
            value={cname}
            handleChangeFilter={handleChangeFilter}
          />
          <StyledSelect className="input-group">
            <StyledSelectLabel as="label">Платежная система по типу:</StyledSelectLabel>
            <Select
              showSearch
              className="custom-select"
              id="ctag"
              name="ctag"
              value={ctag ? ctag : null}
              defaultValue={null}
              onChange={(value) => handleChangeFilter("ctag", value)}
            >
              <Option key="1" value={null}>
                <div className="option-select-item" style={style}>
                  Все
                </div>
              </Option>
              <Option key="2" value="CRYPTO">
                <div className="option-select-item" style={style}>
                  Криптовалюта
                </div>
              </Option>
              <Option key="3" value="CURRENCY">
                <div className="option-select-item" style={style}>
                  Платежная система
                </div>
              </Option>
            </Select>
          </StyledSelect>
          <DelayInputComponent
            type="number"
            name="cprice_gte"
            label="Себестоимость от"
            handleChange={handleChangeInput}
            value={cprice_gte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="number"
            name="cprice_lte"
            label="Себестоимость до"
            handleChange={handleChangeInput}
            value={cprice_lte ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
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

export default PaymentSystemFilter;
