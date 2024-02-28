import React, { useState } from "react";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { StyledButton } from "../styles/styled-button";
import ModalWindow from "../modal/modal-window";
import { useHistory } from "react-router-dom";
import { parseUuidIRI } from "../../utils/response";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_MESSAGE } from "../../graphql/mutations/feedback.mutation";
import { feedbackStatus, feedbackStatusConst, feedbackType } from "../../utils/feedback-status";
import { StyledCol, StyledRow } from "../styles/styled-table";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const FeedbackItem = ({ feedback, deleteFeedbackMessageAction }) => {

  let history = useHistory();
  const [visible, setVisible] = useState(false);
  const [updateSeen] = useMutation(UPDATE_MESSAGE, {
    onCompleted: () => {
      window.location.href = `/panel/feedback/details/${parseUuidIRI(feedback.id)}`;
    }
  });

  const deleteDialog = (feedback) => {
    return (
      <>
        <div className="default-modal__body-content">
          Вы действительно хотите удалить сообщение от {feedback.firstname} {feedback.lastname} ?
        </div>
        <div className="default-modal__body-footer">
          <StyledButton
            color="danger"
            weight="normal"
            onClick={() => {setVisible(false);}}
          >
            Нет
          </StyledButton>
          <StyledButton
            color="success"
            weight="normal"
            onClick={() => {
              deleteFeedbackMessageAction(feedback);
              setVisible(false);
            }}
          >
            Да
          </StyledButton>
        </div>
      </>
    );
  };

  const onDeleteClick = async () => {
    setVisible(true);
  };

  const DetailClick = (e) => {
    if (feedback.status === feedbackStatusConst.NOT_VIEWED) {
      updateSeen({ variables: { id: feedback.id, status: feedbackStatusConst.VIEWED } });
    }
    if (e.target.tagName === "DIV" || e.target.dataset.action === "details") {
      history.push(`/panel/feedback/details/${parseUuidIRI(feedback.id)}`);
    }

  };

  return (
    <>
      {visible && <ModalWindow
        visible={visible}
        setVisible={setVisible}
        title="Внимание!"
        content={deleteDialog(feedback)}
      />}
      <StyledRow col="6" className={`feedback-table__row ${feedback.status}`} onClick={DetailClick} title="Октырть детали сообщения">
        <StyledCol
          data-title="Пользователь"
          className="feedback-table__user user"
        >
          <div className="user__name">
            {feedback.firstname} {feedback.lastname}
            <CopyToClipboard
              text={`${feedback.firstname} ${feedback.lastname}`}
              onCopy={() => {
                closableNotificationWithClick("Скопировано", "success");
              }}
            >
              <span className="icon-copy" title="Скопировать имя и фамилию" />
            </CopyToClipboard>
          </div>
          <div className="user__email">
            {feedback.email}
            <CopyToClipboard
              text={feedback.email}
              onCopy={() => {
                closableNotificationWithClick("Скопировано", "success");
              }}
            >
              <span className="icon-copy" title="Скопировать e-mail" />
            </CopyToClipboard>
          </div>
        </StyledCol>
        <StyledCol
          data-title="Дата"
          className="feedback-table__date"
        >
          {TimestampToDate(feedback.createdAt)}
        </StyledCol>
        <StyledCol
          data-title="Сатус"
          className="feedback-table__status"
        >
          {feedbackStatus(feedback.status)}
        </StyledCol>
        <StyledCol
          data-title="Тип"
          className="feedback-table__type"
        >
          {feedbackType(feedback.type)}
        </StyledCol>
        <StyledCol
          data-title="Город"
          className="feedback-table__city"
        >
          {feedback.city ? feedback.city.name : "-"}
        </StyledCol>
        <StyledCol
          data-title="Действие"
          className="feedback-table__action"
        >
          <StyledButton
            color="info"
            weight="normal"
            onClick={DetailClick}
            data-action="details"
          >
            Детали
          </StyledButton>
          <StyledButton
            color="danger"
            weight="normal"
            type="button"
            onClick={onDeleteClick}
            title="Удалить сообщение"
          >
            {feedback.status === feedbackStatusConst.DELETED ? "Удалить полностью" : "Удалить"}
          </StyledButton>
        </StyledCol>
      </StyledRow>
    </>
  );
};

export default FeedbackItem;
