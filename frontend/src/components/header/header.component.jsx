import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import Nav from "../navigation/nav.component";
import Logo from "../logo/logo.component";

import IS_LOGGED_IN from "../../graphql/queries/login.query";

import { StyledHeader, StyledHeaderContent, StyledHeaderWrapper } from "./styled-header";

const Header = ({ theme, toggleTheme }) => {

  // const [light, setLight] = useState(true);
  const [fixed, setFixed] = useState(false);

  const {
    data: { isLoggedIn }
  } = useQuery(IS_LOGGED_IN);

  let height = 50;
  let scrolled = 0;
  let ticking = false;

  const fixedHeader = (scrolled) => {
    if (scrolled > height) {
      setFixed(true)
    } else {
      setFixed(false)
    }
  }

  window.addEventListener('scroll', function(e) {
    scrolled = window.pageYOffset;

    if (!ticking) {
      window.requestAnimationFrame(function() {
        fixedHeader(scrolled);
        ticking = false;
      });
      ticking = true;
    }
  });

  return (
    <>
      {/*
        To add a Christmas garland, add the component and state "light" - <ChristmasGarland light={light} />.
      */}
      {/*<ChristmasGarland light={light} />*/}
      <StyledHeader id="header" fixed={fixed}>
        <StyledHeaderWrapper className="header__wrapper">
          <StyledHeaderContent className="header__content">
            <Logo fixed={fixed} />
            <Nav theme={theme} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} />
          </StyledHeaderContent>
        </StyledHeaderWrapper>
      </StyledHeader>
    </>
  );
};

export default Header;
