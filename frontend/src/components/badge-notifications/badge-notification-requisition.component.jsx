import React, { useState, useEffect } from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { GET_NOT_SEEN_REQUISITIONS_COUNT } from "../../graphql/queries/requisition.query";
import { mercureUrl } from "../../utils/response";
import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";

import { StyledBadgeNotification } from "./styled-badge-notification";
import { requisitionStatusConst } from "../../utils/requsition.status";

const BadgeNotificationRequisition = () => {
  let permissions = {};
  const client = useApolloClient();

  const { userRole, managerCity } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [count, setCount] = useState("");

  switch (userRole) {
    case "manager":
      permissions = {exchangePoint_list: managerCity.length !== 0 ? managerCity : ""};
      break;
  }

  const { refetch } = useQuery(GET_NOT_SEEN_REQUISITIONS_COUNT, {
    variables: {
      status_list: [
        requisitionStatusConst.NEW,
        requisitionStatusConst.CARD_VERIFICATION,
        requisitionStatusConst.INVOICE,
        requisitionStatusConst.PROCESSED
      ],
      ...permissions
    },
    onCompleted: (data) => {
      if (data) {
        const { requisitions } = data;
        if (requisitions.length !== 0) {
          const { totalCount } = requisitions.paginationInfo;
          setCount(totalCount);
        }
      }
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only"
  });

  mercureUrl.searchParams.append("topic", "http://coin24/requisitios");

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
export default BadgeNotificationRequisition;
