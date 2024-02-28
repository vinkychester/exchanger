import React from "react";
import Select, { Option } from "rc-select";

import {
  StyledSelect,
  StyledSelectLabel,
} from "../../styles/styled-img-select";

const FilterActionSelect = ({ name, value, handleChangeFilter }) => {
  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Уровень:</StyledSelectLabel>
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
        <Option value={"INFO"}>
          <div className="option-select-item" style={style}>
            Оповещение
          </div>
        </Option>
        <Option value={"ERROR"}>
          <div className="option-select-item" style={style}>
            Действие с ошибкой
          </div>
        </Option>
        <Option value={"WARNING"}>
          <div className="option-select-item" style={style}>
            Обратите внимание
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default FilterActionSelect;
