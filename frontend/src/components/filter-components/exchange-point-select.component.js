import Select, { Option } from "rc-select";
import React, { useEffect } from "react";
import AlertMessage from "../alert/alert.component";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import SelectSkeleton from "../skeleton/skeleton-select";
import { GET_EXCHANGE_POINTS } from "../../graphql/mutations/client.mutation";
import { parseUuidIRI } from "../../utils/response";

const ExchangePointSelectComponent = ({ cityId, networkId, handleChange, useName }) => {

  const [loadExchangePoints, { loading, error, data }] = useMutation(GET_EXCHANGE_POINTS);

  useEffect(() => {
    if (!!cityId || !!networkId) {
      loadExchangePoints(
        {
          variables: {
            id: cityId,
            cityId: parseUuidIRI(cityId),
            networkId: parseUuidIRI(networkId)
          }
        }
      );
    }
  }, [cityId]);

  if (loading) return <SelectSkeleton className="input-group" optionWidth="55" label="Загрузка" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { exchangePoints } = data.getExchangePointsCity.city;

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Точка обмена:</StyledSelectLabel>
      <Select

        className="custom-select"
        name="exchangePoint"
        id="exchangePoint"

        animation={"slide-up"}
        choiceTransitionName="rc-select-selection__choice-zoom"
        multiple={true}
        optionFilterProp="children"
        optionLabelProp="children"
        placeholder="Выберите точку обмена"
        onChange={handleChange}
      >
        <Option value={"custom"}>
          <div className="option-select-item" style={style}> Свой вариант точни обмена</div>
        </Option>
        {!!exchangePoints && exchangePoints.map(({ ...props }, id) => (

          <Option key={id} value={!!useName ? props.name : props.id}>
            <div className="option-select-item" style={style}>
              {`${props.description} ( адрес ${props.address} )`}
            </div>
          </Option>
        ))}
      </Select>
    </StyledSelect>
  );
};

export default ExchangePointSelectComponent;
