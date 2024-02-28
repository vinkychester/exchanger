import React from "react";
import Select, { Option } from "rc-select";

import {
  StyledSelect,
  StyledSelectLabel,
} from "../../styles/styled-img-select";

const FilterRoleSelect = ({ name, value, handleChangeFilter }) => {
  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Роль:</StyledSelectLabel>
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
        <Option value={"App\\Entity\\Client"}>
          <div className="option-select-item" style={style}>
            Client
          </div>
        </Option>
        <Option value={"App\\Entity\\Admin"}>
          <div className="option-select-item" style={style}>
            Admin
          </div>
        </Option>
        <Option value={"App\\Entity\\Manager"}>
          <div className="option-select-item" style={style}>
            Manager
          </div>
        </Option>
        <Option value={"App\\Entity\\Seo"}>
          <div className="option-select-item" style={style}>
            Seo
          </div>
        </Option>
        <Option value={"systemEvent"}>
          <div className="option-select-item" style={style}>
            System events
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default FilterRoleSelect;
