import Select, { Option } from "rc-select";
import React from "react";
import AlertMessage from "../alert/alert.component";
import { useQuery } from "@apollo/react-hooks";
import { parseIRI } from "../../utils/response";


import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import SelectSkeleton from "../skeleton/skeleton-select";
import { GET_SERVICES } from "../../graphql/queries/payment-service.query";
import { GET_PAIR_UNIT_TABS } from "../../graphql/queries/pair-unit-tab.query";

const PaymentTabSelectComponent = ({ value, handleChange }) => {

  const { loading, error, data } = useQuery(GET_PAIR_UNIT_TABS);

  if (loading) return <SelectSkeleton className="input-group" optionWidth="55" label="Платежная систем" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { pairUnitTabs } = data;

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Пункт калькулятора:</StyledSelectLabel>
      <Select
        className="custom-select"
        name="paymentTab"
        onChange={handleChange}
        value={value ?? "all"}
        defaultValue={"all"}
        id="paymentTab"
      >
        <Option value={"all"}>
          <div className="option-select-item" style={style}> Все</div>
        </Option>
        {!!pairUnitTabs && pairUnitTabs.map(({ ...props }, id) => (
          <Option key={id} value={parseIRI(props.id)}>
            <div className="option-select-item" style={style}>
              {props.name}
            </div>
          </Option>
        ))}
      </Select>
    </StyledSelect>
  );
};

export default PaymentTabSelectComponent;
