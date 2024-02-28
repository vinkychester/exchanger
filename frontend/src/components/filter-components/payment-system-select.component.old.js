import Select, { Option } from "rc-select";
import React from "react";
import { GET_PAYMENT_SYSTEMS } from "../../graphql/queries/payment-system.query";
import AlertMessage from "../alert/alert.component";
import { useQuery } from "@apollo/react-hooks";
import { parseIRI } from "../../utils/response";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import SelectSkeleton from "../skeleton/skeleton-select";

const PaymentSystemSelectComponent = ({ value, handleChange, useName, direction }) => {

  const { loading, error, data } = useQuery(GET_PAYMENT_SYSTEMS);

  if (loading) return <SelectSkeleton className="input-group" optionWidth="55" label="Платежная система" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.paymentSystems;

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Платежная система:</StyledSelectLabel>
      <Select
        className="custom-select"
        name="paymentSystem"
        onChange={handleChange}
        value={value ?? "all"}
        defaultValue={"all"}
        id="paymentSystem"
      >
        <Option value={"all"}>
          <div className="option-select-item" style={style}> Все</div>
        </Option>
        {!!collection && collection.map(({ id, ...props }) => (
          <Option key={id} value={!!useName ? props.name : parseIRI(id)}>
            <div className="option-select-item" style={style}>
              {props.name}
            </div>
          </Option>
        ))}
      </Select>
    </StyledSelect>
  );
};

export default PaymentSystemSelectComponent;
