import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import SkeletonImage from "../skeleton/skeleton-image";

const ImageMedia = ({ alt, mediaObjects, index }) => {
  if (mediaObjects.length === 0) return <SkeletonImage />;
  let a;
  if (index !== 0) {
    a = 1;
  } else {
    a = 0;
  }

  let { storage, contentUrl } = mediaObjects[a];

  if (!storage) return <SkeletonImage />;
  return (
    <LazyLoadImage
      src={"/files/original/post/content/" + storage + "/" + contentUrl}
      alt={alt}
    />
  );
};

export default ImageMedia;
