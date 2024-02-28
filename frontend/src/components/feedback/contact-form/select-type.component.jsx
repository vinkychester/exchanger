import React from "react";
import Select, { Option } from "rc-select";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import { feedbackType, feedbackTypeCons } from "../../../utils/feedback-status";

const SelectType = ({ checkedType, setCheckedType, setCheckedCity }) => {

  const handleChangeSelect = (value) => {
    setCheckedType(value);
    setCheckedCity();
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
        <Option value={feedbackTypeCons.BANK}>
          <div
            className="option-select-item"
            style={style}
          >
            {feedbackType(feedbackTypeCons.BANK)}
          </div>
        </Option>
        <Option value={feedbackTypeCons.CASH}>
          <div
            className="option-select-item"
            style={style}
          >
            {feedbackType(feedbackTypeCons.CASH)}
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );

};

export default SelectType;