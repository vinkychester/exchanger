import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import SelectSkeleton from "../skeleton/skeleton-select";
import AlertMessage from "../alert/alert.component";
import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

import { GET_FIAT_RATES_PAIR_UNIT } from "../../graphql/queries/pair-unit.query";
import { RatesContext } from "./rates.component";
import { deleteDuplicates } from "../../utils/rates.util";

const RatesPayment = () => {
  const { selected, setSelected } = useContext(RatesContext);
  const { data, loading, error } = useQuery(GET_FIAT_RATES_PAIR_UNIT, {
    fetchPolicy: "network-only",
    onCompleted: ({ currencyCollectionPairUnits }) => {
      if (currencyCollectionPairUnits.collection.length !== 0) {
        setSelected(deleteDuplicates(currencyCollectionPairUnits.collection)[0])
      }
    }
  });

  const handleChange = (value, { label }) => {
    setSelected(label);
  };

  if (loading || Object.keys(selected).length === 0)
    return (
      <SelectSkeleton optionWidth="55" label="Выбрать способ оплаты" />
    );
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.currencyCollectionPairUnits;

  if (!collection.length)
    return <AlertMessage type="warning" message="Нет платежных систем." />;

  const filtered = deleteDuplicates(collection);

  return (
    <StyledSelect>
      <StyledSelectLabel>Выбрать способ оплаты:</StyledSelectLabel>
      <Select
        showSearch
        className="custom-select-img"
        defaultValue={selected?.paymentSystem?.name + selected?.currency?.asset}
        onChange={handleChange}
      >
        {filtered &&
          filtered.map((item) => {
            const { paymentSystem, currency, id } = item;
            return (
              <Option
                key={id}
                value={`${paymentSystem.name}${currency.asset}`}
                label={item}
              >
                <div className="option-select-item">
                  <span
                    role="img"
                    className={`exchange-icon-${paymentSystem.tag}`}
                    aria-label={`${currency.tag}`}
                  />
                  <b>{paymentSystem.name}</b>
                  {currency.asset}
                </div>
              </Option>
            );
          })}
      </Select>
    </StyledSelect>
  );
};

export default RatesPayment;
