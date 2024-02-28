import React from "react";
import Title from "../../components/title/title.component";
import StaticInfoNav from "../../components/static-information/static-info-navigation";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import AlertMessage from "../../components/alert/alert.component";

import { StyledContainer } from "../../components/styles/styled-container";
import {
  StaticInfoContent,
  StaticInfoGrid,
  StaticInfoWrapper
} from "../../components/static-information/styled-static-info";
import { StyledBlockTitle, StyledList, StyledParagraph } from "../../components/styles/styled-document-elemets";

const ExchangeRegulations = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>Регламент обмена · Coin24</title>
      </Helmet>
      <StaticInfoWrapper>
        <Title
          as="h1"
          title="Регламент обмена"
          description="Инфо"
        />
        <StaticInfoGrid>
          <StaticInfoNav />
          <StaticInfoContent>
            <StyledBlockTitle>
              Условия оформления заявок:
            </StyledBlockTitle>
            <StyledParagraph>
              Заявку на обмен цифровых активов может подать только зарегистрированный пользователь сервиса
              coin24.com.ua. Для проведения некоторых операций сервис coin24.com.ua может запросить прохождения
              процедуры верификации. Для прохождения верификации клиент обязан предоставить документы подтверждающие
              личность, указать верные данные в личном кабинете. Запрещено создавать заявки на выплату средств на
              реквизиты третьих лиц. Заявки, с использованием банковских карт, обрабатываются автоматически. С графиком
              работы по городам можно ознакомиться в разделе <NavLink to="/contacts" className="default-link">“Контакты”</NavLink>,
              выбрав интересующие направление обмена. В случае подачи заявки в нерабочее время, заявка будет обработана в следующий
              рабочий день, если не было предварительно оговорено проведения заявки в выходные дни или не рабочее время.
            </StyledParagraph>

            <StyledBlockTitle>
              Условия фиксации курса:
            </StyledBlockTitle>
            <StyledParagraph>
              Курс заявки фиксируется сервисом автоматически на момент захода криптовалюты или фиатных средств в рабочее
              время (10:00-18:00 (GMT+2)), а также вне рабочее время при предварительном согласовании с сервисом.
            </StyledParagraph>

            <StyledBlockTitle>
              Условия оплаты заявки клиентом:
            </StyledBlockTitle>
            <StyledParagraph>
              На сайте реализован автоматический прием/выплата для обменов с(на) карту любого украинского банка. Для
              совершения обмена важно единоразово верифицировать карту. Подробнее можно ознакомится в разделе{" "}
              <NavLink
                to="/card-verification-manual"
                className="default-link"
              >
                Верификация карт
              </NavLink>.
            </StyledParagraph>
            <StyledList>
              <b>Для заявок наличными:</b>
              <li>
                прием криптовалюты возможен в течении 24 часов после оформления заявки и подтверждения возможности
                обмена менеджером - клиенту будут доступны реквизиты для оплаты. После зачисления средств, сервис
                фиксирует курс и в деталях заявки появляется адрес, сумма и секретный код для получения наличных в
                кассе.
              </li>
              <li>
                выплата криптовалюты совершается в течении 30 минут после физической оплаты клиентом средств на кассе.
                После создании заявки необходимо связаться с менеджером в вашем городе и получить подтверждение на
                возможность оплаты - в деталях заявки будет доступен адрес, сумма и секретный код для оплаты в кассе.
                Курс фиксируется после после оплаты.
              </li>
            </StyledList>
            <AlertMessage
              margin="0 0 15px"
              type="warning"
              message="Неоплаченные заявки закрываются системой автоматически по истечению 48 часов."
            />

            <StyledBlockTitle>
              Условия оплаты заявки обменным пунктом (дополнительные условия отправки средств, зависящие от места
              нахождения клиента, при наличии):
            </StyledBlockTitle>
            <StyledParagraph>
              Обменный пункт отправляет цифровые активы/фиатные средства после получения полной оплаты по созданной
              заявке. В случае оплаты не в полном объеме, сервис оставляет за собой право пересчитать заявку, и
              выполнить ее в объеме, который был получен сервисом от клиента.
            </StyledParagraph>

            <StyledBlockTitle>
              Формат получения консультаций после оплаты заявки клиентом:
            </StyledBlockTitle>
            <StyledParagraph>
              Клиент может получить консультацию по поводу созданной заявки в чате онлайн поддержки или через контактные
              данные, указанные в разделе{" "}
              <NavLink
                to="/contacts"
                className="default-link"
              >
                “Контакты”
              </NavLink>.
            </StyledParagraph>
          </StaticInfoContent>
        </StaticInfoGrid>
      </StaticInfoWrapper>
    </StyledContainer>
  );
};

export default React.memo(ExchangeRegulations);
