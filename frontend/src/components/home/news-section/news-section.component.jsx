import React from "react";

import NewsActualItem from "../../news/news-actual-item.component";
import Title from "../../title/title.component";
import NewsActualSkeleton from "../../news/skeleton/news-actual-item-skeleton";
import AlertMessage from "../../alert/alert.component";

import { useQuery } from "@apollo/react-hooks";
import { GET_POSTS_USER_ACTUAL } from "../../../graphql/queries/posts.query";

import { StyledNewsSection } from "./styled-news-section";
import { StyledContainer } from "../../styles/styled-container";

const NewsSectionComponent = () => {

  const { data: actualPosts, loading: loadingActual, error: errorActual } = useQuery(GET_POSTS_USER_ACTUAL,
    {
      variables: {
        "itemsPerPage": 3
      }
    });
  
  return (
    <StyledNewsSection>
      <StyledContainer wrapper="content">
        <Title
          as="div"
          title="Полезные статьи"
          description="Новости"
          className="home-news-section__title"
        />

        {loadingActual ?
          <div className="home-news-section__content">
            <NewsActualSkeleton />
          </div> :
          !actualPosts?.posts.collection.length ?
            <AlertMessage
              type="warning"
              message="Статьи отсутствуют."
              margin="20px 0"
            /> :
            <div className="home-news-section__content">
              {actualPosts?.posts.collection.map((post, index) => {
                if (index < 3) {
                  return <NewsActualItem
                    key={index}
                    post={post}
                  />;
                }
              })}
            </div>}
      </StyledContainer>
    </StyledNewsSection>
  );
};

export default NewsSectionComponent;