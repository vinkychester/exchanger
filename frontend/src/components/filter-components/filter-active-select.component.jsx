import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

const FilterActiveSelect = ({ name, value, handleChangeFilter }) => {
  const style = {
    textTransform: "inherit",
  };
  
  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label"> Активность: </StyledSelectLabel>
      <Select
        className="custom-select"
        name={name}
        value={value ? value : null}
        defaultValue={null}
        onChange={(value) => handleChangeFilter(name, value)}
      >
        <Option value={null}>
          <div className="option-select-item" style={style}>
            Все
          </div>
        </Option>
        <Option value={"true"}>
          <div className="option-select-item" style={style}>
            Активна
          </div>
        </Option>
        <Option value={"false"}>
          <div className="option-select-item" style={style}>
            Неактивна
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default FilterActiveSelect;
