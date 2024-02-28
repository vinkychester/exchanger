import React from "react";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import Select, { Option } from "rc-select";

const SystemReportTypeSelect = ({ value, handleChangeFilter, name }) => {
  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Тип:</StyledSelectLabel>
      <Select
        className="custom-select"
        name={name}
        id={name}
        defaultValue={null}
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

export default SystemReportTypeSelect;