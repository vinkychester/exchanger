import React, { useState, useContext } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";

import DialogModal from "../dialog/dialog.component";
import TextAreaGroupComponent from "../input-group/textarea-group.component";

import { StyledButton } from "../styles/styled-button";

import { UPDATE_CREDIT_CARD_DATA } from "../../graphql/mutations/credit-card.mutation";
import { GET_CREDIT_CARD_DETAILS } from "../../graphql/queries/credit-card.query";
import { CardVerificationDetailsContext } from "./card-verification-details.component";
import { creditCardStatuses } from "../../utils/consts.util";
import { parseApiErrors } from "../../utils/response";

const CardVerificationDetailsCancelButton = () => {
  const { id } = useContext(CardVerificationDetailsContext);

  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  const [updateCreditCardData, { loading }] = useMutation(
    UPDATE_CREDIT_CARD_DATA,
    {
      onCompleted: () => setVisible(false),
      onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors)),
    }
  );

  const handleCancelCreditCard = () => {
    updateCreditCardData({
      variables: { id, comment, status: creditCardStatuses.CANCELED },
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
          visible={visible}
          message={
            <DialogMessage
              comment={comment}
              setComment={setComment}
              errors={errors}
            />
          }
          title="Внимание!"
          setVisible={setVisible}
          handler={handleCancelCreditCard}
        />
      )}
      <StyledButton
        weight="normal"
        type="submit"
        color="danger"
        onClick={() => {
          setVisible(true);
        }}
      >
        Отклонить
      </StyledButton>
    </>
  );
};

const DialogMessage = ({ comment, setComment, errors }) => {
  return (
    <>
      <p style={{marginBottom: '15px'}}>Вы действительно хотите отменить верификацию карты?</p>
      <TextAreaGroupComponent
        name="comment"
        label="Примечание"
        placeholder="Текст примечания"
        handleChange={(event) => setComment(event.target.value)}
        value={comment}
        maxLength="3600"
        required
        errors={errors.comment}
      />
    </>
  );
};

export default CardVerificationDetailsCancelButton;
