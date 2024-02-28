import React from "react";
import Select, { Option } from "rc-select";
import { requisitionStatusConst } from "../../utils/requsition.status";
import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

const RequisitionStatusSelectComponent = ({ value, handleChange }) => {

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Статус:</StyledSelectLabel>
      <Select
        className="custom-select"
        name="status"
        onChange={handleChange}
        value={value ?? "all"}
        defaultValue={"all"}
        id="status"
      >
        <Option value={"all"}>
          <div className="option-select-item" style={style}>
            Все
          </div>
        </Option>
        <Option value={requisitionStatusConst.NEW}>
          <div className="option-select-item" style={style}>
            Новая заявка
          </div>
        </Option>
        <Option value={requisitionStatusConst.PROCESSED}>
          <div className="option-select-item" style={style}>
            Оплаченные заявки
          </div>
        </Option>
        <Option value={requisitionStatusConst.FINISHED}>
          <div className="option-select-item" style={style}>
            Выполненые заявки
          </div>
        </Option>
        <Option value={requisitionStatusConst.CANCELED}>
          <div className="option-select-item" style={style}>
            Отмененные заявки
          </div>
        </Option>
        <Option value={requisitionStatusConst.DISABLED}>
          <div className="option-select-item" style={style}>
            Закрытые заявки
          </div>
        </Option>
        <Option value={requisitionStatusConst.ERROR}>
          <div className="option-select-item" style={style}>
            Ошибка при выплате
          </div>
        </Option>
      </Select>
    </StyledSelect>
  );
};

export default RequisitionStatusSelectComponent;

