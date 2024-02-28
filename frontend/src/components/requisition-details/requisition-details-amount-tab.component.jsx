import React from "react";
import { useApolloClient } from "@apollo/react-hooks";

import {
  StyledBlockSubText,
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../styles/styled-info-block";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";

const RequisitionDetailsAmountTab = ({
  label,
  info,
  amount,
  className,
  fee,
  commission,
}) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { paymentSystem, currency } = info;
  const { constant, percent } = fee;

  let amountNew =
    label === "Получаю" && paymentSystem.tag === "CASH" && userRole === "client"
      ? amount.toString().split(".")[0]
      : amount;

  return (
    <StyledInfoBlock
      className={`requisition-info requisition-tab_${className}`}
    >
      <StyledBlockTitle>{label}:</StyledBlockTitle>
      <StyledBlockText>
        <div
          className={`exchange-icon-${
            paymentSystem.tag === "CRYPTO" ? currency.asset : paymentSystem.tag
          } requisition-info__icon`}
        />
        <div className="requisition-info__main-data">
          {amountNew} <b>{currency.asset}</b>
        </div>
      </StyledBlockText>
      <StyledBlockSubText className="requisition-info__subinfo">
        <p>
          Константа{" "}
          {paymentSystem.tag === "CRYPTO" ? "сети" : "платежной системы"}:
        </p>{" "}
        <span>
          {constant} {currency.asset}
        </span>
      </StyledBlockSubText>
      <StyledBlockSubText className="requisition-info__subinfo">
        <p>
          Комиссия{" "}
          {paymentSystem.tag === "CRYPTO" ? "системы" : "платежной системы"}:
        </p>{" "}
        <span>{paymentSystem.tag === "CRYPTO" ? commission : percent}%</span>
      </StyledBlockSubText>
    </StyledInfoBlock>
  );
};

export default RequisitionDetailsAmountTab;
