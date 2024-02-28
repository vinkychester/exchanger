import React, { useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Cropper from "react-cropper";

import Can from "../can/can.component";
import AlertMessage from "../alert/alert.component";
import SkeletonImage from "../skeleton/skeleton-image";

import { StyledNewsImageWrapper } from "./styled-admin-news";
import { StyledButton } from "../styles/styled-button";

import "cropperjs/dist/cropper.css";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { posts } from "../../rbac-consts";

const NewsImageContainer = ({ postDetails, setPostDetails }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [image, setImage] = useState();
  const [cropper, setCropper] = useState();

  const onChangeImage = (event) => {
    event.preventDefault();
    let files;
    if (event.dataTransfer) {
      files = event.dataTransfer.files;
    } else if (event.target) {
      files = event.target.files;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(files[0]);
  };

  const handleSubmitImage = (event) => {
    event.preventDefault();
    setPostDetails((prevState) => ({
      ...prevState,
      fileCropped: cropper.getCroppedCanvas().toDataURL(),
      fileOriginal: image,
    }));
    setImage(null);
    closableNotificationWithClick("Изображение сохранено", "success");
  };

  const getUploadButton = () => {
    return (
      <>
        <AlertMessage
          type="info"
          message="Рекомендуемая ширина: от 1200px"
          margin="15px 0"
        />
        <StyledButton
          as="label"
          htmlFor="upload"
          color="info"
          weight="normal"
          className="news-image__button"
        >
          <span>Изменить изображение</span>
          <input
            id="upload"
            type="file"
            accept="image/*"
            onChange={onChangeImage}
          />
        </StyledButton>
        {image && (
          <div className="news-image__cropper">
            <Cropper
              src={image}
              initialAspectRatio={1}
              aspectRatio={1110 / 460}
              viewMode={1}
              guides={true}
              background={false}
              responsive={true}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              // autoCropArea={1}
              checkOrientation={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
            />
            <StyledButton
              color="success"
              weight="normal"
              onClick={handleSubmitImage}
            >
              Сохранить изображение
            </StyledButton>
          </div>
        )}
      </>
    );
  };

  if (!postDetails.fileCropped)
    return (
      <StyledNewsImageWrapper>
        <div className="news-image">
          <SkeletonImage />
        </div>
        {getUploadButton()}
      </StyledNewsImageWrapper>
    );

  return (
    <StyledNewsImageWrapper>
      <div className="news-image">
        {postDetails.fileCropped.length > 50 ? (
          <LazyLoadImage
            src={postDetails.fileCropped}
            alt={postDetails.imageDescription} />
        ) : (
          <LazyLoadImage
            src={"/files/original/post/content/" + postDetails.fileCropped}
            alt={postDetails.imageDescription} />
        )}
      </div>
      <Can
        role={userRole}
        perform={posts.WRITE}
        yes={() => getUploadButton()}
      />
    </StyledNewsImageWrapper>
  );
};

export default NewsImageContainer;
