import React, { useContext, useState } from "react";
import { useMutation, useApolloClient } from "@apollo/react-hooks";

import LoadButton from "../spinner/button-spinner.component";

import { StyledButton } from "../styles/styled-button";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_REQUISITION_DETAILS } from "../../graphql/queries/requisition.query";
import { CREATE_INVOICE } from "../../graphql/mutations/invoice.mutation";
import { RequisitionDetailsContext } from "./requisition-details.component";
import Dialog from "rc-dialog";
import { NavLink } from "react-router-dom";

const RequisitionDetailsPaymentButton = ({ label, cardStatus, isDisabled = false }) => {
  const client = useApolloClient();
  const [cardVerified, setCardVerified] = useState(false);

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { requisitionId } = useContext(RequisitionDetailsContext);
  const [createInvoice, { loading, data, error }] = useMutation(CREATE_INVOICE);
  const handleVerified = () => {
    cardStatus ? setCardVerified(true) : handleCreateInvoice();
  };

  const handleCreateInvoice = () => {
    createInvoice({
      variables: { requisition: requisitionId },
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

  const modalContent = () => {
    const yes = () => {
      setCardVerified(false);
      handleCreateInvoice();
    };

    const style = {
      textAlign: 'justify'
    }

    return (
      <>
        <div className="default-modal__body-content">
          <p style={style}>
            По данному направлению после оплаты проводиться верификация карты. Ознакомиться с тем, как произвести верификацию банковской карты, Вы можете по {' '}
            <NavLink
            className="default-link"
            to="/panel/card-verification"
            target="_blank"
            rel="noreferrer"
          >
            этой ссылке
          </NavLink>{" "}.
          </p><br/>
          <p>
            Верификация банковских карт проводится в рабочее время тех. поддержки, с 8:00 до 24:00.
          </p><br/>
          <p style={style}>
            Для продолжения нажмите ОК.
          </p>
        </div>
        <div className="default-modal__body-footer">
          <StyledButton color="main" onClick={yes} weight="normal">
            Ok
          </StyledButton>
        </div>
      </>
    );
  };

  if (loading)
    return (
      <LoadButton color="success" text={label} weight="normal" type="button" />
    );

  return (
    <>
      {!data && (
      <StyledButton
        color="success"
        weight="normal"
        onClick={ handleVerified }
        type="button"
        disabled={isDisabled}
      >
        {label}
      </StyledButton>
    )}
    {cardVerified && (
      <Dialog
        visible={cardVerified}
        wrapClassName="rc-modal-center"
        closeIcon={false}
        closable={false}
        animation="zoom"
        maskAnimation="fade"
        title="Внимание"
        className="default-modal"
      >
        {modalContent()}
      </Dialog>
    )}
    </>
  );
}

export default RequisitionDetailsPaymentButton;
