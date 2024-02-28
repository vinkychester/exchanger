import React, { useContext, useState } from "react";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";

import DialogModal from "../dialog/dialog.component";

import { StyledButton } from "../styles/styled-button";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_CLIENT_BANK_DETAILS } from "../../graphql/queries/bank-detail.query";
import { DELETE_BANK_DETAILS } from "../../graphql/mutations/bank-detail.mutation";
import { BankDetailsFilterContext } from "./bank-details.container";
import { BankDetailsAttributesContext } from "./bank-details-list.component";

const BankDetailsToggleButton = () => {
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { filter, itemsPerPage, currentPage, handleChangeFilter } = useContext(BankDetailsFilterContext);
  const { id, title, totalCount, lastPage } = useContext(BankDetailsAttributesContext);
  const { page, ...props } = filter;

  const [visible, setVisible] = useState(false);

  const [deleteBankDetails, { loading, error }] = useMutation(DELETE_BANK_DETAILS, {
    onCompleted: () => setVisible(false)
  });

  const getPageOnRemove = (currentPage) => {
    let calculatedPage = Math.ceil((totalCount - 1) / itemsPerPage);
    if (currentPage > lastPage) currentPage = lastPage;
    else if (currentPage > calculatedPage) currentPage = calculatedPage;
    if (currentPage < 1) return 1;
    handleChangeFilter("page", currentPage);
    return currentPage;
  };

  const handleToggleBankDetails = () => {
    deleteBankDetails({
      variables: { id },
      refetchQueries: [
        {
          query: GET_CLIENT_BANK_DETAILS,
          variables: {
            itemsPerPage,
            page: getPageOnRemove(currentPage),
            client_id: userId,
            ...props,
          },
        },
      ],
    });
  };
  

  return (
    <>
      {visible && (
        <DialogModal
          visible={visible}
          message={`Вы уверены, что хотите удалить реквизит ${title}?`}
          title="Внимание!"
          setVisible={setVisible}
          handler={handleToggleBankDetails}
        />
      )}
      <StyledButton
        type="button"
        color={"danger"}
        weight="normal"
        onClick={() => setVisible(true)}
        disabled={loading}
      >
        Удалить
      </StyledButton>
      {error && <p>Error : {error}</p>}
    </>
  );
};

export default BankDetailsToggleButton;
