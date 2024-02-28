import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";

import AlertMessage from "../../alert/alert.component";

import { StyledButton } from "../../styles/styled-button";
import { StyledRequisitionLink } from "../styled-requisition-details";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import { requisitionStatusConst } from "../../../utils/requsition.status";

const PaycoreLink = ({ value, requisitionStatus, tag }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  if (tag === "CRYPTO") return <></>;

  if (
    "client" !== userRole &&
    (requisitionStatus === requisitionStatusConst.INVOICE ||
      requisitionStatus === requisitionStatusConst.NEW)
  )
    return <AlertMessage type="info" message="Ожидается оплата от клиента" />;

  return (
    <StyledRequisitionLink className="system-requisite__link">
      {"client" === userRole &&
        // <LoadButton color="success" weight="normal" text="Заявка в оплате" mb="15"/>
        (requisitionStatus === requisitionStatusConst.NEW ||
        requisitionStatus === requisitionStatusConst.INVOICE ? (
          <StyledButton
            as="a"
            href={value}
            target="_blank"
            color="success"
            weight="normal"
            type="button"
            rel="noreferrer"
          >
            Перейти к оплате
          </StyledButton>
        ) : (
          <p>
            Регламент обмена 30 минут, после оплаты заявки. Если возникли
            вопросы - обратитесь к менеджерам сервиса, пожалуйста. Контакты
            менеджеров Вы сможете найти в{" "}
            <NavLink to="/contacts" className="default-link">
              соответствующем разделе сайта
            </NavLink>
            .
          </p>
        ))}
    </StyledRequisitionLink>
  );
};

export default PaycoreLink;
