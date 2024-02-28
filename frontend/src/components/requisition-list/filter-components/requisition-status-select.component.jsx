import React from "react";
import Select, { Option } from "rc-select";
import { useApolloClient } from "@apollo/react-hooks";

import {
  StyledSelect,
  StyledSelectLabel,
} from "../../styles/styled-img-select";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import {
  requisitionStatusConst,
  requisitionStatusArray,
  requisitionStatus,
} from "../../../utils/requsition.status";

const RequisitionStatusSelect = ({ value, handleChangeFilter }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const name = "status";
  const style = {
    textTransform: "inherit",
  };

  return (
    <StyledSelect className="input-group">
      <StyledSelectLabel as="label">Статус:</StyledSelectLabel>
      <Select
        // mode="tags"
        // className="custom-select custom-multiselect"
        className="custom-select"
        name={name}
        id={name}
        value={value ? value : null}
        onChange={(value) => handleChangeFilter(name, value)}
      >
        <Option value={null}>
          <div className="option-select-item" style={style}>
            Все
          </div>
        </Option>
        {userRole !== "client" && (
          <Option value={requisitionStatusArray.NOT_PROCESSING}>
            <div className="option-select-item" style={style}>
              {requisitionStatus(requisitionStatusArray.NOT_PROCESSING)}
            </div>
          </Option>
        )}
        <Option value={requisitionStatusConst.NEW}>
          <div className="option-select-item" style={style}>
            {requisitionStatus(requisitionStatusConst.NEW)}
          </div>
        </Option>
        {<Option value={requisitionStatusArray.PROCESSING}>
          <div className="option-select-item" style={style}>
            {requisitionStatus(requisitionStatusArray.PROCESSING)}
          </div>
        </Option>}
        <Option value={requisitionStatusConst.PROCESSED}>
          <div className="option-select-item" style={style}>
            {requisitionStatus(requisitionStatusConst.PROCESSED)}
          </div>
        </Option>
        <Option value={requisitionStatusConst.CARD_VERIFICATION}>
          <div className="option-select-item" style={style}>
            {requisitionStatus(requisitionStatusConst.CARD_VERIFICATION)}
          </div>
        </Option>
        <Option value={requisitionStatusConst.FINISHED}>
          <div className="option-select-item" style={style}>
            {requisitionStatus(requisitionStatusConst.FINISHED)}
          </div>
        </Option>
        <Option value={requisitionStatusConst.CANCELED}>
          <div className="option-select-item" style={style}>
            {requisitionStatus(requisitionStatusConst.CANCELED)}
          </div>
        </Option>
        <Option value={requisitionStatusConst.DISABLED}>
          <div className="option-select-item" style={style}>
            {requisitionStatus(requisitionStatusConst.DISABLED)}
          </div>
        </Option>
        <Option value={requisitionStatusConst.ERROR}>
          <div className="option-select-item" style={style}>
            {requisitionStatus(requisitionStatusConst.ERROR)}
          </div>
        </Option>
        <Option value={requisitionStatusArray.REFUND}>
          <div className="option-select-item" style={style}>
            Возврат средств
          </div>
        </Option>
        {/*<Option value={requisitionStatusConst.PENDING}>*/}
        {/*  <div className="option-select-item" style={style}>*/}
        {/*  {requisitionStatus(requisitionStatusConst.PENDING)}*/}
        {/*  </div>*/}
        {/*</Option>*/}
      </Select>
    </StyledSelect>
  );
};

export default RequisitionStatusSelect;
