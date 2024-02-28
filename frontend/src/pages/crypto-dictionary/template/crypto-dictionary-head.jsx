import React from "react";

import {
  StyledDictionaryHeadItemCurrent,
  StyledDictionaryHeadItemList,
  StyledDictionaryItemHead
} from "../styled-crypto-dictionary";

const CryptoDictionaryHead = ({ current }) => {

  return (
    <StyledDictionaryItemHead>
      <StyledDictionaryHeadItemCurrent>
        {current}
      </StyledDictionaryHeadItemCurrent>
      <StyledDictionaryHeadItemList>
        <li className={`item ${current === "A" && "current"}`}>
          <a href="#A">A</a>
        </li>
        <li className={`item ${current === "B" && "current"}`}>
          <a href="#B">B</a>
        </li>
        <li className={`item ${current === "C" && "current"}`}>
          <a href="#C">C</a>
        </li>
        <li className={`item ${current === "D" && "current"}`}>
          <a href="#D">D</a>
        </li>
        <li className={`item ${current === "E" && "current"}`}>
          <a href="#E">E</a>
        </li>
        <li className={`item ${current === "F" && "current"}`}>
          <a href="#F">F</a>
        </li>
        <li className={`item ${current === "H" && "current"}`}>
          <a href="#H">H</a>
        </li>
        <li className={`item ${current === "I" && "current"}`}>
          <a href="#I">I</a>
        </li>
        <li className={`item ${current === "J" && "current"}`}>
          <a href="#J">J</a>
        </li>
        <li className={`item ${current === "L" && "current"}`}>
          <a href="#L">L</a>
        </li>
        <li className={`item ${current === "M" && "current"}`}>
          <a href="#M">M</a>
        </li>
        <li className={`item ${current === "N" && "current"}`}>
          <a href="#N">N</a>
        </li>
        <li className={`item ${current === "O" && "current"}`}>
          <a href="#O">O</a>
        </li>
        <li className={`item ${current === "P" && "current"}`}>
          <a href="#P">P</a>
        </li>
        <li className={`item ${current === "R" && "current"}`}>
          <a href="#R">R</a>
        </li>
        <li className={`item ${current === "S" && "current"}`}>
          <a href="#S">S</a>
        </li>
        <li className={`item ${current === "T" && "current"}`}>
          <a href="#T">T</a>
        </li>
        <li className={`item ${current === "W" && "current"}`}>
          <a href="#W">W</a>
        </li>
      </StyledDictionaryHeadItemList>
    </StyledDictionaryItemHead>
  );
};

export default CryptoDictionaryHead;