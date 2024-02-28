import React from "react";
import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import Select, { Option } from "rc-select";
import { useQuery } from "@apollo/react-hooks";
import { GET_PAYMENT_PAIR_UNITS } from "../../graphql/queries/pair-unit.query";
import AlertMessage from "../alert/alert.component";
import SelectSkeleton from "../skeleton/skeleton-select";

const SelectCrypto = ({ pairUnits, setPostDetails }) => {
  const {data,error,loading} = useQuery(GET_PAYMENT_PAIR_UNITS);

  const handleChangeSelect = (value) => {
    setPostDetails((prevState) => ({
      ...prevState,
      pairUnits: value,
    }));
  };

  if (loading) return <SelectSkeleton className="create-post_select" optionWidth="55" label="Выберите криптовалюту"/>;
  if (error) return <AlertMessage type="error" message={error} />;
  if (!data) return <AlertMessage type="info" message="Нет криптовалют." />;

  const {collection} = data.pairUnits;

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group create-post_select">
      <StyledSelectLabel>
        Выберите криптовалюту:
      </StyledSelectLabel>
      <Select
        className="custom-select-img custom-multiselect"
        mode="multiple"
        name="pairUnits"
        value={pairUnits}
        onChange={handleChangeSelect}
        placeholder="Выберите криптовалюту"
      >
        {collection.map(({...props}) => (
          <Option value={props.id} key={props.id}>
            <div
              className="option-select-item"
              style={style}
            >
              {props.paymentSystem.name} {props.currency.asset}
            </div>
          </Option>
        ))}
      </Select>
    </StyledSelect>
  );

};

export default SelectCrypto;