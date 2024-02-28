import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";

import AlertMessage from "../alert/alert.component";
import PageSpinner from "../spinner/page-spinner.component";
import NewsForm from "./news-form.component";

import { GET_POST } from "../../graphql/queries/posts.query";
import { UPDATE_POST } from "../../graphql/mutations/post.mutation";

import { parseApiErrors } from "../../utils/response";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { convertDateFromDatePickerToTimestamp } from "../../utils/datetime.util";

const NewsEditForm = ({ match }) => {
  const id = "/api/posts/" + match.params.id;
 
  const [errors, setErrors] = useState([]);
  const [newDate, setNewDate] = useState("");

  const [updatePost] = useMutation(UPDATE_POST, {
    onCompleted: () => {
      closableNotificationWithClick("Статья успешно сохранена!", "success");
      setErrors([]);
    },
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors)),
  });

  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id },
    fetchPolicy: "network-only"
  });
  
  const [postDetails, setPostDetails] = useState({
    title: "",
    link: null,
    content: "",
    description: "",
    author: "",
    metaTitle: "",
    metaDescription: "",
    metaUrl: "",
    imageUrl: "",
    imageContentUrl: "",
    imageDescription: "",
    createdAt: "",
    fileCropped: "",
    fileOriginal: "",
    pairUnits: []
  });

  useEffect(() => {
    if (data) {
      const { mediaObjects,pairUnits, ...props } = data.post;
      let path;
      if(mediaObjects[0]) path = mediaObjects[0].storage + "/" + mediaObjects[0].contentUrl;
      setPostDetails({
        link: null,
        fileCropped: mediaObjects.length ? path : "",
        pairUnits: pairUnits ? pairUnits.collection.map((Object) => {
          return Object.id;
        }) : [],
        ...props
      });
    }
  }, [data]);

  if (loading) return <PageSpinner />;
  if (error) return <AlertMessage type="error" message={error} />;

  const handleClick = () => {
    const { createdAt, link, lang, ...props } = postDetails;

    updatePost({
      variables: {
        id,
        post: link,
        lang: "ru-ru",
        createdAt: newDate
          ? convertDateFromDatePickerToTimestamp(newDate)
          : createdAt,
        ...props
      }
    });
  };


  return (
    <NewsForm
      postDetails={postDetails}
      setPostDetails={setPostDetails}
      errors={errors}
      handleClick={handleClick}
      formName="Редактировать"
      buttonName="Сохранить"
    />
  )
}

export default NewsEditForm;
