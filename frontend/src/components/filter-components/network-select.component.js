import Select, { Option } from "rc-select";
import React from "react";
import AlertMessage from "../alert/alert.component";
import { useQuery } from "@apollo/react-hooks";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import SelectSkeleton from "../skeleton/skeleton-select";
import { GET_CITIES_WITH_NETWORKS, GET_NETWORKS_WITH_CITIES } from "../../graphql/queries/cities.query";

const NetworkSelectComponent = ({ value, handleChange, useName, multi }) => {

  const { loading, error, data } = useQuery(GET_NETWORKS_WITH_CITIES, {
    fetchPolicy: "network-only",
  });

  if (loading) return <SelectSkeleton className="input-group" optionWidth="55" label="Загрузка" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { networks } = data;

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Выбор сети:</StyledSelectLabel>
      <Select

        mode={"tags"}
        className="custom-select"
        name="networks"
        id="networks"

        value={value}
        animation={"slide-up"}
        choiceTransitionName="rc-select-selection__choice-zoom"
        multiple={multi}
        optionFilterProp="children"
        optionLabelProp="children"
        placeholder="Выбрать Сеть"
        onChange={handleChange}
      >
        {!!networks && networks.map(({ ...props }, id) => (
          <Option key={id} value={!!useName ? props.name : props.id}>
            <div className="option-select-item" style={style}>
              {` ( сеть ${props.name} )`}
            </div>
          </Option>
        ))}
      </Select>
    </StyledSelect>
  );
};

export default NetworkSelectComponent;
