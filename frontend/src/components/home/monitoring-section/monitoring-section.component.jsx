import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { StyledMonitoringContent, StyledMonitoringWrapper } from "./styled-monitoring-section";
import { StyledContainer } from "../../styles/styled-container";

import bestChange from "../../../assets/images/monitoring/88x31-bestchange.gif";
import xrates from "../../../assets/images/monitoring/88x31-xrates.gif";
import kurs from "../../../assets/images/monitoring/88x31-kurs.png";
import okChangers from "../../../assets/images/monitoring/90x32-okchanger.png";
import glazok from "../../../assets/images/monitoring/88x31-glazok.gif";
import cryptobrokers from "../../../assets/images/monitoring/88x31-cryptobrokers.png";
import allChange from "../../../assets/images/monitoring/88x31-allchange.jpg";
import bitsMedia from "../../../assets/images/monitoring/88x31-bitsmedia.png"

const MonitoringSectionComponent = () => {
  return (
    <StyledMonitoringWrapper>
      <StyledContainer wrapper="content">
        <StyledMonitoringContent>
          <a
            href="https://www.bestchange.ru/coin24-exchanger.html"
            target="_blank"
            rel="noreferrer"
            title="BestChange.ru - Мониторинг обменников в интернете"
          >
            <LazyLoadImage
              src={bestChange}
              alt="Мониторинг обменников валюты"
              width="88"
              height="31"
              border="0" />
          </a>
          <a
            href="https://xrates.ru/testimonials/otzyvy-coin24comua"
            target="_blank"
            rel="noreferrer"
          >
            <LazyLoadImage
              src={xrates}
              width="88"
              height="31"
              border="0"
              alt="Мониторинг обменников XRates.ru" />
          </a>
          <a
            href="https://kurs.com.ua/forums/topic/4782-coin24comua/"
            target="_blank"
            rel="noreferrer"
            title="Мониторинг обменников электронных валют"
          >
            <LazyLoadImage
              src={kurs}
              width="88"
              height="31"
              alt="kurs.com.ua" />
          </a>
          <a
            href="https://www.okchanger.ru/exchangers/COIN24"
            target="_blank"
            rel="noreferrer"
          >
            <LazyLoadImage
              src={okChangers}
              width="88"
              height="31"
              alt="okChangers" />
          </a>
          <a
            href="https://cryptobrokers.ru/coin24-info/"
            target="_blank"
            rel="noreferrer"
            title="Мониторинг обменников Cryptobrokets"
          >
            <LazyLoadImage
              border="0"
              src={cryptobrokers}
              width="88"
              height="31"
              alt="CryptobroketsLogo" />
          </a>
          <a
            href="https://allchange.org/exchanger/coin24-com-ua"
            target="_blank"
            rel="noreferrer"
            title="Мониторинг AllChange"
          >
            <LazyLoadImage
              border="0"
              src={allChange}
              width="88"
              height="31"
              alt="Мониторинг AllChange" />
          </a>
          <a
            href="https://glazok.org/exchange/?details=868"
            target="_blank"
            rel="noreferrer"
            title="Мониторинг обменных пунктов GLAZOK"
          >
            <LazyLoadImage
              border="0"
              src={glazok}
              width="88"
              height="31"
              alt="Glazok" />
          </a>
          <a
            href="https://bits.media/exchanger/coin24-com-ua"
            target="_blank"
            rel="noreferrer"
            title="Криптовалюты и блокчейн по русски"
          >
            <LazyLoadImage
              border="0"
              src={bitsMedia}
              width="88"
              height="31"
              alt="bits.media" />
          </a>
        </StyledMonitoringContent>
      </StyledContainer>
    </StyledMonitoringWrapper>
  );
};

export default MonitoringSectionComponent;