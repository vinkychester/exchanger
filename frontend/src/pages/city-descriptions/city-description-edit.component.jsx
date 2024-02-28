import React from "react";
import { useApolloClient } from "@apollo/react-hooks";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import CityDetailEditForm from "../../components/city-details/city-details-edit-form.component";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { cityDetails } from "../../rbac-consts";

const CityDetailsEditPage = ({ match }) => {
  const client = useApolloClient();
  const { id } = match.params;

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <>
      <Can
        role={userRole}
        perform={cityDetails.EDIT}
        yes={() => (
            <CityDetailEditForm id={id} />
        )}
        no={() => <ForbiddenPage />}
      />
    </>
  );
};

export default React.memo(CityDetailsEditPage);