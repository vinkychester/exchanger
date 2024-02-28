import React  from "react";

import { StyledChristmasGarland } from "./styled-christmas-garland";

const ChristmasGarland = ({light}) => {

  return (
    <StyledChristmasGarland light={light}>
      <ul className="lightrope">
        {Array.from(new Array(42)).map(() => (
          <li key={Math.random()} />
        ))}
      </ul>
    </StyledChristmasGarland>
  );
};

export default ChristmasGarland;