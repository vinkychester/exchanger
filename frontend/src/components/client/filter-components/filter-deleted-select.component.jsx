import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";

const FilterDeletedSelect = ({ name, value, handleChangeFilter }) => {
  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label"> Статус аккаунта: </StyledSelectLabel>
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
            Удаленный
          </div>
        </Option>
        <Option value={"false"}>
          <div className="option-select-item" style={style}>
            Активный аккаунт
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default FilterDeletedSelect;
