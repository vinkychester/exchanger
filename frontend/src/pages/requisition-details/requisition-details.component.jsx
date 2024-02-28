import React, { useEffect } from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import AlertMessage from "../../components/alert/alert.component";
import RequisitionDetails from "../../components/requisition-details/requisition-details.component";
import PageSpinner from "../../components/spinner/page-spinner.component";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_REQUISITION_DETAILS } from "../../graphql/queries/requisition.query";
import { requisition } from "../../rbac-consts";
import { mercureUrl, parseUuidIRI } from "../../utils/response";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledRequisitionDetailsWrapper } from "../../components/requisition-details/styled-requisition-details";

const RequisitionDetailsPage = ({ match }) => {
  const clientApollo = useApolloClient();
  const abortController = new AbortController();

  const { signal } = abortController;
  const { id } = match.params;

  const { userRole, userId, managerCity } = clientApollo.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { loading, error, data, refetch } = useQuery(GET_REQUISITION_DETAILS, {
    variables: {
      id: "/api/requisitions/" + id,
      isManager: "client" !== userRole
    },
    context: { fetchOptions: { signal }},
    fetchPolicy: "network-only"
  });

  mercureUrl.searchParams.append("topic", `http://coin24/callback/${id}`);
  mercureUrl.searchParams.append("topic", `http://coin24/invoice/${id}`);

  useEffect(() => {
    const eventSource = new EventSource(mercureUrl);
    eventSource.onmessage = (event) => {
      refetch({
        variables: {
          id: "/api/requisitions/" + id,
          isManager: "client" !== userRole && "manager" !== userRole,
        },
        context: { fetchOptions: { signal }},
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);
  
  useEffect(() => {
    if (data) {
      const { detailsQueryRequisition } = data;
      if (detailsQueryRequisition.length !== 0) {
        const { client, pair } = detailsQueryRequisition;
        const { payment, payout } = pair;
        const isCash =
          "CASH" === payment.paymentSystem.subName ||
          "CASH" === payout.paymentSystem.subName;
        // set verification link
        if (!isCash && client.verificationInfo.link && "client" === userRole)
          localStorage.setItem(
            "verificationLink" + userId,
            client.verificationInfo.link
          );
        else localStorage.removeItem("verificationLink" + userId);
      }
    }

    return () => {
      abortController.abort();
    };
  }, [data]);

  if (loading) return <PageSpinner />;
  if (error) return (
    <StyledContainer>
      <AlertMessage type="error" message={error.message} />
    </StyledContainer>
  );
  if (!data) return (
    <StyledContainer>
      <AlertMessage type="warning" message="Not found." />
    </StyledContainer>
  );

  const { exchangePoint, client, manager, ...props } = data.detailsQueryRequisition;

  let permissions = {};

  switch (userRole) {
    case "client":
      permissions = { userId, ownerId: parseUuidIRI(client.id) };
      break;
    case "manager":
      permissions = { exchangePoint, managerCity, managerId: userId, requisitionManagerId: manager ? manager.id : "" };
      break;
  }

  return (
    <Can
      role={userRole}
      perform={requisition.READ_DETAILS}
      data={permissions}
      yes={() => (
        <StyledContainer>
          <StyledRequisitionDetailsWrapper>
            <RequisitionDetails client={client} manager={manager} exchangePoint={exchangePoint} {...props} />
          </StyledRequisitionDetailsWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(RequisitionDetailsPage);
