import React, { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import $ from "jquery";
import "jquery-mask-plugin/dist/jquery.mask.min.js";

import ImageUploading from "react-images-uploading";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import DelayInputComponent from "../input-group/delay-input-group";

import { StyledFormWrapper, StyledHiddenForm } from "../styles/styled-form";
import { StyledVerificationCardImages } from "./styled-verification-card";
import { StyledButton } from "../styles/styled-button";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { CREATE_CREDIT_CARD } from "../../graphql/mutations/credit-card.mutation";
import { GET_CREDIT_CARDS } from "../../graphql/queries/credit-card.query";
import { CardVerificationContext } from "../../pages/card-verification/card-verification.component";
import { getMask, getPlaceholder } from "../../utils/mask.util";
import { hideCreditCardSigns } from "../../utils/app.utils";
import { convertDateToTimestamp } from "../../utils/datetime.util";
import { parseApiErrors } from "../../utils/response";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import translate from "../../i18n/translate";
import AlertMessage from "../alert/alert.component";

const INITIAL_STATE = {
  cardNumber: "",
  expiryDate: "",
  files: []
};

const CardVerificationForm = ({ hide, setHide }) => {
  let history = useHistory();
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [apiErrors, setErrors] = useState({});

  const { filter, currentPage } = useContext(CardVerificationContext);
  const { itemsPerPage } = filter;

  useEffect(() => {
    // $("input[name=cardNumber]").mask(getMask("cardNumber"), {
    //   placeholder: getPlaceholder("cardNumber"),
    // });
    $("input[name=expiryDate]").mask(getMask("expiryDate"), {
      placeholder: getPlaceholder("expiryDate")
    });

    const { location } = history;
    if (location.state) {
      setHide(false);
      history.replace({ state: null });
    }
  }, [history, setHide]);

  const [cardVerificationDetails, setCardVerificationDetails] = useState(
    INITIAL_STATE
  );
  const [createCreditCard, { loading }] = useMutation(CREATE_CREDIT_CARD, {
    onCompleted: () => {
      setCardVerificationDetails(INITIAL_STATE);
      setErrors([]);
      closableNotificationWithClick("Карта на верификацию успешно добавленна. На процесс верификации отводится до 24 часов. Однако по факту, проверка занимает меньше 1 часа.", "success");
      // document.getElementById("card-verification-form").reset();
    },
    onError: ({ graphQLErrors }) => {
      setErrors(parseApiErrors(graphQLErrors));
    }
  });

  const handleChangeVerificationData = (event) => {
    const { name, value } = event.target;
    setCardVerificationDetails((prevState) => ({
      ...prevState,
      [name]: value.trim()
    }));
  };

  const handleChangeFiles = (imageList, addUpdateIndex) => {
    setCardVerificationDetails((prevState) => ({
      ...prevState,
      files: imageList
    }));
  };

  const { date_gte, date_lte, ...filterProps } = filter;

  const handleSubmit = (event) => {
    event.preventDefault();
    const { cardNumber, files, ...props } = cardVerificationDetails;
    if (!files.length) {
      return closableNotificationWithClick("Загрузите фото для верификации.", "error");
    }
    let creditCard = cardNumber.replace(/-/g, "").replace(/\s+/g, "");
    createCreditCard({
      variables: {
        cardNumber: creditCard,
        cardMask: hideCreditCardSigns(creditCard),
        client: `/api/clients/${userId}`,
        files, ...props
      },
      refetchQueries: [
        {
          query: GET_CREDIT_CARDS,
          variables: {
            ...filterProps,
            itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
            page: currentPage,
            date_gte: convertDateToTimestamp(date_gte),
            date_lte: convertDateToTimestamp(date_lte),
            client_id: userId,
          }
        }
      ]
    });
  };

  const { cardNumber, expiryDate, files } = cardVerificationDetails;

  return (
    <>
      <StyledHiddenForm className="hidden-card-verification-form">
        <StyledLoadingWrapper mt="20">
          {loading && <FragmentSpinner position="center" />}
          <StyledFormWrapper
            hide={hide}
            onSubmit={handleSubmit}
            className={`card-verification-form ${loading && "loading"}`}
            id="card-verification-form"
          >
            <DelayInputComponent
              type="text"
              name="cardNumber"
              // mask={getMask("cardNumber")}
              label={translate("cardNumber")}
              value={cardNumber ?? ""}
              handleChange={handleChangeVerificationData}
              errorMessage={apiErrors.cardNumber}
              debounceTimeout={600}
              autoComplete="off"
              required
            />
            <DelayInputComponent
              type="text"
              name="expiryDate"
              // mask={getMask("expiryDate")}
              label="Cрок действия карты"
              value={expiryDate ?? ""}
              handleChange={handleChangeVerificationData}
              errorMessage={apiErrors.expiryDate}
              debounceTimeout={600}
              autoComplete="off"
              required
            />
            <ImageUploading
              required
              multiple
              value={files}
              onChange={handleChangeFiles}
              maxNumber={10}
              maxFileSize={5242880}
              dataURLKey="data_url"
              acceptType={["jpg", "gif", "png", "jpeg"]}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                errors
              }) => (
                <StyledVerificationCardImages>
                  <div className="images__head">
                    <StyledButton
                      color="info"
                      type="button"
                      weight="normal"
                      onClick={onImageUpload}
                    >
                      Загрузить фото
                    </StyledButton>
                    {/* error message */}
                    <p className="images_errors">
                      {apiErrors.creditCardAttachments}
                    </p>
                    {errors && (
                      <div className="images_errors">
                        <div>
                          {errors.maxNumber && (
                            <span>Максимальное количество изображений - 10</span>
                          )}
                        </div>
                        <div>
                          {errors.maxFileSize && (
                            <span>Максимальний размер загружаємого изображения - 5 MB</span>
                          )}
                        </div>
                        <div>
                          {errors.acceptType && (
                            <span>Типы загружаемых изображений - jpg, gif, png, jpeg </span>
                          )}
                        </div>
                      </div>
                    )}
                    {imageList.length !== 0 ? (
                      <StyledButton
                        color="danger"
                        weight="normal"
                        type="button"
                        onClick={onImageRemoveAll}
                      >
                        Очистить все
                      </StyledButton>
                    ) : null}
                  </div>
                  <div className="images__body">
                    {imageList.map((image, index) => (
                      <div key={index} className="image-item">
                        <LazyLoadImage
                          src={image["data_url"]} alt="" />
                        <div className="image-item__action">
                          <button
                            className="action-button action-button_update"
                            type="button"
                            onClick={() => onImageUpdate(index)}
                            title="Изменить"
                          >
                            <span className="icon-download-solid" />
                          </button>
                          <button
                            className="action-button action-button_remove"
                            type="button"
                            onClick={() => onImageRemove(index)}
                            title="Удалить"
                          >
                            <span className="icon-trash" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </StyledVerificationCardImages>
              )}
            </ImageUploading>
            <div className="card-verification-form__action">
              <StyledButton type="submit" color="success">
                Сохранить
              </StyledButton>
            </div>
          </StyledFormWrapper>
        </StyledLoadingWrapper>
      </StyledHiddenForm>
      <AlertMessage
        margin="15px 0 0 "
        type="info"
        message={
          <React.Fragment>
            <p>
              Для того, чтобы осуществить операцию покупки/продажи цифровых активов при помощи банковских карт,
              ресурс Сoin24.com.ua, имеет право запрашивать верификацию платежных методов.
            </p> <br />
            <p>
              Для верификации банковских карт, пользователь обязан предоставить: фото банковской карты на фоне заявки, фото банковской карты на котором видны номер карты, селфи с картой.
              Подробнее с требованиями можете озакомится на странице - <NavLink className="default-link" to="/card-verification-manual">Верификация карт: пошаговая инструкция</NavLink>.
            </p> <br />
            <p>
              Верификация банковских карт проводится в рабочее время обменника, и может занимать от нескольких минут до нескольких часов в зависимости от загрузки.
            </p>
          </React.Fragment>
        }
      />
    </>
  );
};

export default CardVerificationForm;
