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

const CashToCrypto = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>Обмен биткоин на наличные в Украине - Купить/продать Bitcoin (BTC) наличными · Coin24</title>
        <meta
          name="description"
          content="Купить биткоин и другую крипту наличными в Украине ᐈ Обменять BTC наличкой по выгодному курсу в Украине ➤ Автоматический ввод и вывод Bitcoin и другой криптовалюты на наличные в удобное время"
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <StaticSeoPageWrapper>
        <Title
          as="h1"
          title="Купить/продать криптовалюту за наличные UAH, USD, EUR"
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
            title="Купить биткоин и другую крипту наличными"
          />
        </StyledBreadcrumb>
        <StaticSeoContent>
          <StyledParagraph>
            Обмен btc наличные – это сравнительно новое направление обмена в Украине. Никаких банковских операций,
            верификаций и ожиданий – купить биткоин за наличные при личной встрече в предварительно оговоренном месте –
            это очень удобно и просто!
          </StyledParagraph>
          <StyledParagraph>
            Обмен криптовалют на наличные по выгодному курсу доступен на сайте Coin24.com.ua. Вы можете обменять самые
            популярные криптовалюты, как: Bitcoin (BTC), Litecoin (LTC), Dash (DASH), Ethereum (ETH), Ethereum Classic
            (ETS), Tether (USDT) - TRC20/ ERC20/ OMNI, Bitcoin Cash (BCH), Waves и другие криптовалюты. А если какой-то
            из криптовалют нет в нашем списке, Вы можете связаться с администрацией сайта и мы закажем крипту специально
            для Вас.
          </StyledParagraph>
          <StyledBlockTitle>
            Обмен Bitcoin на наличные
          </StyledBlockTitle>
          <StyledParagraph>
            Чтобы купить биткоин с помощью налички, Вам потребуется перейти на Главную страницу сайта Coin24 и оформить
            заявку на обмен крипты на наличные или в обратном направлении. Обязательно укажите какую криптовалюту и в
            каком количестве Вы хотите купить или продать. После оформления Вашей заявки, наш обменник автоматически
            определит получаемую сумму в выбранной Вами валюте (гривна, доллары, евро). Если Вы подтвердите данную
            транзакцию, с Вами свяжется менеджер для согласования деталей транзакции. Ввод или вывод биткоин на наличные
            через сервис Coin24 происходит при личной встрече с нашим менеджером, который свяжется с Вами после создания
            заявки через сайт и уточнит все необходимые детали.
          </StyledParagraph>
          <StyledParagraph>
            Вывод крипты на наличку, как и покупка btc совершаются на нашем сервисе по минимальной комиссии, которая
            значительно ниже, чем в других аналогичных обменниках и биржах. Стоит учитывать, что размер комиссии сервиса
            зависит от выбранной криптовалюты, а также от суммы обмена. Стоимость окончательной суммы предварительно
            обсуждается с Вами для согласования. Для Вашего удобства мы создали на сайте Coin24.com онлайн калькулятор
            криптовалюты, с помощью которого Вы всегда можете рассчитать необходимую Вам сумму и увидеть % комиссионных.
            Однако, никогда не забывайте: курс криптовалют крайне волатилен и может поддаваться колебаниям ежеминутно.
          </StyledParagraph>
          <StyledBlockTitle>
            Bitcoin купить за наличные – города Украины
          </StyledBlockTitle>
          <StyledParagraph>
            Продать и купить крипту за наличку через сервис Coin24 можно в 32-х городах Украины:{" "}
            <NavLink to="/city/obmen-kriptovaljut-belaja-cerkov" className="default-link">Белая Церковь</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-vinnica" className="default-link">Винница</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-dnepr" className="default-link">Днепр</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-doneck" className="default-link">Донецк</NavLink>,{" "}
            <NavLink to="/city/obmen-krpitovaljut-zhitomir" className="default-link">Житомир</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-zaporozhe" className="default-link">Запорожье</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-ivano-frankovsk" className="default-link">Ивано-Франковск</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-kiev" className="default-link">Киев</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-kolomyja" className="default-link">Коломыя</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-kramatorsk" className="default-link">Краматорск</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-kropivnickij" className="default-link">Кропивницкий</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-lugansk" className="default-link">Луганск</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-luck" className="default-link">Луцк</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-lvov" className="default-link">Львов</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-mariupol" className="default-link">Мариуполь</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-mukachevo" className="default-link">Мукачево</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-nikolaev" className="default-link">Николаев</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-odessa" className="default-link">Одесса</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-poltava" className="default-link">Полтава</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-rovno" className="default-link">Ровно</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-svetlovodsk" className="default-link">Светловодск</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-krym" className="default-link">Симферополь</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-sumy" className="default-link">Сумы</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-ternopol" className="default-link">Тернополь</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-uzhgorod" className="default-link">Ужгород</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-harkov" className="default-link">Харьков</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-herson" className="default-link">Херсон</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-hmelnickij" className="default-link">Хмельницкий</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-chervonograd" className="default-link">Червоноград</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-cherkassy" className="default-link">Черкассы</NavLink>,{" "}
            <NavLink to="/city/obmen-kriptovaljut-chernigov" className="default-link">Чернигов</NavLink>{" "}
            и <NavLink to="/city/obmen-kriptovaljut-chernovcy" className="default-link">Черновцы</NavLink>.
          </StyledParagraph>
          <StyledParagraph>
            Если Вам необходима помощь в работе с нашим сервисом или возникли любые другие вопросы, обращайтесь в службу
            технической поддержки. Наш сайт автоматический, поэтому обрабатывает заявки 24/7, график работы менеджеров:
            ежедневно, с 08:00 до 00:00.
          </StyledParagraph>
          <StyledBlockTitle>
            Преимущества работы с Coin24:
          </StyledBlockTitle>
          <StyledList>
            <li>
              Многоуровневая система защиты, надежность.
            </li>
            <li>
              Самые актуальные и выгодные курсы мировых бирж.
            </li>
            <li>
              Автоматический и быстрый современный ресурс, обмен 24/7, без перерывов и выходных.
            </li>
            <li>
              Согласование с Вами условий обмена.
            </li>
            <li>
              Двухуровневая реферальная программа от привлеченных рефералов, а также кэшбэк от совершенных обменных
              операций.
            </li>
            <li>
              Соблюдение строгой конфиденциальности.
            </li>
            <li>
              Широкий выбор платежных систем для обмена.
            </li>
            <li>
              Всегда в доступе достаточная сумма на резервном счете, а если все таки его будет недостаточно, напишите
              администраторам сайте, которые помогут решить этот вопрос.
            </li>
            <li>
              Выгодное партнерство.
            </li>
          </StyledList>
          <StyledParagraph>
            Сервис Coin24 предоставляет услуги на финансовом рынке Украины с 2011 года. Состоянием на 2021 год, сервисом
            воспользовалось более 10000 клиентов. А многочисленные положительные <NavLink to="/reviews" className="default-link">отзывы</NavLink> о нас на просторах Интернета
            говорят о нашей надежности и отличной репутации.
          </StyledParagraph>
        </StaticSeoContent>
        <DirectionsRates paymentSystem="Cash" currency="UAH" />
      </StaticSeoPageWrapper>
    </StyledContainer>
  );
};

export default React.memo(CashToCrypto);