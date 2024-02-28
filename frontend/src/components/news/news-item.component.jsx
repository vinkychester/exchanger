import React from "react";
import { NavLink } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";

import ImageMedia from "../media/ImageMedia";
import AlertMessage from "../alert/alert.component";

import {
  StyledNewsItem,
  StyledNewsItemImage,
  StyledNewsItemInfo,
} from "./styled-news";
import { StyledButton } from "../styles/styled-button";

import { TimestampToDateWithoutTime } from "../../utils/timestampToDate.utils";

const NewsItem = ({ posts }) => {
  if (!posts.length)
    return (
      <AlertMessage
        type="warning"
        message="Статьи отсутствуют"
        margin="15px 0 0"
      />
    );

  return posts.map((post, index) => {
    const {
      id,
      createdAt,
      title,
      description,
      mediaObjects,
      imageDescription,
    } = post;

    let detailsLink = "/news/" + post.metaUrl;

    return (
      <StyledNewsItem key={id} className="news-item">
        <StyledNewsItemInfo className="news-item__info article">
          <div className="article__date">
            <p>{TimestampToDateWithoutTime(createdAt)}</p>
          </div>
          <div className="article__content">
            <div className="article__title">
              <h3>
                <NavLink to={detailsLink}>{title}</NavLink>
              </h3>
            </div>
            <div className="article__description">
              {ReactHtmlParser(description)}
            </div>
          </div>
          <div className="article__action">
            <StyledButton
              as={NavLink}
              to={detailsLink}
              color="main"
              className="article__details-btn"
            >
              Читать
            </StyledButton>
          </div>
        </StyledNewsItemInfo>
        <StyledNewsItemImage className="news-item__image">
          <NavLink to={detailsLink}>
            <ImageMedia alt={imageDescription} mediaObjects={mediaObjects} index={index}/>
          </NavLink>
        </StyledNewsItemImage>
      </StyledNewsItem>
    );
  });
};

export default NewsItem;
