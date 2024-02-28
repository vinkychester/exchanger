import React, { useState } from "react";
import Tabs, { TabPane } from "rc-tabs";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import CopyInputComponent from "../../input-group/copy-input-group";

import { StyledReferralBanners } from "../styled-referral";
import { useQuery } from "@apollo/react-hooks";
import { GET_USER_LOYALTY_PROGRAM_DETAILS } from "../../../graphql/queries/user.query";

const ReferralBanners = ({ url, userUUID }) => {
  const [image, setImage] = useState(`${url}/referral/pic180_1.jpg`);
  const [current, setCurrent] = useState("180-1.jpg");
  const [token, setToken] = useState(null);

  const { loading } = useQuery(GET_USER_LOYALTY_PROGRAM_DETAILS, {
    variables: {
      userUUID: userUUID
    },
    onCompleted: data => {
      setToken(data.programLoyaltyClient.referralToken);
    }
  });

  const selectImage = (e) => {
    setImage(e.target.src);
    setCurrent(e.target.src.split("pic")[1]);
  };

  let htmlCode = `<a href="${url}/refToken=${token}"><img src="${image}" alt="Обмен криптовалют в coin24.com.ua"></a>`;
  let forumCode = "[URL=" + url + "/refToken=" + token + "][IMG]" + image + "[/IMG][/URL]";

  return (
    <StyledReferralBanners>
      <CopyInputComponent
        label="HTML баннер"
        value={htmlCode}
        readOnly
      />
      <CopyInputComponent
        label="Forum баннер"
        value={forumCode}
        readOnly
      />

      <p>
        Используйте любой ниже приведенный баннер для приглашения рефералов.
        Кликните по баннеру, для получения его кода для дальнейшего размещения на сайте или на форуме.
      </p>

      <Tabs
        defaultActiveKey="180"
        tabPosition="top"
        className="banners-tab"
      >
        <TabPane
          tab="180x150"
          key="180"
          className="image-container"
        >
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic180-1.jpg`}
              alt=""
              className={current === "180-1.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic180-2.jpg`}
              alt=""
              className={current === "180-2.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic180-3.jpg`}
              alt=""
              className={current === "180-3.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
        </TabPane>
        <TabPane
          tab="234x60"
          key="234"
          className="image-container"
        >
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic234-1.jpg`}
              alt=""
              className={current === "234-1.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic234-2.jpg`}
              alt=""
              className={current === "234-2.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic234-3.jpg`}
              alt=""
              className={current === "234-3.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
        </TabPane>
        <TabPane
          tab="250x250"
          key="250"
          className="image-container"
        >
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic250-1.jpg`}
              alt=""
              className={current === "250-1.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic250-2.jpg`}
              alt=""
              className={current === "250-2.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic250-3.jpg`}
              alt=""
              className={current === "250-3.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
        </TabPane>
        <TabPane
          tab="468x60"
          key="468"
          className="image-container"
        >
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic468-1.jpg`}
              alt=""
              className={current === "468-1.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic468-2.jpg`}
              alt=""
              className={current === "468-2.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic468-3.jpg`}
              alt=""
              className={current === "468-3.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
        </TabPane>
        <TabPane
          tab="728x90"
          key="728"
          className="image-container"
        >
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic728-1.jpg`}
              alt=""
              className={current === "728-1.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic728-2.jpg`}
              alt=""
              className={current === "728-2.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
          <div className="image-container__item">
            <LazyLoadImage
              src={`${url}/referral/pic728-3.jpg`}
              alt=""
              className={current === "728-3.jpg" ? 'image-container_current' : null}
              onClick={selectImage} />
          </div>
        </TabPane>
      </Tabs>
    </StyledReferralBanners>
  );
};

export default ReferralBanners;