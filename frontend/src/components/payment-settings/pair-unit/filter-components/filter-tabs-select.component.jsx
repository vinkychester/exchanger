import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import AlertMessage from "../../../alert/alert.component";
import SelectSkeleton from "../../../skeleton/skeleton-select";

import { StyledSelect, StyledSelectLabel } from "../../../styles/styled-img-select";

import { GET_PAIR_UNIT_TABS } from "../../../../graphql/queries/pair-unit-tab.query";
import { parseIRI } from "../../../../utils/response";

const FilterTabsSelect = ({ name, value, handleChangeFilter }) => {
  const { loading, error, data } = useQuery(GET_PAIR_UNIT_TABS);

  if (loading)
    return (
      <SelectSkeleton className="input-group" optionWidth="55" label="Табы" />
    );
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { pairUnitTabs } = data;

  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Пункт калькулятора:</StyledSelectLabel>
      <Select
        className="custom-select"
        id={name}
        name={name}
        value={value ? value : null}
        defaultValue={null}
        onChange={(value) => handleChangeFilter(name, value)}
      >
        <Option value={null}>
          <div className="option-select-item" style={style}>
            Все
          </div>
        </Option>
        {pairUnitTabs &&
          pairUnitTabs.map(({ id, name }) => (
            <Option key={id} value={parseIRI(id)}>
              <div className="option-select-item" style={style}>
                {name}
              </div>
            </Option>
          ))}
      </Select>
    </StyledSelect>
  );
};

export default FilterTabsSelect;
