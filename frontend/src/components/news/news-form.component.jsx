import React, { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import { slugify } from "transliteration";

import CKEditor from "react-ckeditor-component";

import BreadcrumbItem from "../breadcrumb/breadcrumb-item";
import NewsImageContainer from "./news-image.component";
import DelayInputComponent from "../input-group/delay-input-group";
import Can from "../can/can.component";
import ForbiddenPage from "../../pages/forbidden/forbidden.component";
import AlertMessage from "../alert/alert.component";
import SelectCrypto from "./select-crypto.component";

import { StyledContainer } from "../styles/styled-container";
import { StyledButton } from "../styles/styled-button";
import { StyledAdminNewsCreatePost } from "./styled-admin-news";
import { StyledBreadcrumb } from "../styles/styled-breadcrumb";

import { posts } from "../../rbac-consts";
import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";

const NewsForm = ({
  postDetails,
  setPostDetails,
  errors,
  handleClick,
  formName,
  buttonName,
}) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [publishDisabled, setPublishDisabled] = useState(true);
  const [message, setMessage] = useState(false);

  // const domain = window.location.href.split("/panel/")[0];

  // const [langForQuery, setLangForQuery] = useState("en-us");
  //
  // const { data, loading, error } = useQuery(GET_POSTS_TITLE, {
  //   variables: { lang: langForQuery },
  // });

  // if (loading) return <PageSpinner />;
  // if (error) return <AlertMessage type="error" message={error} />;
  //
  // const { collection } = data.posts;
  //
  // const handleChangeSelect = (value) => {
  //   setPostDetails((prevState) => ({ ...prevState, link: value }));
  // };
  //
  // const handleChangeSelectLang = (value) => {
  //   setPostDetails((prevState) => ({ ...prevState, lang: value }));
  //   if (langForQuery === "ru-ru") {
  //     setLangForQuery("en-us");
  //   } else {
  //     setLangForQuery("ru-ru");
  //   }
  // };
  //
  const descriptionCKEditor = (evt) => {
    const description = evt.editor.getData();
    setPostDetails((prevState) => ({ ...prevState, description }));
  };

  const contentCKEditor = (evt) => {
    const content = evt.editor.getData();
    setPostDetails((prevState) => ({ ...prevState, content }));
  };

  const changePostDetails = useCallback(
    (name, value) => {
      setPostDetails((prevState) => ({ ...prevState, [name]: value.trim() }));
    },
    [postDetails]
  );

  const handleChangeTitle = (event) => {
    const { value, name } = event.target;
    setPostDetails((prevState) => ({
      ...prevState,
      [name]: value.trim(),
      metaUrl: slugify(value.trim()),
    }));
  };

  // /*const style = {
  //   textTransform: "inherit"
  // };*/
  //

  const handleClickEditUrl = () => {
    setMessage(true);
    setPublishDisabled(false);
  };
  const handleChangeInput = (event) => {
    const { value, name } = event.target;
    changePostDetails(name, value);
  };
  const {
    title,
    description,
    content,
    imageDescription,
    metaDescription,
    metaTitle,
    author,
    metaUrl,
    publish,
    pairUnits,
  } = postDetails;

  return (
    <Can
      role={userRole}
      perform={posts.WRITE}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>{formName} статью - Coin24</title>
          </Helmet>
          <StyledAdminNewsCreatePost className="create-post">
            <div className="create-post__head">
              <StyledBreadcrumb>
                <BreadcrumbItem as={NavLink} to="/" title="Главная" />
                <BreadcrumbItem as={NavLink} to="/panel/news" title="Статьи" />
                <BreadcrumbItem as="span" title={formName + " статью"} />
              </StyledBreadcrumb>
            </div>
            <div className="create-post__body">
              <div className="create-post__content">
                <DelayInputComponent
                  label="Заголовок"
                  name="title"
                  value={title}
                  autoComplete="off"
                  debounceTimeout={600}
                  handleChange={handleChangeTitle}
                  errorMessage={errors.title}
                  required
                />
                <div className="ckeditor-wrapper">
                  <div className="ckeditor-wrapper__label">Описание:</div>
                  <CKEditor
                    content={description}
                    events={{
                      change: descriptionCKEditor,
                    }}
                  />
                  {errors.description && (
                    <small className="text-danger">{errors.description}</small>
                  )}
                </div>
                <div className="ckeditor-wrapper">
                  <div className="ckeditor-wrapper__label">Контент:</div>
                  <CKEditor
                    content={content}
                    events={{
                      change: contentCKEditor,
                    }}
                  />
                  {errors.content && (
                    <small className="text-danger">{errors.content}</small>
                  )}
                </div>
              </div>
              <div className="create-post__options">
                <div className="create-post__action">
                  <StyledButton
                    onClick={handleClick}
                    color="success"
                    weight="normal"
                  >
                    {buttonName}
                  </StyledButton>
                </div>
                {/*<StyledSelect>*/}
                {/*  <StyledSelectLabel>Язык:</StyledSelectLabel>*/}
                {/*  <Select*/}
                {/*    // labelId="labelLang"*/}
                {/*    className="custom-select-img create-post_select"*/}
                {/*    id="selectLang"*/}
                {/*    name="lang"*/}
                {/*    onChange={handleChangeSelectLang}*/}
                {/*    value={lang}*/}
                {/*  >*/}
                {/*    <Option value="ru-ru">*/}
                {/*      <div*/}
                {/*        className="option-select-item create-post_select-item"*/}
                {/*        style={style}*/}
                {/*      >*/}
                {/*        <span*/}
                {/*          role="img"*/}
                {/*          className="exchange-icon"*/}
                {/*        >*/}
                {/*          <img*/}
                {/*            role="img"*/}
                {/*            src={`${domain}/flags/ru.png`}*/}
                {/*            alt=""*/}
                {/*          />*/}
                {/*        </span>*/}
                {/*        Русский*/}
                {/*      </div>*/}
                {/*    </Option>*/}
                {/*    <Option value="en-us">*/}
                {/*      <div*/}
                {/*        className="option-select-item create-post_select-item"*/}
                {/*        style={style}*/}
                {/*      >*/}
                {/*        <span*/}
                {/*          role="img"*/}
                {/*          className="exchange-icon"*/}
                {/*        >*/}
                {/*          <img*/}
                {/*            role="img"*/}
                {/*            src={`${domain}/flags/us.png`}*/}
                {/*            alt=""*/}
                {/*          />*/}
                {/*        </span>*/}
                {/*        English*/}
                {/*      </div>*/}
                {/*    </Option>*/}
                {/*  </Select>*/}
                {/*</StyledSelect>*/}
                {/*<StyledSelect>*/}
                {/*  <StyledSelectLabel>Связь со статьей:</StyledSelectLabel>*/}
                {/*  <Select*/}
                {/*    // labelId="label"*/}
                {/*    className="custom-select-img create-post_select"*/}
                {/*    id="select"*/}
                {/*    name="link"*/}
                {/*    onChange={handleChangeSelect}*/}
                {/*    value={link}*/}
                {/*  >*/}
                {/*    <Option value={null}>*/}
                {/*      <div*/}
                {/*        className="option-select-item create-post_select-item"*/}
                {/*        style={style}*/}
                {/*      >*/}
                {/*        Не связывать*/}
                {/*      </div>*/}
                {/*    </Option>*/}
                {/*    {collection.map((option) => (*/}
                {/*      <Option*/}
                {/*        key={option.id}*/}
                {/*        value={option.id}*/}
                {/*      >*/}
                {/*        <div*/}
                {/*          className="option-select-item create-post_select-item"*/}
                {/*          style={style}*/}
                {/*        >*/}
                {/*          {option.title}*/}
                {/*        </div>*/}
                {/*      </Option>*/}
                {/*    ))}*/}
                {/*  </Select>*/}
                {/*</StyledSelect>*/}
                <NewsImageContainer
                  postDetails={postDetails}
                  setPostDetails={setPostDetails}
                />
                <DelayInputComponent
                  label="Alt-тег изображения"
                  name="imageDescription"
                  value={imageDescription}
                  autoComplete="off"
                  debounceTimeout={600}
                  handleChange={handleChangeInput}
                  errorMessage={errors.imageDescription}
                />
                <SelectCrypto
                  pairUnits={pairUnits}
                  setPostDetails={setPostDetails}
                />
                <DelayInputComponent
                  label="Meta-Заголовок"
                  name="metaTitle"
                  value={metaTitle}
                  autoComplete="off"
                  debounceTimeout={600}
                  handleChange={handleChangeInput}
                  errorMessage={errors.metaTitle}
                />
                <DelayInputComponent
                  label="Meta-Описание"
                  name="metaDescription"
                  value={metaDescription}
                  autoComplete="off"
                  debounceTimeout={600}
                  handleChange={handleChangeInput}
                  errorMessage={errors.metaDescription}
                />
                <DelayInputComponent
                  label="Автор"
                  name="author"
                  value={author}
                  autoComplete="off"
                  debounceTimeout={600}
                  handleChange={handleChangeInput}
                  errorMessage={errors.author}
                />
                <DelayInputComponent
                  label="URL"
                  name="metaUrl"
                  value={metaUrl}
                  autoComplete="off"
                  debounceTimeout={600}
                  handleChange={handleChangeInput}
                  errorMessage={errors.metaUrl}
                  required
                  disabled={
                    formName === "Редактировать" ? publishDisabled : false
                  }
                />
                {formName === "Редактировать" && (
                  <div>
                    {!publish ? (
                      <StyledButton
                        onClick={handleClickEditUrl}
                        weight="normal"
                        color="info"
                      >
                        Редактировать URL
                      </StyledButton>
                    ) : (
                      <AlertMessage
                        type="warning"
                        message="Нельзя изменить URL для опубликованных статей."
                        margin="15px 0"
                      />
                    )}
                    {message && (
                      <AlertMessage
                        type="warning"
                        message="Внимание! URL будет изменен."
                        margin="15px 0"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </StyledAdminNewsCreatePost>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default NewsForm;
