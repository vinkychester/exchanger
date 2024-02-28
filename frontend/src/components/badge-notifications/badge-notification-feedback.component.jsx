import React, { useState, useEffect } from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { GET_NEW_FEEDBACK_MESSAGE } from "../../graphql/queries/feedback.query";
import { mercureUrl } from "../../utils/response";
import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";

import { StyledBadgeNotification } from "./styled-badge-notification";

const BadgeNotificationFeedback = () => {
  let permissions = {};
  const client = useApolloClient();

  const { userRole, managerCity } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  switch (userRole) {
    case "manager":
      permissions = {citySearch: managerCity.length !== 0 ? managerCity : ""};
      break;
  }
  const [count, setCount] = useState("");
  const { refetch } = useQuery(GET_NEW_FEEDBACK_MESSAGE, {
    variables: {...permissions},
    onCompleted: (data) => {
      if (data) {
        const { feedbackMessages } = data;
        const { totalCount } = feedbackMessages.paginationInfo;
        setCount(totalCount);
      }
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only"
  });

  mercureUrl.searchParams.append("topic", "http://coin24/feedbacks");

  useEffect(() => {
    const eventSource = new EventSource(mercureUrl);
    eventSource.onmessage = () => {
      refetch();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (count <= 0) return null

  return (
    <StyledBadgeNotification>
      {count}
    </StyledBadgeNotification>
  );
};
export default BadgeNotificationFeedback;
