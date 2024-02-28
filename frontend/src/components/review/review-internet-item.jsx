import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ReviewsFromInternetItem = ({ link, image, alt }) => {
  return (
    <a
      href={link}
      target="_blank"
      className="reviews-internet-content__item"
      rel="noreferrer"
    >
      <LazyLoadImage
        src={image}
        alt={alt} />
    </a>
  );
};

export default ReviewsFromInternetItem;