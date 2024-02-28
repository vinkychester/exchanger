import React from "react";
import { useApolloClient } from "@apollo/react-hooks";

import Can from "../../components/can/can.component";
import FeedbackDetailContainer from "../../components/feedback/detail/feedback-detail.container.component";
import ForbiddenPage from "../forbidden/forbidden.component";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { feedbacks } from "../../rbac-consts";

const FeedbackDetailsPage = ({ match }) => {
  const client = useApolloClient();
  const { id } = match.params;

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={feedbacks.DETAILS}
      yes={() => <FeedbackDetailContainer id={id} />}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(FeedbackDetailsPage);
