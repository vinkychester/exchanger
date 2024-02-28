import React from "react";
import { useApolloClient } from "@apollo/react-hooks";

import Can from "../../components/can/can.component";
import LoyaltyProgramClient from "./loyalty-program-client.component";
import LoyaltyProgramAdmin from "./loyalty-program-admin.component";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { loyalty } from "../../rbac-consts";

const LoyaltyProgramPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <>
      <Can
        role={userRole}
        perform={loyalty.CLIENT_READ}
        yes={() => <LoyaltyProgramClient />}
      />
      <Can
        role={userRole}
        perform={loyalty.READ}
        yes={() => <LoyaltyProgramAdmin />}
      />
    </>
  );
};

export default React.memo(LoyaltyProgramPage);
