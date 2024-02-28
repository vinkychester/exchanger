import React from "react";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";

import {
  StyledCookieMessageAction,
  StyledCookieMessageContainer,
  StyledCookieMessageContent,
  StyledCookieMessageWrapper,
} from "./styled-cookie-message";
import { StyledButton } from "../styles/styled-button";

const CookieMessage = ({ setCookie }) => {
  const isAgree = () => {
    Cookies.set("useterms", true, { expires: 365 });
    setCookie(true);
  };

  return (
    <StyledCookieMessageWrapper>
      <StyledCookieMessageContainer>
        <StyledCookieMessageContent>
          <p>
            Мы используем файлы cookies, чтобы улучшить быстродействие сайта.
            Используя этот сайт, вы даете согласие на использование файлов
            cookies.
          </p>
          <NavLink to="/useterms" target="_blank" className="default-link" rel="noreferrer">
            Пользовательское соглашение
          </NavLink>{" "}
          и{" "}
          <NavLink to="/privacy/ru" target="_blank" className="default-link" rel="noreferrer">
            Политика конфиденциальности
          </NavLink>
        </StyledCookieMessageContent>
        <StyledCookieMessageAction>
          <StyledButton color="main" weight="normal" onClick={isAgree}>
            Я согласен
          </StyledButton>
        </StyledCookieMessageAction>
      </StyledCookieMessageContainer>
    </StyledCookieMessageWrapper>
  );
};

export default CookieMessage;
