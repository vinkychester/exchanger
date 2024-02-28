import React, { useState } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import SelectSkeleton from "../skeleton/skeleton-select";
import AlertMessage from "../alert/alert.component";
import LoadButton from "../spinner/button-spinner.component";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import { StyledButton } from "../styles/styled-button";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_MANAGERS_LIST } from "../../graphql/queries/manager.query";
import { GET_REQUISITION_DETAILS } from "../../graphql/queries/requisition.query";
import { UPDATE_REQUISITION_MANAGER } from "../../graphql/mutations/requisition.mutation";

const RequisitionDetailsManager = ({ requisitionId, managerId, cities_externalId }) => {
  const client = useApolloClient();
  
  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [manager, setManager] = useState(managerId ?? null);

  const { data, loading, error } = useQuery(GET_MANAGERS_LIST, {
    variables: { cities_externalId },
    fetchPolicy: "network-only",
  });

  const [updateRequisitionManager, { loading: mutationLoading, data: mutationData }] = useMutation(UPDATE_REQUISITION_MANAGER);

  const handleSetManager = () => {
    updateRequisitionManager({
      variables: { id: requisitionId, manager },
      refetchQueries: [
        {
          query: GET_REQUISITION_DETAILS,
          variables: {
            id: requisitionId,
            isManager: "client" !== userRole,
          },
        },
      ],
    });
  };

  if (loading)
    return (
      <SelectSkeleton
        className="input-group"
        optionWidth="55"
        label="Менеджеры"
      />
    );
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.managers;

  if (!collection.length)
    return <AlertMessage type="warning" message="Нет менеджеров в системе." />;

  const style = {
    textTransform: "inherit",
  };

  return (
    <>
      <StyledSelect className="input-group">
        <StyledSelectLabel as="label">Менеджер заявки</StyledSelectLabel>
        <Select
          className="custom-select"
          id="manager"
          name="manager"
          // value={value ? value : null}
          defaultValue={manager ?? null}
          onChange={(value) => setManager(value)}
        >
          <Option value={null}>
            <div className="option-select-item" style={style}>
              Назначить менеджера
            </div>
          </Option>
          {collection &&
            collection.map(({ id, firstname, lastname, email }) => (
              <Option key={id} value={id}>
                <div className="option-select-item" style={style}>
                  {firstname} {lastname} ({email})
                </div>
              </Option>
            ))}
        </Select>
      </StyledSelect>
      {mutationLoading ? (
        <LoadButton
          mt="15"
          color="info"
          text="Назначить"
          weight="normal"
          type="button"
        />
      ) : (
        !mutationData && (
          <StyledButton
            mt="15"
            as="button"
            color="info"
            weight="normal"
            type="button"
            onClick={handleSetManager}
          >
            Назначить
          </StyledButton>
        )
      )}
    </>
  );
};

export default RequisitionDetailsManager;
