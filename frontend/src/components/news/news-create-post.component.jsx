import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import NewsForm from "./news-form.component";

import { CREATE_POST } from "../../graphql/mutations/post.mutation";
import { parseApiErrors } from "../../utils/response";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const NewsCreatePost = () => {
  const [errors, setErrors] = useState([]);

  const [postDetails, setPostDetails] = useState({
    title: "",
    link: null,
    lang: "ru-ru",
    content: null,
    description: null,
    author: null,
    metaTitle: null,
    metaDescription: null,
    metaUrl: "",
    imageDescription: null,
    fileCropped: "",
    fileOriginal: "",
    pairUnits: []
  });

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      closableNotificationWithClick("Новость успешно создана", "success");
      setErrors([]);
    },
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors)),
  });

  const handleClick = () => {
    const { link, ...props } = postDetails;
    createPost({
      variables: {
        linkPost: link ? "/api/parent_news/" + link.slice(11) : null,
        // lang: "ru-ru",
        ...props,
      },
    });
  };

  return (
    <NewsForm
      postDetails={postDetails}
      setPostDetails={setPostDetails}
      errors={errors}
      handleClick={handleClick}
      formName="Добавить"
      buttonName="Добавить статью"
    />
  );
};

export default NewsCreatePost;
