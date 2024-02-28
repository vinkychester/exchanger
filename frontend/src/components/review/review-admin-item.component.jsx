import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import Checkbox from "rc-checkbox";

import Can from "../can/can.component";
import ForbiddenPage from "../../pages/forbidden/forbidden.component";
import ModalWindow from "../modal/modal-window";

import { StyledButton } from "../styles/styled-button";
import { StyledCol, StyledRow } from "../styles/styled-table";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { SET_PUBLISHED_REVIEW } from "../../graphql/mutations/review.mutation";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { parseUuidIRI } from "../../utils/response";
import { reviews } from "../../rbac-consts";

const ReviewAdminItem = ({ review, deleteReviewAction }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [visible, setVisible] = useState(false);
  const [updateReviewPublish] = useMutation(SET_PUBLISHED_REVIEW);

  const handleReviewPublish = (event) => {
    updateReviewPublish({
      variables: { id: review.id, publish: event.target.checked },
    });
  };

  const deleteDialog = (review) => {
    return (
      <>
        <div className="default-modal__body-content">
          Вы действительно хотите удалить отзыв пользователя{" "}
          {review.client.firstname} {review.client.lastname}?
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
              deleteReviewAction(review.id);
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

  return (
    <Can
      role={userRole}
      perform={reviews.EDIT}
      yes={() => (
        <>
          {visible && (
            <ModalWindow
              visible={visible}
              setVisible={setVisible}
              title="Внимание!"
              content={deleteDialog(review)}
            />
          )}
          <StyledRow
            col="5"
            key={review.id}
            className="admin-reviews-table__row"
          >
            <StyledCol
              data-title="Публикация"
              className="admin-reviews-table__publish"
            >
              <Checkbox
                className="default-checkbox"
                defaultChecked={review.publish}
                onChange={handleReviewPublish}
              />
            </StyledCol>
            <StyledCol data-title="Дата" className="admin-reviews-table__date">
              {TimestampToDate(review.createdAt)}
            </StyledCol>
            <StyledCol
              data-title="Пользователь"
              className="admin-reviews-table__name"
            >
              {review.client.firstname} {review.client.lastname}
            </StyledCol>
            <StyledCol
              data-title="Текст"
              className="admin-reviews-table__message"
            >
              {review.message}
            </StyledCol>
            <StyledCol
              data-title="Действие"
              className="admin-reviews-table__action"
            >
              <StyledButton
                to={`/panel/review/edit/${parseUuidIRI(review.id)}`}
                as={NavLink}
                color="info"
                weight="normal"
              >
                Редактировать
              </StyledButton>
              <StyledButton
                color="danger"
                weight="normal"
                type="button"
                onClick={onDeleteClick}
              >
                Удалить
              </StyledButton>
            </StyledCol>
          </StyledRow>
        </>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default ReviewAdminItem;
