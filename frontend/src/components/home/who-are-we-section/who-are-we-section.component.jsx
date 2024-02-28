import React from "react";
import Title from "../../title/title.component";

import { StyledContainer } from "../../styles/styled-container";
import { StyledWhoAreWeContent, StyledWhoAreWeSection } from "./styled-who-are-we-section";

const WhoAreWeSectionComponent = () => {

  return (
    <StyledWhoAreWeSection>
      <StyledContainer wrapper="content">
        <Title
          as="h2"
          title="Быстрый и безопасный сервис обмена криптовалют в Украине!"
          description="Кто мы?"
          className="home-who-are-we-section__title"
        />
        <StyledWhoAreWeContent>
          <p className="home-who-are-we-section__text">
            Круглосуточный обмен биткоинов, лайткоинов, эфириума и других криптомонет теперь стал возможен благодаря
            автоматическому обменнику крипты Coin24.com.ua.
          </p>
          <p className="home-who-are-we-section__text">
            Купить криптовалюту за несколько кликов теперь не проблема! На нашем сайте ввод или вывод электронных валют
            можно совершить любым способом оплаты - наличка, безналичный расчет, картами ПриватБанк (Приват24),
            Монобанк,
            Visa/MasterCard и другими.
          </p>
          <p className="home-who-are-we-section__text">
            Мы сервис покупки и продажи криптовалют в Украине. Coin24.com.ua - очень быстрый и в этом Вы можете убедиться сами.
            Чтобы купить Bitcoin, эфир или другой альткоин понадобиться всего пару минут, ведь обменник работает в
            автоматическом режиме.
          </p>
          <p className="home-who-are-we-section__text home-who-are-we-section_strong">
            Не медлите, инвестируйте в крипту с лучшими на рынке!
          </p>
        </StyledWhoAreWeContent>
      </StyledContainer>
    </StyledWhoAreWeSection>
  );
};

export default WhoAreWeSectionComponent;