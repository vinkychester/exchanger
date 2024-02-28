import React, { useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import VisibilitySensor from "react-visibility-sensor";
import CountUp from "react-countup";

import { StyledCounterItem } from "./styled-num-counter-section";

const NumCounterItem = ({ top, bottom, endCount, countSuffix, img, alt, animation }) => {

  const [countUp, setCountUp] = useState(false);

  const visibilityChange = (isVisible) => {
    if (isVisible) {
      setCountUp(true);
    }
  };

  return (
    <StyledCounterItem
      className="home-about-counter-item counter-item"
      animation={animation}
    >
      <div className="counter-item__top">
        {top}
      </div>
      <div className="counter-item__center">
        <div className="counter-item__num">
          <div className="counter-item__img">
            <LazyLoadImage
              src={img}
              alt={alt} />
          </div>
          <VisibilitySensor
            onChange={visibilityChange}
            offset={{ top: 10 }}
          >
            <CountUp
              start={0}
              end={countUp ? endCount : 0}
              duration={5}
              suffix={countSuffix}
            />
          </VisibilitySensor>
        </div>
      </div>
      <div className="counter-item__bottom">
        {bottom}
      </div>
    </StyledCounterItem>
  );
};

export default NumCounterItem;