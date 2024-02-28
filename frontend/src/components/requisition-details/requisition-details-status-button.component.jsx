import React, { useContext, useState } from "react";
import { useMutation, useApolloClient } from "@apollo/react-hooks";

import LoadButton from "../spinner/button-spinner.component";
import DialogModal from "../dialog/dialog.component";

import { StyledButton } from "../styles/styled-button";

import { UPDATE_REQUISITION_STATUS } from "../../graphql/mutations/requisition.mutation";
import { GET_REQUISITION_DETAILS } from "../../graphql/queries/requisition.query";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { RequisitionDetailsContext } from "./requisition-details.component";

const RequisitionDetailsStatusButton = ({
  status,
  message,
  btnText,
  color,
}) => {
  const client = useApolloClient();

  const { userRole, userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { requisitionId } = useContext(RequisitionDetailsContext);

  const [visible, setVisible] = useState(false);
  const [updateStatus, { loading }] = useMutation(UPDATE_REQUISITION_STATUS, {
    onCompleted: () => setVisible(false),
  });

  const handleCancelRequisition = () => {
    updateStatus({
      variables: { id: requisitionId, status },
      refetchQueries: [
        {
          query: GET_REQUISITION_DETAILS,
          variables: {
            id: requisitionId,
            isManager: "client" !== userRole && "manager" !== userRole,
          },
        },
      ],
    });
  };

  return loading ? (
    <LoadButton color={color} text={btnText} weight="normal" type="button" />
  ) : (
    <>
      {visible && (
        <DialogModal
          visible={visible}
          message={message}
          title="Внимание!"
          setVisible={setVisible}
          handler={handleCancelRequisition}
        />
      )}
      <StyledButton
        onClick={() => {
          setVisible(true);
        }}
        color={color}
        weight="normal"
        type="button"
      >
        {btnText}
      </StyledButton>
    </>
  );
};

export default RequisitionDetailsStatusButton;
