import React from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import StaticInfoNav from "../../components/static-information/static-info-navigation";
import Title from "../../components/title/title.component";

import { StyledContainer } from "../../components/styles/styled-container";
import {
  StaticInfoContent,
  StaticInfoGrid,
  StaticInfoWrapper
} from "../../components/static-information/styled-static-info";
import { StyledBlockTitle, StyledParagraph } from "../../components/styles/styled-document-elemets";

const PrivacyPolicy = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>Политика Конфиденциальности · Coin24</title>
      </Helmet>
      <StaticInfoWrapper>
        <Title
          as="h1"
          title="Политика конфиденциальности"
          description="Инфо"
        />
        <StaticInfoGrid>
          <StaticInfoNav />
          <StaticInfoContent>
            <StyledParagraph>
              Администрация сайта{" "}
              <NavLink to="/" className="default-link">
                coin24.com.ua
              </NavLink>{" "}
              обязуется сохранять Вашу конфиденциальность в Интернете. Мы уделяем большое значение охране
              предоставленных Вами данных. Наша политика конфиденциальности основана на требованиях{" "}
              <a
                href="https://ec.europa.eu/info/law/law-topic/data-protection_en"
                className="default-link"
                target="_blank"
                rel="noreferrer"
              >
                Общего регламента о защите персональных данных Европейского Союза (GDPR)
              </a>.
              Цели, в которых мы собираем персональные данные: улучшение работы нашего сервиса, осуществление контактов
              с посетителями данного сайта, новостная рассылка по электронной почте, обработка данных пользователей для
              сервиса онлайн - торговли, предоставление информации, которую запрашивал пользователь, осуществление
              услуг, связанных с направлением деятельности данного сайта, а так же для указанных ниже действий.
            </StyledParagraph>
            <StyledBlockTitle>
              Сбор и использование персональных данных
            </StyledBlockTitle>
            <StyledParagraph>
              Мы собираем и используем Ваши персональные данные только в случае Вашего добровольного согласия. При
              согласии с этим Вы разрешаете нам собирать и использовать следующие данные: имя и фамилия, дата рождения,
              электронная почта, номер телефона, домашний адрес, данные банковской карточки, идентификаторы электронных
              кошельков, данные аккаунтов в социальных сетях, документов, удостоверяющих личность. Сбор и обработка
              ваших данных проводится соответствии с законами, действующими на территории Европейского Союза и в
              Украине.
            </StyledParagraph>

            <StyledBlockTitle>
              Хранение данных, изменение и удаление
            </StyledBlockTitle>
            <StyledParagraph>
              Пользователь, предоставивший свои персональные данные сайту{" "}
              <NavLink
                to="/"
                className="default-link"
              >
                coin24.com.ua
              </NavLink>{" "}
              имеет право на их изменение и удаление, а так же на отзыв своего согласия с их использованием. Срок, в
              течение которого будут храниться Ваши персональные данные: время, необходимое для использования данных для
              основной деятельности сайта. При завершении использования Ваших данных администрация сайта удаляет их. Для
              доступа к своим персональным данным Вы можете связаться с администрацией сайта по следующему адресу:{" "}
              <NavLink
                to="/contacts"
                className="default-link"
              >
                coin24.com.ua/contacts
              </NavLink>.
              Мы можем передавать Ваши личные данные третьей стороне только с Вашего
              добровольного согласия, если они были переданы, то изменение данных в других организациях, не связанных с
              нами, мы осуществить не можем.
            </StyledParagraph>

            <StyledBlockTitle>
              Использование технических данных при посещении сайта
            </StyledBlockTitle>
            <StyledParagraph>
              При посещении Вами сайта{" "}
              <NavLink
                to="/"
                className="default-link"
              >
                coin24.com.ua
              </NavLink>{" "}
              в базе данных сохраняются записи о Вашем IP адресе, времени
              посещения, настройках браузера, операционной системе, а также другая техническая информация необходимая
              для корректного отображения содержимого сайта. По этим данным нам невозможно идентифицировать личность
              посетителя.
            </StyledParagraph>

            <StyledBlockTitle>
              Предоставление информации детьми
            </StyledBlockTitle>
            <StyledParagraph>
              Если Вы являетесь родителем или опекуном, и Вы знаете, что Ваши дети предоставили нам свои личные данные
              без Вашего согласия, свяжитесь с нами:{" "}
              <NavLink
                to="/contacts"
                className="default-link"
              >
                coin24.com.ua/contacts
              </NavLink>.
              На нашем сервисе запрещено оставлять личные данные несовершеннолетних без согласия родителей или опекунов.
            </StyledParagraph>

            <StyledBlockTitle>
              Использование cookies
            </StyledBlockTitle>
            <StyledParagraph>
              Для корректного отображения содержимого и для удобства использования сайта{" "}
              <NavLink
                to="/"
                className="default-link"
              >
                coin24.com.ua
              </NavLink>{" "}
              мы используем cookie файлы. Это небольшие файлы, которые хранятся на Вашем устройстве. Они помогают сайту
              запомнить информацию о вас, например на каком языке Вы просматриваете сайт и какие страницы Вы уже
              открывали, эта информация будет полезна при следующем посещении. Благодаря файлам cookie просмотр сайта
              становится значительно более удобным. Подробнее про эти файлы Вы можете{" "}
              <a
                href="https://ru.wikipedia.org/wiki/Cookie"
                className="default-link"
                target="_blank"
                rel="noreferrer"
              >
                прочитать тут
              </a>.
              Вы можете настроить прием или блокировку cookie в браузере самостоятельно. Невозможность принимать cookie
              может ограничить работоспособность сайта.
            </StyledParagraph>

            <StyledBlockTitle>
              Использование персональных данных другими сервисами
            </StyledBlockTitle>
            <StyledParagraph>
              На этом сайте используются сторонние интернет-сервисы, осуществляющие независимый от нас сбор информации:
              Google Analytics , Google AdSense, Yandex.Metrica, Yandex.Direct, Disqus.com, Facebook.com. Собранные ими
              данные могут предоставляться другим службам внутри этих организаций, они могут использовать данные для
              персонализации рекламы своей собственной рекламной сети. Вы можете прочитать пользовательские соглашения
              этих организаций на их сайтах. Там же Вы можете отказаться от сбора ими персональных данных, к примеру
              блокировщик{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout?hl=ru"
                className="default-link"
                target="_blank"
                rel="noreferrer"
              >
                Google Analytics находится тут
              </a>,{" "}
              <a
                href="https://yandex.ru/support/metrika/general/opt-out.html"
                className="default-link"
                target="_blank"
                rel="noreferrer"
              >
                блокировщик Яндекс Метрики тут
              </a>.
              Мы не передаем персональные данные другим организациям и службам, не указанным в данной политике
              конфиденциальности. Исключение составляет только передача информации при законных требованиях
              государственных органов уполномоченных осуществлять данные действия.
            </StyledParagraph>

            <StyledBlockTitle>
              Ссылки на другие сайты
            </StyledBlockTitle>
            <StyledParagraph>
              Наш сайт{" "}
              <NavLink
                to="/"
                className="default-link"
              >
                coin24.com.ua
              </NavLink>{" "}
              может содержать ссылки на другие сайты, которые не управляются нами. Мы не несем ответственность за их
              содержание. Мы рекомендуем Вам ознакомиться с политикой конфиденциальности каждого сайта, который Вы
              посещаете, если она там есть.
            </StyledParagraph>

            <StyledBlockTitle>
              Изменения в политике конфиденциальности
            </StyledBlockTitle>
            <StyledParagraph>
              Наш сайт coin24.com.ua может обновлять нашу политику конфиденциальности время от времени. Мы сообщаем о
              любых изменениях, разместив новую политику конфиденциальности на этой странице. Мы отслеживаем изменения
              законодательства, касающегося персональных данных в Европейском Союзе и в государстве Украина. Если Вы
              оставили персональные данные у нас, то мы оповестим вас об изменении в политике конфиденциальности. Если
              ваши персональные данные были введены не корректно, то мы не сможем с Вами связаться.
            </StyledParagraph>

            <StyledBlockTitle>
              Обратная связь, заключительные положения
            </StyledBlockTitle>
            <StyledParagraph>
              Связаться с администрацией сайта{" "}
              <NavLink
                to="/"
                className="default-link"
              >
                coin24.com.ua
              </NavLink>{" "}
              по вопросам, связанным с политикой конфиденциальности можно по адресу:{" "}
              <NavLink
                to="/contacts"
                className="default-link"
              >
                coin24.com.ua/contacts
              </NavLink>,
              с помощью контактной формы указанной в соответствующем разделе данного сайта. Если Вы не согласны с данной
              политикой конфиденциальности, Вы не можете пользоваться услугами сайта{" "}
              <NavLink
                to="/"
                className="default-link"
              >
                coin24.com.ua
              </NavLink>,
              в этом случае Вы должны воздержаться от посещения нашего сайта.
            </StyledParagraph>
          </StaticInfoContent>
        </StaticInfoGrid>
      </StaticInfoWrapper>
    </StyledContainer>
  );
};

export default React.memo(PrivacyPolicy);
