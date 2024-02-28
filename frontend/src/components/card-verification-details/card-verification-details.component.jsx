import React, { createContext, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Can from "../../components/can/can.component";
import Title from "../title/title.component";
import BreadcrumbItem from "../breadcrumb/breadcrumb-item";
import AlertMessage from "../alert/alert.component";
import CardVerificationDetailsUserTab from "./card-verification-details-user-tab.component";
import CardVerificationDetailsCancelButton from "./card-verification-details-cancel-button.component";
import CardVerificationDetailsApproveButton from "./card-verification-details-approve-button.component";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

import { StyledContainer } from "../styles/styled-container";
import {
  StyledCardVerificationDetailsWrapper,
  StyledCVDetailsImages,
} from "./styled-verification-card-details";
import { StyledBreadcrumb } from "../styles/styled-breadcrumb";
import {
  StyledCol,
  StyledColHead,
  StyledRow,
  StyledTable,
  StyledTableBody,
  StyledTableHeader,
} from "../styles/styled-table";
import { StyledButton } from "../styles/styled-button";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { cardVerification } from "../../rbac-consts";
import { creditCardStatuses } from "../../utils/consts.util";

import translate from "../../i18n/translate";

export const CardVerificationDetailsContext = createContext();

const CardVerificationDetails = ({
  id,
  expiryDate,
  cardMask,
  status,
  comment,
  createdAt,
  mediaObjects,
  client,
  cardNumber,
  manager,
  verificationTime
}) => {
  const clientApollo = useApolloClient();

  let history = useHistory();

  const { userRole } = clientApollo.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [lightbox, setLightbox] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(0);

  const handleRedirectToForm = () => {
    history.push({
      pathname: "/panel/card-verification",
      state: { isRedirect: true },
    });
  };

  let destructMediaObjects = mediaObjects.map((data) => ({ url: data.base64 }));

  const toggleLightbox = (index) => {
    setLightbox(!lightbox);
    setLightboxItem(index);
  };

  return (
    <StyledContainer>
      <Helmet>
        <title>Верификация карты- Coin24</title>
      </Helmet>
      <StyledCardVerificationDetailsWrapper role={userRole}>
        <Title
          as="h1"
          title="Верификация карты"
          className="verification-card-details__title"
        />
        <div className="verification-card-details__head">
          <StyledBreadcrumb>
            <BreadcrumbItem as={NavLink} to="/" title="Главная" />
            <BreadcrumbItem
              as={NavLink}
              to="/panel/card-verification"
              title="Список карт"
            />
            <BreadcrumbItem as="span" title="Верификация карты" />
          </StyledBreadcrumb>
        </div>
        {creditCardStatuses.NOT_VERIFIED === status && (
          <Can
            role={userRole}
            perform={cardVerification.ACTIONS}
            yes={() => (
              <CardVerificationDetailsContext.Provider value={{ id, cardMask }}>
                <div className="verification-card-details__action">
                  <CardVerificationDetailsCancelButton />
                  <CardVerificationDetailsApproveButton />
                </div>
              </CardVerificationDetailsContext.Provider>
            )}
          />
        )}
        <StyledTable className="card-verification-details-table">
          <StyledTableHeader
            col={userRole !== "client" ? "7" : "4"}
            className="card-verification-details-table__head"
          >
            <Can
              role={userRole}
              perform={cardVerification.CLIENT_DETAILS}
              yes={() =>
                <>
                  <StyledColHead>Клиент</StyledColHead>
                  <StyledColHead>Менеджер</StyledColHead>
                  <StyledColHead>Дата обработки</StyledColHead>
                </>
              }
            />
            <StyledColHead>Номер карты</StyledColHead>
            <StyledColHead>Срок действия карты</StyledColHead>
            <StyledColHead>Статус</StyledColHead>
            <StyledColHead>Дата загрузки</StyledColHead>
          </StyledTableHeader>
          <StyledTableBody>
            <StyledRow
              col={userRole !== "client" ? "7" : "4"}
              className="card-verification-details-table__row"
            >
              <Can
                role={userRole}
                perform={cardVerification.CLIENT_DETAILS}
                yes={() =>
                  <>
                    <CardVerificationDetailsUserTab user={client} />
                    <StyledCol data-title="Менеджер">
                      {manager}
                    </StyledCol>
                    <StyledCol data-title="Дата обработки">
                      {verificationTime ?TimestampToDate(verificationTime) : ""}
                    </StyledCol>
                  </>
                }
              />
              <StyledCol data-title="Номер карты">
                {userRole === "client" ? cardMask : cardNumber}
              </StyledCol>
              <StyledCol data-title="Срок действия карты">
                {expiryDate}
              </StyledCol>
              <StyledCol data-title="Статус">{translate(status)}</StyledCol>
              <StyledCol data-title="Дата загрузки">
                {TimestampToDate(createdAt)}
              </StyledCol>
            </StyledRow>
          </StyledTableBody>
        </StyledTable>
        <StyledCVDetailsImages>
          {mediaObjects &&
            mediaObjects.map((item, index) => (
              <div
                key={item.id}
                className="image-item"
                onClick={() => {
                  toggleLightbox(index);
                }}
              >
                <LazyLoadImage
                  src={item.base64} alt="" />
              </div>
            ))}
        </StyledCVDetailsImages>
        {lightbox && (
          <Lightbox
            images={destructMediaObjects}
            onClose={toggleLightbox}
            showTitle={false}
            startIndex={lightboxItem}
          />
        )}
        {comment && (
          <AlertMessage type="warning" message={comment} margin="15px 0" />
        )}
        {status === creditCardStatuses.CANCELED && userRole === "client" && (
          <StyledButton
            type="button"
            color="info"
            weight="normal"
            onClick={handleRedirectToForm}
          >
            Отправить повторно
          </StyledButton>
        )}
      </StyledCardVerificationDetailsWrapper>
    </StyledContainer>
  );
};

export default CardVerificationDetails;
