import React from "react";
import Select, { Option } from "rc-select";

import {
  StyledSelect,
  StyledSelectLabel,
} from "../../styles/styled-img-select";

import { creditCardStatuses } from "../../../utils/consts.util";
import translate from "../../../i18n/translate";

const FilterCardVerificationStatusSelect = ({ value, handleChangeFilter }) => {
  const name = "status";
  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Статус:</StyledSelectLabel>
      <Select
        className="custom-select"
        name={name}
        id={name}
        defaultValue={null}
        value={value ?? null}
        onChange={(value) => handleChangeFilter(name, value)}
      >
        <Option value={null}>
          <div className="option-select-item" style={style}>
            Все
          </div>
        </Option>
        <Option value={creditCardStatuses.VERIFIED}>
          <div className="option-select-item" style={style}>
            {translate(creditCardStatuses.VERIFIED)}
          </div>
        </Option>
        <Option value={creditCardStatuses.NOT_VERIFIED}>
          <div className="option-select-item" style={style}>
            {translate(creditCardStatuses.NOT_VERIFIED)}
          </div>
        </Option>
        <Option value={creditCardStatuses.CANCELED}>
          <div className="option-select-item" style={style}>
            {translate(creditCardStatuses.CANCELED)}
          </div>
        </Option>
        <Option value={creditCardStatuses.PAST_DUE_DATE}>
          <div className="option-select-item" style={style}>
            {translate(creditCardStatuses.PAST_DUE_DATE)}
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default FilterCardVerificationStatusSelect;
