import React from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import RequisitionItem from "../../requisition-list/requisition-item.component";

import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../../styles/styled-table";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import { GET_NEW_CLIENT_REQUISITIONS } from "../../../graphql/queries/requisition.query";

const ClientDetailsRequisitionList = ({ id }) => {
  let permissions = {};
  const client = useApolloClient();

  const { userRole, managerCity } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  if ("manager" === userRole)
    permissions = {
      exchangePoint_list: managerCity.length !== 0 ? managerCity : "",
    };

  const { data, loading, error } = useQuery(GET_NEW_CLIENT_REQUISITIONS, {
    variables: {
      client_id: id,
      ...permissions,
    },
    fetchPolicy: "network-only",
  });

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="20px" />;
  if (error) return <AlertMessage type="error" message={error.message} margin="15px 0"/>;
  if (!data) return <></>;

  const { collection } = data.requisitions;

  if (!collection.length)
    return <AlertMessage type="info" message="Нет заявок" margin="15px 0 0" />;

  return (
    <StyledTable className="requisition-table">
      <StyledTableHeader col="8" className="requisition-table__header">
        <StyledColHead>Номер</StyledColHead>
        <StyledColHead>Дата</StyledColHead>
        <StyledColHead>Сумма платежа</StyledColHead>
        <StyledColHead>Сумма к получению</StyledColHead>
        <StyledColHead>Статус</StyledColHead>
        <StyledColHead />
      </StyledTableHeader>
      <StyledTableBody>
        {collection &&
          collection.map(({ ...props }, key) => (
            <RequisitionItem key={key} {...props} />
          ))}
      </StyledTableBody>
    </StyledTable>
  );
};

export default ClientDetailsRequisitionList;