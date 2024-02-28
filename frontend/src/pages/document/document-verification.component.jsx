import React from "react";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import AlertMessage from "../../components/alert/alert.component";
import Title from "../../components/title/title.component";
import BreadcrumbItem from "../../components/breadcrumb/breadcrumb-item";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledBreadcrumb } from "../../components/styles/styled-breadcrumb";
import { StyledDocumentVerificationDetails } from "./styled-document";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { documents } from "../../rbac-consts";

const DocumentVerificationPage = () => {
  const client = useApolloClient();

  const { userId, userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const renderFrame = () => {
    const link = localStorage.getItem("verificationLink" + userId);

    if (!link) {
      return (
        <AlertMessage
          type="info"
          message="Верификация документов сейчас недоступна"
        />
      );
    }

    return (
      <div className="document__frame">
        <iframe
          style={{ height: "1200px" }}
          scrolling="no"
          frameBorder="0"
          src={link}
        >
          Ваш браузер не поддерживает плавающие фреймы!
        </iframe>
      </div>
    );
  };

  return (
    <Can
      role={userRole}
      perform={documents.PANEL_VERIFICATION}
      yes={() => (
        <StyledContainer>
          <Helmet>
            <title>Верификация документов - Coin24</title>
          </Helmet>
          <StyledDocumentVerificationDetails>
            <Title
              as="h1"
              title="Верификация документов"
              className="document-verification-title"
            />

            <StyledBreadcrumb>
              <BreadcrumbItem as={NavLink} to="/" title="Главная" />
              <BreadcrumbItem
                as={NavLink}
                to="/panel/documents"
                title="Список схем"
              />
              <BreadcrumbItem as="span" title="Верификация документов" />
            </StyledBreadcrumb>
            {renderFrame()}
          </StyledDocumentVerificationDetails>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(DocumentVerificationPage);
