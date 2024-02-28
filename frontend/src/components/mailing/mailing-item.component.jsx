import React, { useState } from "react";
import { parseUuidIRI } from "../../utils/response";
import { NavLink } from "react-router-dom";
import { TimestampToDate } from "../../utils/timestampToDate.utils";

import { StyledCol, StyledRow } from "../styles/styled-table";
import { StyledButton } from "../styles/styled-button";
import ReactHtmlParser from "react-html-parser";
import Confirmation from "../confirmation/confirmation";

const MailingItem = ({ id, title, message, status, createdAt, deleteMailing }) => {

  const [visible, setVisible] = useState(false);
  const onDeleteClick = () => {
    setVisible(true);
  };

  const handleDelete = () => {
    deleteMailing({ variables: { id: id } });
  };

  return (
    <>
      {visible && (
        <Confirmation
          question={"Вы действительно хотите удалить рассылка?"}
          handler={handleDelete}
          setVisible={setVisible}
          visible={visible}
        />
      )}
      <StyledRow col="5" className="admin-mailing-table__row">
        <StyledCol className="admin-mailing-table__title" data-title="Заголовок">
          {title}
        </StyledCol>
        <StyledCol className="admin-mailing-table__message" data-title="Сообщение">
          <p>
            {ReactHtmlParser(message)}
          </p>
        </StyledCol>
        <StyledCol
          className={`admin-mailing-table__status ${status ? "admin-mailing-table_status-active" : "admin-mailing-table_status-inactive"}`}
          data-title="Статус"
        >
          {status ? "Рассылка активна" : "Рассылка не активна"}
        </StyledCol>
        <StyledCol className="admin-mailing-table__date" data-title="Дата создания">
          {TimestampToDate(createdAt)}
        </StyledCol>
        <StyledCol className="admin-mailing-table__action" data-title="Действие">
          <StyledButton
            to={`/panel/mailings/details/${parseUuidIRI(id)}`}
            as={NavLink}
            color="info"
            weight="normal"
          >
            Детали
          </StyledButton>
          <StyledButton
            color="danger"
            weight="normal"
            onClick={onDeleteClick}
          >
            Удалить
          </StyledButton>
        </StyledCol>
      </StyledRow>
    </>
  );
};

export default MailingItem;