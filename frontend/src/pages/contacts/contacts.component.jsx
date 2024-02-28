import React from "react";
import { Helmet } from "react-helmet-async";
import Title from "../../components/title/title.component";
import ContactsFormContainer from "../../components/feedback/contact-form/contacts-form.container.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledContactsWrapper } from "./styled-contacts";
import AlertMessage from "../../components/alert/alert.component";

const Contacts = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>Контакты - Coin24</title>
        <meta
          name="description"
          content=""
        />
      </Helmet>
      <StyledContactsWrapper>
        <Title
          as="h1"
          title="Свяжитесь с нами"
          description="Контакты"
        />
        <div className="contacts-content">
          <ContactsFormContainer />
          <AlertMessage
            className="contacts-warning"
            type="warning"
            message="Уважаемые клиенты в телеграмме появились мошенники, которые создают логины визуально похожие на контакты менеджеров сервиса. Просьба переходить в чаты для общения с менеджерами исключительно через ссылки-мессенджеров, которые предоставленны в разделе контакты."
            margin="30px 0"
          />
        </div>
      </StyledContactsWrapper>
    </StyledContainer>
  );
};

export default React.memo(Contacts);
