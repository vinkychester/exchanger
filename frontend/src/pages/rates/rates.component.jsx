import React from "react";
import { Helmet } from "react-helmet-async";

import Title from "../../components/title/title.component";
import Rates from "../../components/rates/rates.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledRatesWrapper } from "./styled-rates";

// import "../../assets/css/rc-select.css";
// import "rc-tooltip/assets/bootstrap.css";

const RatesPage = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>
          Курсы криптовалют онлайн 📈 Курс биткоина к доллару, евро, гривне -
          Coin24
        </title>
        <meta
          name="description"
          content="Курс Биткоина (Bitcoin), курс Эфириума (Ethereum) и других криптовалют на сегодня 💲Графики криптовалют в режиме реального времени ✅ Динамика изменения цены Биткоина, Эфира, Лайткоина."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <StyledRatesWrapper>
        <Title as="h1" title="Курсы криптовалюты" description="Обмен" />
        <Rates />
      </StyledRatesWrapper>
    </StyledContainer>
  );
};

export default React.memo(RatesPage);
