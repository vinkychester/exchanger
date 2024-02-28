import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";

import DialogModal from "../dialog/dialog.component";

import { StyledButton } from "../styles/styled-button";

import { GET_CREDIT_CARD_DETAILS } from "../../graphql/queries/credit-card.query";
import { UPDATE_APPROVE_CREDIT_CARD } from "../../graphql/mutations/credit-card.mutation";
import { CardVerificationDetailsContext } from "./card-verification-details.component";
import { creditCardStatuses } from "../../utils/consts.util";

const CardVerificationDetailsApproveButton = () => {
  const { id, cardMask } = useContext(CardVerificationDetailsContext);

  const [visible, setVisible] = useState(false);
  const [updateApproveCreditCard, { loading }] = useMutation(
    UPDATE_APPROVE_CREDIT_CARD, { onCompleted: () => setVisible(false) }
  );

  const handleApproveCreditCard = () => {
    updateApproveCreditCard({
      variables: { id, status: creditCardStatuses.VERIFIED },
      refetchQueries: [
        {
          query: GET_CREDIT_CARD_DETAILS,
          variables: { id },
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
          message={`Вы действительно хотите верифицировать карту ${cardMask}?`}
          title="Внимание!"
          setVisible={setVisible}
          handler={handleApproveCreditCard}
        />
      )}
      <StyledButton
        weight="normal"
        type="submit"
        color="success"
        onClick={() => {
          setVisible(true);
        }}
      >
        Верифицировать
      </StyledButton>
    </>
  );
};

export default CardVerificationDetailsApproveButton;
