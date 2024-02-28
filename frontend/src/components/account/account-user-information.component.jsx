import React, { useCallback, useContext } from "react";
import { useMutation, useApolloClient } from "@apollo/react-hooks";

import FragmentSpinner from "../spinner/fragment-spinner.component";
import AccountAvatar from "./account-avatar.component";
import AccountDelete from "./account-delete.component";
import InputGroupComponent from "../input-group/input-group.component";

import { StyledPersonalDataWrapper, StyledUserInfo } from "../../pages/account/styled-account";
import { StyledButton } from "../styles/styled-button";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";

import { UserAccountContext } from "../../pages/account/account.component";
import { parseApiErrors } from "../../utils/response";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import {
  UPDATE_DETAILS_ADMIN,
  UPDATE_DETAILS_CLIENT,
  UPDATE_DETAILS_MANAGER,
  UPDATE_DETAILS_SEO
} from "../../graphql/mutations/account.mutation";
import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";

const AccountUserInformation = () => {
  const client = useApolloClient();
  const { user, avatarDetails } = useContext(UserAccountContext);

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const UPDATE_QUERY = { UPDATE_DETAILS_ADMIN, UPDATE_DETAILS_MANAGER, UPDATE_DETAILS_SEO, UPDATE_DETAILS_CLIENT };
  const [updateAccountDetails, { loading }] = useMutation(UPDATE_QUERY[`UPDATE_DETAILS_${userRole.toUpperCase()}`],
    {
      onCompleted: () => {
        closableNotificationWithClick(
          "Вы успешно изменили данные своего аккаунта",
          "success"
        );
      },
      onError: ({ graphQLErrors }) => {
        let error = parseApiErrors(graphQLErrors);
        if (error.internal) {
          closableNotificationWithClick(error.internal, "error");
        }
      },
      variables: {
        firstname: "",
        lastname: "",
      },
    }
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      let variables = {
        firstname: event.target["firstname"].value,
        lastname: event.target["lastname"].value,
        id: user.id
      };

      updateAccountDetails({
        variables,
      });
    },
    [updateAccountDetails, avatarDetails]
  );

  return (
    <StyledPersonalDataWrapper>
      <StyledUserInfo onSubmit={handleSubmit}>
        <AccountAvatar userRole={userRole} />
        <StyledLoadingWrapper>
          {loading && <FragmentSpinner position="center" />}
          <div className={`client-name ${loading && "loading"}`}>
            <InputGroupComponent
              id="firstname"
              label="Имя"
              defaultValue={user.firstname}
            />
            <InputGroupComponent
              id="lastname"
              label="Фамилия"
              defaultValue={user.lastname}
            />
            <InputGroupComponent
              id="email"
              label="E-mail"
              defaultValue={user.email}
              readOnly
            />
            <div className="button-align">
              <StyledButton color="success" weight="normal" type="submit">
                Сохранить
              </StyledButton>
              {userRole === "client" && !user.isDeleted && <AccountDelete />}
            </div>
          </div>
        </StyledLoadingWrapper>
      </StyledUserInfo>
    </StyledPersonalDataWrapper>
  );
};
export default AccountUserInformation;
