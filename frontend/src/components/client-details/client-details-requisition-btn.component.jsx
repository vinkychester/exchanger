import React from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

import { StyledButton } from "../styles/styled-button";

import { ADD_MANAGER_CLIENT_REQUISITION } from "../../graphql/queries/manager.query";

const ClientDetailsRequisitionBtn = ({ id }) => {
  let history = useHistory();

  const [createManagerClientRequisition] = useMutation(
    ADD_MANAGER_CLIENT_REQUISITION,
    {
      onCompleted: () => history.push("/"),
    }
  );

  const handleButtonClick = () => {
    createManagerClientRequisition({
      variables: {
        input: { uuid: id },
      },
    });
  };

  return (
    <StyledButton
      color="main"
      type="button"
      title="Фильтр"
      weight="normal"
      onClick={handleButtonClick}
    >
      Создать заявку от пользователя
    </StyledButton>
  );
};

export default ClientDetailsRequisitionBtn;
