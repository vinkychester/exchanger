import React from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Title from "../../../components/title/title.component";
import BreadcrumbItem from "../../../components/breadcrumb/breadcrumb-item";
import DirectionsRates from "./directions-rates.component";

import { StyledBreadcrumb } from "../../../components/styles/styled-breadcrumb";
import { StaticSeoContent, StaticSeoPageWrapper } from "../../seo-content/styled-seo-content";
import { StyledBlockTitle, StyledList, StyledParagraph } from "../../../components/styles/styled-document-elemets";
import { StyledContainer } from "../../../components/styles/styled-container";

const CardToCrypto = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>Обмен биткоин на Visa/MasterCard - Купить/продать Bitcoin (BTC) через Visa/MasterCard · Coin24</title>
        <meta
          name="description"
          content="Купить биткоин картой Visa/MasterCard ᐈ Обменять BTC через Виза/Мастеркард по выгодному курсу в Украине ➤ Автоматический ввод и вывод Bitcoin и другой криптовалюты на карту Visa/MasterCard в удобное время"
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <StaticSeoPageWrapper>
        <Title
          as="h1"
          title="Купить/продать криптовалюту картой Visa/MasterCard"
          className="seo__title"
        />
        <StyledBreadcrumb mb="20">
          <BreadcrumbItem
            as={NavLink}
            to="/"
            title="Главная"
          />
          <BreadcrumbItem
            as={NavLink}
            to="/all-exchange-pairs"
            title="Направления обменов"
          />
          <BreadcrumbItem
            as="span"
            title="Обмен биткоин на Visa/MasterCard "
          />
        </StyledBreadcrumb>
        <StaticSeoContent>
          <StyledParagraph>
            Обмен биткоин на Visa и MasterCard на данный момент является одним из самых популярных направлений на сайте
            Coin24.com.ua. Купить лайткоин visa/mastercard, биткоин и другие криптовалюты на сервисе можно за считанные
            минуты.
          </StyledParagraph>
          <StyledParagraph>
            <strong>Visa</strong> – это американская транснациональная компания, которая предоставляет услуги по
                                  проведению платежных
                                  транзакций и стала популярной после 1958 года. Большой опыт в сфере финансового рынка
                                  зарекомендовал Visa,
                                  как одну из самых надежных банковских систем на данный момент. А в наше время карты
                                  Visa востребованы в
                                  большинстве стран мира и широко используются для онлайн-платежей, в том числе и
                                  криптовалют. Компания
                                  выпускает более 25 видов карт.
          </StyledParagraph>
          <StyledParagraph>
            <strong>MasterCard</strong> – это международная платежная система, которая объединяет в себе более 22000
                                        учреждений по
                                        финансовым направлениям в целых 210 странах мира! Главный офис находится в
                                        Нью-Йорке. MasterCard приобрел
                                        широкую популярность, так же, как и Visa. Начиная с 1966 года, картами
                                        MasterCard пользуется все большее
                                        количество людей, а в XXI веке эта платежная система является одной из основных
                                        для операций по обмену
                                        цифровых активов.
          </StyledParagraph>
          <StyledBlockTitle>
            Обмен btc на Visa/MasterCard
          </StyledBlockTitle>
          <StyledParagraph>
            Для того, чтобы купить биткоин Visa/MasterCard на сайте Coin24.com.ua, прежде всего, Вам необходимо
            зарегистрироваться и <NavLink to="/card-verification-manual" className="default-link">пройти верификацию карты</NavLink>.
          </StyledParagraph>
          <StyledParagraph>
            Coin24 – это официальный обменник криптовалют в Украине. Работа сервиса соответствует всем банковским нормам
            и требованиям в нашей стране. Мы ценим безопасность данных и конфиденциальность каждого клиента. Во
            избежание фейковых обменов и использования чужой карты, мы можем потребовать прохождение верификации от всех
            пользователей, которые решились провести транзакции через наш сервис. Однако не стоит беспокоиться, Ваши
            данные никогда не попадут к третьим лицам.
          </StyledParagraph>
          <StyledBlockTitle>
            Как вывести bitcoin на карту Visa/MasterCard
          </StyledBlockTitle>
          <StyledParagraph>
            Чтобы совершить быстрый автоматический обмен visa usd на bitcoin или обмен mastercard usd на bitcoin или
            другие криптовалюты, перейдите на главную страницу сайта Coin24.com.ua и подайте заявку на обмен крипты. В
            столбце «Отдаете», выберите пункт «Coin», а затем Bitcoin BTC или другую любую криптовалюту. В Столбце
            «Получаете» выберите верное направление обмена в графе «Банк», укажите «VisaMc UAH». Укажите кол-во коинов,
            которые хотите вывести на карту виза/мастеркард, пройдите верификацию и ожидайте поступления средств на Вашу
            банковскую карту.
          </StyledParagraph>
          <StyledBlockTitle>
            Как купить bitcoin с карты Visa/MasteCard
          </StyledBlockTitle>
          <StyledParagraph>
            Чтобы купить биткоин через карту мастеркард или виза, на <NavLink to="/" className="default-link">Главной странице</NavLink> сайта в столбце «Отдаете»,
            выберите пункт «Bank» и затем «VisaMc UAH». В Столбце «Получаете» выберите «Bitcoin» или другое направление
            обмена в графе «Coin» и совершите обмен по такому же алгоритму, как было указано выше.
          </StyledParagraph>
          <StyledParagraph>
            <strong>Доступные криптовалюты для обмена</strong> на нашем сервисе: Bitcoin(BTC), Litecoin (LTC), Dash
                                                               (DASH), <NavLink to="/news/ethereum-princip-raboty-preimushchestva-i-prognozy" className="default-link">Ethereum (ETH)</NavLink>, Ethereum Classic (ETS), Tether (USDT) – TRC20/
                                                               ERC20/ OMNI, <NavLink to="/news/bitcoin-cash-obzor-kriptovaljuty" className="default-link">Bitcoin Cash (BCH)</NavLink>, Waves и другие
                                                               криптовалюты. А если какой-то из криптовалют нет в нашем
                                                               списке, Вы можете связаться с администрацией сайта
                                                               и мы закажем крипту специально для Вас.
          </StyledParagraph>
          <StyledParagraph>
            Чтобы совершить вывод bitcoin на карту visa или MasterCard, Вы обязательно должны быть владельцем
            собственной физической карты этих банковских систем. Так как для совершения обмена может потребоваться <NavLink to="/card-verification-manual" className="default-link">верификация</NavLink> карты, поэтому убедитесь, что карта у Вас под рукой. Если Вам необходима помощь или поддержка
            менеджера сайта – смело обращайтесь! График работы технической поддержки: с понедельника по пятницу с 08:00
            до 00:00.
          </StyledParagraph>
          <StyledBlockTitle>
            Сервис Coin24.com.ua гарантирует:
          </StyledBlockTitle>
          <StyledList>
            <li>
              Автоматический и качественный обмен криптовалют, круглосуточная работа сервиса, 24/7;
            </li>
            <li>
              Защиту Ваших персональных данных;
            </li>
            <li>
              Выгодные курсы известных всемирных бирж и с минимальной комиссией;
            </li>
            <li>
              Соблюдение конфиденциальности пользователей, информация о заявках хранится в зашифрованном виде;
            </li>
            <li>
              Двухуровневую <NavLink to="/partners" className="default-link">реферальную программу</NavLink> с возможностью заработка на привлечении других пользователей, а также
              кэшбек от Ваших транзакций;
            </li>
            <li>
              И множество других привилегий.
            </li>
          </StyledList>
          <StyledParagraph>
            Попробуйте сами совершить первый обмен крипты на карту Visa/MasterCard и убедитесь сами во всех
            преимуществах данного обменника!
          </StyledParagraph>
        </StaticSeoContent>
        <DirectionsRates paymentSystem="VisaMC" currency="UAH" />
      </StaticSeoPageWrapper>
    </StyledContainer>
  );
};

export default React.memo(CardToCrypto);