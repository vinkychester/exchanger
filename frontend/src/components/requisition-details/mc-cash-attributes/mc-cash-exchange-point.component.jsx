import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";

import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";

import { GET_EXCHANGE_POINTS } from "../../../graphql/queries/exchange-point.query";

const MCCashExchangePoint = ({
  id,
  name,
  value,
  networkId,
  external,
  pairUnit,
  handleChangeMCCashDetails,
}) => {
  const { loading, error, data } = useQuery(GET_EXCHANGE_POINTS, {
    variables: { network_id: networkId, pairUnit_id: pairUnit, city_id: external },
  });

  const handleChangeSelect = (value, { label }) => {
    handleChangeMCCashDetails(id, name, value, label);
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="25px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collectionQueryExchangePoints } = data;

  if (!collectionQueryExchangePoints.length)
    return <AlertMessage type="warning" message="Нет точек обмена." />;

  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="mscash-field">
      <StyledSelectLabel as="label">Выберите точку обмена:</StyledSelectLabel>
      <Select
        className="custom-select-img"
        defaultValue={(value) ?? ""}
        onChange={handleChangeSelect}
        name={name}
      >
        <Option value="" label="выбрать">
          <div className="option-select-item" style={style}>
            Выбрать точку
          </div>
        </Option>
        {collectionQueryExchangePoints &&
          collectionQueryExchangePoints.map(
            ({ id, name, description, address, externalId }) => (
              <Option
                key={id}
                value={externalId.toString()}
                label={`${name} (${description}) ${address}`}
              >
                <div className="option-select-item" style={style}>
                  {name} ({description}) 
                  {/* {address} */}
                </div>
              </Option>
            )
          )}
      </Select>
    </StyledSelect>
  );
};

export default MCCashExchangePoint;
