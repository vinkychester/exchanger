import React from "react";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import Select, { Option } from "rc-select";

const PaymentTypeSelect = ({ checkedType, setCheckedType }) => {

  const handleChangeSelect = (value) => {
    setCheckedType(value);
  };

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group contact-select">
      <StyledSelectLabel>
        Выберите направление:
      </StyledSelectLabel>
      <Select
        className="custom-select"
        name="type"
        value={checkedType}
        onChange={handleChangeSelect}
        defaultValue={"Выберите направление"}
      >
        <Option value={'bank'}>
          <div
            className="option-select-item"
            style={style}
          >
            {"Безналичный расчет"}
          </div>
        </Option>
        <Option value={"cash"}>
          <div
            className="option-select-item"
            style={style}
          >
            {"Наличный расчет"}
          </div>
        </Option>
      </Select>
    </StyledSelect>
  )
}

export default PaymentTypeSelect