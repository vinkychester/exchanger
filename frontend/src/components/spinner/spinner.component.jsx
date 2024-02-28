import React from 'react';
import { css } from "@emotion/core";
import { BarLoader, MoonLoader, PulseLoader, RingLoader, ScaleLoader } from 'react-spinners';

const Spinner = ({size, color, display, type, margin}) => {

  const override = css`
    display: ${display};
    margin: ${margin ? margin : '15px auto'};
`;

  switch (type) {
    case 'boardLoader' :
      return <BarLoader css={override} size={size} color={color} loading={true}/>;
    case 'scaleLoader' :
      return <ScaleLoader css={override} size={size} color={color} loading={true}/>;
    case 'pulseLoader' :
      return <PulseLoader css={override} size={size} color={color} loading={true}/>;
    case 'moonLoader' :
      return <MoonLoader css={override} size={size} color={color} loading={true}/>;
    default :
      return <RingLoader css={override} size={size} color={color} loading={true}/>;
  }
};

export default Spinner;