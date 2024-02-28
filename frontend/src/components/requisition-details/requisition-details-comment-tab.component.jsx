import React, { useContext, useState } from "react";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import Tooltip from "rc-tooltip";

import Can from "../can/can.component";
import TextAreaGroupComponent from "../input-group/textarea-group.component";

import { StyledTooltip } from "../styles/styled-tooltip";
import { StyledButton } from "../styles/styled-button";
import {
  StyledRequisitionDetailsCommentItem,
  StyledRequisitionDetailsCommentWrapper
} from "./styled-requisition-details-commet";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { UPDATE_REQUISITION_DETAILS } from "../../graphql/mutations/requisition.mutation";
import { GET_REQUISITION_DETAILS } from "../../graphql/queries/requisition.query";
import { RequisitionDetailsContext } from "./requisition-details.component";
import { parseApiErrors } from "../../utils/response";
import { requisition } from "../../rbac-consts";

const RequisitionDetailsCommentTab = ({ comment }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { requisitionId } = useContext(RequisitionDetailsContext);
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState({});

  const [ updateRequisitionDetails, { loading }] = useMutation(UPDATE_REQUISITION_DETAILS, {
    onError: ({ graphQLErrors }) => { setErrors(parseApiErrors(graphQLErrors)) },
  });

  const handleSaveComment = () => {
    updateRequisitionDetails({
      variables: {
        id: requisitionId,
        comment: value
      },
      refetchQueries: [
        {
          query: GET_REQUISITION_DETAILS,
          variables: {
            id: requisitionId,
            isManager: "client" !== userRole && "manager" !== userRole
          }
        }
      ]
    });
  };

  return (
    <>
      <Can
        role={userRole}
        perform={requisition.COMMENT_CREATE}
        yes={() =>
          !comment && (
            <StyledRequisitionDetailsCommentWrapper>
              <TextAreaGroupComponent
                name="comment"
                label={
                  <>
                    Примечание
                    <Tooltip
                      placement="top"
                      overlay="Комментарий к заявке, пожелания по обмену."
                    >
                      <StyledTooltip className="icon-question" />
                    </Tooltip>
                  </>}
                placeholder="Текст примечания"
                handleChange={(event) => setValue(event.target.value)}
                required="required"
                value={value}
                maxLength="3600"
                className="comment-field"
                errors={errors.comment}
              />
              <StyledButton
                type="button"
                weight="normal"
                // disabled={mutationLoading}
                color="main"
                onClick={handleSaveComment}
              >
                Отправить
              </StyledButton>
            </StyledRequisitionDetailsCommentWrapper>
          )
        }
      />
      {comment && (
        <StyledRequisitionDetailsCommentWrapper>
          <StyledRequisitionDetailsCommentItem>
            <div className="comment-item__head">Примечание:</div>
            {comment}
          </StyledRequisitionDetailsCommentItem>
        </StyledRequisitionDetailsCommentWrapper>
      )}
    </>
  );
};

export default RequisitionDetailsCommentTab;
