import React from "react";
import { NavLink } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";

import { StyledNewsActualItem } from "./styled-news";

import { TimestampToDateWithoutTime } from "../../utils/timestampToDate.utils";

const NewsActualItem = ({ post }) => {
  const detailsLink = "/news/" + post.metaUrl;
  return (
    <StyledNewsActualItem className="actual-news">
      <div className="actual-news__head">
        <h3>
          <NavLink to={detailsLink}>
            {post.title}
          </NavLink>
        </h3>
      </div>
      <div className="actual-news__body">
        {ReactHtmlParser(post.description)}
      </div>
      <div className="actual-news__footer">
        <p className="actual-news__date">{TimestampToDateWithoutTime(post.createdAt)}</p>
        <NavLink to={detailsLink} className="actual-news__action default-link">
          Читать...
        </NavLink>
      </div>
    </StyledNewsActualItem>
  );
};

export default NewsActualItem;
