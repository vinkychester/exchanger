import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

const ManagerStatusSelect = ({ value, handleChangeFilter, name }) => {
  
  const style = {
    textTransform: "inherit"
  };
  
  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Статус:</StyledSelectLabel>
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
        <Option value={true}>
          <div className="option-select-item" style={style}>
            Безналичный расчет
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default ManagerStatusSelect;
