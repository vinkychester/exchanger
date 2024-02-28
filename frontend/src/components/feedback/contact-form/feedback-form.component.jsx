import React, { createRef, useEffect, useState } from "react";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import Tooltip from "rc-tooltip";
import ReCAPTCHA from "react-google-recaptcha";

import FragmentSpinner from "../../spinner/fragment-spinner.component";
import TextAreaGroupComponent from "../../input-group/textarea-group.component";
import DelayInputComponent from "../../input-group/delay-input-group";

import { StyledButton } from "../../styles/styled-button";
import {
  StyledFormText,
  StyledFormTitle,
  StyledFormWrapper,
} from "../../styles/styled-form";
import { StyledLoadingWrapper } from "../../spinner/styled-spinner";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import { GET_USER_BY_ID } from "../../../graphql/queries/user.query";
import { CREATE_FEEDBACK_MESSAGE } from "../../../graphql/mutations/feedback.mutation";
import { parseApiErrors } from "../../../utils/response";
import { feedbackTypeCons } from "../../../utils/feedback-status";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

const FeedbackForm = ({ checkedType, setCheckedType, checkedCity }) => {
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [submitButton, setSubmitButton] = useState(true);

  const INITIAL_STATE = { firstname: "", lastname: "", email: "", message: "" };
  const [feedbackMessage, setFeedbackMessage] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState([]);
  const recaptchaRef = createRef();
  const [captchaToken, setCaptchaToken] = useState();

  const { data } = useQuery(GET_USER_BY_ID, {
    variables: { userId: `/api/clients/${userId}` },
    fetchPolicy: "network-only",
    onCompleted: () => {
      setFeedbackMessage((prevState) => ({
        ...prevState,
        firstname: data.client ? data.client.firstname : "",
        lastname: data.client ? data.client.lastname : "",
        email: data.client ? data.client.email : "",
      }));
    },
  });

  const [createFeedbackMessage, { loading }] = useMutation(
    CREATE_FEEDBACK_MESSAGE,
    {
      onCompleted: () => {
        setFeedbackMessage((prevState) => ({
          ...prevState,
          message: "",
        }));
        setErrors([]);
        setCheckedType("Выберите направление:");
        closableNotificationWithClick(
          "Ваше обращение принято в обработку",
          "success"
        );
      },
      onError: ({ graphQLErrors }) => {
        setErrors(parseApiErrors(graphQLErrors));
        if (errors.internal) {
          closableNotificationWithClick(errors.internal, "error");
        }
      },
    }
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeedbackMessage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createFeedbackMessage({
      variables: {
        checkedCity: checkedCity ? checkedCity.split('_')[0] : checkedCity,
        checkedType,
        firstName: feedbackMessage.firstname,
        lastName: feedbackMessage.lastname,
        email: feedbackMessage.email,
        message: feedbackMessage.message,
        captchaToken: captchaToken,
      },
    });
  };

  useEffect(() => {
    setSubmitButton(true);
    recaptchaRef.current.execute();
    if (checkedType === feedbackTypeCons.CASH && checkedCity !== undefined) {
      setSubmitButton(false);
    }
    if (checkedType === feedbackTypeCons.BANK) {
      setSubmitButton(false);
    }
  }, [checkedType, checkedCity, recaptchaRef]);

  return (
    <StyledLoadingWrapper className="loading-contact-form">
      {loading && <FragmentSpinner position="center" />}
      <StyledFormWrapper
        className={`contact-form ${loading && "loading"}`}
        onSubmit={handleSubmit}
      >
        <StyledFormTitle as="h3">Форма обратной связи</StyledFormTitle>
        <StyledFormText as="p">Отправьте нам сообщение</StyledFormText>

        <DelayInputComponent
          type="text"
          name="firstname"
          label="Имя"
          handleChange={handleChange}
          value={feedbackMessage.firstname}
          debounceTimeout={600}
          autoComplete="off"
          required
          errorMessage={errors.firstname}
        />
        <DelayInputComponent
          type="text"
          name="lastname"
          label="Фамилия"
          handleChange={handleChange}
          value={feedbackMessage.lastname}
          debounceTimeout={600}
          autoComplete="off"
          required
          errorMessage={errors.lastname}
        />
        <DelayInputComponent
          type="email"
          name="email"
          label="E-mail"
          handleChange={handleChange}
          value={feedbackMessage.email}
          debounceTimeout={600}
          autoComplete="off"
          required
          errorMessage={errors.email}
        />
        <TextAreaGroupComponent
          name="message"
          label="Ваше сообщение"
          handleChange={handleChange}
          required="required"
          value={feedbackMessage.message}
          maxLength="3600"
          errors={errors.message}
        />
        <StyledFormText as="p" className="contact-form__useterms">
          Нажимая кнопку "Отправить", Вы даете согласие на обработку своих
          персональных данных принимаете{" "}
          <NavLink className="default-link" to="/useterms" target="_blank" rel="noreferrer">
            пользовательское соглашение
          </NavLink>
          .
        </StyledFormText>
        <div className="contact-form__action">
          <Tooltip placement="top" overlay="Сначала выберите направление">
            <div
              className={`contact-form__tooltip ${
                !submitButton && "contact-form_tooltip-off"
              }`}
            />
          </Tooltip>
          <StyledButton
            type="submit"
            disabled={submitButton}
            color="main"
            className="contact-form__submit"
          >
            Отправить
          </StyledButton>
        </div>
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_PUBLIC}
          size="invisible"
          ref={recaptchaRef}
          onChange={(value) => {
            setCaptchaToken(value);
          }}
        />
      </StyledFormWrapper>
    </StyledLoadingWrapper>
  );
};

export default FeedbackForm;
