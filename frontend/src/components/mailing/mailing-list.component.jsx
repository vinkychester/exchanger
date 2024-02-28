import React, { useContext } from "react";
import { MailingFilterContext } from "../../pages/mailing/mailing.component";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_ALL_MAILING_MESSAGE } from "../../graphql/queries/mailing.query";
import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../styles/styled-table";
import MailingItem from "./mailing-item.component";
import { DELETE_MAILING } from "../../graphql/mutations/mailing.query";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import FragmentSpinner from "../spinner/fragment-spinner.component";

const MailingList = () => {

  const { filter } = useContext(MailingFilterContext);
  const { data, loading, error } = useQuery(GET_ALL_MAILING_MESSAGE, {
    variables: filter,
    fetchPolicy: "network-only"
  });

  const [deleteMailing, { loading: deleteLoading }] = useMutation(DELETE_MAILING, {
    refetchQueries: [{
      query: GET_ALL_MAILING_MESSAGE,
      variables: filter
    }],
    onCompleted: () => {
      closableNotificationWithClick("Рассылка успешно удалена", "success");
    }
  });

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error} margin="15px 0" />;
  if (!data) return <AlertMessage type="warning" message="Список рассылок пуст" margin="15px 0" />;

  const { mailings } = data;
  if (!mailings.length) return <AlertMessage type="info" message="Список рассылок пуст" margin="15px 0" />;

  return (
    <StyledTable className="admin-mailing-table">
      {deleteLoading && <FragmentSpinner position="center" />}
      <StyledTableHeader col="5" className="admin-mailing-table__head">
        <StyledColHead>Заголовок</StyledColHead>
        <StyledColHead>Сообщение</StyledColHead>
        <StyledColHead>Статус</StyledColHead>
        <StyledColHead>Дата создания</StyledColHead>
        <StyledColHead />
      </StyledTableHeader>
      <StyledTableBody>
        {mailings && mailings.map(({ id, ...props }) => (
          <MailingItem key={id} id={id} deleteMailing={deleteMailing} {...props} />
        ))}
      </StyledTableBody>
    </StyledTable>
  );
};

export default MailingList;