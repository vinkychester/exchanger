import React from "react";
import { StyledButton } from "../styles/styled-button";
import { useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";

import AlertMessage from "../alert/alert.component";

import { StyledDocumentVerificationItem } from "../../pages/document/styled-document";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";

const DocumentVerificationItem = ({ schema }) => {
  let history = useHistory();
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { collection } = schema.pairUnit;
  const { collection: collection1 } = schema.clientVerificationSchema;
  const { verificationInfo } = collection1.find(
    (client) => client.client.id === "/api/clients/" + userId
  );

  const verificationFlowHandle = () => {
    if (!verificationInfo.status) {
      localStorage.setItem("verificationLink" + userId, verificationInfo.link);
      history.push("/panel/document/verification");
    }
  };

  return (
    <StyledDocumentVerificationItem>
      <div className="document-flow-action">
        {verificationInfo.status ? (
          <AlertMessage
            type="success"
            message="Ваши документы верифицированы"
          />
        ) : (
          <StyledButton
            color="info"
            weight="normal"
            onClick={verificationFlowHandle}
          >
            Пройти верификацию
          </StyledButton>
        )}
      </div>
      <div className="document-flow-title">
        Схема верификации для обмена по направлениям:
      </div>
      <div className="payment-system-list">
        {collection.map(({ ...pairUnit }, key) => (
          <div key={key} className="payment-system-list__item payment-system">
            <div className={`exchange-icon-${pairUnit.paymentSystem.tag}`} />
            <div className="payment-system__name">
              {pairUnit.paymentSystem.name}
            </div>
            <div className="payment-system__currency">
              {pairUnit.currency.asset}
            </div>
          </div>
        ))}
      </div>
    </StyledDocumentVerificationItem>
  );
};

export default DocumentVerificationItem;
