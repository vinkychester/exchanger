import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Can from "../../components/can/can.component";
import Title from "../../components/title/title.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import DocumentContainer from "../../components/document/document.container";
import AlertMessage from "../../components/alert/alert.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledDocumentWrapper } from "./styled-document";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { documents } from "../../rbac-consts";

const DocumentPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={documents.PANEL_READ}
      yes={() => (
        <StyledContainer>
          <Helmet>
            <title>Верификация документов - Coin24</title>
          </Helmet>
          <StyledDocumentWrapper>
            <Title
              as="h1"
              title="Верификация документов"
              description="Проверка"
            />
            <div className="document__description">
              <p>
                Наш ресурс проводит верификацию с целью обеспечить Вам
                единственный аккаунт для пользования всеми нашими сервисами,
                чтобы Вы могли производить вход с одной учётной записи. Мы не
                храним никаких личных данных пользователя и не передаём их
                третьим лицам. Наш сервис строго соблюдает{" "}
                <NavLink to="/" className="default-link">
                  политику KYC
                </NavLink>{" "}
                и{" "}
                <NavLink to="/" className="default-link">
                  пользовательское соглашение
                </NavLink>
                .
              </p>
              <AlertMessage
                type="info"
                message="Верификация производится один раз для пользователя и служит инструментом для использования кроссервисного доступа."
              />
            </div>
            <DocumentContainer />
          </StyledDocumentWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(DocumentPage);
