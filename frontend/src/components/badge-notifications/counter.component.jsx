import React from "react";

import { StyledCounter } from "./styled-badge-notification";

const Counter = ({name, count}) => {

  return (
    <StyledCounter>Кол-во {name}: {count}</StyledCounter>
  )
}

export default Counter;