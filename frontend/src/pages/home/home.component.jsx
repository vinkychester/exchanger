import React from "react";
import { Helmet } from "react-helmet-async";

import TopPageSectionComponent from "../../components/home/top-page/top-home-page-section";
import CalculatorContainer from "../../components/calculator/calculator.container";
import WhoAreWeSectionComponent from "../../components/home/who-are-we-section/who-are-we-section.component";
import NumCounterSectionComponent from "../../components/home/num-counter-section/num-counter-section";
import AboutSectionComponent from "../../components/home/about-section/about-section.component";
import ProfitSectionComponent from "../../components/home/profit-section/profit-section";
import NewsSectionComponent from "../../components/home/news-section/news-section.component";
import UsefulSectionComponent from "../../components/home/useful-section/useful-section.component";
import MonitoringSectionComponent from "../../components/home/monitoring-section/monitoring-section.component";

// import { StyledHome } from "./styled-home";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Онлайн обменник криптовалют💱 Автоматический обмен крипты в Украине - Coin24</title>
        <meta
          name="description"
          content="Купить и продать биткоин (btc), эфириум (eth) или другую криптовалюту по выгодному курсу ✅ Обмен bitcoin на карту ПриватБанк, Монобанк, Виза/Мастеркард в автоматическом режиме 💳 Онлайн обменник крипты на наличные в Украине"
        />
        <link rel="canonical" href={'https://' + window.location.hostname} />
      </Helmet>
      <TopPageSectionComponent />
      <CalculatorContainer />
      <WhoAreWeSectionComponent/>
      <NumCounterSectionComponent />
      <AboutSectionComponent />
      <ProfitSectionComponent />
      <NewsSectionComponent />
      <UsefulSectionComponent/>
      <MonitoringSectionComponent/>
    </>
  );
};

export default React.memo(Home);
