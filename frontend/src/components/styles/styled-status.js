import React from "react";
import styled from 'styled-components'
import { requisitionStatus } from "../../utils/requsition.status";

const status = {
  status: String
}

const changeStatus = (status) => {
  switch (status) {
    case 'ERROR' :
    case 'DISABLED' :
    case 'CANCELED':
      return `
        background: linear-gradient(40deg, #FF0000 30%, #FB4B6B 90%);
      `;
    case 'FINISHED':
      return `
        background: linear-gradient(40deg, #277661 -20%, #29be68 70%);
      `;
    default:
      return `
        background: linear-gradient(40deg, #FF7A00 30%, #efb442 90%);
      `;
  }
}

export const StyledStatus = styled('div', status)`
  min-width: 145px;
  padding: 2px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  border-radius: 5px;
  display: inline-grid;
  ${({status}) => changeStatus(status)};
`;

const RenderStatus = ({status}) => {
  return (
    <StyledStatus status={status}>
      {requisitionStatus(status)}
    </StyledStatus>
  )
}

export default RenderStatus;