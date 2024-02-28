import React from "react";
import SkeletonInput from "../../skeleton/skeleton-input";
import LoadButton from "../../spinner/button-spinner.component";
import SkeletonImage from "../../skeleton/skeleton-image";

import { StyledNewsContainer, StyledNewsItem, StyledNewsItemImage, StyledNewsItemInfo } from "../styled-news";
import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";
import { StyledSkeletonNewsList } from "./styled-skeleton-news";

const NewsItemSkeleton = () => {
  return (
    <StyledSkeletonNewsList>
      <SkeletonInput className="skeleton-news__search" label="Поиск" />
      <StyledNewsContainer>
        {Array.from(new Array(10)).map(() => (
          <StyledNewsItem key={Math.random()} className="news-item">
            <StyledNewsItemInfo className="news-item__info article">
              <div className="article__date">
                <StyledSkeletonBg
                  as="span"
                  color="theme"
                  height="19"
                  width="15"
                />
              </div>
              <div className="article__content">
                <div className="article__title skeleton-news__title">
                  <h3>
                    <StyledSkeletonBg
                      as="span"
                      color="theme"
                      height="22"
                    />
                    <StyledSkeletonBg
                      as="span"
                      color="theme"
                      height="22"
                      width="35"
                    />
                  </h3>
                </div>
                <div className="article__description skeleton-news__description">
                  <StyledSkeletonBg
                    as="span"
                    color="theme"
                    height="15"
                  />
                  <StyledSkeletonBg
                    as="span"
                    color="theme"
                    height="15"
                  />
                  <StyledSkeletonBg
                    as="span"
                    color="theme"
                    height="15"
                    width="25"
                  />
                </div>
              </div>
              <div className="article__action">
                <LoadButton
                  color="main"
                  className="article__details-btn"
                  text="Читать"
                />
              </div>
            </StyledNewsItemInfo>
            <StyledNewsItemImage className="news-item__image">
              <SkeletonImage />
            </StyledNewsItemImage>
          </StyledNewsItem>))}
      </StyledNewsContainer>
    </StyledSkeletonNewsList>
  );
};

export default NewsItemSkeleton;