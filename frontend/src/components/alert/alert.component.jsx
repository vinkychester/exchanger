import React from 'react';

import { StyledAlertWrapper } from './styled-alert';

const AlertMessage = ({message, type, margin, className, center}) => {
  return (
    <StyledAlertWrapper center={center} className={className} type={type} margin={margin}>
      <span>{message}</span>
    </StyledAlertWrapper>
  )
}

export default AlertMessage