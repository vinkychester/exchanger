import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Can from "../can/can.component";
import AlertMessage from "../alert/alert.component";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import Title from "../title/title.component";
import ForbiddenPage from "../../pages/forbidden/forbidden.component";
import PageSpinner from "../spinner/page-spinner.component";
import BreadcrumbItem from "../breadcrumb/breadcrumb-item";
import TextAreaGroupComponent from "../input-group/textarea-group.component";

import { StyledFormWrapper } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";
import { StyledAdminEditReview } from "./styled-admin-reviews";
import { StyledContainer } from "../styles/styled-container";
import { StyledBreadcrumb } from "../styles/styled-breadcrumb";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_REVIEW_BY_ID } from "../../graphql/queries/review.query";
import { UPDATE_REVIEW_MESSAGE_BY_ID } from "../../graphql/mutations/review.mutation";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { reviews } from "../../rbac-consts";
import { parseApiErrors } from "../../utils/response";

const ReviewEditPanel = ({ match }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });
  const { id } = match.params;

  const [errors, setErrors] = useState([]);

  const { data, loading, error } = useQuery(GET_REVIEW_BY_ID, {
    variables: { id: `/api/reviews/${id}` },
    fetchPolicy: "network-only",
  });

  const [{ message, reviewId }, updateMessage] = useState({
    message: "",
    reviewId: `/api/reviews/${id}`,
  });

  const [updateReviewMessage, { loading: mutationLoading }] = useMutation(
    UPDATE_REVIEW_MESSAGE_BY_ID,
    {
      onCompleted: () => {
        setErrors([]);
        closableNotificationWithClick(
          "Отзыв отредактирован успешно",
          "success"
        );
      },
      onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors)),
    }
  );

  const setMessage = (messageText) => {
    updateMessage((prevState) => ({
      ...prevState,
      message: messageText,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMessage(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateReviewMessage({ variables: { id: reviewId, message } });
  };

  useEffect(() => {
    if (!!data) {
      setMessage(data.review.message);
    }
  }, [data]);

  if (loading) return <PageSpinner />;
  if (error) return <AlertMessage type="error" message={error.message} />;

  return (
    <Can
      role={userRole}
      perform={reviews.EDIT}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Редактирование отзыва - Coin24</title>
          </Helmet>
          <StyledAdminEditReview className="edit-review">
            <Title
              as="h1"
              title="Редактирование отзыва"
              className="edit-review__title"
            />
            <div className="edit-review__head">
              <StyledBreadcrumb>
                <BreadcrumbItem as={NavLink} to="/" title="Главная" />
                <BreadcrumbItem
                  as={NavLink}
                  to="/panel/reviews"
                  title="Список отзывов"
                />
                <BreadcrumbItem
                  as="span"
                  title={`Отзыв от ${data.review.client.firstname} ${data.review.client.lastname}`}
                />
              </StyledBreadcrumb>
              <div className="edit-review__date">
                {TimestampToDate(data.review.createdAt)}
              </div>
            </div>
            <StyledLoadingWrapper className="loading-edit-review-form">
              {mutationLoading && <FragmentSpinner position="center" />}
              <StyledFormWrapper
                onSubmit={handleSubmit}
                className={`edit-review-form ${mutationLoading && "loading"}`}
              >
                <TextAreaGroupComponent
                  className="edit-review-form__field"
                  name="message"
                  maxLength="1200"
                  handleChange={handleChange}
                  required="required"
                  defaultValue={data.review.message}
                  errors={errors.message}
                />
                <div className="edit-review-form__footer">
                  <StyledButton
                    type="submit"
                    disabled={mutationLoading}
                    color="success"
                  >
                    Сохранить
                  </StyledButton>
                </div>
              </StyledFormWrapper>
            </StyledLoadingWrapper>
          </StyledAdminEditReview>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default ReviewEditPanel;
