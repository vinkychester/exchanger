import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";

const FilterPublishSelect = ({ name, value, handleChangeFilter }) => {
  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Публикация:</StyledSelectLabel>
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
        <Option value={true}>
          <div className="option-select-item" style={style}>
            Опубликована
          </div>
        </Option>
        <Option value={false}>
          <div className="option-select-item" style={style}>
            Неопубликована
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default FilterPublishSelect;
