import React, { useState, useContext } from "react";
import { useMutation, useApolloClient } from "@apollo/react-hooks";

import DialogModal from "../dialog/dialog.component";

import { StyledButton } from "../styles/styled-button";

import { DELETE_CREDIT_CARD } from "../../graphql/mutations/credit-card.mutation";
import { GET_CREDIT_CARDS } from "../../graphql/queries/credit-card.query";
import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { CardVerificationContext } from "../../pages/card-verification/card-verification.component";
import { convertDateToTimestamp } from "../../utils/datetime.util";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const CardVerificationDeleteButton = ({ id, cardMask }) => {
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { filter, currentPage } = useContext(CardVerificationContext);
  const { itemsPerPage } = filter;
  
  const [visible, setVisible] = useState(false);

  const [deleteCreditCard, { loading }] = useMutation(DELETE_CREDIT_CARD, {
    onCompleted: () => {
      setVisible(false);
      closableNotificationWithClick("Банковская карта удалена", "success");
    },
  });

  const { date_gte, date_lte, ...props } = filter;

  const handleDeleteCreditCard = () => {
    deleteCreditCard({
      variables: { id },
      refetchQueries: [
        {
          query: GET_CREDIT_CARDS,
          variables: {
            ...props,
            itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
            page: currentPage,
            date_gte: convertDateToTimestamp(date_gte),
            date_lte: convertDateToTimestamp(date_lte),
            client_id: userId, 
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
          message={`Вы уверены, что хотите удалить карту ${cardMask}?`}
          title="Внимание!"
          setVisible={setVisible}
          handler={handleDeleteCreditCard}
        />
      )}
      <StyledButton
        type="button"
        color="danger"
        weight="normal"
        disabled={loading}
        onClick={() => setVisible(true)}
      >
        Удалить
      </StyledButton>
    </>
  );
};

export default CardVerificationDeleteButton;
