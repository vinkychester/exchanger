import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ImageUploading from "react-images-uploading";

import { StyledVerificationCardImages } from "../card-verification-list/styled-verification-card";
import { StyledButton } from "../styles/styled-button";

const UploadFile = ({ handleChangeFiles, file }) => {
  return (
    <>
      <ImageUploading
        required
        value={file}
        onChange={handleChangeFiles}
        maxFileSize={5242880}
        dataURLKey="data_url"
        acceptType={["jpg", "png", "jpeg"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          errors
        }) => (
          <StyledVerificationCardImages>
            <div className="images__head">
              <StyledButton
                color="info"
                type="button"
                weight="normal"
                onClick={onImageUpload}
              >
                Загрузить фото
              </StyledButton>
              {errors && (
                <div className="images_errors">
                  <div>
                    {errors.maxFileSize && (
                      <span>Максимальний размер загружаємого изображения - 5 MB</span>
                    )}
                  </div>
                  <div>
                    {errors.acceptType && (
                      <span>Типы загружаемых изображений - jpg, png, jpeg </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="images__body">
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <LazyLoadImage
                    src={image["data_url"]} alt="" />
                  <div className="image-item__action">
                    <button
                      className="action-button action-button_update"
                      type="button"
                      onClick={() => onImageUpdate(index)}
                      title="Изменить"
                    >
                      <span className="icon-download-solid" />
                    </button>
                    <button
                      className="action-button action-button_remove"
                      type="button"
                      onClick={() => onImageRemove(index)}
                      title="Удалить"
                    >
                      <span className="icon-trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </StyledVerificationCardImages>
        )}
      </ImageUploading>
    </>
  );
};

export default UploadFile;