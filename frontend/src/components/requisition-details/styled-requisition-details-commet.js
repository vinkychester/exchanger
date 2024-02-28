import styled from "styled-components";

export const StyledRequisitionDetailsCommentWrapper = styled.div`
  margin-top: 30px;
  .comment-field {
    label {
      font-size: 14px;
      opacity: 0.4;
    }
  }
`;

export const StyledRequisitionDetailsCommentItem = styled.div`
  padding: 10px 15px 15px 15px;
  text-align: left;
  display: flex;
  flex-direction: column;
  background-color: ${({theme}) => theme.hoverColor};
  border-radius: 5px;
  position: relative;
  word-wrap: break-word;
  &:before {
    content: '';
    width: 0;
    height: 0;
    bottom: -5px;
    border: 5px solid;
    border-color: ${({theme})=> `${theme.hoverColor} transparent transparent ${theme.hoverColor}`};
    position: absolute;
    left: 0;
  }
  .comment-item__head {
    padding-bottom: 5px;
    color: ${({theme}) => theme.defaultColor};
    font-size: 11px;
    opacity: 0.55;
  }
`
