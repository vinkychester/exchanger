import React, { useContext } from "react";
import Select, { Option } from "rc-select";
import { useQuery, useApolloClient } from "@apollo/react-hooks";

import AlertMessage from "../alert/alert.component";
import SelectSkeleton from "../skeleton/skeleton-select";

import { StyledSelect } from "../styles/styled-img-select";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_CLIENT_BANK_DETAILS_BY_DIRECTION } from "../../graphql/queries/bank-detail.query";
import { CalculatorAttributesContext, CalculatorContext } from "./calculator.component";
import { CalculatorAttributesContentContext } from "./calculator-attributes.component";

const CalculatorAttributesSelect = ({ fieldName, selected, setSelected }) => {
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { setErrors, handleChangeRequisitionDetails } = useContext(CalculatorContext);
  const { direction, pairUnitId, attributes } = useContext(CalculatorAttributesContext);
  const { handleToggleCheckbox } = useContext(CalculatorAttributesContentContext);

  const { data, loading, error } = useQuery(GET_CLIENT_BANK_DETAILS_BY_DIRECTION, {
    variables: { client_id: userId, direction, pairUnit_id: pairUnitId },
    fetchPolicy: "network-only"
  });

  const field = `${direction}Attributes`;
  const saveField = `save${direction[0].toUpperCase() + direction.slice(1)}BankDetails`;

  const handleChangeSelect = (value, { label, key }) => {
    setSelected(value);
    handleToggleCheckbox(false);
    setErrors({});
    handleChangeRequisitionDetails(field, attributes.concat(label));
    handleChangeRequisitionDetails(saveField, false);
  };

  if (loading) return <SelectSkeleton optionWidth="12" margin="0 0 10px 0" />; // or <></>
  if (error) return <AlertMessage type="warning" message="There are no attributes" />;
  if (!data) return <AlertMessage type="warning" message="Not found" />;

  const { collection } = data.bankDetails;

  if (!collection.length) return <></>;

  return (
    <StyledSelect className="save-requisite-select">
      <Select
        id="save-attributes"
        className="custom-select-img"
        defaultValue=""
        onChange={handleChangeSelect}
        name={fieldName}
        value={selected}
      >
        <Option value="" label={[]}>
          <div className="save-requisite-select__item">
            Выбрать из сохраненных
          </div>
        </Option>
        {collection &&
          collection.map(({ title, attributes }) => {
            let result = attributes.find((item) => item.name === fieldName);
            const { id, name, value } = result;
            return (
              <Option key={id} value={value} label={attributes}>
                <div className="save-requisite-select__item">
                  {value} ({title})
                </div>
              </Option>
            );
          })}
      </Select>
    </StyledSelect>
  );
};

export default React.memo(CalculatorAttributesSelect);
