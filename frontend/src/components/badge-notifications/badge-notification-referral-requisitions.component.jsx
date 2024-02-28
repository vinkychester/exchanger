import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { mercureUrl } from "../../utils/response";
import { StyledBadgeNotification } from "./styled-badge-notification";
import { GET_NEW_REQUISITIONS_COUNT } from "../../graphql/queries/payout-requisitions.query";

const BadgeNotificationReferralRequisitions = () => {
  const [count, setCount] = useState("");

  const { refetch } = useQuery(GET_NEW_REQUISITIONS_COUNT, {
    onCompleted: (data) => {
      if (data) {
        const { payoutRequisitions } = data;
        if (payoutRequisitions.length !== 0) {
          const { totalCount } = payoutRequisitions.paginationInfo;
          setCount(totalCount);
        }
      }
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only"
  });

  mercureUrl.searchParams.append("topic", "http://coin24/payout_requisitios");

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

export default BadgeNotificationReferralRequisitions;