import React from "react";
import Title from "../../title/title.component";
import ProfitItem from "./profit-item";

import { StyledContainer } from "../../styles/styled-container";
import { StyledProfitContent, StyledProfitWrapper } from "./styled-profit-section";

const ProfitSectionComponent = () => {
  return (
    <StyledProfitWrapper>
      <div className="bg-ellipse"/>
      <StyledContainer wrapper="content">
          <Title
            as="div"
            title="Преимущества работы с нами"
            description="Выгода"
            className="home-profit-section__title"
          />
          <StyledProfitContent>
            <ProfitItem
              img="safety"
              title="Надёжно"
              text="Использование многоуровневой серверной защиты. Система безопасности и контроля цифровых активов. Сервис размещён в авторитетных мониторингах и листингах. Гарантия поступления средств, при условии соблюдения правил обмена сервиса"
            />
            <ProfitItem
              img="profit"
              title="Выгодно"
              text="Всегда актуальные и выгодные курсы обмена ведущих мировых бирж. Отсутствие скрытых платежей или дополнительных комиссий. Фиксация и согласование курса с клиентом при условии наличного обмена "
            />
            <ProfitItem
              img="legally"
              title="Современно"
              text="Удобный современный ресурс. Автоматический поиск лучших курсов мировых криптобирж для совершения сделок. Автоматический обмен криптовалют с использованием банковских карт. Доступный и понятный интерфейс для всех"
            />
            <ProfitItem
              img="info"
              title="Информативно"
              text="Сервис информирует и минимизирует расходы клиента, которые не связанные с комиссиями данного обменника. Согласование условий обмена с менеджером в чате заявки, при обмене на наличные средства"
            />
            <ProfitItem
              img="referral"
              title="Реферальная программа"
              text="Выгодная двухуровневая партнёрская программа. Возможность не только выгодно обменивать, но и зарабатывать. Индивидуальные дисконтные программы и программа лояльности для постоянных клиентов. Система кешбэк"
            />
            <ProfitItem
              img="confidentially"
              title="Конфиденциально"
              text="Информация о пользователях не хранится на сервисе. Соблюдение строгой конфиденциальности. Мы уважаем Ваше желание не раскрывать личные данные о себе. Информация о заявках хранится в зашифрованном виде"
            />
            <ProfitItem
              img="functionally"
              title="Функционально"
              text="Широкий выбор платёжных систем для вывода средств и направлений обмена. Обмен в удобной для клиента валюте. Высокая скорость проведения транзакций и обработки заявок. Круглосуточный автоматический обмен криптовалют"
            />
            <ProfitItem
              img="partnership"
              title="Выгодное партнёрство"
              text="Предоставляем продуманные инструменты с высокой конверсией. API и другие форматы интеграции. Помощь и консультирование с подключением к сервису. Предоставление боксовых решений"
            />
          </StyledProfitContent>
        </StyledContainer>
    </StyledProfitWrapper>
  );
};

export default ProfitSectionComponent;