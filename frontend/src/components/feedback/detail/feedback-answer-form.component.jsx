import React, { useState } from "react";
import TextAreaGroupComponent from "../../input-group/textarea-group.component";
import { useMutation } from "@apollo/react-hooks";
import { author } from "../../../utils/feedback-status";
import Spinner from "../../spinner/spinner.component";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import { CREATE_FEEDBACK_DETAIL } from "../../../graphql/mutations/feedback.mutation";
import { GET_FEEDBACK_MESSAGE_BY_ID } from "../../../graphql/queries/feedback.query";

import { StyledButton } from "../../styles/styled-button";
import { StyledFormTitle, StyledFormWrapper } from "../../styles/styled-form";

const FeedbackAnswerForm = ({ feedbackMessageId }) => {

  const [message, setMessage] = useState();
  const [error, setError] = useState('');

  const [createFeedbackDetail, { loading }] = useMutation(CREATE_FEEDBACK_DETAIL, {
    onCompleted: () => {
      setMessage("");
      setError('');
      closableNotificationWithClick(
        "Ответ отправлен",
        "success"
      );
    }
  });

  const handleChange = event => {
    const { value } = event.target;
    setMessage(value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (message.length < 3) {
      setError('Сообщение должно быть как минимум 3 символа');
      return false;
    }
    createFeedbackDetail({
      variables: { feedbackMessageId: feedbackMessageId, message, author: author.MANAGER },
      refetchQueries: [{ query: GET_FEEDBACK_MESSAGE_BY_ID, variables: { id: feedbackMessageId } }]
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;

  return (
    <StyledFormWrapper onSubmit={handleSubmit}>
      <StyledFormTitle as='h3'>
        Написать ответ
      </StyledFormTitle>
      <TextAreaGroupComponent
        name="message"
        label="Ваше сообщение"
        placeholder="Текст сообщения"
        handleChange={handleChange}
        required="required"
        value={message}
        maxLength="3600"
        errors={error}
      />
      <StyledButton type="submit" color="main">
        Ответить
      </StyledButton>
    </StyledFormWrapper>
  );

};

export default FeedbackAnswerForm;