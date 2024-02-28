import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import FeedbackAnswerForm from "./feedback-answer-form.component";
import FeedbackMessagesItem from "./feedback-messages-item.component";
import { feedbackStatusConst } from "../../../utils/feedback-status";
import { Helmet } from "react-helmet-async";
import BreadcrumbItem from "../../breadcrumb/breadcrumb-item";
import Title from "../../title/title.component";
import PageSpinner from "../../spinner/page-spinner.component";
import AlertMessage from "../../alert/alert.component";

import { GET_FEEDBACK_MESSAGE_BY_ID } from "../../../graphql/queries/feedback.query";
import { UPDATE_DELETE_FEEDBACK_MESSAGE_BY_ID, UPDATE_MESSAGE } from "../../../graphql/mutations/feedback.mutation";

import { StyledContainer } from "../../styles/styled-container";
import { StyledFeedbackDetailsWrapper } from "../styled.feedback";
import { StyledBreadcrumb } from "../../styles/styled-breadcrumb";
import { StyledButton } from "../../styles/styled-button";
import Confirmation from "../../confirmation/confirmation";

const FeedbackDetailContainer = ({ id }) => {

  const [confirm, setConfirm] = useState("");
  const { data, loading, error } = useQuery(GET_FEEDBACK_MESSAGE_BY_ID, {
    variables: { id: "/api/feedback_messages/" + id }
  });

  const [closeTicket] = useMutation(UPDATE_MESSAGE);
  const [restoreTicket] = useMutation(UPDATE_DELETE_FEEDBACK_MESSAGE_BY_ID);

  const closeTicketHandle = () => {
    closeTicket({
      variables: { id: "/api/feedback_messages/" + id, status: feedbackStatusConst.WELL_DONE },
      refetchQueries: [{
        query: GET_FEEDBACK_MESSAGE_BY_ID,
        variables: { id: "/api/feedback_messages/" + id }
      }]
    });
  };

  const restoreTicketHandle = () => {
    restoreTicket({
      variables: { id: "/api/feedback_messages/" + id, status: feedbackStatusConst.VIEWED, deleted: false },
      refetchQueries: [{
        query: GET_FEEDBACK_MESSAGE_BY_ID,
        variables: { id: "/api/feedback_messages/" + id }
      }]
    });
  };

  if (loading) return <PageSpinner />;
  if (error) return <AlertMessage type="error" message={error.graphQLErrors[0].message} />;
  if (!data) return <AlertMessage type="info" message="Тикет не найден." />;
  const { feedbackMessage } = data;
  const { feedbackDetail } = data.feedbackMessage;

  return (
    <StyledContainer size="xl">
      <Helmet>
        <title>Сообщение от {feedbackMessage.lastname} {feedbackMessage.firstname}- Coin24</title>
      </Helmet>
      <StyledFeedbackDetailsWrapper>
        {confirm && <Confirmation
          question={`Вы действительно хотите ${confirm === "closeTicket" ? "закрыть тикет?" : "востановить тикет?"}`}
          handler={confirm === "closeTicket" ? closeTicketHandle : restoreTicketHandle}
          setVisible={setConfirm}
          visible={confirm}
        />}
        <Title
          as="h1"
          title={`История сообщений с ${feedbackMessage.email}`}
          className="feedback-details__title"
        />
        <div className="feedback-details__head">
          <StyledBreadcrumb>
            <BreadcrumbItem
              as={NavLink}
              to="/"
              title="Главная"
            />
            <BreadcrumbItem
              as={NavLink}
              to="/panel/feedbacks"
              title="Список сообщений"
            />
            <BreadcrumbItem
              as="span"
              title={`Сообщение от ${feedbackMessage.firstname} ${feedbackMessage.lastname}`}
            />
          </StyledBreadcrumb>
          <div className="feedback-details__action">
            {feedbackMessage.status === feedbackStatusConst.VIEWED ?
              <StyledButton
                color="success"
                weight="normal"
                onClick={() => setConfirm("closeTicket")}
              >
                Отметить как обработанный
              </StyledButton> : feedbackMessage.status === feedbackStatusConst.DELETED ?
                <StyledButton
                  color="success"
                  weight="normal"
                  onClick={() => setConfirm("restoreTicket")}
                >
                  Восстановить
                </StyledButton>
                : null}
          </div>
        </div>
        <div className="feedback-details__body">
          <FeedbackMessagesItem feedbackMessage={feedbackMessage} feedbackDetail={feedbackDetail} />
          {feedbackMessage.status === feedbackStatusConst.WELL_DONE ?
            <AlertMessage
              type="success"
              message="Обработана"
            /> :
            <FeedbackAnswerForm feedbackMessageId={feedbackMessage.id} />}
        </div>
      </StyledFeedbackDetailsWrapper>
    </StyledContainer>
  );
};

export default FeedbackDetailContainer;
