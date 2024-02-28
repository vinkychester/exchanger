import React, { useState } from "react";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import ReactFancyBox from "react-fancybox";
import CKEditor from "react-ckeditor-component";
import ReactHtmlParser from "react-html-parser";

import "react-fancybox/lib/fancybox.css";

import Can from "../../components/can/can.component";
import FragmentSpinner from "../../components/spinner/fragment-spinner.component";
import PageSpinner from "../../components/spinner/page-spinner.component";
import Title from "../../components/title/title.component";
import BreadcrumbItem from "../../components/breadcrumb/breadcrumb-item";
import AlertMessage from "../../components/alert/alert.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import DelayInputComponent from "../../components/input-group/delay-input-group";
import UploadFile from "../../components/mailing/upload-file.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledMailingDetailsWrapper } from "../../components/mailing/styled-mailing";
import { StyledLoadingWrapper } from "../../components/spinner/styled-spinner";
import { StyledBreadcrumb } from "../../components/styles/styled-breadcrumb";
import { StyledButton } from "../../components/styles/styled-button";
import { StyledFormWrapper } from "../../components/styles/styled-form";

import {
  UPDATE_MAILING_DATA,
  UPDATE_MAILING_STATUS,
} from "../../graphql/mutations/mailing.query";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_MAILING_DETAILS } from "../../graphql/queries/mailing.query";
import { closableNotificationWithClick } from "../../components/notification/closable-notification-with-click.component";
import { mailing } from "../../rbac-consts";

const UPDATE_DATA = { title: "", message: "", file: [] };

const MailingDetailsPage = ({ match }) => {
  const client = useApolloClient();
  const { id } = match.params;

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [reloadForm, setReloadForm] = useState(false);
  const [errors, setErrors] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updateData, setUpdateData] = useState(UPDATE_DATA);

  const { loading, error, data } = useQuery(GET_MAILING_DETAILS, {
    variables: { id: `/api/mailings/${id}` },
    fetchPolicy: "network-only",
    onCompleted: (data1) => {
      setUpdateData((prevState) => {
        return {
          ...prevState,
          message: data1.mailing.message,
        };
      });
    },
  });
  const [sendMailing] = useMutation(UPDATE_MAILING_STATUS, {
    refetchQueries: [
      {
        query: GET_MAILING_DETAILS,
        variables: { id: `/api/mailings/${id}` },
      },
    ],
  });

  const [updateMailing, { loading: mutationLoading }] = useMutation(
    UPDATE_MAILING_DATA,
    {
      onCompleted: () => {
        setEditMode(false);
        setReloadForm(false);
        setErrors([]);
        closableNotificationWithClick(
          " Данные рассылки успешно обновлены",
          "success"
        );
      },
      refetchQueries: () => [
        {
          query: GET_MAILING_DETAILS,
          variables: { id: `/api/mailings/${id}` },
        },
      ],
    }
  );
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdateData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleCKEditorChangeInput = (event) => {
    const message = event.editor.getData();
    setUpdateData((prevState) => ({ ...prevState, message }));
  };
  const handleChangeFiles = (imageList) => {
    setUpdateData((prevState) => ({
      ...prevState,
      file: imageList,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // setReloadForm(true);

    if (!editMode) {
      setEditMode(true);
      return false;
    }
    if (editMode && !reloadForm) {
      setReloadForm(true);
    }
    if (JSON.stringify(UPDATE_DATA) === JSON.stringify(updateData)) {
      closableNotificationWithClick(" Данные рассылки не изменялись", "info");
      setReloadForm(false);
      return false;
    }
    updateMailing({
      variables: {
        id: `/api/mailings/${id}`,
        title: updateData.title ? updateData.title : title,
        message: updateData.message ? updateData.message : message,
        file: updateData.file ? updateData.file : file,
      },
    });
  };

  const handleMailing = () => {
    sendMailing({ variables: { id: `/api/mailings/${id}`, status: !status } });
    closableNotificationWithClick(" Рассылка успешно отправлена", "success");
  };

  if (loading) return <PageSpinner />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { title, message, base64, status } = data.mailing;
  const { file } = updateData;

  return (
    <Can
      role={userRole}
      perform={mailing.DETAILS}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Редактирование письма - Coin24</title>
          </Helmet>
          <StyledMailingDetailsWrapper className="edit-mailing">
            <Title
              as="h1"
              title="Редактирование письма"
              className="edit-mailing__title"
            />
            <div className="edit-mailing__head">
              <StyledBreadcrumb>
                <BreadcrumbItem as={NavLink} to="/" title="Главная" />
                <BreadcrumbItem
                  as={NavLink}
                  to="/panel/mailing"
                  title="Список рассылок"
                />
                <BreadcrumbItem as="span" title={title} />
              </StyledBreadcrumb>
              {!status && (
                <StyledButton
                  type="button"
                  color="success"
                  weight="normal"
                  className="edit-mailing__send-out-btn"
                  onClick={handleMailing}
                  disabled={mutationLoading}
                >
                  Разослать
                </StyledButton>
              )}
            </div>

            <StyledLoadingWrapper className="loading-edit-mailing-form">
              {reloadForm && <FragmentSpinner position="center" />}
              <StyledFormWrapper
                onSubmit={handleSubmit}
                className={`edit-mailing-form ${reloadForm && "loading"}`}
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
                  readonly={!editMode}
                  errorMessage={errors.title}
                />
                {editMode && (
                  <UploadFile
                    file={file}
                    handleChangeFiles={handleChangeFiles}
                  />
                )}
                {editMode ? (
                  <div>
                    <div className="ckeditor-wrapper">
                      <div className="ckeditor-wrapper__label">Описание:</div>
                      <CKEditor
                        content={updateData.message}
                        events={{
                          change: handleCKEditorChangeInput,
                        }}
                      />
                    </div>
                    {errors.message && (
                      <small className="text-danger">{errors.message}</small>
                    )}
                  </div>
                ) : (
                  <p>{ReactHtmlParser(updateData.message)}</p>
                )}

                <div className="contact-form__action">
                  <StyledButton
                    weight="normal"
                    type="submit"
                    color="info"
                    className="contact-form__submit"
                  >
                    {editMode ? "Обновить" : "Редактировать"}
                  </StyledButton>
                </div>
              </StyledFormWrapper>
            </StyledLoadingWrapper>

            <div className="images">
              {base64 && !editMode && (
                <div className="image">
                  <ReactFancyBox thumbnail={base64} image={base64} />
                </div>
              )}
            </div>
          </StyledMailingDetailsWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(MailingDetailsPage);
