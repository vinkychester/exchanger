import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import Spinner from "../../spinner/spinner.component";

import { StyledSelect } from "../../styles/styled-img-select";
import { StyledPairUnitTab } from "../../../pages/payment-settings/styled-payment-settings";

import { GET_PAIR_UNIT_TABS } from "../../../graphql/queries/pair-unit-tab.query";
import { UDATE_PAIR_UNIT_TAB } from "../../../graphql/mutations/pair-unit.mutation";

const PairUnitTab = ({ currentTab, pairUnitId }) => {
  const [selected, setSelected] = useState(currentTab ? currentTab.id : null);

  const { loading: queryLoading, error: queryError, data } = useQuery(GET_PAIR_UNIT_TABS);
  const [updatePairUnitTab, { loading: mutationLoading, error: mutationError }] = useMutation(UDATE_PAIR_UNIT_TAB);
  useEffect(() => {
      setSelected(currentTab ? currentTab.id : null);
    }, [currentTab]
  );
  if (queryLoading) return <Spinner color="#EC6110" type="moonLoader" size="25px" />;

  const { pairUnitTabs } = data;

  const handleChange = (value) => {
    setSelected(value);
    updatePairUnitTab({ variables: { id: pairUnitId, pairUnitTabs: value } });
  };

  return (
    <StyledPairUnitTab>
      <StyledSelect>
        <Select
          className="custom-select-img"
          defaultValue={selected}
          disabled={mutationLoading}
          onChange={handleChange}
          value={selected}
        >
          <Option value={null} label="Таб не выбран">
            <div className="option-select-item">Таб не выбран</div>
          </Option>
          {pairUnitTabs.map(({ id, name }) => (
            <Option key={id} value={id} label={name}>
              <div className="option-select-item">{name}</div>
            </Option>
          ))}
        </Select>
      </StyledSelect>
      {mutationLoading && (
        <div className="default-spinner">
          <Spinner color="#EC6110" type="moonLoader" size="17px" />
        </div>
      )}
      {mutationError && <p>Error :( Please try again</p>}
    </StyledPairUnitTab>
  );
};

export default PairUnitTab;
