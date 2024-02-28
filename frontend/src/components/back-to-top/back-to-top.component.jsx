import React, { useState } from "react";
import { animateScroll as scroll } from "react-scroll";

import { StyledBackToTop, StyledUfoImage } from "./styled-back-to-top";

const BackToTopButton= () => {

  const [show, setShow] = useState(false);

  const trackScroll = () => {
    let scrolled = window.pageYOffset;
    let height = document.documentElement.clientHeight;

    if (scrolled > height) {
      setShow(true);
    }
    if (scrolled < height) {
      setShow(false);
    }
  };

  window.addEventListener("scroll", trackScroll);

  return (
    <StyledBackToTop show={show} onClick={scroll.scrollToTop} title="Вверх">
      <StyledUfoImage/>
    </StyledBackToTop>
  );
};

export default BackToTopButton;