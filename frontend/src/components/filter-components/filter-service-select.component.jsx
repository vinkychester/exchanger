import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import AlertMessage from "../alert/alert.component";
import SelectSkeleton from "../skeleton/skeleton-select";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

import { GET_SERVICES } from "../../graphql/queries/payment-service.query";

const FilterServiceSelect = ({ name, value, handleChangeFilter, label }) => {
  const { loading, error, data } = useQuery(GET_SERVICES);

  if (loading)
    return (
      <SelectSkeleton className="input-group" optionWidth="55" label="Сервис" />
    );
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { services } = data;

  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">{"Сервис провайдер" + (label ? label : "") + ":"}</StyledSelectLabel>
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
        {services &&
          services.map(({ id, name, tag }) => (
            <Option key={id} value={tag}>
              <div className="option-select-item" style={style}>
                {name}
              </div>
            </Option>
          ))}
      </Select>
    </StyledSelect>
  );
};

export default FilterServiceSelect;
