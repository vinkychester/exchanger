import React from "react";
import CitiesList from "../../components/cities/cities-list.component";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Title from "../../components/title/title.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledCitiesWrapper } from "./styled-cities";
import { StyledParagraph } from "../../components/styles/styled-document-elemets";

const CitiesPage = () => {

  return (
    <StyledContainer>
      <Helmet>
        <title>Обмен криптовалют в городах Украины: Киев, Одесса, Харьков, Днепр - Coin24</title>
        <meta
          name="description"
          content="Как купить или продать криптовалюту на наличные с помощью сервиса обмена криптовалют Coin24 можно узнать здесь ✅Тут представлен список городов, в которых доступен обмен криптовалют на наличные."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <StyledCitiesWrapper>
        <Title
          as="h1"
          title="Coin24 в городах Украины"
          description="Инфо"
        />
        <CitiesList />

        <StyledParagraph>
          С появлением криптовалют, появилась большая потребность в их покупке и продаже на фиатные деньги или другие
          криптовалюты. Одним из правильных, простых и быстрых решений была разработка Coin 24 - ресурса, который
          производит обмен электронной валюты.
        </StyledParagraph>

        <StyledParagraph>
          Coin24 работает на рынке электронной валюты Украины с 2011 года. Основное направление работы Coin24 - это
          покупка и продажа криптовалюты за наличные средства и безналичный перевод.
        </StyledParagraph>

        <StyledParagraph>
          Онлайн-обменник Coin24 предлагает Вам выгодный курс и быстроту обмена по всей Украине. Сервис представляет
          десятки направлений купли-продажи популярных криптовалют без каких-либо скрытых комиссий и непонятных схем.
        </StyledParagraph>

        <StyledParagraph>
          Процесс покупки криптовалюты или продажи криптовалюты в Украине через обменник Coin24 – это быстрое и
          надёжное решение. Мы гарантируем качество сервиса обмена!
        </StyledParagraph>

        <StyledParagraph>
          Ниже Вы можете детально ознакомиться с обменом BTC, ETH, LTC, XRP, DOGE, ETC, EOS, TRX, BCH и т. д. в Вашем
          регионе.
        </StyledParagraph>

        <StyledParagraph>
          Если затрудняетесь с выбором или что-то для Вас остаётся непонятным - обращайтесь за помощью к
          онлайн-оператору,
          либо же к нашим менеджерам, на странице {" "}
          <NavLink to={"/contacts"} className="default-link">
            "Контакты"
          </NavLink>.
        </StyledParagraph>
      </StyledCitiesWrapper>
    </StyledContainer>
  );
};

export default React.memo(CitiesPage);