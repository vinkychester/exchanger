import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect } from "../styles/styled-img-select";
import Tooltip from "rc-tooltip";

const ItemsPerPageSelectComponent = ({ value, user, handleChangeFilter, name }) => {

  const items = user ? [12, 20, 36, 60, 100] : [10, 20, 30, 50, 100];

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="perpage-select">
      <Tooltip placement="top" overlay="Кол-во записей на странице">
        <Select
          className="custom-select"
          name={name}
          value={value ? value : 50}
          onChange={(value) => handleChangeFilter(name, value)}
          placeholder={"Количество записей на странице"}
        >
          {items.map(item => (
            <Option value={item} key={item}>
              <div className="option-select-item" style={style}>
                {item}
              </div>
            </Option>
          ))}
        </Select>
      </Tooltip>
    </StyledSelect>
  );
};

export default ItemsPerPageSelectComponent;