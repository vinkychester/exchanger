import React from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Title from "../../components/title/title.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StaticSeoContent, StaticSeoPageWrapper } from "../seo-content/styled-seo-content";
import { StyledParagraph } from "../../components/styles/styled-document-elemets";
import { StyledExchangeDirectionsWrapper } from "./styled-exchange-directions";

const ExchangeDirectionsPage = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>Купить криптовалюту в Украине с помощью банковской карты и за наличные · Coin24</title>
        <meta
          name="description"
          content="Купить и продать Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC) и другую крипту картой ПриватБанк (Приват24), Монобанк, Visa/MasterCard и за наличные в Киеве, Харькове, Днепре, Одессе и других городах Украины. Обмен крипты наличкой и банковской картой по выгодному курсу"
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <StaticSeoPageWrapper>
        <Title
          as="h1"
          title="Обмен криптовалют на наличные. Ввод/вывод крипты на карту ПриватБанк, Монобанк, Visa/MasterCard"
          className="seo__title"
        />
        <StaticSeoContent>
          <StyledParagraph>
            Популярность онлайн-платежей и электронных валют в мире растёт очень быстрыми темпами. Каждый месяц, а то и
            неделю, запускаются не только новые проекты в сфере финансов, но и платёжные системы.
          </StyledParagraph>
          <StyledParagraph>
            С появлением криптовалют изменения произошли и на валютном рынке. Эти цифровые активы хоть и появились
            только в 2009 году, но уже сумели достичь очень большой популярности среди множества пользователей сети
            Интернет. При этом, не каждый знает или понимает, как можно купить биткоин или другую крипту с максимальной
            выгодой для себя. Здесь на помощь приходят обменники криптовалют, где очень быстро можно приобрести заветные
            биткоины, эфириум или не менее популярные <NavLink
            to="/news/stejblkoin-chto-eto-takoe"
            className="default-link"
            target="_blank"
          >стейблкоины</NavLink>. Одним
            из таких есть автоматический обменник криптовалют Coin24.com.ua. Данный сервис предоставляет большой выбор
            криптовалют для обмена. Купить или продать BTC, ETH,
            LTC, USDT, DOGE, TRX, DASH и другие монеты можно как наличными, так и безналичными деньгами.
          </StyledParagraph>
          <StyledParagraph>
            Обменять крипту картой ПриватБанк (Приват24), Монобанк или Visa/MasterCard вовсе не проблема для данного
            обменника. Сервис работает полностью в автоматическом режиме. Всего несколько минут понадобиться Вам для
            проведения такого обмена.
          </StyledParagraph>
          <StyledParagraph>
            Coin24.com.ua также даёт возможность своим клиентам купить и продать криптовалюту на наличные деньги
            в <NavLink to="/cities" className="default-link" target="_blank">32 городах</NavLink> Украины по выгодному
            курсу. Обменник гарантирует полную безопасность и конфиденциальность всех
            обменных операций.
          </StyledParagraph>
          <StyledParagraph>
            Как совершить обмен крипты банковской картой или за наличные, читайте ниже.
          </StyledParagraph>
        </StaticSeoContent>
        <StyledExchangeDirectionsWrapper>
          <NavLink to="/obmen-btc-privatbank-uah" className="exchange-direction-item">
            <div className="exchange-direction-item__icon exchange-direction-item_p24" />
            <div className="exchange-direction-item__title">
              Обмен на Приват24
            </div>
          </NavLink>
          <NavLink to="/obmen-btc-monobank-uah" className="exchange-direction-item">
            <div className="exchange-direction-item__icon exchange-direction-item_monob" />
            <div className="exchange-direction-item__title">
              Обмен на Monobank
            </div>
          </NavLink>
          <NavLink to="/obmen-btc-visa-mastercard-uah" className="exchange-direction-item">
            <div className="exchange-direction-item__icon exchange-direction-item_card" />
            <div className="exchange-direction-item__title">
              Обмен на Visa/MC
            </div>
          </NavLink>
          <NavLink to="/obmen-btc-cash" className="exchange-direction-item">
            <div className="exchange-direction-item__icon exchange-direction-item_cash" />
            <div className="exchange-direction-item__title">
              Наличный обмен
            </div>
          </NavLink>
        </StyledExchangeDirectionsWrapper>
      </StaticSeoPageWrapper>
    </StyledContainer>
  );
};

export default React.memo(ExchangeDirectionsPage);