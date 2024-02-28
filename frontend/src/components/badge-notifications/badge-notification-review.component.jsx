import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_NEW_REVIEW } from "../../graphql/queries/review.query";
import { mercureUrl } from "../../utils/response";

import { StyledBadgeNotification } from "./styled-badge-notification";

const BadgeNotificationReview = () => {
  const [count, setCount] = useState("");
  const { refetch } = useQuery(GET_NEW_REVIEW, {
    onCompleted: (data) => {
      if (data) {
        const { reviews } = data;
        const { totalCount } = reviews.paginationInfo;
        setCount(totalCount);
      }
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only"
  });

  mercureUrl.searchParams.append("topic", "http://coin24/review");

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
export default BadgeNotificationReview;
