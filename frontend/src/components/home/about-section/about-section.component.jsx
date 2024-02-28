import React from "react";

import Title from "../../title/title.component";

import { StyledContainer } from "../../styles/styled-container";
import { StyledAboutContent, StyledAboutSection } from "./styled-about-section";
import { StyledButton } from "../../styles/styled-button";
import { NavLink } from "react-router-dom";

const AboutSectionComponent = () => {

  return (
    <StyledAboutSection>
      <StyledContainer wrapper="content">
        <Title
          as="div"
          title="О сервисе Coin24"
          description="О Нас"
          className="home-about-section__title"
        />
        <StyledAboutContent className="home-about-section__content home-about-preview">
          <p className="home-about-preview__text">
            <b>Coin24.com.ua</b> – это сервис на территории Украины, предоставляющий услугу покупки и продажи цифровых
                                 активов. Также, это онлайн-сервис, предоставляющий возможность обменять любую
                                 криптовалюту на фиатные средства (доллары, евро, гривны, рубли и др.), с использованием
                                 самых востребованных платёжных систем.
          </p>
          <p className="home-about-preview__text">
            Свои услуги на финансовом рынке наша компания предоставляет с 2011 года. Проект Coin24.com.ua был основан в
            августе 2018 года. Основным направлением проекта является покупка и продажа криптовалюты за наличные и
            безналичные
            средства, продажа кошельков и заказ необходимой криптовалюты в нужном количестве.
          </p>
          <div className="home-about-preview__footer">
            <StyledButton
              as={NavLink}
              to="/about-us"
              color="main"
            >
              Читать больше
            </StyledButton>
          </div>
        </StyledAboutContent>
      </StyledContainer>
    </StyledAboutSection>
  );
};

export default AboutSectionComponent;