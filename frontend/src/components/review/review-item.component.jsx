import React from "react";
import { TimestampToDate } from "../../utils/timestampToDate.utils";

import { StyledReviewsPost, StyledReviewsPostAuthor, StyledReviewsPostContent } from "./styled-reviews";

const ReviewItem = ({review}) => {

  return (
    <StyledReviewsPost>
      <StyledReviewsPostContent>
        {review.message}
      </StyledReviewsPostContent>
      <StyledReviewsPostAuthor>
        <h4>
          {review.client.firstname}
        </h4>
        <p>
          {TimestampToDate(review.createdAt)}
        </p>
      </StyledReviewsPostAuthor>
    </StyledReviewsPost>
  );

};

export default ReviewItem;
