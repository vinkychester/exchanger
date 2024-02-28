import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import AlertMessage from "../alert/alert.component";
import SelectSkeleton from "../skeleton/skeleton-select";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

import { GET_USDT_COMMISSION } from "../../graphql/queries/currency.query";

const ReferralPayoutUsdtSelect = ({ setUsdtType, setSum, setWallet }) => {
  const { loading, error, data } = useQuery(GET_USDT_COMMISSION, {
    fetchPolicy: "network-only"
  });

  const handleChangeSelect = (value) => {
    setWallet("");
    setUsdtType(value.split('-')[0]);
    setSum(value.split('-')[1]);
  };

  if (loading) return <SelectSkeleton
    className="contact-select"
    optionWidth="55"
    label="Платежная система"
  />;

  if (error)
    return <AlertMessage type="error" message="Error" margin="15px 0" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.pairUnits;

  if (!collection.length)
    return <AlertMessage type="warning" message="Нет платежных систем." />;

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Платежная система:</StyledSelectLabel>
      <Select
        className="custom-select"
        defaultValue=""
        onChange={handleChangeSelect}
      >
        <Option value="" label="usdt" style={style}>
          <div className="option-select-item">
            Выберите платежную систему
          </div>
        </Option>
        {collection &&
          collection.map(({ id, currency, fee }) => {
            return (
              <Option key={id} value={currency.asset + "-" + fee.constant} label="usdt">
                <div className="option-select-item" style={style}>
                  {currency.asset}
                </div>
              </Option>
            );
          })}
      </Select>
    </StyledSelect>
  );
};

export default ReferralPayoutUsdtSelect;
