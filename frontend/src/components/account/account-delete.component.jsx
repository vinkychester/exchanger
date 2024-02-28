import React, { useCallback, useContext, useState } from "react";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";

import DialogModal from "../dialog/dialog.component";

import { StyledButton } from "../styles/styled-button";

import { UPDATE_CLIENT_DETAILS } from "../../graphql/mutations/client.mutation";
import { UserAccountContext } from "../../pages/account/account.component";

const AccountDelete = () => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const { user } = useContext(UserAccountContext);

  const client = useApolloClient();

  const [updateClient, { loading }] = useMutation(UPDATE_CLIENT_DETAILS, {
    onCompleted: () => {
      setVisible(false);
      client.writeData({
        data: { isLoggedIn: false, userId: "", userRole: "anonymous" },
      });
      history.push("/");
    },
  });

  const handleDeleteAccount = () => {
    updateClient({
      variables: { id: user.id, isDeleted: true },
    });
  };

  return (
    <>
      {visible && (
        <DialogModal
          loading={loading}
          visible={visible}
          message="Вы действительно хотите удалить аккаунт?"
          title="Внимание!"
          setVisible={setVisible}
          handler={handleDeleteAccount}
        />
      )}
      <StyledButton
        color="danger"
        weight="normal"
        type="button"
        onClick={() => {
          setVisible(true);
        }}
      >
        Удалить аккаунт
      </StyledButton>
    </>
  );
};

export default AccountDelete;
