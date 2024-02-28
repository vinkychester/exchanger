import Select, { Option } from "rc-select";
import React from "react";
import AlertMessage from "../alert/alert.component";
import { useQuery } from "@apollo/react-hooks";
import { parseIRI } from "../../utils/response";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import SelectSkeleton from "../skeleton/skeleton-select";
import { GET_SERVICES } from "../../graphql/queries/payment-service.query";

const PaymentServiceSelectComponent = ({ value, handleChange }) => {

  const { loading, error, data } = useQuery(GET_SERVICES);

  if (loading) return <SelectSkeleton className="input-group" optionWidth="55" label="Платежная систем" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { services } = data;

  const style = {
    textTransform: "inherit"
  };


  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Сервис провайдер:</StyledSelectLabel>
      <Select
        className="custom-select"
        name="serviceProvider"
        onChange={handleChange}
        value={value ?? "all"}
        defaultValue={"all"}
        id="serviceProvider"
      >
        <Option value={"all"}>
          <div className="option-select-item" style={style}> Все</div>
        </Option>
        {!!services && services.map(({ ...props }, id) => (
          <Option key={id} value={props.tag}>
            <div className="option-select-item" style={style}>
              {props.name}
            </div>
          </Option>
        ))}
      </Select>
    </StyledSelect>
  );
};

export default PaymentServiceSelectComponent;
