import React from "react";
import Select, { Option } from "rc-select";

import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";

const PairUnitSelect = ({
  label,
  direction,
  selected,
  collection,
  handleChangeSelect,
}) => (
  <StyledSelect className={`create-pair-form__${direction}`}>
    <StyledSelectLabel>{label} :</StyledSelectLabel>
    <Select
      mode="tags"
      className="custom-select-img custom-multiselect"
      value={selected}
      onChange={(value) => handleChangeSelect(direction, value)}
    >
      {collection &&
        collection.map(({ id, currency, paymentSystem, service }) => {
          return (
            <Option key={id} value={id} label="paymentUnit">
              <div className="option-select-item">
                <span
                  role="img"
                  className={`exchange-icon-${paymentSystem.tag === 'CRYPTO' ? currency.asset : paymentSystem.tag}`}
                  aria-label={currency.asset}
                />
                <b>{paymentSystem.name}</b> {currency.asset} {service.name}
              </div>
            </Option>
          );
        })}
    </Select>
  </StyledSelect>
);

export default React.memo(PairUnitSelect);
