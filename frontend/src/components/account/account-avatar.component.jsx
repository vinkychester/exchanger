import React, { useCallback, useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import AvatarSkeleton from "./skeleton/avatar-skeleton.component";
import AccountUpdateToken from "./account-update-token";

import { StyledUserAvatar } from "../../pages/account/styled-account";

import { UPLOAD_MEDIA_OBJECT } from "../../graphql/queries/media.query";
import { UserAccountContext } from "../../pages/account/account.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { parseApiErrors } from "../../utils/response";

const AccountAvatar = ({ userRole }) => {
  const { user } = useContext(UserAccountContext);
  const { firstname, lastname, mediaObject } = user;

  const [image, setImage] = useState(mediaObject ? mediaObject.base64 : "");
  const [errorMessage, setErrorMessage] = useState("");

  const [uploadMediaObject, { loading }] = useMutation(UPLOAD_MEDIA_OBJECT, {
    onCompleted: () => {
      setErrorMessage("");
      closableNotificationWithClick("Изображение сохранено", "success");
    },
    onError: ({ graphQLErrors }) =>
      setErrorMessage(parseApiErrors(graphQLErrors)),
  });

  const onImageSelect = useCallback((event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event) => {
        const { result } = event.target;
        setImage(result)
        uploadMediaObject({
          variables: { mediaFile: result },
        });
      };
      reader.readAsDataURL(event.target.files[0]); // convert to base64 string
    }
  }, [uploadMediaObject]);

  if (loading)
    return <AvatarSkeleton firstname={firstname} lastname={lastname} loading />;

  return (
    <StyledUserAvatar>
      {image ? (
        <div className="user-image">
          <LazyLoadImage
            src={image} alt="profile image" />
        </div>
      ) : (
        <AvatarSkeleton firstname={firstname} lastname={lastname} />
      )}
      <label htmlFor="upload" className="user-edit-image">
        <span>Изменить фото</span>
        <input
          id="upload"
          name={"avatar"}
          type="file"
          accept="image/*"
          onChange={onImageSelect}
        />
      </label>
      {errorMessage && errorMessage}
      {userRole === "manager" && (
        <AccountUpdateToken />
      )}
    </StyledUserAvatar>
  );
}

export default AccountAvatar;
