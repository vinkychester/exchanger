import React from "react";
import Select, { Option } from "rc-select";

import {
  StyledSelect,
  StyledSelectLabel,
} from "../../styles/styled-img-select";

const FilterStatusSelect = ({ name, value, handleChangeFilter }) => {
  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Статус:</StyledSelectLabel>
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
        <Option value={"trusted"}>
          <div className="option-select-item" style={style}>
            доверенный
          </div>
        </Option>
        <Option value={"suspicious"}>
          <div className="option-select-item" style={style}>
            подозрительный
          </div>
        </Option>
        <Option value={"stable"}>
          <div className="option-select-item" style={style}>
            стабильный
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default FilterStatusSelect;
