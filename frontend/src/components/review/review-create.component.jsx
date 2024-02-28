import React, { useContext, useState } from "react";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";

import FragmentSpinner from "../spinner/fragment-spinner.component";
import AlertMessage from "../alert/alert.component";
import TextAreaGroupComponent from "../input-group/textarea-group.component";
import LoadButton from "../spinner/button-spinner.component";

import {
  StyledFormTitle,
  StyledFormWrapper,
  StyledHiddenForm,
  StyledHiddenFormAction,
} from "../styles/styled-form";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";
import { StyledButton } from "../styles/styled-button";
import { StyledAlertWrapper } from "../alert/styled-alert";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { CREATE_REVIEW } from "../../graphql/mutations/review.mutation";
import { GET_PUBLISHED_REVIEWS } from "../../graphql/queries/review.query";
import { GET_CLIENT_REQUISITION_TOTAL_COUNT_BY_ID } from "../../graphql/queries/clients.query";
import { PaginationContext } from "../../pages/review/reviews.component";
import { parseApiErrors } from "../../utils/response";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const ReviewCreate = () => {
  const paginationContext = useContext(PaginationContext);
  const clientApollo = useApolloClient();

  const { userId, userRole } = clientApollo.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [errors, setErrors] = useState([]);
  const [hide, setHide] = useState(true);

  const [{ message, client }, setMessage] = useState({
    message: "",
    client: `/api/clients/${userId}`,
  });

  const [createReview, { loading: mutationLoading }] = useMutation(
    CREATE_REVIEW,
    {
      refetchQueries: [
        {
          query: GET_PUBLISHED_REVIEWS,
          variables: {
            publish: true,
            page: paginationContext.currentPage,
            itemsPage: paginationContext.itemsPerPage,
          },
        },
      ],
      onCompleted: () => {
        setMessage((prevState) => ({
          ...prevState,
          message: "",
        }));
        setErrors([]);
        closableNotificationWithClick(
          "После прохождения модерации, Ваш отзыв будет опубликован на этой странице. Благодарим за Ваше мнение.",
          "success"
        );
      },
      onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors)),
    }
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    localStorage.setItem(userId, value);
    setMessage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.removeItem(userId);
    createReview({ variables: { message, client } });
  };

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery(GET_CLIENT_REQUISITION_TOTAL_COUNT_BY_ID, {
    skip: !userId,
    variables: { id: `/api/clients/${userId}` },
    fetchPolicy: "network-only",
  });

  if (queryLoading) return <LoadButton color="main" text="Добавить отзыв" />;

  if (error) return <AlertMessage type="error" message={error.message} />;

  if (userRole !== "client") {
    return (
      <StyledAlertWrapper margin="0 0 30px" type="info">
        <span>
          Для того чтобы оставить свой отзыв,{" "}
          <NavLink to="/login" className="default-link">
            войдите
          </NavLink>{" "}
          или{" "}
          <NavLink to="/registration" className="default-link">
            зарегистрируйтесь
          </NavLink>
          .
        </span>
      </StyledAlertWrapper>
    );
  }

  if (data.client.requisitions.paginationInfo.totalCount === 0) {
    return (
      <AlertMessage
        type="info"
        message="Для того чтоб оставить свой отзыв, нужно сделать минимум один обмен."
        margin="0 0 30px"
      />
    );
  }

  return (
    <StyledHiddenForm className="hidden-send-reviews-form">
      <StyledHiddenFormAction>
        <StyledButton type="button" color="main" onClick={showForm}>
          Добавить отзыв
        </StyledButton>
      </StyledHiddenFormAction>
      <StyledLoadingWrapper className="loading-send-reviews-form">
        {mutationLoading && <FragmentSpinner position="center" />}
        <StyledFormWrapper
          hide={hide}
          onSubmit={handleSubmit}
          className={`send-reviews-form ${mutationLoading && "loading"}`}
        >
          <StyledFormTitle as="h3" className="send-reviews-form__title">
            Ваши впечатления!
          </StyledFormTitle>
          <TextAreaGroupComponent
            name="message"
            label="Оставьте, пожалуйста, свой отзыв"
            placeholder="Текст отзыва"
            handleChange={handleChange}
            required="required"
            value={
              localStorage.getItem(userId)
                ? localStorage.getItem(userId)
                : message
            }
            maxLength="1200"
            errors={errors.message}
          />
          <div className="send-reviews-form__footer">
            <StyledButton type="submit" disabled={mutationLoading} color="main">
              Отправить
            </StyledButton>
          </div>
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </StyledHiddenForm>
  );
};

export default ReviewCreate;
