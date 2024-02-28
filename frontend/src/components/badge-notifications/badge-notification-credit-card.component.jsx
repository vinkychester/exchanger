import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_NOT_VERIFIED_CREDIT_CARD } from "../../graphql/queries/credit-card.query";
import { mercureUrl } from "../../utils/response";

import { StyledBadgeNotification } from "./styled-badge-notification";

const BadgeNotificationCreditCard = () => {
  const [count, setCount] = useState("");
  const { refetch } = useQuery(GET_NOT_VERIFIED_CREDIT_CARD, {
    onCompleted: (data) => {
      if (data) {
        const { creditCards } = data;
        const { totalCount } = creditCards.paginationInfo;
        setCount(totalCount);
      }
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only"
  });

  mercureUrl.searchParams.append("topic", "http://coin24/credit_card");

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
export default BadgeNotificationCreditCard;
