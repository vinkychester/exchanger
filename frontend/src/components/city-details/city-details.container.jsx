import React from "react";
import { useApolloClient } from "@apollo/react-hooks";

import Can from "../can/can.component";
import CityDetailsList from "./city-details-list.component";
import CityDetailForm from "./city-details-create-form.component";
import ForbiddenPage from "../../pages/forbidden/forbidden.component";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { cityDetails } from "../../rbac-consts";

const CityDetailsContainer = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <>
      <Can
        role={userRole}
        perform={cityDetails.CREATE}
        yes={() => <CityDetailForm />}
        no={() => <ForbiddenPage />}
      />
      <Can
        role={userRole}
        perform={cityDetails.READ}
        yes={() => <CityDetailsList />}
        no={() => <ForbiddenPage />}
      />
    </>
  );
};

export default CityDetailsContainer;
