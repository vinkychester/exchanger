import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_MAILING } from "../../graphql/mutations/mailing.query";
import { parseApiErrors } from "../../utils/response";
import { StyledFormWrapper } from "../styles/styled-form";
import DelayInputComponent from "../input-group/delay-input-group";
import { StyledButton } from "../styles/styled-button";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";
import { GET_ALL_MAILING_MESSAGE } from "../../graphql/queries/mailing.query";
import { MailingFilterContext } from "../../pages/mailing/mailing.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import UploadFile from "./upload-file.component";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import CKEditor from "react-ckeditor-component";

const INITIAL_STATE = {
  title: "",
  message: "",
  file: []
};

const MailingForm = ({ hide, setHide}) => {

  const [loadForm, setLoadForm] = useState(false);
  const [errors, setErrors] = useState([]);
  const [submitButton, setSubmitButton] = useState();

  const [mailingMessage, setMailingMessage] = useState(INITIAL_STATE);
  const { filter } = useContext(MailingFilterContext);
  const [createMailing, { loading }] = useMutation(CREATE_MAILING, {
    onCompleted: () => {
      setMailingMessage(INITIAL_STATE);
      setErrors([]);
      setHide(true);
      closableNotificationWithClick(
        "Рассылка успешно создана",
        "success"
      );
    },
    onError: ({graphQLErrors}) => {
      setErrors(parseApiErrors(graphQLErrors));
    },
    refetchQueries: () => [{
      query: GET_ALL_MAILING_MESSAGE,
      variables: filter
    }]
  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    setMailingMessage((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleCKEditorChangeInput = (event) => {
    const description = event.editor.getData();
    setMailingMessage((prevState) => ({
      ...prevState,
      message: description
    }));
  };
  const handleChangeFiles = (imageList) => {
    setMailingMessage((prevState) => ({
      ...prevState,
      file: imageList
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoadForm(true);
    createMailing({
      variables: mailingMessage
    })
  };

  const {title, message, file} = mailingMessage;

  return (
    <StyledLoadingWrapper className="loading-mailing-form">
      {loading && <FragmentSpinner position="center" />}
      <StyledFormWrapper
        className={`mailing-form ${loading && "loading"}`}
        onSubmit={handleSubmit}
        hide={hide}
      >
        <DelayInputComponent
          type="text"
          name="title"
          label="Заголовок"
          handleChange={handleChange}
          value={title}
          debounceTimeout={600}
          autoComplete="off"
          required
          errorMessage={errors.title}
        />
        <UploadFile file={file} handleChangeFiles={handleChangeFiles} />
        <div className="ckeditor-wrapper">
          <div className="ckeditor-wrapper__label">Описание:</div>
          <CKEditor
            content={message}
            events={{
              "change": handleCKEditorChangeInput
            }}
          />
        </div>
        {errors.message && (
          <small className="text-danger">{errors.message}</small>
        )}
        <div className="mailing-form__action">
          <StyledButton
            type="submit"
            disabled={submitButton}
            color="success"
            weight="normal"
            className="mailing-form__submit"
          >
            Создать рассылку
          </StyledButton>
        </div>
      </StyledFormWrapper>
    </StyledLoadingWrapper>
  );

};

export default MailingForm;