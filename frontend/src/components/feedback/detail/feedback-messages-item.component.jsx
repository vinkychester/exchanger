import React, { useEffect, useRef, useState } from "react";
import { TimestampToDate } from "../../../utils/timestampToDate.utils";
import { authorType } from "../../../utils/feedback-status";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { StyledMessageAlign } from "../styled.feedback";
import ReactHtmlParser from "react-html-parser";

const FeedbackMessagesItem = ({ feedbackMessage, feedbackDetail }) => {

  const messagesEndRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
  };

  useEffect(scrollToBottom, [feedbackDetail]);

  return (
    <div className="message-wrapper" id="message-wrapper">
      <StyledMessageAlign>
        <div className="message-item">
          <div className="message-item__head">
            <div className="message-item__author">
              {feedbackMessage.firstname} {feedbackMessage.lastname}
            </div>
            <CopyToClipboard
              text={feedbackMessage.email}
              onCopy={() => {
                setCopied(true);
                closableNotificationWithClick("Скопировано", "success");
              }}
            >
              <div className="message-item__email">
                {feedbackMessage.email}
              </div>
            </CopyToClipboard>
          </div>
          <div className="message-item__content">
            {feedbackMessage.message}
          </div>
          <div className="message-item__date">
            {TimestampToDate(feedbackMessage.createdAt)}
          </div>
        </div>
        <div ref={messagesEndRef} />
      </StyledMessageAlign>
      {feedbackDetail.map(({ ...message }, key) => (
        <StyledMessageAlign key={key} author={message.author}>
          <div className="message-item">
            <div className="message-item__head">
              <div className="message-item__author">
                {authorType(message.author)}
              </div>
            </div>
            <div className="message-item__content">
              {ReactHtmlParser(message.message)}
            </div>
            <div className="message-item__date">
              {TimestampToDate(message.createdAt)}
            </div>
          </div>
        </StyledMessageAlign>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default FeedbackMessagesItem;