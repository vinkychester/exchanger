import React, { useState } from "react";

import Select, { Option } from "rc-select";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_CITIES } from "../../../graphql/queries/cities.query";
import SelectSkeleton from "../../skeleton/skeleton-select";

const SelectCity = ({ checkedCity, setCheckedCity }) => {
  const [cities, setCities] = useState();

  const { data } = useQuery(GET_ALL_CITIES, {
    fetchPolicy: "network-only",
    variables:{ disable: false},
    onCompleted: data => {
      setCities(data.cities);
    }
  });

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
            placeholder={"Выбрать город"}
          >
            {cities && cities.map(({ ...citi }, key) => (
              <Option
                value={citi.id+'_'+citi.name}
                key={key}
              >
                <div
                  className="option-select-item"
                  style={style}
                >
                  {citi.name}
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

}

export default SelectCity;