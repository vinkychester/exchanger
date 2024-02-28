import React from "react";
import Select, { Option } from "rc-select";

import {
  StyledSelect,
  StyledSelectLabel,
} from "../../styles/styled-img-select";

const RequisitionExchangeTypeSelect = ({ value, handleChangeFilter }) => {
  const name = "exchangeType";
  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Тип обмена:</StyledSelectLabel>
      <Select
        className="custom-select"
        name={name}
        id={name}
        value={value ? value : null}
        onChange={(value) => handleChangeFilter(name, value)}
      >
        <Option value={null}>
          <div className="option-select-item" style={style}>
            Все
          </div>
        </Option>
        <Option value="bank">
          <div className="option-select-item" style={style}>
            Безналичный расчет
          </div>
        </Option>
        <Option value="cash">
          <div className="option-select-item" style={style}>
            Наличный расчет
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default RequisitionExchangeTypeSelect;