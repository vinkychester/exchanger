import Select, { Option } from "rc-select";
import React from "react";
import { useQuery } from "@apollo/react-hooks";

import SelectSkeleton from "../skeleton/skeleton-select";
import AlertMessage from "../alert/alert.component";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

import { GET_ALL_CITIES } from "../../graphql/queries/cities.query";

const ManagerCitySelect = ({ value, handleChangeFilter, name }) => {
  
  const { data, loading, error } = useQuery(GET_ALL_CITIES, {
    fetchPolicy: "network-only",
    variables: { disable: false }
  });
  
  const style = {
    textTransform: "inherit"
  };
  
  if (loading)
    return (
      <SelectSkeleton
        className="input-group"
        optionWidth="55"
        label="Город"
      />
    );
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;
  
  const { cities } = data;
  
  if (!cities.length)
    return <AlertMessage type="error" message="Нет городов" />;
  
  return (
    <StyledSelect className="input-group contact-select">
      <StyledSelectLabel as="label">Выберите город:</StyledSelectLabel>
      <Select
        showSearch
        className="custom-select"
        name={name}
        id={name}
        value={value ? value : null}
        onChange={(value) => handleChangeFilter(name, value)}
            defaultValue={null}
          >
            <Option
              value={null}
            >
              <div
                className="option-select-item"
                style={style}
              >
                Все
              </div>
            </Option>
            {cities && cities.map(({ id, name }) => (
              <Option
                value={id}
                key={id}
              >
                <div
                  className="option-select-item"
                  style={style}
                >
                  {name}
                </div>
              </Option>
            ))}
      </Select>
    </StyledSelect>
  );
};

export default ManagerCitySelect;
