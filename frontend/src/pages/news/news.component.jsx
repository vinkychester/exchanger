import React from "react";
import { Helmet } from "react-helmet-async";
import Title from "../../components/title/title.component";
import NewsList from "../../components/news/news-list.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledNewsWrapper } from "../../components/news/styled-news";

export const PaginationContext = React.createContext({
  currentPage: 1,
  itemsPerPage: 10
});

const News = () => {

  return (
    <StyledContainer>
      <Helmet>
        <title>Самые актуальные новости из мира криптовалют и блокчейна - Coin24</title>
        <meta
          name="description"
          content="Здесь Вы можете прочитать самые актуальные новости о биткоине, технологии блокчейн и криптовалютах. Прогнозы, обзоры и курсы криптовалют"
        />
        <link rel="canonical" href={'https://' + window.location.hostname + '/news'} />
      </Helmet>
      <StyledNewsWrapper>
        <Title
          as="h1"
          title="Полезные статьи"
          description="Новости"
        />
        <NewsList />
      </StyledNewsWrapper>
    </StyledContainer>
  );
};

export default React.memo(News);


