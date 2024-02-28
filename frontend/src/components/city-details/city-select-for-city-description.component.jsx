import React, { useEffect, useState } from "react";

import Select, { Option } from "rc-select";
import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import SelectSkeleton from "../skeleton/skeleton-select";
import { fetchUkraineCities } from "../../api-calls/fetch-cities";
import { GET_CITIES_DESCRIPTION } from "../../graphql/queries/cities-description.query";
import { useQuery } from "@apollo/react-hooks";

const CitySelectForCityDescription = ({
  checkedCity,
  setCheckedCity,
  label = "Выберите город:",
  additionalCity = null
}) => {
  const [cities, setCities] = useState(null);

  const { data: fetchedCityDescriptions } = useQuery(GET_CITIES_DESCRIPTION,{
    fetchPolicy: "cache-only"
  });

  useEffect(() => {
    fetchUkraineCities().then(data => {
      setCities(data);
    });
  }, []);

  useEffect(() => {
    if(cities && fetchedCityDescriptions.cityDescriptions) {
      let filteredCities = cities;

      filteredCities = filteredCities.filter(
        city => !fetchedCityDescriptions.cityDescriptions.find((cityDescription) => city.name === cityDescription.cityName)
      )

      setCities(filteredCities);
    }
  }, [fetchedCityDescriptions])

  const handleChangeSelect = (value) => {
    setCheckedCity(value);
  };

  const style = {
    textTransform: "inherit"
  };

  return (
    cities ?
      <StyledSelect className="input-group add-city-form__city-select">
        <StyledSelectLabel>
          {label}
        </StyledSelectLabel>
        <Select
          showSearch
          className="custom-select"
          name="city"
          value={checkedCity}
          onChange={handleChangeSelect}
          defaultValue={"Выбрать город"}
        >
          {additionalCity &&
          <Option
            value={additionalCity.name}
            key={additionalCity.id}
          >
            <div
              className="option-select-item"
              style={style}
            >
              {additionalCity.name}
            </div>
          </Option>
          }
          {cities.map((city, key) => (
            <Option
              value={city.name}
              key={key}
            >
              <div
                className="option-select-item"
                style={style}
              >
                {city.name}
              </div>
            </Option>
          ))}
        </Select>
      </StyledSelect> : <SelectSkeleton
        optionWidth="45"
        label="Выберите город:"
        className="add-city-form__city-select"
      />
  );
};

export default React.memo(CitySelectForCityDescription);