import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import Checkbox from "rc-checkbox";

import ModalWindow from "../modal/modal-window";
import Confirmation from "../confirmation/confirmation";
import ReactHtmlParser from "react-html-parser";

import { StyledButton } from "../styles/styled-button";
import { StyledCol, StyledRow } from "../styles/styled-table";

import { GET_POSTS_ADMIN_PANEL } from "../../graphql/queries/posts.query";
import { UPDATE_PUBLISH_POST } from "../../graphql/mutations/post.mutation";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { parseIRI } from "../../utils/response";

const NewsAdminItem = ({ post, deletePostAction }) => {
  const [publishConfirmation, setPublishConfirmation] = useState(false);

  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState();
  const [setPublish] = useMutation(UPDATE_PUBLISH_POST, {
    refetchQueries: [{ query: GET_POSTS_ADMIN_PANEL }],
  });

  const handleChange = ({ id, publish }) => {
    setPublish({ variables: { postId: id, publish: !publish } });
  };

  const deleteDialog = () => {
    const { title, id } = action;
    return (
      <>
        <div className="default-modal__body-content">
          Вы действительно хотите удалить новость - <b>{title}</b>?
        </div>
        <div className="default-modal__body-footer">
          <StyledButton
            color="danger"
            weight="normal"
            onClick={() => {
              setVisible(false);
            }}
          >
            Нет
          </StyledButton>
          <StyledButton
            color="success"
            weight="normal"
            onClick={() => {
              deletePostAction(id);
              setVisible(false);
            }}
          >
            Да
          </StyledButton>
        </div>
      </>
    );
  };

  const onDeleteClick = async (post) => {
    setVisible(true);
    setAction(post);
  };

  const { id, publish, title, description, createdAt, lang } = post;
  
  return (
    <React.Fragment key={id}>
      {visible && (
        <ModalWindow
          visible={visible}
          setVisible={setVisible}
          title="Внимание!"
          content={deleteDialog()}
        />
      )}
      {publishConfirmation && (
        <Confirmation
          question={
            <React.Fragment>
              Вы действительно хотите изменить публикацию новости - <b>{title}</b>?
            </React.Fragment>}
          handler={() => handleChange(post)}
          setVisible={setPublishConfirmation}
          visible={publishConfirmation}
        />
      )}
      <StyledRow col="6" className="admin-news-table__row">
        <StyledCol
          data-title="Публикация"
          className="admin-news-table__publish"
        >
          <Checkbox
            className="default-checkbox"
            onChange={() => setPublishConfirmation(true)}
            value={id}
            checked={publish}
          />
        </StyledCol>
        <StyledCol data-title="Заголовок" className="admin-news-table__title">
          {title}
        </StyledCol>
        <StyledCol data-title="Описание" className="admin-news-table__desc">
          {ReactHtmlParser(description)}
        </StyledCol>
        <StyledCol data-title="Дата" className="admin-news-table__date">
          {TimestampToDate(createdAt)}
        </StyledCol>
        <StyledCol data-title="Язык" className="admin-news-table__lang">
          {lang}
        </StyledCol>
        <StyledCol data-title="Действие" className="admin-news-table__action">
          <StyledButton
            color="info"
            weight="normal"
            as={NavLink}
            to={`/panel/news/edit/${parseIRI(id)}`}
          >
            Редактировать
          </StyledButton>
          <StyledButton
            color="danger"
            weight="normal"
            onClick={() => onDeleteClick(post)}
          >
            Удалить
          </StyledButton>
        </StyledCol>
      </StyledRow>
    </React.Fragment>
  );
};

export default NewsAdminItem;
