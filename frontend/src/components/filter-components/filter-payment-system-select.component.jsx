import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import AlertMessage from "../alert/alert.component";
import SelectSkeleton from "../skeleton/skeleton-select";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

import { GET_PAYMENT_SYSTEMS } from "../../graphql/queries/payment-system.query";

const FilterPaymentSystemSelect = ({ name, value, handleChangeFilter, label }) => {
  const style = {
    textTransform: "inherit",
  };

  const { loading, error, data } = useQuery(GET_PAYMENT_SYSTEMS, {
    fetchPolicy: "network-only"
  });

  if (loading)
    return (
      <SelectSkeleton
        className="input-group"
        optionWidth="55"
        label="Платежная система"
      />
    );
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.paymentSystems;

  if (!collection.length)
    return <AlertMessage type="error" message="Нет платежных систем" />;

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">{"Платежная система" + (label ? label : "") + ":"}</StyledSelectLabel>
      <Select
        showSearch
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
        {collection &&
          collection.map(({ id, name }) => (
            <Option key={id} value={name}>
              <div className="option-select-item" style={style}>
                {name}
              </div>
            </Option>
          ))}
      </Select>
    </StyledSelect>
  );
};

export default FilterPaymentSystemSelect;
