import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import AlertMessage from "../alert/alert.component";
import Select, { Option } from "rc-select";
import SelectSkeleton from "../skeleton/skeleton-select";
import { GET_ALL_CITIES_WITHOUT_CITY_CONTACTS } from "../../graphql/queries/cities.query";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

const CitySelectForCityContacts = ({ checkedCity, setCheckedCity }) => {
  const { data, error, loading } = useQuery(GET_ALL_CITIES_WITHOUT_CITY_CONTACTS, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (data?.cities.length) {
      setCheckedCity(data.cities[0].id);
    }
  }, [data]);

  if (loading) return <SelectSkeleton optionWidth="25" label="Выберите город" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  const { cities } = data;

  if (!cities.length)
    return <AlertMessage type="info" message="Нет перечня городов" margin="15px 0" />;

  const handleChangeSelect = (value) => {
    setCheckedCity(value);
  };

  const style = {
    textTransform: "inherit"
  };

  return (
    <>
      {cities ?
        <StyledSelect className="input-group contact-select">
          <StyledSelectLabel>
            Выберите город:
          </StyledSelectLabel>
          <Select
            showSearch
            className="custom-select"
            name="city"
            value={checkedCity}
            onChange={handleChangeSelect}
            defaultValue={"Выбрать город"}
          >
            {cities && cities.map(({ ...city }, key) => (
              <Option
                value={city.id}
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
          className="contact-select"
          optionWidth="55"
          label="Выберите город"
        />
      }
    </>
  );
};

export default CitySelectForCityContacts;