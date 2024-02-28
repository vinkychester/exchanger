import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

const FilterDirectionSelect = ({ name, value, handleChangeFilter }) => {
  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label"> Направление: </StyledSelectLabel>
      <Select
        className="custom-select"
        id={name}
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
        <Option value={"payment"}>
          <div className="option-select-item" style={style}>
            Покупка
          </div>
        </Option>
        <Option value={"payout"}>
          <div className="option-select-item" style={style}>
            Продажа
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default FilterDirectionSelect;
