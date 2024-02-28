import React from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import AlertMessage from "../alert/alert.component";
import SelectSkeleton from "../skeleton/skeleton-select";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_ATTRIBUTES_BY_ASSET } from "../../graphql/queries/attribute.query";

const LoyaltyProgramAttributes = ({ asset, setWallet }) => {
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { loading, error, data } = useQuery(GET_ATTRIBUTES_BY_ASSET, {
    variables: { clientId: userId, asset },
    fetchPolicy: "network-only"
  });

  if (loading) return <SelectSkeleton
    className="contact-select"
    optionWidth="55"
    label="Реквизиты"
  />;

  if (error)
    return <AlertMessage type="error" message="Error" margin="15px 0" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { attributes } = data;

  if (!attributes.length) return <></>;

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Реквизиты:</StyledSelectLabel>
      <Select
        className="custom-select"
        defaultValue=""
        onChange={(value) => setWallet(value)}
      >
        <Option value="" label="usdt" style={style}>
          <div className="option-select-item">
            Выберите сохраненный реквизит
          </div>
        </Option>
        {attributes &&
          attributes.map(({ id, name, value }) => {
            return (
              <Option key={id} value={value} label="usdt">
                <div className="option-select-item" style={style}>
                  {value} ({name})
                </div>
              </Option>
            );
          })}
      </Select>
    </StyledSelect>
  )
};

export default LoyaltyProgramAttributes;