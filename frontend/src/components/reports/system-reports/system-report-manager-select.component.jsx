import React from "react";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import Select, { Option } from "rc-select";
import { useQuery } from "@apollo/react-hooks";
import { GET_MANAGER_LIST_SELECT } from "../../../graphql/queries/manager.query";
import SelectSkeleton from "../../skeleton/skeleton-select";
import AlertMessage from "../../alert/alert.component";
import { parseUuidIRI } from "../../../utils/response";

const SystemReportManagerSelect = ({ value, handleChangeFilter, name }) => {

  const { data, loading, error } = useQuery(GET_MANAGER_LIST_SELECT, { fetchPolicy: "network-only" });

  if (loading) {
    return (
      <SelectSkeleton
        className="input-group"
        optionWidth="55"
        label="Менеджер"
      />
    );
  }

  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;
  const { collection } = data.managers;
  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Менеджер:</StyledSelectLabel>
      <Select
        className="custom-select"
        name={name}
        id={name}
        defaultValue={null}
        value={value ? value : null}
        onChange={(value) => handleChangeFilter(name, value)}
      >
        <Option value={null}>
          <div className="option-select-item" style={style}>
            Все
          </div>
        </Option>
        {collection.length > 0 && collection.map(({ ...manager }, key) => (
          <Option value={parseUuidIRI(manager.id)} key={key}>
            <div className="option-select-item" style={style}>
              {manager.email}
            </div>
          </Option>
        ))}
      </Select>
    </StyledSelect>
  );
};

export default SystemReportManagerSelect;