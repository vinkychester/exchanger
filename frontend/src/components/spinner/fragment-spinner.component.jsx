import React from 'react';
import Spinner from './spinner.component';

import { StyledFragmentSpinner } from './styled-spinner';

const FragmentSpinner = ({position}) => {
  return (
    <StyledFragmentSpinner className="fragment-spinner" position={position}>
      <Spinner color="#EC6110" type="moonLoader" size="35px" />
    </StyledFragmentSpinner>
  );
};

export default FragmentSpinner;