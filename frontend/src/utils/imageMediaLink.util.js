const ImageMediaLink = (mediaObjects, index) => {

  if (mediaObjects.length === 0) return '';

  let a;
  if (index !== 0) {
    a = 1;
  } else {
    a = 0;
  }

  let { storage, contentUrl } = mediaObjects[a];

  if (!storage) return '';

  return "/files/original/post/content/" + storage + "/" + contentUrl;
};

export { ImageMediaLink };

