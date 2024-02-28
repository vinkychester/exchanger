import Select, { Option } from "rc-select";
import React from "react";
import AlertMessage from "../alert/alert.component";
import { useQuery } from "@apollo/react-hooks";
import SelectSkeleton from "../skeleton/skeleton-select";

import { GET_CITIES_WITH_NETWORKS } from "../../graphql/queries/cities.query";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import { StyledButton } from "../styles/styled-button";

const CitySelectComponent = ({ value, setCiti, saveCities}) => {

  const { loading, error, data } = useQuery(GET_CITIES_WITH_NETWORKS, {
    fetchPolicy: "network-only",
  });
  const handleChange = (value) => {
    setCiti(value);
  };

  if (loading) return <SelectSkeleton className="choose-city" optionWidth="55" label="Загрузка" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { cities } = data;

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="choose-city">

      <StyledSelectLabel className="choose-city__label">
        Города менеджера:
      </StyledSelectLabel>
      <Select
        mode="tags"
        className="custom-multiselect"
        name="city"
        value={value}
        animation={"slide-up"}
        placeholder="Выбрать город"
        onChange={handleChange}
      >
        {cities && cities.map(({ ...props }, id) => (
          <Option key={id} value={props.id}>
            <div className="option-select-item" style={style}>
              {props.name}
            </div>
          </Option>
        ))}
      </Select>
      <StyledButton
        className="choose-city__btn"
        color="info"
        weight="normal"
        type="button"
        onClick={saveCities}
      >
        Обновить города
      </StyledButton>
    </StyledSelect>
  );
};

export default CitySelectComponent;
