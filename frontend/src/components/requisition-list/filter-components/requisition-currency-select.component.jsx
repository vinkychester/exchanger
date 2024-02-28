import React from "react";
import Select, { Option } from "rc-select";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import { useQuery } from "@apollo/react-hooks";
import { GET_FIAT_CURRENCY } from "../../../graphql/queries/currency.query";
import SelectSkeleton from "../../skeleton/skeleton-select";
import AlertMessage from "../../alert/alert.component";

const RequisitionCurrencySelect = ({ value, handleChangeFilter }) => {
  const name = "currency";
  const { data, loading, error } = useQuery(GET_FIAT_CURRENCY);

  if (loading) return <SelectSkeleton className="choose-city" optionWidth="55" label="Загрузка" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.currencies;

  const listCurrency = Object.values(collection.reduce((p, v) => {
    const old = p[v.asset];
    if (!old) {
      p[v.asset] = { ...v, count: 1 };
    } else {
      p[v.asset].count++;
    }
    return p;
  }, {}));

  const style = {
    textTransform: "inherit",
  };

  return (
    <>
      <StyledSelect className="input-group">
        <StyledSelectLabel as="label">Валюта:</StyledSelectLabel>
        <Select
          className="custom-select"
          name={name}
          id={name}
          defaultValue={null}
          value={value ? value : null}
          onChange={(value) => handleChangeFilter(name, value)}
        >
          <Option value={null}>
            <div className="option-select-item" style={style}>
              Все
            </div>
          </Option>
          {listCurrency && listCurrency.map(({ ...props }, id) => (
            <Option key={id} value={props.asset}>
              <div className="option-select-item" style={style}>
                {props.asset}
              </div>
            </Option>
          ))}
        </Select>
      </StyledSelect>
    </>
  );
};

export default RequisitionCurrencySelect;