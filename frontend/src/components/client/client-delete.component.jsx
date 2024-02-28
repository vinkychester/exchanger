import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";

import DialogModal from "../dialog/dialog.component";

import { StyledMenuLink } from "../styles/styled-user-card";

import { UPDATE_CLIENT_DETAILS } from "../../graphql/mutations/client.mutation";
import { GET_CLIENTS } from "../../graphql/queries/clients.query";
import { ClientFilterContext } from "./client.container";
import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../utils/datetime.util";

const ClientDelete = ({ id }) => {
  const [visible, setVisible] = useState(false);

  const { filter, sign } = useContext(ClientFilterContext);
  
  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { page, date_gte, date_lte, isDeleted } = object;

  const currentPage = page ? parseInt(page) : 1;

  const [updateClient, { loading }] = useMutation(UPDATE_CLIENT_DETAILS, {
    onCompleted: () => {
      setVisible(false);
    },
  });

  const handleDeleteAccount = () => {
    updateClient({
      variables: { id, isDeleted: true },
      refetchQueries: [
        {
          query: GET_CLIENTS,
          variables: {  
            ...object,
            itemsPerPage: filter[`${sign}itemsPerPage`] ? +filter[`${sign}itemsPerPage`] : 50,
            page: currentPage,
            isBanned: sign === "b",
            isDeleted: isDeleted ? isDeleted === "true" :  null,
            date_gte: convertDateToTimestampStart(date_gte),
            date_lte: convertDateToTimestampEnd(date_lte), },
          fetchPolicy: "network-only",
        },
      ],
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
      <StyledMenuLink
        type="button"
        onClick={() => {
          setVisible(true);
        }}
      >
        Удалить аккаунт
      </StyledMenuLink>
    </>
  );
};

export default ClientDelete;