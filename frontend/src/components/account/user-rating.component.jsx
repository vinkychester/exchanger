import React from "react";

const UserRating = ({ rating }) => {
  const generalLevel = 5;
  const ratingLevel = [];

  for (let i = 0; i < generalLevel; i++) {
    if (i < rating) {
      ratingLevel.push(<span className="icon-star-solid" key={i} />);
    } else {
      ratingLevel.push(<span className="icon-star-regular" key={i} />);
    }
  }
  return ratingLevel;
};

export default UserRating;
