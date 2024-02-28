import React from "react";
import { Helmet } from "react-helmet-async";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Title from "../../components/title/title.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledAboutUsContent, StyledAboutUsSection, StyledAboutUsWrapper } from "./styled-about-us";
import { StyledBlockTitle, StyledParagraph } from "../../components/styles/styled-document-elemets";

import speedIcon from "../../assets/images/speed.svg";
import safetyIcon from "../../assets/images/safety.svg";
import { NavLink } from "react-router-dom";
import { StyledButton } from "../../components/styles/styled-button";

const AboutUs = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>Один из лучший обмеников в Украине · Coin24</title>
        <meta
          name="description"
          content="Мета описание"
        />
      </Helmet>
      <StyledAboutUsWrapper>
        <Title
          as="h1"
          title="О сервисе Coin24"
          description="О Нас"
        />
        <StyledAboutUsContent>
          <StyledParagraph>
            Coin24.com.ua – это сервис на территории Украины, предоставляющий услугу покупки и продажи цифровых активов.
            Также, это онлайн-сервис предоставляющий возможность обменять любую криптовалюту на фиатные средства
            (доллары, евро, гривны, рубли и др.), с использованием самых востребованных платежных систем.
          </StyledParagraph>
          <StyledParagraph>
            Свои услуги на финансовом рынке Украины, наша компания предоставляет с 2011 года. Проект Coin24.com.ua был
            основан в августе 2018 года. Основным направлением проекта является покупка и продажа криптовалюты за
            наличные и безналичные средства, продажа кошельков и заказ необходимой криптовалюты в нужном количестве.
          </StyledParagraph>
          <StyledParagraph>
            У нас Вы всегда можете обменять криптовалюту на фиатные средства, а также купить крипту за наличные или
            безналичные деньги. Вариативность сервиса предлагает большой выбор способов оплаты посредством различных
            платежных систем. Наши менеджеры всегда вежливо и оперативно ответят на любой Ваш вопрос касательно обмена,
            любым удобным для Вас способом связи.
          </StyledParagraph>
          <StyledParagraph>
            Проект Coin24.com.ua создан с целью предоставлять качественные финансовые и информационные услуги в мире
            криптовалют, чтобы все, кто заинтересован этой сферой, могли ощутить выгоды и преимущества данной отрасли и
            оценить возможности цифровых денег.{" "}
            <NavLink to="/news" className="default-link">Информационный раздел</NavLink> и аналитика последних событий
            из мира
            криптоиндустрии, будет информировать Вас о том, когда лучше купить, продать или обменять биткоин или любую
            другую криптовалюту по выгодному курсу. Краткое содержание последних событий из мира криптовалюты позволит
            Вам узнавать информацию одним из первых.
          </StyledParagraph>
        </StyledAboutUsContent>
        <StyledAboutUsSection>
          <div className="about-us__content">
            <Title
              as="h2"
              title="Надежный обмен"
              className="about-us__sub-title"
            />
            <StyledParagraph>
              Воспользовавшись нашим сервисом, Вы всегда можете быть уверены в надежности и безопасности
              предоставляемых нами услуг. Безопасность и конфиденциальность - это кредо нашей компании. Самый ценный
              человеческий ресурс – это время. С помощью сервиса Coin24.com.ua, Вы сможете использовать свое время
              рационально, ведь купить, продать или обменять криптовалюту у нас, по самых выгодных курсах, без скрытых
              комиссий и дополнительных платежей, Вы сможете в течении всего нескольких минут. Мы работаем не только
              качественно, но и быстро.
            </StyledParagraph>
            <div className="about-us__action">
              <StyledButton
                color="main"
                as={NavLink}
                to="/"
              >
                Начать обмен
              </StyledButton>
            </div>
          </div>
          <div className="about-us__icon">
            <LazyLoadImage
              src={safetyIcon} alt="" width="35%" />
          </div>
        </StyledAboutUsSection>
        <StyledAboutUsSection>
          <div className="about-us__icon">
            <LazyLoadImage
              src={speedIcon} alt="" width="75%" />
          </div>
          <div className="about-us__content">
            <StyledParagraph>
              Основными принципами Coin24.com.ua является уважение к нашим клиентам, поэтому мы предлагаем Вам наиболее
              выгодные курсы мировых криптовалютных бирж для обмена цифровой валюты. Наш сервис гарантирует
              конфиденциальность и защищенность проводимых транзакций. Информация о пользователях не попадет в руки
              третьих лиц. Надежность нашего сервиса подтверждена <NavLink to="/reviews" className="default-link">положительными
                отзывами</NavLink> множества
              довольных клиентов.
              Зарегистрированным пользователям мы предлагаем еще большие выгоды. Пользуясь нашим сервисом, Вы сможете не
              только совершать выгодные для Вас сделки, но и зарабатывать на реферальной программе, приглашая
              пользователей и получая процент от прибыли системы с каждого совершенного обмена Ваших рефералов, которые
              совершили переход по Вашей реферальной ссылке и зарегистрировались на ресурсе. На Coin24.com.ua действует
              двухуровневая <NavLink to="/partners" className="default-link">реферальная программа</NavLink>.
            </StyledParagraph>
            <div className="about-us__action">
              <StyledButton
                color="main"
                as={NavLink}
                to="/rates"
              >
                Смотреть курс
              </StyledButton>
            </div>
          </div>
        </StyledAboutUsSection>
        <StyledAboutUsContent>
          <StyledBlockTitle>
            Доверяйте профессионалам - начните работать с нами прямо сейчас, и Вы убедитесь сами, что это выгодно во
            всех
            смыслах этого слова.
          </StyledBlockTitle>
        </StyledAboutUsContent>
      </StyledAboutUsWrapper>
    </StyledContainer>
  );
};

export default React.memo(AboutUs);
