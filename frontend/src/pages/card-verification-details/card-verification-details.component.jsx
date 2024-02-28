import React from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import AlertMessage from "../../components/alert/alert.component";
import PageSpinner from "../../components/spinner/page-spinner.component";
import CardVerificationDetails from "../../components/card-verification-details/card-verification-details.component";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_CREDIT_CARD_DETAILS } from "../../graphql/queries/credit-card.query";
import { cardVerification } from "../../rbac-consts";
import { parseUuidIRI } from "../../utils/response";

const CardVerificationDetailsPage = ({ match }) => {
  const clientApollo = useApolloClient();
  const { id } = match.params;

  const { userId, userRole } = clientApollo.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { loading, error, data } = useQuery(GET_CREDIT_CARD_DETAILS, {
    variables: { id: `/api/credit_cards/${id}` },
    fetchPolicy: "network-only",
  });

  if (loading) return <PageSpinner />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { client, ...props } = data.creditCard;

  let permissions = {};

  if ("client" === userRole)
    permissions = { userId, ownerId: parseUuidIRI(client.id) };

  return (
    <Can
      role={userRole}
      perform={cardVerification.READ_DETAILS}
      data={permissions}
      yes={() => <CardVerificationDetails client={client} {...props} />}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(CardVerificationDetailsPage);
